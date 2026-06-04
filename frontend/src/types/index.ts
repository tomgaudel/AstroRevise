// Auth Types
export interface User {
  id: string;
  email: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

// Matter/Chapter Types
export type Subject = 'MATHS' | 'PHYSIQUE';

export interface Matter {
  id: string;
  user_id: string;
  name: Subject;
  created_at: string;
}

export interface Theme {
  id: string;
  user_id: string;
  matter_id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface Chapter {
  id: string;
  user_id: string;
  theme_id: string;
  name: string;
  description?: string;
  mastery: number;
  created_at: string;
  updated_at: string;
}

// Note Types
export interface Note {
  id: string;
  user_id: string;
  chapter_id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

// Resource Types
export interface FileResource {
  id: string;
  user_id: string;
  chapter_id: string;
  name: string;
  url: string;
  file_type: 'PDF' | 'IMAGE' | 'VIDEO';
  created_at: string;
}

export interface Video {
  id: string;
  user_id: string;
  chapter_id: string;
  title: string;
  youtube_url: string;
  created_at: string;
}

// QCM Types
export interface Question {
  id: string;
  user_id: string;
  chapter_id: string;
  text: string;
  answers: string[];
  correct_answer: number;
  created_at: string;
  updated_at: string;
}

export interface QCMScore {
  id: string;
  user_id: string;
  chapter_id: string;
  score: number;
  total_questions: number;
  percentage: number;
  created_at: string;
}

// Task Types
export type TaskType = 'COURS' | 'EXERCICES' | 'ANKI' | 'VIDEO' | 'QCM';

export interface Task {
  id: string;
  user_id: string;
  title: string;
  subject: Subject;
  chapter_id?: string;
  task_type: TaskType;
  estimated_duration?: number;
  link?: string;
  scheduled_date: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

// Anki Types
export interface AnkiCard {
  id: string;
  user_id: string;
  chapter_id: string;
  front: string;
  back: string;
  anki_nid?: number;
  created_at: string;
}

// Dashboard Types
export interface DashboardData {
  todayTasks: Task[];
  lowMasteryChapters: Chapter[];
  recentScores: QCMScore[];
  ankiConnected: boolean;
}
