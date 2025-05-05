'use client';

import { useQuery } from '@tanstack/react-query';
import GitHubService from '@/src/services/github';

interface UseGitHubQueriesParams {
  token: string;
  username?: string;
  repoName?: string;
}

export const useGitHubQueries = ({ token }: UseGitHubQueriesParams) => {
  // Requête pour l'utilisateur authentifié
  const useAuthenticatedUser = () => {
    return useQuery({
      queryKey: ['authenticatedUser', token],
      queryFn: () => GitHubService.getAuthenticatedUser(token),
      enabled: !!token,
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  };

  // Requête pour les repos de l'utilisateur
  const useUserRepos = () => {
    return useQuery({
      queryKey: ['userRepos', token],
      queryFn: () => GitHubService.getUserRepos(token),
      enabled: !!token,
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  };

  // Requête pour les stats des PRs
  const usePullRequestStats = (userLogin?: string, repoFullName?: string) => {
    return useQuery({
      queryKey: ['prStats', token, userLogin, repoFullName],
      queryFn: () => GitHubService.getPullRequestStats(token, userLogin || '', repoFullName),
      enabled: !!token && !!userLogin,
      staleTime: 2 * 60 * 1000, // 2 minutes
    });
  };

  // Requête pour les PRs détaillées
  const usePullRequests = (userLogin?: string, repoFullName?: string, state: 'open' | 'closed' | 'all' = 'all') => {
    return useQuery({
      queryKey: ['pullRequests', token, userLogin, repoFullName, state],
      queryFn: () => GitHubService.getPullRequests(token, userLogin || '', repoFullName, state),
      enabled: !!token && !!userLogin,
      staleTime: 2 * 60 * 1000, // 2 minutes
    });
  };

  return {
    useAuthenticatedUser,
    useUserRepos,
    usePullRequestStats,
    usePullRequests,
  };
};

export default useGitHubQueries;