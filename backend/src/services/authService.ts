import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../database/connection.js';
import { User, AuthPayload } from '../types/index.js';

export const authService = {
  async register(email: string, password: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await query(
      `INSERT INTO users (email, password_hash) VALUES ($1, $2) 
       RETURNING id, email, created_at, updated_at`,
      [email, hashedPassword]
    );

    return result.rows[0];
  },

  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const result = await query('SELECT * FROM users WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      throw new Error('User not found');
    }

    const user = result.rows[0];
    const isValid = await bcrypt.compare(password, user.password_hash);

    if (!isValid) {
      throw new Error('Invalid password');
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email } as AuthPayload,
      process.env.JWT_SECRET!,
      { expiresIn: (process.env.JWT_EXPIRY || '7d') as any }
    );

    return {
      user: {
        id: user.id,
        email: user.email,
        password_hash: '',
        created_at: user.created_at,
        updated_at: user.updated_at,
      },
      token,
    };
  },

  async getUserById(userId: string): Promise<User | null> {
    const result = await query('SELECT * FROM users WHERE id = $1', [userId]);
    return result.rows[0] || null;
  },
};
