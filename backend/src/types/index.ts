// User Types
export interface User {
  id: string;
  email: string;
  password_hash: string;
  created_at: Date;
  updated_at: Date;
}

export interface AuthPayload {
  userId: string;
  email: string;
}

// Subject/Matter Types
export type Subject = 'MATHS' | 'PHYSIQUE';

// Chapter Types
export interface Matter {
  id: string;
  user_id: string;
  name: Subject;
  created_at: Date;
}

export interface Theme {
  id: string;
  user_id: string;
  matter_id: string;
  name: string;
  created_at: Date;
  updated_at: Date;
}

export interface Chapter {
  id: string;
  user_id: string;
  theme_id: string;
  name: string;
  description?: string;
  mastery: number;
  created_at: Date;
  updated_at: Date;
}

// Note Types
export interface Note {
  id: string;
  user_id: string;
  chapter_id: string;
  title: string;
  content: string; // Markdown
  created_at: Date;
  updated_at: Date;
}

// File/Resource Types
export interface FileResource {
  id: string;
  user_id: string;
  chapter_id: string;
  name: string;
  url: string;
  file_type: 'PDF' | 'IMAGE' | 'VIDEO';
  created_at: Date;
}

// Video Types
export interface Video {
  id: string;
  user_id: string;
  chapter_id: string;
  title: string;
  youtube_url: string;
  created_at: Date;
}

// QCM Types
export interface Question {
  id: string;
  user_id: string;
  chapter_id: string;
  text: string;
  answers: string[]; // 4 answers
  correct_answer: number; // index 0-3
  created_at: Date;
  updated_at: Date;
}

export interface QuestionResponse {
  id: string;
  user_id: string;
  question_id: string;
  answer_selected: number;
  is_correct: boolean;
  created_at: Date;
}

export interface QCMScore {
  id: string;
  user_id: string;
  chapter_id: string;
  score: number;
  total_questions: number;
  percentage: number;
  created_at: Date;
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
  estimated_duration?: number; // in minutes
  link?: string;
  scheduled_date: Date;
  completed: boolean;
  created_at: Date;
  updated_at: Date;
}

// Anki Types
export interface AnkiDeckConfig {
  id: string;
  user_id: string;
  chapter_id: string;
  deck_name: string;
  created_at: Date;
}

export interface AnkiCard {
  id: string;
  user_id: string;
  chapter_id: string;
  front: string;
  back: string;
  anki_nid?: number; // AnkiConnect note ID
  created_at: Date;
}
