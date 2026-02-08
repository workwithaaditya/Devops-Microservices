import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      );
    }

    // Verify token
    const payload = verifyToken(token);

    return NextResponse.json({
      valid: true,
      user: payload,
    });
  } catch (error) {
    return NextResponse.json(
      { valid: false, error: 'Invalid or expired token' },
      { status: 401 }
    );
  }
}
