import { useState, useEffect } from 'react';

const GITHUB_TOKEN_KEY = 'github_token';

interface UseGithubTokenReturn {
  token: string
  isAuthenticated: boolean;
  setToken: (newToken: string) => void;
  clearToken: () => void;
}

/**
 * Hook personnalisé pour gérer le token GitHub dans localStorage
 * 
 * @returns {Object} Fonctions et états pour gérer le token
 */
export const useGithubToken = (): UseGithubTokenReturn => {
  const [token, setTokenState] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Vérifie si un token existe déjà dans localStorage lors du chargement
  useEffect(() => {
    const storedToken = localStorage.getItem(GITHUB_TOKEN_KEY);
    if (storedToken) {
      setTokenState(storedToken);
      setIsAuthenticated(true);
    }
  }, []);

  // Fonction pour définir un nouveau token
  const setToken = (newToken: string): void => {
    localStorage.setItem(GITHUB_TOKEN_KEY, newToken);
    setTokenState(newToken);
    setIsAuthenticated(true);
  };

  // Fonction pour supprimer le token
  const clearToken = (): void => {
    localStorage.removeItem(GITHUB_TOKEN_KEY);
    setTokenState(null);
    setIsAuthenticated(false);
  };

  return {
    token: token || '',
    isAuthenticated,
    setToken,
    clearToken
  };
};

export default useGithubToken;