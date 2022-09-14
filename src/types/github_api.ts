export interface GithubAPIRepoResponse {
  stargazers_count: number;
  forks_count: number;
  description: string;
  watchers_count: number;
  topics: string[];
  open_issues_count: number;
}
