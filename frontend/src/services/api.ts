import axios, { AxiosInstance } from 'axios';

const API_BASE_URL = 'https://astrorevise-backend.onrender.com/api';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  // Auth
  async register(email: string, password: string) {
    return this.client.post('/auth/register', { email, password });
  }

  async login(email: string, password: string) {
    return this.client.post('/auth/login', { email, password });
  }

  async getProfile() {
    return this.client.get('/auth/profile');
  }

  // Chapters
  async getMatters() {
    return this.client.get('/chapters/matters');
  }

  async getThemes(matterId?: string) {
    return this.client.get('/chapters/themes', { params: { matterId } });
  }

  async getChapters(themeId?: string) {
    return this.client.get('/chapters/chapters', { params: { themeId } });
  }

  async getChapterById(id: string) {
    return this.client.get(`/chapters/chapters/${id}`);
  }

  async createTheme(matterId: string, name: string) {
    return this.client.post('/chapters/themes', { matterId, name });
  }

  async createChapter(themeId: string, name: string, description?: string) {
    return this.client.post('/chapters/chapters', { themeId, name, description });
  }

  async updateChapter(id: string, data: any) {
    return this.client.put(`/chapters/chapters/${id}`, data);
  }

  async deleteChapter(id: string) {
    return this.client.delete(`/chapters/chapters/${id}`);
  }

  // Notes
  async getNotes(chapterId: string) {
    return this.client.get(`/notes/${chapterId}`);
  }

  async getNoteById(id: string) {
    return this.client.get(`/notes/note/${id}`);
  }

  async createNote(chapterId: string, title: string, content: string) {
    return this.client.post('/notes', { chapterId, title, content });
  }

  async updateNote(id: string, title: string, content: string) {
    return this.client.put(`/notes/${id}`, { title, content });
  }

  async deleteNote(id: string) {
    return this.client.delete(`/notes/${id}`);
  }

  // QCM
  async getQuestions(chapterId: string) {
    return this.client.get(`/qcm/${chapterId}`);
  }

  async createQuestion(chapterId: string, text: string, answers: string[], correctAnswer: number) {
    return this.client.post('/qcm', { chapterId, text, answers, correctAnswer });
  }

  async updateQuestion(id: string, text: string, answers: string[], correctAnswer: number) {
    return this.client.put(`/qcm/${id}`, { text, answers, correctAnswer });
  }

  async deleteQuestion(id: string) {
    return this.client.delete(`/qcm/${id}`);
  }

  async startQCM(chapterId: string, questionCount: number = 10) {
    return this.client.post('/qcm/start', { chapterId, questionCount });
  }

  async submitQCM(chapterId: string, answers: Record<string, number>) {
    return this.client.post('/qcm/submit', { chapterId, answers });
  }

  // Tasks
  async getTasks(date?: string, startDate?: string, endDate?: string) {
    return this.client.get('/tasks', { params: { date, startDate, endDate } });
  }

  async createTask(
    title: string,
    subject: 'MATHS' | 'PHYSIQUE',
    taskType: string,
    scheduledDate: string,
    chapterId?: string,
    estimatedDuration?: number,
    link?: string
  ) {
    return this.client.post('/tasks', {
      title,
      subject,
      taskType,
      scheduledDate,
      chapterId,
      estimatedDuration,
      link,
    });
  }

  async updateTask(id: string, data: any) {
    return this.client.put(`/tasks/${id}`, data);
  }

  async deleteTask(id: string) {
    return this.client.delete(`/tasks/${id}`);
  }

  // Resources
  async addFile(chapterId: string, name: string, url: string, fileType: string) {
    return this.client.post('/resources/files', { chapterId, name, url, fileType });
  }

  async getFiles(chapterId: string) {
    return this.client.get(`/resources/files/${chapterId}`);
  }

  async deleteFile(id: string) {
    return this.client.delete(`/resources/files/${id}`);
  }

  async addVideo(chapterId: string, title: string, youtubeUrl: string) {
    return this.client.post('/resources/videos', { chapterId, title, youtubeUrl });
  }

  async getVideos(chapterId: string) {
    return this.client.get(`/resources/videos/${chapterId}`);
  }

  async deleteVideo(id: string) {
    return this.client.delete(`/resources/videos/${id}`);
  }

  // Anki
  async checkAnkiConnection() {
    return this.client.get('/resources/anki/check');
  }

  async createAnkiCard(chapterId: string, deckName: string, front: string, back: string) {
    return this.client.post('/resources/anki/cards', { chapterId, deckName, front, back });
  }

  async getAnkiCards(chapterId: string) {
    return this.client.get(`/resources/anki/cards/${chapterId}`);
  }

  async deleteAnkiCard(id: string) {
    return this.client.delete(`/resources/anki/cards/${id}`);
  }

  // Export
  async exportUserData() {
    return this.client.get('/resources/export/data');
  }
}

export const apiClient = new ApiClient();
