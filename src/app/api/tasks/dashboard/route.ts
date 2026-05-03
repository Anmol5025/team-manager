import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Task from '@/models/Task';
import Project from '@/models/Project';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    
    if (!user) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
    }

    await connectDB();

    let tasks;
    if (user.role === 'Admin') {
      const projects = await Project.find({ createdBy: user._id });
      const projectIds = projects.map(p => p._id);
      tasks = await Task.find({ project: { $in: projectIds } });
    } else {
      tasks = await Task.find({ assignedTo: user._id });
    }

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.status === 'Done').length;
    const pendingTasks = tasks.filter(task => task.status !== 'Done').length;
    const overdueTasks = tasks.filter(
      task => task.status !== 'Done' && new Date(task.dueDate) < new Date()
    ).length;

    return NextResponse.json({
      totalTasks,
      completedTasks,
      pendingTasks,
      overdueTasks,
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}
