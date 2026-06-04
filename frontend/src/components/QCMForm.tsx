import { useState } from 'react';
import { apiClient } from '../services/api.js';
import { SubmitButton, FormError } from './FormElements.js';

interface QCMFormProps {
  chapterId: string;
  onSuccess?: () => void;
}

export const QCMForm: React.FC<QCMFormProps> = ({ chapterId, onSuccess }) => {
  const [text, setText] = useState('');
  const [answers, setAnswers] = useState(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (!text.trim() || answers.some((a) => !a.trim())) {
        throw new Error('Tous les champs sont obligatoires');
      }

      await apiClient.createQuestion(chapterId, text, answers, correctAnswer);

      setText('');
      setAnswers(['', '', '', '']);
      setCorrectAnswer(0);
      onSuccess?.();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la création de la question');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormError message={error} />

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Question</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Entrez votre question..."
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-neon-purple"
          rows={3}
        />
      </div>

      {answers.map((answer, index) => (
        <div key={index}>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Réponse {index + 1}
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={answer}
              onChange={(e) => {
                const newAnswers = [...answers];
                newAnswers[index] = e.target.value;
                setAnswers(newAnswers);
              }}
              placeholder={`Réponse ${index + 1}`}
              className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-neon-purple"
            />
            <label className="flex items-center gap-1">
              <input
                type="radio"
                name="correctAnswer"
                checked={correctAnswer === index}
                onChange={() => setCorrectAnswer(index)}
              />
              <span className="text-sm">Correct</span>
            </label>
          </div>
        </div>
      ))}

      <SubmitButton isLoading={isLoading}>Créer la question</SubmitButton>
    </form>
  );
};
