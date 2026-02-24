import { useState, useEffect } from 'react';
import type { LearningData } from '../lib/types';
import { getStats } from '../lib/learningData';

interface DashboardProps {
  data: LearningData;
  onStartQuiz: (filters?: { category?: string; difficulty?: string }) => void;
  onViewLearnings: () => void;
}

export default function Dashboard({ data, onStartQuiz, onViewLearnings }: DashboardProps) {
  const [stats, setStats] = useState<ReturnType<typeof getStats> | null>(null);

  useEffect(() => {
    setStats(getStats(data));
  }, [data]);

  if (!stats) return null;

  const recentEntries = data.entries.slice(0, 5);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">Learning Dashboard</h1>
        <p className="text-xl text-gray-600">Test your knowledge and track your progress</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-gray-500 text-sm font-medium mb-1">Total Entries</div>
          <div className="text-4xl font-bold text-blue-600">{stats.total}</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-gray-500 text-sm font-medium mb-1">Categories</div>
          <div className="text-4xl font-bold text-purple-600">{Object.keys(stats.byCategory).length}</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-gray-500 text-sm font-medium mb-1">Last Updated</div>
          <div className="text-lg font-semibold text-gray-700">
            {new Date(stats.lastUpdated).toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* Difficulty Distribution */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">By Difficulty</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">{stats.byDifficulty.beginner}</div>
            <div className="text-gray-600">Beginner</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-600">{stats.byDifficulty.intermediate}</div>
            <div className="text-gray-600">Intermediate</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600">{stats.byDifficulty.advanced}</div>
            <div className="text-gray-600">Advanced</div>
          </div>
        </div>
      </div>

      {/* Quick Quiz Buttons */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">Start a Quiz</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
          <button
            onClick={() => onStartQuiz()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition"
          >
            Random Quiz
          </button>
          {Object.entries(stats.byCategory).slice(0, 5).map(([category, count]) => (
            <button
              key={category}
              onClick={() => onStartQuiz({ category })}
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition"
            >
              {category} ({count})
            </button>
          ))}
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => onStartQuiz({ difficulty: 'beginner' })}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            Beginner Quiz
          </button>
          <button
            onClick={() => onStartQuiz({ difficulty: 'intermediate' })}
            className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            Intermediate Quiz
          </button>
          <button
            onClick={() => onStartQuiz({ difficulty: 'advanced' })}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            Advanced Quiz
          </button>
        </div>
      </div>

      {/* Recent Learnings */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Recent Learnings</h2>
          <button
            onClick={onViewLearnings}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            View All →
          </button>
        </div>
        <div className="space-y-4">
          {recentEntries.map(entry => (
            <div key={entry.id} className="border-l-4 border-blue-600 pl-4 py-2">
              <div className="font-semibold text-gray-900">{entry.topic}</div>
              <div className="text-sm text-gray-600">{entry.category} • {entry.difficulty}</div>
              <div className="text-sm text-gray-700 mt-1">
                {entry.conceptLearned.substring(0, 120)}...
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
