import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken, extractToken } from '@/lib/auth';

// GET /api/posts - Fetch all posts (feed)
export async function GET(req: NextRequest) {
  try {
    const posts = await prisma.post.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 50, // Limit to 50 posts for now
    });

    return NextResponse.json({ posts });
  } catch (error) {
    console.error('Fetch posts error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

// POST /api/posts - Create a new post
export async function POST(req: NextRequest) {
  try {
    // Extract and verify token
    const authHeader = req.headers.get('authorization');
    const token = extractToken(authHeader);
    const user = await verifyToken(token);

    // Get post content
    const { content } = await req.json();

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }

    if (content.length > 500) {
      return NextResponse.json(
        { error: 'Content must be less than 500 characters' },
        { status: 400 }
      );
    }

    // Create post
    const post = await prisma.post.create({
      data: {
        content,
        userId: user.userId,
        username: user.username,
      },
    });

    return NextResponse.json(
      {
        message: 'Post created successfully',
        post,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Create post error:', error);
    
    if (error.message === 'Authentication failed' || error.message === 'Invalid authorization header') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}
