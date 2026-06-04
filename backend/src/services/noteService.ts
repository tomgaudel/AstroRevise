import { query } from '../database/connection.js';
import { Note } from '../types/index.js';

export const noteService = {
  async getNotes(userId: string, chapterId: string): Promise<Note[]> {
    const result = await query(
      `SELECT * FROM notes WHERE user_id = $1 AND chapter_id = $2 ORDER BY updated_at DESC`,
      [userId, chapterId]
    );
    return result.rows;
  },

  async getNoteById(userId: string, noteId: string): Promise<Note | null> {
    const result = await query(
      `SELECT * FROM notes WHERE id = $1 AND user_id = $2`,
      [noteId, userId]
    );
    return result.rows[0] || null;
  },

  async createNote(userId: string, chapterId: string, title: string, content: string): Promise<Note> {
    const result = await query(
      `INSERT INTO notes (user_id, chapter_id, title, content) VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [userId, chapterId, title, content]
    );
    return result.rows[0];
  },

  async updateNote(userId: string, noteId: string, title: string, content: string): Promise<Note> {
    const result = await query(
      `UPDATE notes SET title = $1, content = $2, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $3 AND user_id = $4 RETURNING *`,
      [title, content, noteId, userId]
    );
    return result.rows[0];
  },

  async deleteNote(userId: string, noteId: string): Promise<void> {
    await query(
      `DELETE FROM notes WHERE id = $1 AND user_id = $2`,
      [noteId, userId]
    );
  },
};
