import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Project from '@/models/Project';
import { getUserFromRequest } from '@/lib/auth';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUserFromRequest(request);
    
    if (!user) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
    }

    if (user.role !== 'Admin') {
      return NextResponse.json(
        { message: 'Not authorized to delete projects' },
        { status: 403 }
      );
    }

    await connectDB();

    const { id } = await params;
    const project = await Project.findById(id);

    if (!project) {
      return NextResponse.json({ message: 'Project not found' }, { status: 404 });
    }

    if (project.createdBy.toString() !== user._id.toString()) {
      return NextResponse.json(
        { message: 'Not authorized to delete this project' },
        { status: 403 }
      );
    }

    await Project.findByIdAndDelete(id);

    return NextResponse.json({ message: 'Project removed' });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUserFromRequest(request);
    
    if (!user) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
    }

    if (user.role !== 'Admin') {
      return NextResponse.json(
        { message: 'Not authorized to update projects' },
        { status: 403 }
      );
    }

    await connectDB();

    const { title, description, members } = await request.json();
    const { id } = await params;

    const project = await Project.findById(id);

    if (!project) {
      return NextResponse.json({ message: 'Project not found' }, { status: 404 });
    }

    if (project.createdBy.toString() !== user._id.toString()) {
      return NextResponse.json(
        { message: 'Not authorized to update this project' },
        { status: 403 }
      );
    }

    project.title = title || project.title;
    project.description = description || project.description;
    project.members = members || project.members;

    const updatedProject = await project.save();
    const populatedProject = await Project.findById(updatedProject._id)
      .populate('createdBy', 'name email')
      .populate('members', 'name email');

    return NextResponse.json(populatedProject);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}
