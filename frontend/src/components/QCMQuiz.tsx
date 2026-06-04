import React, { useState, useEffect } from 'react';
import { apiClient } from '../services/api.js';
import { Question } from '../types/index.js';
import { LoadingSpinner, FormError, SubmitButton } from './FormElements.js';

interface QCMQuizProps {
  chapterId: string;
  questionCount?: number;
  onComplete: (results: any) => void;
}

export const QCMQuiz: React.FC<QCMQuizProps> = ({ chapterId, questionCount = 10, onComplete }) => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const response = await apiClient.startQCM(chapterId, questionCount);
        setQuestions(response.data.questions);
      } catch (err: any) {
        setError('Erreur lors du chargement des questions');
      } finally {
        setIsLoading(false);
      }
    };

    loadQuestions();
  }, [chapterId, questionCount]);

  const handleAnswerSelect = (answerIndex: number) => {
    setAnswers({
      ...answers,
      [questions[currentIndex].id]: answerIndex,
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await apiClient.submitQCM(chapterId, answers);
      onComplete(response.data);
    } catch (err: any) {
      setError('Erreur lors de la soumission');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (questions.length === 0) {
    return <FormError message="Aucune question disponible pour ce chapitre" />;
  }

  const currentQuestion = questions[currentIndex];
  const isAnswered = answers[currentQuestion.id] !== undefined;

  return (
    <div className="space-y-6">
      <FormError message={error} />

      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold">
            Question {currentIndex + 1} / {questions.length}
          </h3>
          <div className="bg-slate-200 rounded-full h-2 w-24">
            <div
              className="bg-gradient-neon h-2 rounded-full"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        <p className="text-lg font-medium mb-4">{currentQuestion.text}</p>

        <div className="space-y-2">
          {currentQuestion.answers.map((answer: string, index: number) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              className={`w-full p-3 text-left rounded-lg border-2 transition ${
                answers[currentQuestion.id] === index
                  ? 'border-neon-purple bg-purple-50'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <span className="font-medium">{String.fromCharCode(65 + index)}.</span> {answer}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center">
        <button
          onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
          disabled={currentIndex === 0}
          className="px-4 py-2 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100 disabled:opacity-50"
        >
          Précédent
        </button>

        {currentIndex < questions.length - 1 ? (
          <button
            onClick={() => setCurrentIndex(currentIndex + 1)}
            disabled={!isAnswered}
            className="px-4 py-2 rounded-lg bg-gradient-neon text-white hover:shadow-md-soft disabled:opacity-50"
          >
            Suivant
          </button>
        ) : (
          <SubmitButton isLoading={isSubmitting}>Terminer</SubmitButton>
        )}
      </div>
    </div>
  );
};
