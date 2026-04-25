// Well-known GitHub language colors
const LANG_COLORS: Record<string, string> = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  Python: "#3572A5",
  Java: "#b07219",
  "C#": "#178600",
  "C++": "#f34b7d",
  C: "#555555",
  Go: "#00ADD8",
  Rust: "#dea584",
  Ruby: "#701516",
  PHP: "#4F5D95",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
  Dart: "#00B4AB",
  HTML: "#e34c26",
  CSS: "#563d7c",
  SCSS: "#c6538c",
  Shell: "#89e051",
  Lua: "#000080",
  Vue: "#41b883",
  Svelte: "#ff3e00",
  Jupyter: "#DA5B0B",
  R: "#198CE7",
  Scala: "#c22d40",
  Elixir: "#6e4a7e",
  Haskell: "#5e5086",
  Perl: "#0298c3",
  Objective_C: "#438eff",
};

export function getLanguageColor(lang: string): string {
  return LANG_COLORS[lang] || "#8b8b8b";
}

export interface GitHubUser {
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  location: string | null;
  email: string | null;
  blog: string | null;
  company: string | null;
  twitter_username: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
}

export interface GitHubRepo {
  name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  fork: boolean;
  html_url: string;
  updated_at: string;
  size: number;
}

export interface GitHubEvent {
  type: string;
  created_at: string;
  payload?: {
    commits?: { message: string }[];
    action?: string;
    size?: number;
  };
}

export interface ProfileData {
  user: GitHubUser;
  repos: GitHubRepo[];
  events: GitHubEvent[];
  languages: { name: string; percentage: number; color: string }[];
  totalStars: number;
  totalForks: number;
  totalCommitsThisYear: number;
  totalPRs: number;
  totalIssues: number;
  topRepos: GitHubRepo[];
  commitsByHour: number[];
}

async function ghFetch<T>(url: string): Promise<T> {
  const res = await fetch(url, {
    headers: { Accept: "application/vnd.github.v3+json" },
    next: { revalidate: 300 },
  });
  if (!res.ok) {
    if (res.status === 404) throw new Error("User not found");
    if (res.status === 403) throw new Error("API rate limit exceeded. Try again in a minute.");
    throw new Error(`GitHub API error: ${res.status}`);
  }
  return res.json();
}

export async function fetchGitHubProfile(username: string): Promise<ProfileData> {
  // Fetch user + repos + events in parallel
  const [user, repos, events] = await Promise.all([
    ghFetch<GitHubUser>(`https://api.github.com/users/${username}`),
    ghFetch<GitHubRepo[]>(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`),
    ghFetch<GitHubEvent[]>(`https://api.github.com/users/${username}/events?per_page=100`),
  ]);

  // Calculate language distribution from repos (exclude forks)
  const langBytes: Record<string, number> = {};
  const ownRepos = repos.filter((r) => !r.fork);
  for (const repo of ownRepos) {
    if (repo.language) {
      langBytes[repo.language] = (langBytes[repo.language] || 0) + repo.size;
    }
  }
  const totalBytes = Object.values(langBytes).reduce((a, b) => a + b, 0) || 1;
  const languages = Object.entries(langBytes)
    .map(([name, bytes]) => ({
      name,
      percentage: Math.round((bytes / totalBytes) * 100),
      color: getLanguageColor(name),
    }))
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 8);

  // Normalize percentages to sum to 100
  const pctSum = languages.reduce((s, l) => s + l.percentage, 0);
  if (pctSum > 0 && pctSum !== 100 && languages.length > 0) {
    languages[0].percentage += 100 - pctSum;
  }

  // Sum stars & forks
  const totalStars = repos.reduce((s, r) => s + r.stargazers_count, 0);
  const totalForks = repos.reduce((s, r) => s + r.forks_count, 0);

  // Count PRs, issues, and push events from recent events
  let totalPRs = 0;
  let totalIssues = 0;
  let totalCommitsThisYear = 0;
  const commitsByHour = new Array(24).fill(0);

  for (const ev of events) {
    if (ev.type === "PullRequestEvent") totalPRs++;
    if (ev.type === "IssuesEvent") totalIssues++;
    if (ev.type === "PushEvent") {
      const count = ev.payload?.size || ev.payload?.commits?.length || 1;
      totalCommitsThisYear += count;
      const hour = new Date(ev.created_at).getHours();
      commitsByHour[hour] += count;
    }
  }

  // Top repos by stars (non-fork)
  const topRepos = [...ownRepos]
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 6);

  return {
    user,
    repos,
    events,
    languages,
    totalStars,
    totalForks,
    totalCommitsThisYear,
    totalPRs,
    totalIssues,
    topRepos,
    commitsByHour,
  };
}
