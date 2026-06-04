import axios from 'axios';
import { query } from '../database/connection.js';
import { AnkiCard } from '../types/index.js';

const ANKI_URL = 'http://localhost:8765';

interface AnkiRequest {
  action: string;
  version: number;
  params?: any;
}

const ankiRequest = async (action: string, params?: any): Promise<any> => {
  try {
    const response = await axios.post(ANKI_URL, {
      action,
      version: 6,
      params,
    } as AnkiRequest);

    if (response.data.error) {
      throw new Error(response.data.error);
    }

    return response.data.result;
  } catch (error) {
    throw new Error('AnkiConnect unavailable');
  }
};

export const ankiService = {
  async checkConnection(): Promise<boolean> {
    try {
      await ankiRequest('version');
      return true;
    } catch {
      return false;
    }
  },

  async getDueCards(deckName: string): Promise<number> {
    try {
      const dueCards = await ankiRequest('findCards', {
        query: `deck:"${deckName}" is:due`,
      });
      return dueCards.length;
    } catch {
      return 0;
    }
  },

  async createCard(deckName: string, front: string, back: string): Promise<number | null> {
    try {
      const noteId = await ankiRequest('addNote', {
        note: {
          deckName,
          modelName: 'Basic',
          fields: {
            Front: front,
            Back: back,
          },
          tags: ['AstroRevise'],
        },
      });
      return noteId;
    } catch {
      return null;
    }
  },

  async saveCard(
    userId: string,
    chapterId: string,
    front: string,
    back: string,
    ankiNid?: number
  ): Promise<AnkiCard> {
    const result = await query(
      `INSERT INTO anki_cards (user_id, chapter_id, front, back, anki_nid) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [userId, chapterId, front, back, ankiNid || null]
    );
    return result.rows[0];
  },

  async getCards(userId: string, chapterId: string): Promise<AnkiCard[]> {
    const result = await query(
      `SELECT * FROM anki_cards WHERE user_id = $1 AND chapter_id = $2 ORDER BY created_at`,
      [userId, chapterId]
    );
    return result.rows;
  },

  async deleteCard(userId: string, cardId: string): Promise<void> {
    await query(
      `DELETE FROM anki_cards WHERE id = $1 AND user_id = $2`,
      [cardId, userId]
    );
  },
};
