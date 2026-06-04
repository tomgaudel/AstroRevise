import { Request, Response } from 'express';
import { noteService } from '../services/noteService.js';

export const noteController = {
  async getNotes(req: Request, res: Response) {
    try {
      const { chapterId } = req.params;
      const notes = await noteService.getNotes(req.user!.userId, chapterId);
      res.json(notes);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async getNoteById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const note = await noteService.getNoteById(req.user!.userId, id);

      if (!note) {
        return res.status(404).json({ error: 'Note not found' });
      }

      res.json(note);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async createNote(req: Request, res: Response) {
    try {
      const { chapterId, title, content } = req.body;

      if (!chapterId || !title || !content) {
        return res.status(400).json({ error: 'chapterId, title, and content are required' });
      }

      const note = await noteService.createNote(req.user!.userId, chapterId, title, content);
      res.status(201).json(note);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async updateNote(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { title, content } = req.body;

      if (!title || !content) {
        return res.status(400).json({ error: 'title and content are required' });
      }

      const note = await noteService.updateNote(req.user!.userId, id, title, content);
      res.json(note);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async deleteNote(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await noteService.deleteNote(req.user!.userId, id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },
};
