import { useState } from 'react';
import type { LearningEntry } from '../lib/types';
import { filterEntries } from '../lib/learningData';

interface LearningListProps {
  entries: LearningEntry[];
  onBack: () => void;
}

export default function LearningList({ entries, onBack }: LearningListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const categories = Array.from(new Set(entries.map(e => e.category))).sort();
  
  const filtered = filterEntries(entries, {
    category: selectedCategory || undefined,
    difficulty: selectedDifficulty || undefined,
    search: searchTerm || undefined
  });

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-4xl font-bold">All Learnings</h1>
          <button
            onClick={onBack}
            className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-6 rounded-lg transition"
          >
            ← Back
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Difficulties</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          {(searchTerm || selectedCategory || selectedDifficulty) && (
            <div className="mt-4 text-sm text-gray-600">
              Showing {filtered.length} of {entries.length} entries
            </div>
          )}
        </div>
      </div>

      {/* Entries List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-600">
            No entries found matching your filters.
          </div>
        ) : (
          filtered.map(entry => (
            <div key={entry.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div
                className="p-6 cursor-pointer hover:bg-gray-50 transition"
                onClick={() => setExpandedId(expandedId === entry.id ? null : entry.id)}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-gray-900">{entry.topic}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    entry.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                    entry.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {entry.difficulty}
                  </span>
                </div>

                <div className="flex gap-4 text-sm text-gray-600 mb-3">
                  <span className="font-medium text-purple-600">{entry.category}</span>
                  <span>{new Date(entry.timestamp).toLocaleDateString()}</span>
                  {entry.revisitCount && entry.revisitCount > 0 && (
                    <span>Reviewed {entry.revisitCount} time{entry.revisitCount > 1 ? 's' : ''}</span>
                  )}
                </div>

                {entry.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {entry.tags.map(tag => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                <p className="text-gray-700">{entry.conceptLearned}</p>

                <div className="mt-3 text-sm text-blue-600 font-medium">
                  {expandedId === entry.id ? '▼ Hide details' : '▶ Show details'}
                </div>
              </div>

              {expandedId === entry.id && (
                <div className="px-6 pb-6 border-t border-gray-200 bg-gray-50">
                  <div className="mt-4 space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Context</h4>
                      <p className="text-gray-700">{entry.context}</p>
                    </div>

                    {entry.whyItMatters && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Why It Matters</h4>
                        <p className="text-gray-700">{entry.whyItMatters}</p>
                      </div>
                    )}

                    {entry.futureApplication && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Future Application</h4>
                        <p className="text-gray-700">{entry.futureApplication}</p>
                      </div>
                    )}

                    {entry.relatedConcepts.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Related Concepts</h4>
                        <div className="flex flex-wrap gap-2">
                          {entry.relatedConcepts.map(concept => (
                            <span
                              key={concept}
                              className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded"
                            >
                              {concept}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {entry.quizQuestions.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">
                          Quiz Questions ({entry.quizQuestions.length})
                        </h4>
                        <div className="space-y-2">
                          {entry.quizQuestions.map((q, i) => (
                            <div key={i} className="text-sm bg-white p-3 rounded border border-gray-200">
                              <div className="font-medium text-gray-900 mb-1">{q.question}</div>
                              <div className="text-green-600">✓ {q.correctAnswer}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
