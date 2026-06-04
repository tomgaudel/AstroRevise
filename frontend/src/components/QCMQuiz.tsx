import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../hooks/useAuth';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

interface QCMQuizProps {
  chapterId: string;
  questionCount?: number;
}

interface Question {
  id: string;
  text: string;
  answers: string[];
  correct_answer: number;
}

const QCMQuiz: React.FC<QCMQuizProps> = ({ chapterId, questionCount = 10 }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [score, setScore] = useState<number | null>(null);
  const { token } = useAuthStore();

  useEffect(() => {
    fetchQuestions();
  }, [chapterId]);

  const fetchQuestions = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(`/questions/chapter/${chapterId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      let allQuestions = response.data;
      if (allQuestions.length > questionCount) {
        allQuestions = allQuestions.sort(() => 0.5 - Math.random()).slice(0, questionCount);
      }
      setQuestions(allQuestions);
      setAnswers({});
      setCurrentIndex(0);
      setScore(null);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Erreur lors du chargement des questions');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswer = (questionId: string, answerIndex: number) => {
    setAnswers({ ...answers, [questionId]: answerIndex });
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((q) => {
      if (answers[q.id] === q.correct_answer) {
        correct++;
      }
    });
    const percentage = (correct / questions.length) * 100;
    setScore(percentage);
    return percentage;
  };

  const submitQuiz = async () => {
    const percentage = calculateScore();
    try {
      await api.post(
        '/qcm/scores',
        {
          chapter_id: chapterId,
          score: Math.round((percentage / 100) * questions.length),
          total_questions: questions.length,
          percentage,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error('Erreur lors de la sauvegarde du score', err);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Chargement des questions...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-8">{error}</div>;
  }

  if (score !== null) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold mb-4">Quiz terminé !</h2>
        <p className="text-xl">
          Ton score : {Math.round(score)}% ({Math.round((score / 100) * questions.length)} / {questions.length})
        </p>
        <button
          onClick={fetchQuestions}
          className="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          Recommencer
        </button>
      </div>
    );
  }

  if (questions.length === 0) {
    return <div className="text-center py-8">Aucune question trouvée pour ce chapitre.</div>;
  }

  const currentQuestion = questions[currentIndex];
  const currentAnswer = answers[currentQuestion?.id];

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="mb-4">
        <span className="text-sm text-gray-500">
          Question {currentIndex + 1} / {questions.length}
        </span>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
          <div
            className="bg-purple-600 h-2 rounded-full transition-all"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-4">
        <h3 className="text-lg font-semibold mb-4">{currentQuestion?.text}</h3>
        <div className="space-y-2">
          {currentQuestion?.answers.map((answer, idx) => (
            <label key={idx} className="flex items-center space-x-3 p-2 rounded hover:bg-gray-50 cursor-pointer">
              <input
                type="radio"
                name="question"
                value={idx}
                checked={currentAnswer === idx}
                onChange={() => handleAnswer(currentQuestion.id, idx)}
                className="w-4 h-4 text-purple-600"
              />
              <span>{answer}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50 hover:bg-gray-400"
        >
          Précédent
        </button>
        {currentIndex < questions.length - 1 ? (
          <button
            onClick={handleNext}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Suivant
          </button>
        ) : (
          <button
            onClick={submitQuiz}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Terminer
          </button>
        )}
      </div>
    </div>
  );
};

export default QCMQuiz;