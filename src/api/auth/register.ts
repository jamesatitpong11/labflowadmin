import { Request, Response } from 'express';
import connectToDatabase from '@/lib/database';
import User from '@/models/User';
import { generateToken } from '@/lib/auth';
import { createSuccessResponse, handleApiError, ApiError } from '@/lib/api-response';

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  role?: 'ผู้ดูแลระบบ' | 'แพทย์' | 'พยาบาล' | 'เจ้าหน้าที่';
}

export interface RegisterResponse {
  user: {
    _id: string;
    email: string;
    name: string;
    role: string;
  };
  token: string;
}

export default async function registerHandler(req: Request, res: Response) {
  if (req.method !== 'POST') {
    return res.status(405).json(handleApiError(new ApiError('Method not allowed', 405)));
  }

  try {
    await connectToDatabase();

    const { email, password, name, role = 'เจ้าหน้าที่' }: RegisterRequest = req.body;

    // Validate input
    if (!email || !password || !name) {
      throw new ApiError('Email, password, and name are required', 400);
    }

    if (password.length < 6) {
      throw new ApiError('Password must be at least 6 characters long', 400);
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      throw new ApiError('User with this email already exists', 409);
    }

    // Create new user
    const user = new User({
      email: email.toLowerCase(),
      password,
      name: name.trim(),
      role
    });

    await user.save();

    // Generate JWT token
    const token = generateToken(user);

    // Prepare response data
    const responseData: RegisterResponse = {
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      token
    };

    const response = createSuccessResponse(responseData, 'User registered successfully', 201);
    res.status(201).json(response);

  } catch (error) {
    const errorResponse = handleApiError(error);
    res.status(errorResponse.statusCode).json(errorResponse);
  }
}
