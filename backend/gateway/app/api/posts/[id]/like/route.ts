import { NextRequest, NextResponse } from 'next/server';

const POST_SERVICE_URL = process.env.POST_SERVICE_URL || 'http://localhost:4002';

// POST /api/posts/:id/like - Like a post
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = req.headers.get('authorization');

    const response = await fetch(`${POST_SERVICE_URL}/api/posts/${params.id}/like`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader && { Authorization: authHeader }),
      },
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Gateway like post error:', error);
    return NextResponse.json(
      { error: 'Gateway error' },
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
    const authHeader = req.headers.get('authorization');

    const response = await fetch(`${POST_SERVICE_URL}/api/posts/${params.id}/like`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader && { Authorization: authHeader }),
      },
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Gateway unlike post error:', error);
    return NextResponse.json(
      { error: 'Gateway error' },
      { status: 500 }
    );
  }
}
