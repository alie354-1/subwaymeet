import React, { useState } from 'react';
import { Users, Search, KeyRound } from 'lucide-react';

interface JoinSessionProps {
  onJoinSession: (code: string, userName: string) => void;
  isLoading?: boolean;
}

export const JoinSession: React.FC<JoinSessionProps> = ({
  onJoinSession,
  isLoading = false
}) => {
  const [sessionCode, setSessionCode] = useState('');
  const [userName, setUserName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!sessionCode.trim()) {
      setError('Please enter a session code');
      return;
    }

    if (!userName.trim()) {
      setError('Please enter your name');
      return;
    }

    onJoinSession(sessionCode.trim().toUpperCase(), userName.trim());
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="text-center mb-6">
        <div className="bg-blue-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          <Users className="h-8 w-8 text-blue-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900">Join a Meetup</h3>
        <p className="text-gray-600 mt-2">Enter the code shared by your friend</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="sessionCode" className="block text-sm font-medium text-gray-700 mb-2">
            Session Code
          </label>
          <div className="relative">
            <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              id="sessionCode"
              value={sessionCode}
              onChange={(e) => setSessionCode(e.target.value)}
              placeholder="Enter 6-digit code"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-center text-lg"
              maxLength={6}
              disabled={isLoading}
            />
          </div>
        </div>

        <div>
          <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-2">
            Your Name
          </label>
          <input
            type="text"
            id="userName"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="How should others see you?"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          />
        </div>

        {error && (
          <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <>
              <Search className="h-5 w-5 animate-spin" />
              <span>Joining...</span>
            </>
          ) : (
            <>
              <Users className="h-5 w-5" />
              <span>Join Meetup</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};