import { useState } from 'react';
import type { QuizState } from '../lib/types';
import { submitAnswer, calculateScore, getAnswerOptions } from '../lib/quizLogic';

interface QuizProps {
  initialState: QuizState;
  onComplete: () => void;
  onBack: () => void;
}

export default function Quiz({ initialState, onComplete, onBack }: QuizProps) {
  const [state, setState] = useState<QuizState>(initialState);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  if (state.isComplete) {
    const score = calculateScore(state);
    
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-4xl font-bold text-center mb-8">Quiz Complete!</h1>
          
          <div className="text-center mb-8">
            <div className="text-6xl font-bold text-blue-600 mb-2">{score.percentage}%</div>
            <div className="text-xl text-gray-600">
              {score.correct} correct out of {score.total}
            </div>
          </div>

          {score.percentage === 100 && (
            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6">
              <p className="font-bold">🎉 Perfect Score!</p>
              <p>You've mastered these concepts!</p>
            </div>
          )}

          {score.percentage >= 80 && score.percentage < 100 && (
            <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-6">
              <p className="font-bold">✨ Great Job!</p>
              <p>You have a strong understanding.</p>
            </div>
          )}

          {score.percentage >= 60 && score.percentage < 80 && (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6">
              <p className="font-bold">👍 Good Effort!</p>
              <p>Review the concepts you missed.</p>
            </div>
          )}

          {score.percentage < 60 && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
              <p className="font-bold">📚 Keep Practicing!</p>
              <p>Review these topics and try again.</p>
            </div>
          )}

          <div className="space-y-4 mb-8">
            <h2 className="text-2xl font-bold">Review</h2>
            {state.answers.map((answer, index) => (
              <div
                key={index}
                className={`border-l-4 p-4 rounded ${
                  answer.isCorrect ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
                }`}
              >
                <div className="font-semibold mb-2">
                  {answer.isCorrect ? '✓' : '✗'} {answer.question}
                </div>
                {!answer.isCorrect && (
                  <>
                    <div className="text-sm text-gray-600">
                      Your answer: <span className="font-medium">{answer.userAnswer}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      Correct answer: <span className="font-medium text-green-600">{answer.correctAnswer}</span>
                    </div>
                  </>
                )}
                <div className="text-sm text-gray-700 mt-2">
                  <span className="font-medium">Explanation:</span> {answer.explanation}
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={onBack}
              className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-8 rounded-lg transition"
            >
              Back to Dashboard
            </button>
            <button
              onClick={onComplete}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition"
            >
              Take Another Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  const current = state.questions[state.currentIndex];
  const options = getAnswerOptions(current.question);

  const handleSubmit = () => {
    if (!selectedAnswer) return;
    
    const newState = submitAnswer(state, selectedAnswer);
    setState(newState);
    setSelectedAnswer(null);
    setShowExplanation(false);
  };

  const handleAnswerClick = (answer: string) => {
    setSelectedAnswer(answer);
    setShowExplanation(true);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={onBack}
              className="text-gray-600 hover:text-gray-800 font-medium"
            >
              ← Back
            </button>
            <div className="text-gray-600 font-medium">
              Question {state.currentIndex + 1} of {state.questions.length}
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${((state.currentIndex + 1) / state.questions.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="mb-6">
          <div className="text-sm text-gray-600 mb-2">
            Topic: {current.entry.topic} ({current.entry.category})
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {current.question.question}
          </h2>
        </div>

        <div className="space-y-3 mb-6">
          {options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerClick(option)}
              className={`w-full text-left p-4 rounded-lg border-2 transition ${
                selectedAnswer === option
                  ? showExplanation && option === current.question.correctAnswer
                    ? 'border-green-500 bg-green-50'
                    : showExplanation
                    ? 'border-red-500 bg-red-50'
                    : 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
              }`}
              disabled={showExplanation}
            >
              <div className="font-medium">{option}</div>
            </button>
          ))}
        </div>

        {showExplanation && (
          <div className={`p-4 rounded-lg mb-6 ${
            selectedAnswer === current.question.correctAnswer
              ? 'bg-green-100 border-l-4 border-green-500'
              : 'bg-yellow-100 border-l-4 border-yellow-500'
          }`}>
            <div className="font-semibold mb-2">
              {selectedAnswer === current.question.correctAnswer ? '✓ Correct!' : 'Not quite...'}
            </div>
            <div className="text-sm">
              <span className="font-medium">Explanation:</span> {current.question.explanation}
            </div>
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={!selectedAnswer}
          className={`w-full font-semibold py-3 px-6 rounded-lg transition ${
            selectedAnswer
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {state.currentIndex === state.questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
        </button>
      </div>
    </div>
  );
}
