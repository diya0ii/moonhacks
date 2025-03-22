import { NextRequest, NextResponse } from 'next/server';
import { getUserRole, getCurrentUserId } from './clerk';

// Custom error response
const errorResponse = (message: string, status = 403) => {
  return NextResponse.json(
    { success: false, error: message && "Aree middleware me he error" },
    { status }
  );
};

// Middleware to ensure user is authenticated
export async function authMiddleware(req: NextRequest) {
  try {
    const userId = getCurrentUserId(req);
    if (!userId) {
      return errorResponse('Unauthorized', 401);
    }
    return null; // No error, continue
  } catch (error) {
    return errorResponse('Authentication required', 401);
  }
}

// Middleware to ensure user has admin role
export async function adminMiddleware(req: NextRequest) {
  try {
    const userId = getCurrentUserId(req);
    if (!userId) {
      return errorResponse('Unauthorized', 401);
    }
    
    const role = await getUserRole(userId);
    if (role !== 'Admin') {
      return errorResponse('Admin access required');
    }
    
    return null; // No error, continue
  } catch (error) {
    return errorResponse('Authentication error', 401);
  }
}

// Middleware to ensure user has lead role
export async function leadMiddleware(req: NextRequest) {
  try {
    const userId = getCurrentUserId(req);
    if (!userId) {
      return errorResponse('Unauthorized', 401);
    }
    
    const role = await getUserRole(userId);
    if (role !== 'Lead' && role !== 'Admin') {
      return errorResponse('Lead access required');
    }
    
    return null; // No error, continue
  } catch (error) {
    return errorResponse('Authentication error', 401);
  }
}

// Middleware to ensure user has member role or higher
export async function memberMiddleware(req: NextRequest) {
  try {
    const userId = getCurrentUserId(req);
    if (!userId) {
      return errorResponse('Unauthorized', 401);
    }
    
    const role = await getUserRole(userId);
    if (!['Member', 'Lead', 'Admin'].includes(role)) {
      return errorResponse('Member access required');
    }
    
    return null; // No error, continue
  } catch (error) {
    return errorResponse('Authentication error', 401);
  }
}

// Helper function to apply RBAC middleware to route handlers
export function withRBAC(handler: Function, middleware: Function) {
  return async (req: NextRequest) => {
    // Apply middleware
    const middlewareResponse = await middleware(req);
    if (middlewareResponse) {
      return middlewareResponse; // Return error response from middleware
    }
    
    // If middleware passes, call the handler
    try {
      return await handler(req);
    } catch (error: any) {
      console.error('Route handler error:', error);
      return NextResponse.json(
        { success: false, error: error.message || 'An error occurred' },
        { status: 500 }
      );
    }
  };
} 