import { query } from '../database/connection.js';
import { Chapter, Theme, Matter } from '../types/index.js';

export const chapterService = {
  async getMatters(userId: string): Promise<Matter[]> {
    const result = await query(
      `SELECT * FROM matters WHERE user_id = $1 ORDER BY name`,
      [userId]
    );
    return result.rows;
  },

  async getThemes(userId: string, matterId?: string): Promise<Theme[]> {
    if (matterId) {
      const result = await query(
        `SELECT * FROM themes WHERE user_id = $1 AND matter_id = $2 ORDER BY name`,
        [userId, matterId]
      );
      return result.rows;
    }

    const result = await query(
      `SELECT * FROM themes WHERE user_id = $1 ORDER BY name`,
      [userId]
    );
    return result.rows;
  },

  async getChapters(userId: string, themeId?: string): Promise<Chapter[]> {
    if (themeId) {
      const result = await query(
        `SELECT * FROM chapters WHERE user_id = $1 AND theme_id = $2 ORDER BY name`,
        [userId, themeId]
      );
      return result.rows;
    }

    const result = await query(
      `SELECT * FROM chapters WHERE user_id = $1 ORDER BY name`,
      [userId]
    );
    return result.rows;
  },

  async getChapterById(userId: string, chapterId: string): Promise<Chapter | null> {
    const result = await query(
      `SELECT * FROM chapters WHERE id = $1 AND user_id = $2`,
      [chapterId, userId]
    );
    return result.rows[0] || null;
  },

  async createTheme(userId: string, matterId: string, name: string): Promise<Theme> {
    const result = await query(
      `INSERT INTO themes (user_id, matter_id, name) VALUES ($1, $2, $3) 
       RETURNING *`,
      [userId, matterId, name]
    );
    return result.rows[0];
  },

  async createChapter(userId: string, themeId: string, name: string, description?: string): Promise<Chapter> {
    const result = await query(
      `INSERT INTO chapters (user_id, theme_id, name, description) VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [userId, themeId, name, description || null]
    );
    return result.rows[0];
  },

  async updateChapter(userId: string, chapterId: string, data: Partial<Chapter>): Promise<Chapter> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (data.name !== undefined) {
      fields.push(`name = $${paramIndex++}`);
      values.push(data.name);
    }
    if (data.description !== undefined) {
      fields.push(`description = $${paramIndex++}`);
      values.push(data.description);
    }
    if (data.mastery !== undefined) {
      fields.push(`mastery = $${paramIndex++}`);
      values.push(data.mastery);
    }

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(chapterId, userId);

    const result = await query(
      `UPDATE chapters SET ${fields.join(', ')} WHERE id = $${paramIndex++} AND user_id = $${paramIndex++} RETURNING *`,
      values
    );

    return result.rows[0];
  },

  async deleteChapter(userId: string, chapterId: string): Promise<void> {
    await query(
      `DELETE FROM chapters WHERE id = $1 AND user_id = $2`,
      [chapterId, userId]
    );
  },

  async updateChapterMastery(chapterId: string): Promise<number> {
    // Calculate mastery from last 3 QCM scores
    const result = await query(
      `SELECT AVG(percentage) as avg_mastery FROM qcm_scores 
       WHERE chapter_id = $1 ORDER BY created_at DESC LIMIT 3`,
      [chapterId]
    );

    const mastery = result.rows[0]?.avg_mastery || 0;

    await query(
      `UPDATE chapters SET mastery = $1 WHERE id = $2`,
      [mastery, chapterId]
    );

    return mastery;
  },
};
