import { Request, Response } from 'express';
import { authService } from '../services/authService.js';

export const authController = {
  async register(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      const user = await authService.register(email, password);

      res.status(201).json({
        id: user.id,
        email: user.email,
      });
    } catch (error: any) {
      if (error.message.includes('duplicate')) {
        return res.status(409).json({ error: 'Email already exists' });
      }
      res.status(500).json({ error: error.message });
    }
  },

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      const { user, token } = await authService.login(email, password);

      res.json({
        user: {
          id: user.id,
          email: user.email,
        },
        token,
      });
    } catch (error: any) {
      res.status(401).json({ error: error.message });
    }
  },

  async getProfile(req: Request, res: Response) {
    try {
      const user = await authService.getUserById(req.user!.userId);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({
        id: user.id,
        email: user.email,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },
};
