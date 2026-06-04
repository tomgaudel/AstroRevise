import { query } from '../database/connection.js';
import { Task } from '../types/index.js';

export const taskService = {
  async getTasks(userId: string, date?: string): Promise<Task[]> {
    if (date) {
      const result = await query(
        `SELECT * FROM tasks WHERE user_id = $1 AND scheduled_date = $2 ORDER BY created_at`,
        [userId, date]
      );
      return result.rows;
    }

    const result = await query(
      `SELECT * FROM tasks WHERE user_id = $1 ORDER BY scheduled_date`,
      [userId]
    );
    return result.rows;
  },

  async getTasksRange(userId: string, startDate: string, endDate: string): Promise<Task[]> {
    const result = await query(
      `SELECT * FROM tasks WHERE user_id = $1 AND scheduled_date >= $2 AND scheduled_date <= $3 
       ORDER BY scheduled_date`,
      [userId, startDate, endDate]
    );
    return result.rows;
  },

  async createTask(
    userId: string,
    title: string,
    subject: 'MATHS' | 'PHYSIQUE',
    taskType: 'COURS' | 'EXERCICES' | 'ANKI' | 'VIDEO' | 'QCM',
    scheduledDate: string,
    chapterId?: string,
    estimatedDuration?: number,
    link?: string
  ): Promise<Task> {
    const result = await query(
      `INSERT INTO tasks (user_id, title, subject, task_type, scheduled_date, chapter_id, estimated_duration, link) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [userId, title, subject, taskType, scheduledDate, chapterId || null, estimatedDuration || null, link || null]
    );
    return result.rows[0];
  },

  async updateTask(userId: string, taskId: string, data: Partial<Task>): Promise<Task> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (data.title !== undefined) {
      fields.push(`title = $${paramIndex++}`);
      values.push(data.title);
    }
    if (data.completed !== undefined) {
      fields.push(`completed = $${paramIndex++}`);
      values.push(data.completed);
    }
    if (data.link !== undefined) {
      fields.push(`link = $${paramIndex++}`);
      values.push(data.link);
    }
    if (data.estimated_duration !== undefined) {
      fields.push(`estimated_duration = $${paramIndex++}`);
      values.push(data.estimated_duration);
    }

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(taskId, userId);

    const result = await query(
      `UPDATE tasks SET ${fields.join(', ')} WHERE id = $${paramIndex++} AND user_id = $${paramIndex++} RETURNING *`,
      values
    );

    return result.rows[0];
  },

  async deleteTask(userId: string, taskId: string): Promise<void> {
    await query(
      `DELETE FROM tasks WHERE id = $1 AND user_id = $2`,
      [taskId, userId]
    );
  },
};
