import { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import Quiz from './components/Quiz';
import LearningList from './components/LearningList';
import { loadLearningData, loadFromFile } from './lib/learningData';
import { generateQuiz } from './lib/quizLogic';
import type { LearningData, QuizState } from './lib/types';
import './index.css';

type View = 'loading' | 'file-picker' | 'dashboard' | 'quiz' | 'list';

function App() {
  const [view, setView] = useState<View>('loading');
  const [data, setData] = useState<LearningData | null>(null);
  const [quizState, setQuizState] = useState<QuizState | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadLearningData()
      .then(data => {
        setData(data);
        setView('dashboard');
      })
      .catch(err => {
        console.error('Failed to load data:', err);
        setView('file-picker');
      });
  }, []);

  const handleFileSelect = async (file: File) => {
    try {
      setError(null);
      const loadedData = await loadFromFile(file);
      setData(loadedData);
      setView('dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load file');
    }
  };

  const handleStartQuiz = (filters?: { category?: string; difficulty?: string }) => {
    if (!data) return;
    
    const quiz = generateQuiz(data.entries, {
      count: 5,
      ...filters
    });

    if (quiz.questions.length === 0) {
      alert('No quiz questions available for these filters');
      return;
    }

    setQuizState(quiz);
    setView('quiz');
  };

  const handleQuizComplete = () => {
    setQuizState(null);
    setView('dashboard');
  };

  if (view === 'loading') {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl font-bold text-blue-600 mb-4">Learning Quiz App</div>
          <div className="text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }

  if (view === 'file-picker') {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white rounded-lg shadow-md p-8">
          <h1 className="text-4xl font-bold text-center mb-6">Learning Quiz App</h1>
          
          <div className="mb-6">
            <p className="text-gray-700 mb-4">
              This app uses sample data for demonstration. To use your own learning data:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>Select your LEARNING.json file using the button below</li>
              <li>Or set up the local API server (see README)</li>
            </ol>
          </div>

          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
              <p className="font-bold">Error</p>
              <p>{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block">
                <span className="sr-only">Choose file</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileSelect(file);
                  }}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-lg file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
                />
              </label>
              <p className="text-sm text-gray-600 mt-2">
                Select your LEARNING.json file from ~/LEARNING.json
              </p>
            </div>

            <div className="text-center">
              <div className="text-gray-600 mb-2">or</div>
              <button
                onClick={() => {
                  // Load sample data (already loaded as fallback)
                  loadLearningData().then(data => {
                    setData(data);
                    setView('dashboard');
                  });
                }}
                className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition"
              >
                Use Sample Data
              </button>
            </div>
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">First time here?</h3>
            <p className="text-sm text-blue-800">
              This quiz app works with the Learning CLI tool. Install it globally with npm,
              then use <code className="bg-blue-200 px-2 py-1 rounded">learning add</code> to create entries.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      {view === 'dashboard' && (
        <Dashboard
          data={data}
          onStartQuiz={handleStartQuiz}
          onViewLearnings={() => setView('list')}
        />
      )}

      {view === 'quiz' && quizState && (
        <Quiz
          initialState={quizState}
          onComplete={handleQuizComplete}
          onBack={() => setView('dashboard')}
        />
      )}

      {view === 'list' && (
        <LearningList
          entries={data.entries}
          onBack={() => setView('dashboard')}
        />
      )}
    </div>
  );
}

export default App;
