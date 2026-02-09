import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken, extractToken } from '@/lib/auth';

// POST /api/posts/:id/like - Like a post
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Extract and verify token
    const authHeader = req.headers.get('authorization');
    const token = extractToken(authHeader);
    const user = await verifyToken(token);

    const postId = params.id;

    // Check if post exists
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    // Check if user already liked this post
    const existingLike = await prisma.like.findUnique({
      where: {
        postId_userId: {
          postId,
          userId: user.userId,
        },
      },
    });

    if (existingLike) {
      return NextResponse.json(
        { error: 'Post already liked' },
        { status: 400 }
      );
    }

    // Create like
    const like = await prisma.like.create({
      data: {
        postId,
        userId: user.userId,
        username: user.username,
      },
    });

    // Get updated like count
    const likeCount = await prisma.like.count({
      where: { postId },
    });

    return NextResponse.json(
      {
        message: 'Post liked successfully',
        like,
        likeCount,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Like post error:', error);

    if (error.message === 'Authentication failed' || error.message === 'Invalid authorization header') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to like post' },
      { status: 500 }
    );
  }
}

// DELETE /api/posts/:id/like - Unlike a post
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Extract and verify token
    const authHeader = req.headers.get('authorization');
    const token = extractToken(authHeader);
    const user = await verifyToken(token);

    const postId = params.id;

    // Find and delete the like
    const like = await prisma.like.findUnique({
      where: {
        postId_userId: {
          postId,
          userId: user.userId,
        },
      },
    });

    if (!like) {
      return NextResponse.json(
        { error: 'Like not found' },
        { status: 404 }
      );
    }

    await prisma.like.delete({
      where: {
        id: like.id,
      },
    });

    // Get updated like count
    const likeCount = await prisma.like.count({
      where: { postId },
    });

    return NextResponse.json({
      message: 'Post unliked successfully',
      likeCount,
    });
  } catch (error: any) {
    console.error('Unlike post error:', error);

    if (error.message === 'Authentication failed' || error.message === 'Invalid authorization header') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to unlike post' },
      { status: 500 }
    );
  }
}
