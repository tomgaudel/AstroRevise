import { query } from '../database/connection.js';
import { Question, QCMScore } from '../types/index.js';

export const qcmService = {
  async getQuestions(userId: string, chapterId: string): Promise<Question[]> {
    const result = await query(
      `SELECT * FROM questions WHERE user_id = $1 AND chapter_id = $2 ORDER BY created_at`,
      [userId, chapterId]
    );
    return result.rows;
  },

  async getRandomQuestions(userId: string, chapterId: string, count: number): Promise<Question[]> {
    const result = await query(
      `SELECT * FROM questions WHERE user_id = $1 AND chapter_id = $2 ORDER BY RANDOM() LIMIT $3`,
      [userId, chapterId, count]
    );
    return result.rows;
  },

  async createQuestion(
    userId: string,
    chapterId: string,
    text: string,
    answers: string[],
    correctAnswer: number
  ): Promise<Question> {
    const result = await query(
      `INSERT INTO questions (user_id, chapter_id, text, answers, correct_answer) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [userId, chapterId, text, answers, correctAnswer]
    );
    return result.rows[0];
  },

  async updateQuestion(
    userId: string,
    questionId: string,
    text: string,
    answers: string[],
    correctAnswer: number
  ): Promise<Question> {
    const result = await query(
      `UPDATE questions SET text = $1, answers = $2, correct_answer = $3, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $4 AND user_id = $5 RETURNING *`,
      [text, answers, correctAnswer, questionId, userId]
    );
    return result.rows[0];
  },

  async deleteQuestion(userId: string, questionId: string): Promise<void> {
    await query(
      `DELETE FROM questions WHERE id = $1 AND user_id = $2`,
      [questionId, userId]
    );
  },

  async saveQCMScore(
    userId: string,
    chapterId: string,
    score: number,
    totalQuestions: number
  ): Promise<QCMScore> {
    const percentage = Math.round((score / totalQuestions) * 100);

    const result = await query(
      `INSERT INTO qcm_scores (user_id, chapter_id, score, total_questions, percentage) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [userId, chapterId, score, totalQuestions, percentage]
    );

    return result.rows[0];
  },

  async getChapterScores(userId: string, chapterId: string, limit: number = 3): Promise<QCMScore[]> {
    const result = await query(
      `SELECT * FROM qcm_scores WHERE user_id = $1 AND chapter_id = $2 
       ORDER BY created_at DESC LIMIT $3`,
      [userId, chapterId, limit]
    );
    return result.rows;
  },
};
