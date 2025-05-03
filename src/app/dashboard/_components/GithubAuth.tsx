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
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg mt-8 border border-gray-700">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            Comment obtenir un token GitHub
          </h2>
          <ol className="list-decimal list-inside space-y-3 ml-4 text-gray-300">
            <li>Connectez-vous à votre compte GitHub</li>
            <li>Accédez à <span className="bg-gray-700 px-2 py-1 rounded font-mono text-sm">Settings &gt; Developer settings &gt; Personal access tokens &gt; Tokens (classic)</span></li>
            <li>Cliquez sur <span className="bg-gray-700 px-2 py-1 rounded font-mono text-sm">Generate new token</span></li>
            <li>Donnez un nom à votre token et sélectionnez au minimum les scopes: <span className="bg-gray-700 px-2 py-1 rounded font-mono text-sm">repo, read:user</span></li>
            <li>Cliquez sur <span className="bg-gray-700 px-2 py-1 rounded font-mono text-sm">Generate token</span></li>
            <li>Copiez le token et collez-le dans le formulaire ci-dessus</li>
          </ol>
        </div>
    </div>
  );
};

export default GithubAuth;