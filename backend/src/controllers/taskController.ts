import { Request, Response } from 'express';
import { taskService } from '../services/taskService.js';

export const taskController = {
  async getTasks(req: Request, res: Response) {
    try {
      const { date, startDate, endDate } = req.query;

      let tasks;

      if (startDate && endDate) {
        tasks = await taskService.getTasksRange(
          req.user!.userId,
          startDate as string,
          endDate as string
        );
      } else if (date) {
        tasks = await taskService.getTasks(req.user!.userId, date as string);
      } else {
        tasks = await taskService.getTasks(req.user!.userId);
      }

      res.json(tasks);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async createTask(req: Request, res: Response) {
    try {
      const { title, subject, taskType, scheduledDate, chapterId, estimatedDuration, link } =
        req.body;

      if (!title || !subject || !taskType || !scheduledDate) {
        return res.status(400).json({
          error: 'title, subject, taskType, and scheduledDate are required',
        });
      }

      const task = await taskService.createTask(
        req.user!.userId,
        title,
        subject,
        taskType,
        scheduledDate,
        chapterId,
        estimatedDuration,
        link
      );

      res.status(201).json(task);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async updateTask(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const task = await taskService.updateTask(req.user!.userId, id, req.body);
      res.json(task);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async deleteTask(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await taskService.deleteTask(req.user!.userId, id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },
};
