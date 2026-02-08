const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:4001';

export interface AuthUser {
  userId: string;
  email: string;
  username: string;
}

export async function verifyToken(token: string): Promise<AuthUser> {
  try {
    const response = await fetch(`${AUTH_SERVICE_URL}/api/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      throw new Error('Invalid token');
    }

    const data = await response.json();
    return data.user;
  } catch (error) {
    throw new Error('Authentication failed');
  }
}

export function extractToken(authHeader: string | null): string {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Invalid authorization header');
  }
  return authHeader.substring(7);
}
