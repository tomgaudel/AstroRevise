import { Request, Response } from 'express';
import { ankiService } from '../services/ankiService.js';
import { resourceService } from '../services/resourceService.js';
import { query } from '../database/connection.js';

export const resourceController = {
  async addFile(req: Request, res: Response) {
    try {
      const { chapterId, name, url, fileType } = req.body;

      if (!chapterId || !name || !url || !fileType) {
        return res.status(400).json({ error: 'All fields are required' });
      }

      const resource = await resourceService.addFileResource(
        req.user!.userId,
        chapterId,
        name,
        url,
        fileType
      );

      res.status(201).json(resource);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async getFiles(req: Request, res: Response) {
    try {
      const { chapterId } = req.params;
      const files = await resourceService.getFileResources(req.user!.userId, chapterId);
      res.json(files);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async deleteFile(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await resourceService.deleteFileResource(req.user!.userId, id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async addVideo(req: Request, res: Response) {
    try {
      const { chapterId, title, youtubeUrl } = req.body;

      if (!chapterId || !title || !youtubeUrl) {
        return res.status(400).json({ error: 'All fields are required' });
      }

      const video = await resourceService.addVideo(req.user!.userId, chapterId, title, youtubeUrl);
      res.status(201).json(video);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async getVideos(req: Request, res: Response) {
    try {
      const { chapterId } = req.params;
      const videos = await resourceService.getVideos(req.user!.userId, chapterId);
      res.json(videos);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async deleteVideo(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await resourceService.deleteVideo(req.user!.userId, id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async checkAnkiConnection(req: Request, res: Response) {
    try {
      const isConnected = await ankiService.checkConnection();
      res.json({ connected: isConnected });
    } catch (error: any) {
      res.json({ connected: false });
    }
  },

  async createAnkiCard(req: Request, res: Response) {
    try {
      const { chapterId, deckName, front, back } = req.body;

      if (!chapterId || !deckName || !front || !back) {
        return res.status(400).json({ error: 'All fields are required' });
      }

      let ankiNid = null;

      try {
        ankiNid = await ankiService.createCard(deckName, front, back);
      } catch {
        // Anki not available, continue without ID
      }

      const card = await ankiService.saveCard(req.user!.userId, chapterId, front, back, ankiNid || undefined);
      res.status(201).json(card);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async getAnkiCards(req: Request, res: Response) {
    try {
      const { chapterId } = req.params;
      const cards = await ankiService.getCards(req.user!.userId, chapterId);
      res.json(cards);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async deleteAnkiCard(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await ankiService.deleteCard(req.user!.userId, id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async exportUserData(req: Request, res: Response) {
    try {
      const userId = req.user!.userId;

      const [
        matters,
        themes,
        chapters,
        notes,
        questions,
        scores,
        tasks,
        cards,
        files,
        videos,
      ] = await Promise.all([
        query('SELECT * FROM matters WHERE user_id = $1', [userId]),
        query('SELECT * FROM themes WHERE user_id = $1', [userId]),
        query('SELECT * FROM chapters WHERE user_id = $1', [userId]),
        query('SELECT * FROM notes WHERE user_id = $1', [userId]),
        query('SELECT * FROM questions WHERE user_id = $1', [userId]),
        query('SELECT * FROM qcm_scores WHERE user_id = $1', [userId]),
        query('SELECT * FROM tasks WHERE user_id = $1', [userId]),
        query('SELECT * FROM anki_cards WHERE user_id = $1', [userId]),
        query('SELECT * FROM file_resources WHERE user_id = $1', [userId]),
        query('SELECT * FROM videos WHERE user_id = $1', [userId]),
      ]);

      const exportData = {
        exportDate: new Date().toISOString(),
        matters: matters.rows,
        themes: themes.rows,
        chapters: chapters.rows,
        notes: notes.rows,
        questions: questions.rows,
        scores: scores.rows,
        tasks: tasks.rows,
        ankiCards: cards.rows,
        files: files.rows,
        videos: videos.rows,
      };

      res.json(exportData);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },
};
