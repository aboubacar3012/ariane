'use client';

import React, { useState } from 'react';

interface GithubAuthProps {
  onTokenSubmit: (token: string) => void;
}

const GithubAuth: React.FC<GithubAuthProps> = ({ onTokenSubmit }) => {
  const [token, setToken] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (token.trim()) {
      onTokenSubmit(token);
    }
  };



  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
      <h2 className="text-xl font-semibold mb-4">GitHub Authentication</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="githubToken" className="block mb-2">
            GitHub Personal Access Token
          </label>
          <input
            id="githubToken"
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="w-full p-2 border rounded bg-gray-700 border-gray-600 text-white"
            placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
          />
          <p className="mt-1 text-sm text-gray-400">
            Votre token est stocké uniquement dans votre navigateur et n&apos;est jamais envoyé à nos serveurs.
          </p>
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Connecter
        </button>
      </form>
    </div>
  );
};

export default GithubAuth;