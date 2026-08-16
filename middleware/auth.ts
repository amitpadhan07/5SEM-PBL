import { NextRequest, NextResponse } from 'next/server';
import { verifyJWT } from '@/lib/auth';

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

export function withAuth(handler: (req: AuthenticatedRequest) => Promise<Response>) {
  return async (req: NextRequest) => {
    try {
      const authHeader = req.headers.get('authorization');
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const token = authHeader.substring(7);
      const payload = verifyJWT(token);

      if (!payload) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
      }

      (req as AuthenticatedRequest).user = {
        userId: payload.userId,
        email: payload.email,
        role: payload.role,
      };

      return handler(req as AuthenticatedRequest);
    } catch (error) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  };
}

export function withRole(...roles: string[]) {
  return (handler: (req: AuthenticatedRequest) => Promise<Response>) => {
    return async (req: AuthenticatedRequest) => {
      if (!req.user || !roles.includes(req.user.role)) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
      return handler(req);
    };
  };
}

export function withAdminRole(handler: (req: AuthenticatedRequest) => Promise<Response>) {
  return async (req: AuthenticatedRequest) => {
    if (!req.user || req.user.role !== 'Admin') {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }
    return handler(req);
  };
}
