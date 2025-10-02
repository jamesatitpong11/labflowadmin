import { Request, Response } from 'express';
import connectToDatabase from '@/lib/database';
import User from '@/models/User';
import { generateToken } from '@/lib/auth';
import { createSuccessResponse, handleApiError, ApiError } from '@/lib/api-response';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: {
    _id: string;
    email: string;
    name: string;
    role: string;
  };
  token: string;
}

export default async function loginHandler(req: Request, res: Response) {
  if (req.method !== 'POST') {
    return res.status(405).json(handleApiError(new ApiError('Method not allowed', 405)));
  }

  try {
    await connectToDatabase();

    const { email, password }: LoginRequest = req.body;

    // Validate input
    if (!email || !password) {
      throw new ApiError('Email and password are required', 400);
    }

    // Find user by email and include password for comparison
    const user = await User.findOne({ 
      email: email.toLowerCase(),
      isActive: true 
    }).select('+password');

    if (!user) {
      throw new ApiError('Invalid email or password', 401);
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new ApiError('Invalid email or password', 401);
    }

    // Generate JWT token
    const token = generateToken(user);

    // Prepare response data
    const responseData: LoginResponse = {
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      token
    };

    const response = createSuccessResponse(responseData, 'Login successful');
    res.status(200).json(response);

  } catch (error) {
    const errorResponse = handleApiError(error);
    res.status(errorResponse.statusCode).json(errorResponse);
  }
}
