import { Request, Response } from 'express';
import { qcmService } from '../services/qcmService.js';
import { chapterService } from '../services/chapterService.js';

export const qcmController = {
  async getQuestions(req: Request, res: Response) {
    try {
      const { chapterId } = req.params;
      const questions = await qcmService.getQuestions(req.user!.userId, chapterId);
      res.json(questions);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async createQuestion(req: Request, res: Response) {
    try {
      const { chapterId, text, answers, correctAnswer } = req.body;

      if (!chapterId || !text || !answers || answers.length !== 4 || correctAnswer === undefined) {
        return res.status(400).json({ error: 'Invalid question data' });
      }

      const question = await qcmService.createQuestion(
        req.user!.userId,
        chapterId,
        text,
        answers,
        correctAnswer
      );

      res.status(201).json(question);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async updateQuestion(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { text, answers, correctAnswer } = req.body;

      if (!text || !answers || answers.length !== 4 || correctAnswer === undefined) {
        return res.status(400).json({ error: 'Invalid question data' });
      }

      const question = await qcmService.updateQuestion(
        req.user!.userId,
        id,
        text,
        answers,
        correctAnswer
      );

      res.json(question);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async deleteQuestion(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await qcmService.deleteQuestion(req.user!.userId, id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async startQCM(req: Request, res: Response) {
    try {
      const { chapterId, questionCount = 10 } = req.body;

      const questions = await qcmService.getRandomQuestions(
        req.user!.userId,
        chapterId,
        questionCount
      );

      // Return questions without correct answers for the quiz
      const questionsForQuiz = questions.map((q) => ({
        id: q.id,
        text: q.text,
        answers: q.answers,
      }));

      res.json({
        questions: questionsForQuiz,
        totalQuestions: questionsForQuiz.length,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async submitQCM(req: Request, res: Response) {
    try {
      const { chapterId, answers } = req.body;

      if (!chapterId || !answers || Object.keys(answers).length === 0) {
        return res.status(400).json({ error: 'chapterId and answers are required' });
      }

      let score = 0;
      const details = [];

      for (const [questionId, selectedAnswer] of Object.entries(answers) as [string, any][]) {
        const questions = await qcmService.getQuestions(req.user!.userId, chapterId);
        const question = questions.find((q) => q.id === questionId);

        if (question) {
          const isCorrect = question.correct_answer === selectedAnswer;
          if (isCorrect) score++;
          details.push({
            questionId,
            isCorrect,
            correct: question.correct_answer,
            selected: selectedAnswer,
          });
        }
      }

      const totalQuestions = Object.keys(answers).length;
      const qcmScore = await qcmService.saveQCMScore(
        req.user!.userId,
        chapterId,
        score,
        totalQuestions
      );

      // Update chapter mastery
      await chapterService.updateChapterMastery(chapterId);

      res.json({
        score,
        totalQuestions,
        percentage: qcmScore.percentage,
        details,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },
};
