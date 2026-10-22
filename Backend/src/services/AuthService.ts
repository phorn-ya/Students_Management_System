import bcryptjs from 'bcryptjs';
import { db } from '../config/database.js';
import { generateToken } from '../utils/jwt.js';

export interface UserData {
  id: number;
  username: string;
  email: string;
  role: string;
}

export interface JwtPayload {
  id: number;
  username: string;
  email: string;
  role: string;
  iss?: string | undefined;
}

export interface AuthResponse {
  user: Omit<UserData, 'password'>;
  token: string;
}

export class AuthService {

  // Register a new user
  async register(
    username: string,
    email: string,
    password: string,
    role: string = 'student',
  ): Promise<AuthResponse> {
    if (!username || !email || !password) {
      throw new Error('Username, email, and password are required');
    }

    if (username.length < 3) {
      throw new Error('Username must be at least 3 characters');
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error('Invalid email format');
    }

    if (password.length < 8) {
      throw new Error('Password must be at least 8 characters');
    }

    const normalizedUsername = username.trim().toLowerCase();
    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await db.query(
      'SELECT id FROM users WHERE username = ? OR email = ?',
      [normalizedUsername, normalizedEmail],
    );

    if (existingUser.rows.length > 0) {
      throw new Error('Username or email already exists');
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    const result = await db.query(
      `INSERT INTO users (username, email, password, role)
       VALUES (?, ?, ?, ?)`,
      [normalizedUsername, normalizedEmail, hashedPassword, role.toLowerCase()],
    );

    const inserted = await db.query(
      'SELECT id, username, email, role FROM users WHERE id = ?',
      [result.insertId],
    );
    const user = inserted.rows[0] as UserData;

    const token = generateToken({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    });

    return { user, token };
  }

  // Login user
  async login(username?: string, email?: string, password?: string): Promise<AuthResponse> {
    if ((!username && !email) || !password) {
      throw new Error('Username/Email and password are required');
    }

    const normalizedUsername = username?.trim().toLowerCase() ?? null;
    const normalizedEmail = email?.trim().toLowerCase() ?? null;

    // Use separate queries to avoid unintended OR matches when only one identifier is provided
    const result = normalizedEmail
      ? await db.query(
          'SELECT id, username, email, password, role FROM users WHERE email = ?',
          [normalizedEmail],
        )
      : await db.query(
          'SELECT id, username, email, password, role FROM users WHERE username = ?',
          [normalizedUsername],
        );

    const user = result.rows[0];

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    const token = generateToken({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    });

    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword as UserData,
      token,
    };
  }

  // Get user profile by ID
  async getProfile(userId: number): Promise<UserData> {
    if (!userId || userId <= 0) {
      throw new Error('Invalid user ID');
    }

    const result = await db.query(
      'SELECT id, username, email, role FROM users WHERE id = ?',
      [userId],
    );

    if (result.rows.length === 0) {
      throw new Error('User not found');
    }

    return result.rows[0] as UserData;
  }

  // Logout (token invalidation handled client-side)
  async logout(userId: number): Promise<void> {
    const result = await db.query('SELECT id FROM users WHERE id = ?', [userId]);

    if (result.rows.length === 0) {
      throw new Error('User not found');
    }

  }
}