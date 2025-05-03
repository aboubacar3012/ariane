'use client';
import React, { useState, useEffect } from 'react';
import GitHubService, { PullRequestStats, PullRequest } from '@/src/services/github';
import GithubAuth from './GithubAuth';
import DashboardContentSkeleton from './DashboardContentSkeleton';

// Interface pour les repos GitHub
interface GitHubRepo {
  id: number;
  name: string;
  owner: {
    login: string;
  };
}

// Interface pour l'utilisateur GitHub
interface GitHubUser {
  login: string;
  name?: string;
  bio?: string;
  avatar_url?: string;
  public_repos: number;
  followers: number;
  following: number;
}

// Interface pour le chargement avec progression
interface LoadingState {
  isLoading: boolean;
  progress: number;
  currentStep: string;
  startTime: number | null;
}

// Composant principal
const DashboardContent = () => {
  const [token, setToken] = useState<string>('');
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [userRepos, setUserRepos] = useState<GitHubRepo[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<string>('');
  const [prStats, setPrStats] = useState<PullRequestStats | null>(null);
  const [pullRequests, setPullRequests] = useState<PullRequest[]>([]);
  const [loading, setLoading] = useState<LoadingState>({
    isLoading: false,
    progress: 0,
    currentStep: '',
    startTime: null
  });
  const [error, setError] = useState<string | null>(null);
  const [prStatusFilter, setPrStatusFilter] = useState<'all' | 'open' | 'closed'>('all');

  // Initialiser le chargement
  const startLoading = (step: string) => {
    setLoading({
      isLoading: true,
      progress: 0,
      currentStep: step,
      startTime: Date.now()
    });
  };

  // Mettre à jour la progression
  const updateLoadingProgress = (progress: number, step: string) => {
    setLoading(prev => ({
      ...prev,
      progress: progress,
      currentStep: step
    }));
  };

  // Terminer le chargement
  const finishLoading = () => {
    setLoading({
      isLoading: false,
      progress: 100,
      currentStep: 'Terminé',
      startTime: null
    });
  };

  // Gérer la soumission du token GitHub
  const handleTokenSubmit = async (newToken: string) => {
    setToken(newToken);
    startLoading("Authentification avec GitHub...");
    setError(null);
    
    try {
      // Récupérer les infos de l'utilisateur authentifié
      updateLoadingProgress(20, "Récupération des informations utilisateur...");
      const userData = await GitHubService.getAuthenticatedUser(newToken);
      setUser(userData as GitHubUser);
      
      // Récupérer les repos de l'utilisateur
      updateLoadingProgress(40, "Récupération des dépôts...");
      const repos = await GitHubService.getUserRepos(newToken);
      setUserRepos(repos);
      
      // Sélectionner automatiquement le dernier projet (le plus récent)
      if (repos.length > 0) {
        updateLoadingProgress(60, "Analyse des dépôts...");
        const lastRepo = repos[0]; // GitHub API retourne les repos par ordre chronologique inverse (le plus récent en premier)
        setSelectedRepo(lastRepo.name);
        
        // Charger les données uniquement pour ce projet
        updateLoadingProgress(80, "Chargement des pull requests...");
        const selectedRepoData = [lastRepo];
        await fetchUserData(newToken, userData.login, selectedRepoData);
      } else {
        // S'il n'y a pas de repos, charger les données globales
        updateLoadingProgress(80, "Finalisation...");
        await fetchUserData(newToken, userData.login, repos);
      }
      
      finishLoading();
    } catch (err) {
      console.error("Erreur d'authentification:", err);
      setError("Erreur d'authentification. Veuillez vérifier votre token GitHub.");
      finishLoading();
    }
  };

  // Gérer le changement de projet sélectionné
  const handleRepoChange = async (repoName: string) => {
    setSelectedRepo(repoName);
    startLoading(repoName ? `Chargement du dépôt ${repoName}...` : "Chargement de tous les dépôts...");
    
    try {
      if (repoName === '') {
        // Si aucun projet n'est sélectionné, afficher les données pour tous les repos
        updateLoadingProgress(50, "Récupération des données pour tous les dépôts...");
        await fetchUserData(token, user!.login, userRepos);
      } else {
        // Sinon, filtrer pour n'afficher que les données du repo sélectionné
        const selectedRepoData = userRepos.find(repo => repo.name === repoName);
        if (selectedRepoData) {
          // Fetch data for just this repository
          updateLoadingProgress(50, `Récupération des pull requests pour ${repoName}...`);
          const filteredRepos = [selectedRepoData];
          await fetchUserData(token, user!.login, filteredRepos);
        }
      }
    } catch (err) {
      setError('Erreur lors du chargement des données pour ce projet');
      console.error(err);
    } finally {
      finishLoading();
    }
  };

  // Charger les données de l'utilisateur
  const fetchUserData = async (authToken: string, username: string, repos: GitHubRepo[]) => {
    try {
      // Récupérer les données GitHub spécifiques à l'utilisateur
      let prData;
      let repoFullName;
      
      if (repos.length === 1) {
        // Si un seul dépôt est sélectionné, on filtre les requêtes pour ce dépôt spécifique
        const repo = repos[0];
        repoFullName = `${repo.owner.login}/${repo.name}`;
        
        // Récupérer les pull requests pour le dépôt spécifique
        updateLoadingProgress(60, `Analyse des pull requests pour ${repo.name}...`);
        prData = await GitHubService.getPullRequestStats(authToken, username, repoFullName);
      } else {
        // Si aucun dépôt spécifique n'est sélectionné, on récupère toutes les données
        updateLoadingProgress(60, "Analyse des pull requests pour tous les dépôts...");
        prData = await GitHubService.getPullRequestStats(authToken, username);
      }
      
      setPrStats(prData);
      
      // Récupérer les pull requests détaillées
      updateLoadingProgress(80, "Récupération des détails des pull requests...");
      const prs = await GitHubService.getPullRequests(authToken, username, repoFullName, prStatusFilter);
      setPullRequests(prs);
      
      updateLoadingProgress(100, "Terminé");
    } catch (err) {
      setError('Erreur lors du chargement des données GitHub');
      console.error(err);
    }
  };
  
  // Gérer le changement de filtre de statut des PR
  const handlePrStatusFilterChange = (status: 'all' | 'open' | 'closed') => {
    setPrStatusFilter(status);
    if (user) {
      startLoading(`Filtrage des pull requests (${status})...`);
      // Recharger les données avec le nouveau filtre
      if (selectedRepo === '') {
        fetchUserData(token, user.login, userRepos)
          .finally(() => finishLoading());
      } else {
        const selectedRepoData = userRepos.find(repo => repo.name === selectedRepo);
        if (selectedRepoData) {
          fetchUserData(token, user.login, [selectedRepoData])
            .finally(() => finishLoading());
        }
      }
    }
  };
  
  // Mettre à jour les données quand le filtre de statut change
  useEffect(() => {
    const updateFilteredData = async () => {
      if (user && token) {
        startLoading(`Mise à jour du filtre (${prStatusFilter})...`);
        if (selectedRepo === '') {
          await fetchUserData(token, user.login, userRepos);
        } else {
          const selectedRepoData = userRepos.find(repo => repo.name === selectedRepo);
          if (selectedRepoData) {
            await fetchUserData(token, user.login, [selectedRepoData]);
          }
        }
        finishLoading();
      }
    };

    updateFilteredData();
  }, [prStatusFilter, user, token, selectedRepo, userRepos]);

  // Si l'utilisateur n'est pas connecté, afficher le formulaire d'authentification
  if (!token || !user) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">GitHub Dashboard</h1>
        <GithubAuth onTokenSubmit={handleTokenSubmit} />
        {loading.isLoading && <DashboardContentSkeleton />}
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
  }

  if (loading.isLoading) {
    return <DashboardContentSkeleton />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="bg-red-900/30 border border-red-700 p-6 rounded-lg text-center max-w-md">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-xl font-bold text-red-400 mb-2">Erreur</div>
          <div className="text-red-300">{error}</div>
          <button 
            onClick={() => setToken('')}
            className="mt-4 bg-red-800 hover:bg-red-700 text-white py-2 px-4 rounded-md transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header avec informations utilisateur et sélecteur de projets */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 rounded-xl shadow-lg mb-6 border border-gray-700">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center">
            {user.avatar_url && (
              <div className="relative">
                <img 
                  src={user.avatar_url} 
                  alt={`Avatar de ${user.login}`} 
                  className="w-16 h-16 rounded-full mr-4 border-2 border-blue-500"
                />
                <div className="absolute bottom-0 right-3 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-800"></div>
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold">{user.name || user.login}</h1>
              <p className="text-gray-400 text-sm">{user.bio || 'Développeur GitHub'}</p>
              <div className="flex items-center text-xs mt-1 text-gray-400 space-x-2">
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                  </svg>
                  {user.public_repos} repos
                </span>
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {user.followers} followers
                </span>
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  {user.following} following
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex-grow max-w-md w-full md:w-auto">
            <label htmlFor="repo-select" className="block text-sm font-medium text-gray-400 mb-1">Sélectionner un projet</label>
            <div className="relative">
              <select 
                id="repo-select"
                value={selectedRepo} 
                onChange={(e) => handleRepoChange(e.target.value)}
                className="bg-gray-700 p-2 pl-4 pr-10 rounded-lg text-white w-full border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none appearance-none"
              >
                <option value="">Tous les projets</option>
                {userRepos.map((repo) => (
                  <option key={repo.id} value={repo.name}>{repo.name}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Statistiques des Pull Requests - Colonne latérale */}
        <div className="lg:col-span-4">
          <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden">
            <div className="p-4 bg-gray-750 border-b border-gray-700">
              <h2 className="text-lg font-semibold flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Statistiques
              </h2>
            </div>
            <div className="p-4">
              {prStats ? (
                <div>
                  {/* Card Grid for Stats */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="bg-gray-750 p-3 rounded-lg border border-gray-700">
                      <div className="text-xs text-gray-400">Total</div>
                      <div className="text-2xl font-bold">{prStats.total}</div>
                    </div>
                    <div className="bg-green-900/30 p-3 rounded-lg border border-green-800">
                      <div className="text-xs text-green-400">Ouvertes</div>
                      <div className="text-2xl font-bold text-green-400">{prStats.open}</div>
                    </div>
                    <div className="bg-purple-900/30 p-3 rounded-lg border border-purple-800">
                      <div className="text-xs text-purple-400">Mergées</div>
                      <div className="text-2xl font-bold text-purple-400">{prStats.merged}</div>
                    </div>
                  </div>
                  
                  {/* Detailed Stats Table */}
                  <table className="min-w-full bg-gray-900 text-white rounded-lg overflow-hidden">
                    <thead className="bg-gray-750">
                      <tr>
                        <th className="py-2 px-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Statut</th>
                        <th className="py-2 px-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Nombre</th>
                        <th className="py-2 px-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">%</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      <tr>
                        <td className="py-2 px-3 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-2.5 w-2.5 rounded-full bg-green-500 mr-2"></div>
                            Ouvertes
                          </div>
                        </td>
                        <td className="py-2 px-3 text-right">{prStats.open}</td>
                        <td className="py-2 px-3 text-right">{((prStats.open / prStats.total) * 100).toFixed(1)}%</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-2.5 w-2.5 rounded-full bg-red-500 mr-2"></div>
                            Fermées
                          </div>
                        </td>
                        <td className="py-2 px-3 text-right">{prStats.closed}</td>
                        <td className="py-2 px-3 text-right">{((prStats.closed / prStats.total) * 100).toFixed(1)}%</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-2.5 w-2.5 rounded-full bg-purple-500 mr-2"></div>
                            Mergées
                          </div>
                        </td>
                        <td className="py-2 px-3 text-right">{prStats.merged}</td>
                        <td className="py-2 px-3 text-right">{((prStats.merged / prStats.total) * 100).toFixed(1)}%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="flex justify-center items-center h-48 text-gray-500">
                  <div className="text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto mb-2 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p>Aucune statistique disponible</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Liste des Pull Requests - Partie principale */}
        <div className="lg:col-span-8">
          <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden">
            <div className="p-4 bg-gray-750 border-b border-gray-700 flex justify-between items-center">
              <h2 className="text-lg font-semibold flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
                Pull Requests
              </h2>
              
              <div className="flex space-x-1 rounded-lg bg-gray-700 p-1">
                <button 
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${prStatusFilter === 'all' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white hover:bg-gray-600'}`}
                  onClick={() => handlePrStatusFilterChange('all')}
                >
                  Toutes
                </button>
                <button 
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${prStatusFilter === 'open' ? 'bg-green-600 text-white' : 'text-gray-300 hover:text-white hover:bg-gray-600'}`}
                  onClick={() => handlePrStatusFilterChange('open')}
                >
                  Ouvertes
                </button>
                <button 
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${prStatusFilter === 'closed' ? 'bg-red-600 text-white' : 'text-gray-300 hover:text-white hover:bg-gray-600'}`}
                  onClick={() => handlePrStatusFilterChange('closed')}
                >
                  Fermées
                </button>
              </div>
            </div>
            
            <div className="p-0">
              {pullRequests.length > 0 ? (
                <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
                  <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-750 sticky top-0">
                      <tr>
                        <th scope="col" className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Pull Request
                        </th>
                        <th scope="col" className="py-3 px-4 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                          État
                        </th>
                        <th scope="col" className="py-3 px-4 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Date
                        </th>
                        <th scope="col" className="py-3 px-4 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-gray-800 divide-y divide-gray-700">
                      {pullRequests.map(pr => (
                        <tr key={pr.id} className="hover:bg-gray-750 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              <div className="flex-shrink-0">
                                {pr.state === 'open' ? (
                                  <div className="h-8 w-8 rounded-full bg-green-900/50 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                      <path fillRule="evenodd" d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                  </div>
                                ) : pr.merged ? (
                                  <div className="h-8 w-8 rounded-full bg-purple-900/50 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
                                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414L11.414 15l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                  </div>
                                ) : (
                                  <div className="h-8 w-8 rounded-full bg-red-900/50 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                  </div>
                                )}
                              </div>
                              <div className="ml-3">
                                <p className="text-sm font-medium">{pr.title}</p>
                                <p className="text-xs text-gray-400">#{pr.number} par {pr.user?.login}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-center">
                            {pr.state === 'open' ? (
                              <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-900 text-green-300">Ouverte</span>
                            ) : pr.merged ? (
                              <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-900 text-purple-300">Mergée</span>
                            ) : (
                              <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-900 text-red-300">Fermée</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-center whitespace-nowrap text-sm">
                            <div className="text-gray-300">{new Date(pr.created_at).toLocaleDateString('fr-FR')}</div>
                            <div className="text-xs text-gray-500">{new Date(pr.created_at).toLocaleTimeString('fr-FR')}</div>
                          </td>
                          <td className="py-3 px-4 text-center text-sm font-medium">
                            <a 
                              href={pr.html_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                            >
                              <svg className="mr-1.5 h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                                <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                              </svg>
                              Voir
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="flex justify-center items-center py-20 text-gray-500">
                  <div className="text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-3 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <p className="text-lg mb-1">Aucune pull request trouvée</p>
                    <p className="text-sm text-gray-500">Essayez de changer de filtre ou de sélectionner un autre projet</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default DashboardContent;