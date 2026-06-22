export async function githubFetch(path: string): Promise<any> {
  const url = `https://api.github.com${path}`;
  const response = await fetch(url, {
    headers: {
      "User-Agent": "RepoVitals-App",
      "Accept": "application/vnd.github.v3+json",
    },
  });

  if (response.status === 404) {
    throw new Error(`GitHub resource not found at ${path}`);
  }

  if (!response.ok) {
    const errorMsg = await response.text();
    if (response.status === 403 && response.headers.get("x-ratelimit-remaining") === "0") {
      throw new Error("GitHub API rate limit reached. Try again in a few minutes.");
    }
    throw new Error(`GitHub API error: ${response.status} - ${errorMsg}`);
  }

  return response.json();
}

export async function fetchRepoMeta(owner: string, repo: string) {
  return githubFetch(`/repos/${owner}/${repo}`);
}

export async function fetchLanguages(owner: string, repo: string) {
  return githubFetch(`/repos/${owner}/${repo}/languages`);
}

export async function fetchPackageJson(owner: string, repo: string) {
  return githubFetch(`/repos/${owner}/${repo}/contents/package.json`);
}

export async function fetchRootContents(owner: string, repo: string) {
  return githubFetch(`/repos/${owner}/${repo}/contents`);
}

export async function fetchContributors(owner: string, repo: string) {
  try {
    return await githubFetch(`/repos/${owner}/${repo}/contributors?per_page=5`);
  } catch {
    return [];
  }
}

export async function fetchLatestRelease(owner: string, repo: string) {
  try {
    const releases = await githubFetch(`/repos/${owner}/${repo}/releases?per_page=1`);
    return releases[0] ?? null;
  } catch {
    return null;
  }
}
