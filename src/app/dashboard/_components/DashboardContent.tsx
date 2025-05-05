"use client";
import { useState, useEffect } from "react";
import { PullRequestStats, PullRequest } from "@/src/services/github";
import DashboardContentSkeleton from "./DashboardContentSkeleton";
import useGithubToken from "@/src/hooks/useGithubToken";
import useGitHubQueries from "@/src/hooks/useGitHubQueries";
import {
  Plus,
  Check,
  X,
  ExternalLink,
  Folder,
  Users,
  User,
  FileText,
  BarChart2,
  GitPullRequest,
} from "lucide-react";

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
  name?: string | null;
  bio?: string | null;
  avatar_url?: string;
  public_repos: number;
  followers: number;
  following: number;
}

// Composant pour afficher les informations utilisateur
const UserProfile = ({ user }: { user: GitHubUser }) => {
  return (
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
        <p className="text-gray-400 text-sm">
          {user.bio || "Développeur GitHub"}
        </p>
        <div className="flex items-center text-xs mt-1 text-gray-400 space-x-2">
          <span className="flex items-center">
            <Folder className="h-4 w-4 mr-1" />
            {user.public_repos} repos
          </span>
          <span className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            {user.followers} followers
          </span>
          <span className="flex items-center">
            <User className="h-4 w-4 mr-1" />
            {user.following} following
          </span>
        </div>
      </div>
    </div>
  );
};

