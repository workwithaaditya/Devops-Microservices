import { NextRequest, NextResponse } from 'next/server';

const POST_SERVICE_URL = process.env.POST_SERVICE_URL || 'http://localhost:4002';

// GET /api/posts - Fetch all posts
export async function GET(req: NextRequest) {
  try {
    const response = await fetch(`${POST_SERVICE_URL}/api/posts`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Gateway fetch posts error:', error);
    return NextResponse.json(
      { error: 'Gateway error' },
      { status: 500 }
    );
  }
}

// POST /api/posts - Create a new post
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const authHeader = req.headers.get('authorization');

    const response = await fetch(`${POST_SERVICE_URL}/api/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader && { Authorization: authHeader }),
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Gateway create post error:', error);
    return NextResponse.json(
      { error: 'Gateway error' },
      { status: 500 }
    );
  }
}
