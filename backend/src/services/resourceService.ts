import { query } from '../database/connection.js';
import { FileResource, Video } from '../types/index.js';

export const resourceService = {
  async addFileResource(
    userId: string,
    chapterId: string,
    name: string,
    url: string,
    fileType: 'PDF' | 'IMAGE' | 'VIDEO'
  ): Promise<FileResource> {
    const result = await query(
      `INSERT INTO file_resources (user_id, chapter_id, name, url, file_type) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [userId, chapterId, name, url, fileType]
    );
    return result.rows[0];
  },

  async getFileResources(userId: string, chapterId: string): Promise<FileResource[]> {
    const result = await query(
      `SELECT * FROM file_resources WHERE user_id = $1 AND chapter_id = $2 ORDER BY created_at DESC`,
      [userId, chapterId]
    );
    return result.rows;
  },

  async deleteFileResource(userId: string, resourceId: string): Promise<void> {
    await query(
      `DELETE FROM file_resources WHERE id = $1 AND user_id = $2`,
      [resourceId, userId]
    );
  },

  async addVideo(userId: string, chapterId: string, title: string, youtubeUrl: string): Promise<Video> {
    const result = await query(
      `INSERT INTO videos (user_id, chapter_id, title, youtube_url) VALUES ($1, $2, $3, $4) RETURNING *`,
      [userId, chapterId, title, youtubeUrl]
    );
    return result.rows[0];
  },

  async getVideos(userId: string, chapterId: string): Promise<Video[]> {
    const result = await query(
      `SELECT * FROM videos WHERE user_id = $1 AND chapter_id = $2 ORDER BY created_at DESC`,
      [userId, chapterId]
    );
    return result.rows;
  },

  async deleteVideo(userId: string, videoId: string): Promise<void> {
    await query(
      `DELETE FROM videos WHERE id = $1 AND user_id = $2`,
      [videoId, userId]
    );
  },
};
