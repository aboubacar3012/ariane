import { Octokit } from 'octokit';

// Initialiser Octokit avec le token d'authentification
export const initOctokit = (token: string) => {
  return new Octokit({
    auth: token,
  });
};

// Types pour les données GitHub
export interface PullRequestStats {
  open: number;
  closed: number;
  merged: number;
  total: number;
}

export interface PullRequest {
  id: number;
  number: number;
  title: string;
  html_url: string;
  state: 'open' | 'closed';
  merged: boolean;
  created_at: string;
  user: {
    login: string;
    avatar_url: string;
  };
}

export interface IssueStats {
  open: number;
  closed: number;
  total: number;
}

export interface UserContribution {
  user: string;
  contributions: number;
  timeline: {
    date: string;
    count: number;
  }[];
}

export interface RepoActivity {
  name: string;
  commits: number;
  pullRequests: number;
  issues: number;
  score: number;
}

// Service GitHub
export const GitHubService = {
  // Récupérer l'utilisateur authentifié
  async getAuthenticatedUser(token: string) {
    const client = initOctokit(token);
    
    try {
      const { data } = await client.request('GET /user');
      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération des informations utilisateur:', error);
      throw error;
    }
  },

  // Récupérer les repos de l'utilisateur authentifié
  async getUserRepos(token: string) {
    const client = initOctokit(token);
    
    try {
      const { data } = await client.request('GET /user/repos', {
        sort: 'updated',
        per_page: 100,
      });
      
      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération des repos utilisateur:', error);
      throw error;
    }
  },

  // Récupérer les statistiques des pull requests
  async getPullRequestStats(token: string, username: string, repoFullName?: string): Promise<PullRequestStats> {
    const client = initOctokit(token);
    // Initialiser les compteurs
    const stats: PullRequestStats = {
      open: 0,
      closed: 0,
      merged: 0,
      total: 0,
    };

    try {
      // Construire la requête avec ou sans filtre de repo
      const repoFilter = repoFullName ? ` repo:${repoFullName}` : '';

      // Récupérer les pull requests ouvertes
      const openPRs = await client.request('GET /search/issues', {
        q: `is:pr is:open author:${username}${repoFilter}`,
        per_page: 1,
      });
      stats.open = openPRs.data.total_count;

      // Récupérer les pull requests fermées non mergées
      const closedPRs = await client.request('GET /search/issues', {
        q: `is:pr is:closed is:unmerged author:${username}${repoFilter}`,
        per_page: 1,
      });
      stats.closed = closedPRs.data.total_count;

      // Récupérer les pull requests mergées
      const mergedPRs = await client.request('GET /search/issues', {
        q: `is:pr is:merged author:${username}${repoFilter}`,
        per_page: 1,
      });
      stats.merged = mergedPRs.data.total_count;

      // Calculer le total
      stats.total = stats.open + stats.closed + stats.merged;

      return stats;
    } catch (error) {
      console.error('Erreur lors de la récupération des PR stats:', error);
      return stats;
    }
  },

  // Récupérer les statistiques des commits pour les repos de l'utilisateur
//   async getCommitStats(token: string, username: string, repos: any[]): Promise<CommitStats> {
//     const client = initOctokit(token);
//     const stats: CommitStats = {
//       byRepo: {},
//       byUser: {},
//     };

//     try {
//       for (const repo of repos) {
//         // Récupérer les commits par repo en filtrant par auteur
//         const commits = await client.request('GET /repos/{owner}/{repo}/commits', {
//           owner: repo.owner.login,
//           repo: repo.name,
//           author: username, // Filtrer par auteur
//           per_page: 100,
//         });

//         // Compter les commits par repo
//         stats.byRepo[repo.name] = commits.data.length;

//         // Compter les commits par utilisateur (devrait être principalement l'utilisateur spécifié)
//         commits.data.forEach((commit) => {
//           const author = commit.author?.login || 'unknown';
//           stats.byUser[author] = (stats.byUser[author] || 0) + 1;
//         });
//       }

//       return stats;
//     } catch (error) {
//       console.error('Erreur lors de la récupération des commit stats:', error);
//       return stats;
//     }
//   },

  // Récupérer les statistiques des issues
//   async getIssueStats(token: string, username: string, repoFullName?: string): Promise<IssueStats> {
//     const client = initOctokit(token);
//     const stats: IssueStats = {
//       open: 0,
//       closed: 0,
//       total: 0,
//     };

//     try {
//       // Construire la requête avec ou sans filtre de repo
//       const repoFilter = repoFullName ? ` repo:${repoFullName}` : '';

//       // Récupérer les issues ouvertes
//       const openIssues = await client.request('GET /search/issues', {
//         q: `is:issue is:open author:${username}${repoFilter}`,
//         per_page: 1,
//       });
//       stats.open = openIssues.data.total_count;

//       // Récupérer les issues fermées
//       const closedIssues = await client.request('GET /search/issues', {
//         q: `is:issue is:closed author:${username}${repoFilter}`,
//         per_page: 1,
//       });
//       stats.closed = closedIssues.data.total_count;

//       // Calculer le total
//       stats.total = stats.open + stats.closed;

//       return stats;
//     } catch (error) {
//       console.error('Erreur lors de la récupération des issue stats:', error);
//       return stats;
//     }
//   },

  // Récupérer les contributions par utilisateur
//   async getUserContributions(token: string, userRepos: any[], username?: string): Promise<UserContribution[]> {
//     const client = initOctokit(token);
//     const contributions: UserContribution[] = [];
//     const userContributions: Record<string, { total: number, timeline: Record<string, number> }> = {};

//     try {
//       for (const repo of userRepos) {
//         try {
//           // Récupérer les commits des 30 derniers jours
//           const thirtyDaysAgo = new Date();
//           thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          
//           // Préparer les paramètres de la requête
//           const requestParams: any = {
//             owner: repo.owner.login,
//             repo: repo.name,
//             since: thirtyDaysAgo.toISOString(),
//             per_page: 100,
//           };
          
//           // Ajouter le filtre par auteur si un nom d'utilisateur est spécifié
//           if (username) {
//             requestParams.author = username;
//           }
          
//           const { data: commits } = await client.request('GET /repos/{owner}/{repo}/commits', requestParams);
          
//           commits.forEach(commit => {
//             if (!commit.author?.login) return;
            
//             const username = commit.author.login;
//             const date = commit.commit.committer?.date?.split('T')[0] || 'unknown-date';
            
//             if (!userContributions[username]) {
//               userContributions[username] = { total: 0, timeline: {} };
//             }
            
//             userContributions[username].total += 1;
//             userContributions[username].timeline[date] = (userContributions[username].timeline[date] || 0) + 1;
//           });
//         } catch (error) {
//           console.error(`Erreur lors de la récupération des commits pour ${repo.name}:`, error);
//         }
//       }
      
//       // Convertir en format attendu
//       Object.entries(userContributions).forEach(([user, data]) => {
//         const timeline = Object.entries(data.timeline).map(([date, count]) => ({
//           date,
//           count,
//         })).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        
//         contributions.push({
//           user,
//           contributions: data.total,
//           timeline,
//         });
//       });

//       return contributions;
//     } catch (error) {
//       console.error('Erreur lors de la récupération des contributions:', error);
//       return contributions;
//     }
//   },

  // Récupérer les repos les plus actifs de l'utilisateur
//   async getActiveRepos(token: string): Promise<RepoActivity[]> {
//     const client = initOctokit(token);
//     const repoActivities: RepoActivity[] = [];

//     try {
//       // Récupérer les repos de l'utilisateur
//       const { data: repos } = await client.request('GET /user/repos', {
//         sort: 'updated',
//         per_page: 10,
//       });

//       for (const repo of repos) {
//         try {
//           // Pour chaque repo, récupérer les stats
//           const { data: commits } = await client.request('GET /repos/{owner}/{repo}/commits', {
//             owner: repo.owner.login,
//             repo: repo.name,
//             per_page: 1,
//           });
//           const commitCount = commits.length > 0 ? parseInt(commits[0].commit?.comment_count || "0", 10) : 0;

//           const { data: pullRequests } = await client.request('GET /repos/{owner}/{repo}/pulls', {
//             owner: repo.owner.login,
//             repo: repo.name,
//             state: 'all',
//             per_page: 1,
//           });

//           const { data: issues } = await client.request('GET /repos/{owner}/{repo}/issues', {
//             owner: repo.owner.login,
//             repo: repo.name,
//             state: 'all',
//             per_page: 1,
//           });

//           // Calculer un score d'activité 
//           const score = repo.stargazers_count + repo.forks_count + commitCount + pullRequests.length + issues.length;

//           repoActivities.push({
//             name: repo.name,
//             commits: commitCount,
//             pullRequests: pullRequests.length,
//             issues: issues.length,
//             score,
//           });
//         } catch (error) {
//           console.error(`Erreur lors de la récupération des stats pour ${repo.name}:`, error);
//         }
//       }

//       // Trier par score d'activité
//       repoActivities.sort((a, b) => b.score - a.score);

//       return repoActivities;
//     } catch (error) {
//       console.error('Erreur lors de la récupération des repos actifs:', error);
//       return repoActivities;
//     }
//   },

  // Récupérer les pull requests détaillées
  async getPullRequests(token: string, username: string, repoFullName?: string, state: 'open' | 'closed' | 'all' = 'all'): Promise<PullRequest[]> {
    const client = initOctokit(token);
    const pullRequests: PullRequest[] = [];

    try {
      // Construire la requête avec ou sans filtre de repo
      const repoFilter = repoFullName ? ` repo:${repoFullName}` : '';
      
      // Construire la requête selon l'état demandé
      let stateQuery = '';
      if (state !== 'all') {
        stateQuery = ` is:${state}`;
      }
      
      // Récupérer les pull requests
      const { data } = await client.request('GET /search/issues', {
        q: `is:pr author:${username}${repoFilter}${stateQuery}`,
        per_page: 100,
        sort: 'updated',
        order: 'desc',
      });
      
      // Traiter les résultats
      for (const item of data.items) {
        // Vérifier si la PR est mergée (seules les PRs fermées peuvent être mergées)
        let merged = false;
        if (item.state === 'closed' && item.pull_request) {
          try {
            // Extraire les informations du repo à partir de l'URL
            if (!item.pull_request?.url) {
              continue; // Skip this item if pull_request URL is not available
            }
            
            const urlParts = item.pull_request.url.split('/');
            const owner = urlParts[urlParts.indexOf('repos') + 1];
            const repo = urlParts[urlParts.indexOf('repos') + 2];
            const prNumber = parseInt(urlParts[urlParts.indexOf('pulls') + 1], 10);
            
            // Vérifier si la PR est mergée
            const { data: prDetails } = await client.request('GET /repos/{owner}/{repo}/pulls/{pull_number}', {
              owner,
              repo,
              pull_number: prNumber,
            });
            
            merged = prDetails.merged || false;
          } catch (error) {
            console.error('Erreur lors de la vérification du statut de merge:', error);
          }
        }
        
        pullRequests.push({
          id: item.id,
          number: item.number,
          title: item.title,
          html_url: item.html_url,
          state: item.state as 'open' | 'closed',
          merged,
          created_at: item.created_at,
          user: {
            login: item?.user?.login || '',
            avatar_url: item?.user?.avatar_url || '',
          }
        });
      }
      
      return pullRequests;
    } catch (error) {
      console.error('Erreur lors de la récupération des pull requests:', error);
      return pullRequests;
    }
  },
};

export default GitHubService;