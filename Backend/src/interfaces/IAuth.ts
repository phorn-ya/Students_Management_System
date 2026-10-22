import type { Request } from 'express';

export interface RegisterRequest extends Request {
  body: {
    username?: string;
    email?: string;
    password?: string;
    role?: string;
  };
}

export interface LoginRequest extends Request {
  body: {
    username?: string;
    email?: string;
    usernameOrEmail?: string;
    password?: string;
  };
}
