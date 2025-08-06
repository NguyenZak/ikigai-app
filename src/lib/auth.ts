import jwt from 'jsonwebtoken'
import { prisma } from './db'

export interface AuthUser {
  id: number
  email: string
  name?: string
  role: string // 'ADMIN' | 'MANAGER' | 'STAFF' | 'USER'
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function createSession(userId: number, token: string) {
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + 7) // 7 days

  return await prisma.session.create({
    data: {
      userId,
      token,
      expiresAt,
    },
  })
}

export async function validateSession(token: string): Promise<AuthUser | null> {
  try {
    const session = await prisma.session.findUnique({
      where: { token },
      include: { user: true },
    })

    if (!session || session.expiresAt < new Date()) {
      return null
    }

    return {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name || undefined,
      role: session.user.role,
    }
  } catch (error) {
    console.error('Session validation error:', error)
    return null
  }
}

export async function deleteSession(token: string) {
  try {
    await prisma.session.delete({
      where: { token },
    })
  } catch (error) {
    console.error('Session deletion error:', error)
  }
}

export function generateToken(user: AuthUser): string {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  )
}

export async function verifyAuth(request: Request): Promise<{ success: boolean; user?: AuthUser }> {
  try {
    // For development, allow access without auth
    if (process.env.NODE_ENV === 'development') {
      //Log
        console.log('Development mode: skipping auth verification');
      return { success: true, user: { id: 1, email: 'admin@example.com', role: 'ADMIN' } };
    }

    const token = request.headers.get('cookie')?.split('auth-token=')[1]?.split(';')[0];
    
    if (!token) {
      return { success: false };
    }

    const user = await validateSession(token);
    
    if (!user) {
      return { success: false };
    }

    return { success: true, user };
  } catch (error) {
    console.error('Auth verification error:', error);
    return { success: false };
  }
} 

export function getAuthHeaders(): HeadersInit {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth-token');
    if (token) {
      return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      };
    }
  }
  return {
    'Content-Type': 'application/json',
  };
} 