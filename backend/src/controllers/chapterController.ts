import { Request, Response } from 'express';
import { chapterService } from '../services/chapterService.js';

export const chapterController = {
  async getMatters(req: Request, res: Response) {
    try {
      const matters = await chapterService.getMatters(req.user!.userId);
      res.json(matters);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async getThemes(req: Request, res: Response) {
    try {
      const { matterId } = req.query;
      const themes = await chapterService.getThemes(req.user!.userId, matterId as string);
      res.json(themes);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async getChapters(req: Request, res: Response) {
    try {
      const { themeId } = req.query;
      const chapters = await chapterService.getChapters(req.user!.userId, themeId as string);
      res.json(chapters);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async getChapterById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const chapter = await chapterService.getChapterById(req.user!.userId, id);

      if (!chapter) {
        return res.status(404).json({ error: 'Chapter not found' });
      }

      res.json(chapter);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async createTheme(req: Request, res: Response) {
    try {
      const { matterId, name } = req.body;

      if (!matterId || !name) {
        return res.status(400).json({ error: 'matterId and name are required' });
      }

      const theme = await chapterService.createTheme(req.user!.userId, matterId, name);
      res.status(201).json(theme);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async createChapter(req: Request, res: Response) {
    try {
      const { themeId, name, description } = req.body;

      if (!themeId || !name) {
        return res.status(400).json({ error: 'themeId and name are required' });
      }

      const chapter = await chapterService.createChapter(req.user!.userId, themeId, name, description);
      res.status(201).json(chapter);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async updateChapter(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const chapter = await chapterService.updateChapter(req.user!.userId, id, req.body);
      res.json(chapter);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async deleteChapter(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await chapterService.deleteChapter(req.user!.userId, id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },
};
