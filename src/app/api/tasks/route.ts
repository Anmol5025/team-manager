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
      tasks = await Task.find({ project: { $in: projectIds } })
        .populate('project', 'title')
        .populate('assignedTo', 'name email')
        .sort({ createdAt: -1 });
    } else {
      tasks = await Task.find({ assignedTo: user._id })
        .populate('project', 'title')
        .populate('assignedTo', 'name email')
        .sort({ createdAt: -1 });
    }

    return NextResponse.json(tasks);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    
    if (!user) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
    }

    if (user.role !== 'Admin') {
      return NextResponse.json(
        { message: 'Not authorized to create tasks' },
        { status: 403 }
      );
    }

    await connectDB();

    const { title, description, project, assignedTo, status, dueDate } = await request.json();

    const projectExists = await Project.findById(project);
    if (!projectExists) {
      return NextResponse.json({ message: 'Project not found' }, { status: 404 });
    }

    const task = await Task.create({
      title,
      description,
      project,
      assignedTo: assignedTo || null,
      status: status || 'Todo',
      dueDate,
    });

    const populatedTask = await Task.findById(task._id)
      .populate('project', 'title')
      .populate('assignedTo', 'name email');

    return NextResponse.json(populatedTask, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}