// Composant pour le sélecteur de projets
const RepoSelector = ({
  repos,
  selectedRepo,
  onRepoChange,
}: {
  repos: GitHubRepo[];
  selectedRepo: string;
  onRepoChange: (repo: string) => void;
}) => {
  return (
    <div className="flex-grow max-w-md w-full md:w-auto">
      <label
        htmlFor="repo-select"
        className="block text-sm font-medium text-gray-400 mb-1"
      >
        Sélectionner un projet
      </label>
      <div className="relative">
        <select
          id="repo-select"
          value={selectedRepo}
          onChange={(e) => onRepoChange(e.target.value)}
          className="bg-gray-700 p-2 pl-4 pr-10 rounded-lg text-white w-full border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none appearance-none"
        >
          <option value="">Tous les projets</option>
          {repos.map((repo) => (
            <option key={repo.id} value={repo.name}>
              {repo.name}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
          <FileText className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
};

// Composant pour les statistiques
const PRStats = ({ stats }: { stats: PullRequestStats | null }) => {
  if (!stats) {
    return (
      <div className="flex justify-center items-center h-48 text-gray-500">
        <div className="text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 mx-auto mb-2 text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p>Aucune statistique disponible</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Card Grid for Stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-gray-750 p-3 rounded-lg border border-gray-700">
          <div className="text-xs text-gray-400">Total</div>
          <div className="text-2xl font-bold">{stats.total}</div>
        </div>
        <div className="bg-green-900/30 p-3 rounded-lg border border-green-800">
          <div className="text-xs text-green-400">Ouvertes</div>
          <div className="text-2xl font-bold text-green-400">{stats.open}</div>
        </div>
        <div className="bg-purple-900/30 p-3 rounded-lg border border-purple-800">
          <div className="text-xs text-purple-400">Mergées</div>
          <div className="text-2xl font-bold text-purple-400">
            {stats.merged}
          </div>
        </div>
      </div>

      {/* Detailed Stats Table */}
      <table className="min-w-full bg-gray-900 text-white rounded-lg overflow-hidden">
        <thead className="bg-gray-750">
          <tr>
            <th className="py-2 px-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Statut
            </th>
            <th className="py-2 px-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
              Nombre
            </th>
            <th className="py-2 px-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
              %
            </th>
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
            <td className="py-2 px-3 text-right">{stats.open}</td>
            <td className="py-2 px-3 text-right">
              {((stats.open / stats.total) * 100).toFixed(1)}%
            </td>
          </tr>
          <tr>
            <td className="py-2 px-3 whitespace-nowrap">
              <div className="flex items-center">
                <div className="h-2.5 w-2.5 rounded-full bg-red-500 mr-2"></div>
                Fermées
              </div>
            </td>
            <td className="py-2 px-3 text-right">{stats.closed}</td>
            <td className="py-2 px-3 text-right">
              {((stats.closed / stats.total) * 100).toFixed(1)}%
            </td>
          </tr>
          <tr>
            <td className="py-2 px-3 whitespace-nowrap">
              <div className="flex items-center">
                <div className="h-2.5 w-2.5 rounded-full bg-purple-500 mr-2"></div>
                Mergées
              </div>
            </td>
            <td className="py-2 px-3 text-right">{stats.merged}</td>
            <td className="py-2 px-3 text-right">
              {((stats.merged / stats.total) * 100).toFixed(1)}%
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

// Composant pour la liste des PR
const PRList = ({
  pullRequests,
  filter,
  onFilterChange,
}: {
  pullRequests: PullRequest[];
  filter: "all" | "open" | "closed";
  onFilterChange: (filter: "all" | "open" | "closed") => void;
}) => {
  return (
    <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden">
      <div className="p-4 bg-gray-750 border-b border-gray-700 flex justify-between items-center">
        <h2 className="text-lg font-semibold flex items-center">
          <GitPullRequest className="h-5 w-5 mr-2 text-blue-400" />
          Pull Requests
        </h2>

        <div className="flex space-x-1 rounded-lg bg-gray-700 p-1">
          <button
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              filter === "all"
                ? "bg-blue-600 text-white"
                : "text-gray-300 hover:text-white hover:bg-gray-600"
            }`}
            onClick={() => onFilterChange("all")}
          >
            Toutes
          </button>
          <button
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              filter === "open"
                ? "bg-green-600 text-white"
                : "text-gray-300 hover:text-white hover:bg-gray-600"
            }`}
            onClick={() => onFilterChange("open")}
          >
            Ouvertes
          </button>
          <button
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              filter === "closed"
                ? "bg-red-600 text-white"
                : "text-gray-300 hover:text-white hover:bg-gray-600"
            }`}
            onClick={() => onFilterChange("closed")}
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
                  <th
                    scope="col"
                    className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                  >
                    Pull Request
                  </th>
                  <th
                    scope="col"
                    className="py-3 px-4 text-center text-xs font-medium text-gray-400 uppercase tracking-wider"
                  >
                    État
                  </th>
                  <th
                    scope="col"
                    className="py-3 px-4 text-center text-xs font-medium text-gray-400 uppercase tracking-wider"
                  >
                    Date
                  </th>
                  <th
                    scope="col"
                    className="py-3 px-4 text-center text-xs font-medium text-gray-400 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {pullRequests.map((pr) => (
                  <tr
                    key={pr.id}
                    className="hover:bg-gray-750 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          {pr.state === "open" ? (
                            <div className="h-8 w-8 rounded-full bg-green-900/50 flex items-center justify-center">
                              <Plus className="h-4 w-4 text-green-400" />
                            </div>
                          ) : pr.merged ? (
                            <div className="h-8 w-8 rounded-full bg-purple-900/50 flex items-center justify-center">
                              <Check className="h-4 w-4 text-purple-400" />
                            </div>
                          ) : (
                            <div className="h-8 w-8 rounded-full bg-red-900/50 flex items-center justify-center">
                              <X className="h-4 w-4 text-red-400" />
                            </div>
                          )}
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium">{pr.title}</p>
                          <p className="text-xs text-gray-400">
                            #{pr.number} par {pr.user?.login}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {pr.state === "open" ? (
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-900 text-green-300">
                          Ouverte
                        </span>
                      ) : pr.merged ? (
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-900 text-purple-300">
                          Mergée
                        </span>
                      ) : (
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-900 text-red-300">
                          Fermée
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap text-sm">
                      <div className="text-gray-300">
                        {new Date(pr.created_at).toLocaleDateString("fr-FR")}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(pr.created_at).toLocaleTimeString("fr-FR")}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center text-sm font-medium">
                      <a
                        href={pr.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                      >
                        <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 mx-auto mb-3 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <p className="text-lg mb-1">Aucune pull request trouvée</p>
              <p className="text-sm text-gray-500">
                Essayez de changer de filtre ou de sélectionner un autre projet
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Composant principal
const DashboardContent = () => {
  const { token, setToken } = useGithubToken();
  const [selectedRepo, setSelectedRepo] = useState<string>("");
  const [prStatusFilter, setPrStatusFilter] = useState<
    "all" | "open" | "closed"
  >("all");
  const [error, setError] = useState<string | null>(null);

  // Utiliser les hooks TanStack Query pour les requêtes GitHub
  const githubQueries = useGitHubQueries({ token });

  // Requête pour l'utilisateur
  const {
    data: user,
    isLoading: userLoading,
    error: userError,
  } = githubQueries.useAuthenticatedUser();

  // Requête pour les repos
  const {
    data: userRepos,
    isLoading: reposLoading,
    error: reposError,
  } = githubQueries.useUserRepos();

  // Construire le nom complet du repo si un repo est sélectionné
  const repoFullName =
    userRepos && selectedRepo
      ? `${
          userRepos.find((r) => r.name === selectedRepo)?.owner?.login
        }/${selectedRepo}`
      : undefined;

  // Requête pour les stats des PRs
  const {
    data: prStats,
    isLoading: statsLoading,
    error: statsError,
  } = githubQueries.usePullRequestStats(user?.login, repoFullName);

  // Requête pour les PRs détaillées
  const {
    data: pullRequests = [],
    isLoading: prsLoading,
    error: prsError,
  } = githubQueries.usePullRequests(user?.login, repoFullName, prStatusFilter);

  // État de chargement global
  const isLoading = userLoading || reposLoading || statsLoading || prsLoading;

  // Gérer les erreurs
  useEffect(() => {
    const allErrors = [userError, reposError, statsError, prsError].filter(
      Boolean
    );
    if (allErrors.length > 0) {
      setError("Erreur lors du chargement des données. Veuillez réessayer.");
      console.error("Erreurs détectées:", allErrors);
    } else {
      setError(null);
    }
  }, [userError, reposError, statsError, prsError]);

  // Initialiser le repo sélectionné lorsque les repos sont chargés
  useEffect(() => {
    if (userRepos && userRepos.length > 0 && !selectedRepo) {
      // Sélectionner automatiquement le premier repo (le plus récent)
      setSelectedRepo(userRepos[0].name);
    }
  }, [userRepos, selectedRepo]);

  // Gérer le changement de projet sélectionné
  const handleRepoChange = (repoName: string) => {
    setSelectedRepo(repoName);
  };

  // Gérer le changement de filtre de statut des PR
  const handlePrStatusFilterChange = (status: "all" | "open" | "closed") => {
    setPrStatusFilter(status);
  };

  // Si l'utilisateur n'est pas connecté, afficher le formulaire d'authentification
  if (!token) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
          GitHub Dashboard
        </h1>
        {isLoading && <DashboardContentSkeleton />}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="bg-red-900/30 border border-red-700 p-6 rounded-lg text-center max-w-md">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-red-500 mx-auto mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div className="text-xl font-bold text-red-400 mb-2">Erreur</div>
          <div className="text-red-300">{error}</div>
          <button
            onClick={() => setToken("")}
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
          {userLoading ? (
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gray-700 rounded-full animate-pulse"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-700 rounded w-24 animate-pulse"></div>
                <div className="h-3 bg-gray-700 rounded w-32 animate-pulse"></div>
              </div>
            </div>
          ) : user ? (
            <UserProfile user={user} />
          ) : null}

          {reposLoading ? (
            <div className="flex-grow max-w-md w-full md:w-auto">
              <div className="h-4 bg-gray-700 rounded w-32 mb-2 animate-pulse"></div>
              <div className="h-10 bg-gray-700 rounded w-full animate-pulse"></div>
            </div>
          ) : userRepos && userRepos.length > 0 ? (
            <RepoSelector
              repos={userRepos}
              selectedRepo={selectedRepo}
              onRepoChange={handleRepoChange}
            />
          ) : null}
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Statistiques des Pull Requests - Colonne latérale */}
        <div className="lg:col-span-4">
          <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden">
            <div className="p-4 bg-gray-750 border-b border-gray-700">
              <h2 className="text-lg font-semibold flex items-center">
                <BarChart2 className="h-5 w-5 mr-2 text-blue-400" />
                Statistiques
              </h2>
            </div>
            <div className="p-4">
              {statsLoading ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="bg-gray-750 p-3 rounded-lg border border-gray-700"
                      >
                        <div className="h-3 bg-gray-700 rounded w-12 mb-2 animate-pulse"></div>
                        <div className="h-6 bg-gray-700 rounded w-8 animate-pulse"></div>
                      </div>
                    ))}
                  </div>
                  <div className="h-40 bg-gray-700 rounded animate-pulse"></div>
                </div>
              ) : (
                <PRStats stats={prStats || null} />
              )}
            </div>
          </div>
        </div>

        {/* Liste des Pull Requests - Partie principale */}
        <div className="lg:col-span-8">
          {prsLoading ? (
            <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden">
              <div className="p-4 bg-gray-750 border-b border-gray-700 flex justify-between items-center">
                <h2 className="text-lg font-semibold">Pull Requests</h2>
                <div className="flex space-x-1 rounded-lg bg-gray-700 p-1">
                  {["Toutes", "Ouvertes", "Fermées"].map((label, i) => (
                    <div
                      key={i}
                      className="h-8 bg-gray-600 rounded-md w-16 animate-pulse"
                    ></div>
                  ))}
                </div>
              </div>
              <div className="p-4">
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-16 bg-gray-700 rounded animate-pulse"
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <PRList
              pullRequests={pullRequests}
              filter={prStatusFilter}
              onFilterChange={handlePrStatusFilterChange}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;
