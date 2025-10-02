export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  statusCode: number;
}

export class ApiError extends Error {
  statusCode: number;
  
  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'ApiError';
  }
}

export function createSuccessResponse<T>(
  data: T, 
  message: string = 'Success', 
  statusCode: number = 200
): ApiResponse<T> {
  return {
    success: true,
    message,
    data,
    statusCode
  };
}

export function createErrorResponse(
  message: string, 
  statusCode: number = 500,
  error?: string
): ApiResponse {
  return {
    success: false,
    message,
    error,
    statusCode
  };
}

export function handleApiError(error: any): ApiResponse {
  console.error('API Error:', error);

  if (error instanceof ApiError) {
    return createErrorResponse(error.message, error.statusCode);
  }

  // MongoDB duplicate key error
  if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0];
    return createErrorResponse(
      `${field} already exists`,
      400,
      'DUPLICATE_KEY'
    );
  }

  // MongoDB validation error
  if (error.name === 'ValidationError') {
    const messages = Object.values(error.errors).map((err: any) => err.message);
    return createErrorResponse(
      messages.join(', '),
      400,
      'VALIDATION_ERROR'
    );
  }

  // JWT errors
  if (error.name === 'JsonWebTokenError') {
    return createErrorResponse('Invalid token', 401, 'INVALID_TOKEN');
  }

  if (error.name === 'TokenExpiredError') {
    return createErrorResponse('Token expired', 401, 'TOKEN_EXPIRED');
  }

  // Default error
  return createErrorResponse(
    'Internal server error',
    500,
    'INTERNAL_ERROR'
  );
}
