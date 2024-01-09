"use client";

// pages/repositories.tsx
import { Octokit } from "@octokit/rest";
import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { set } from "zod";

interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  commitCount?: number;
}

const RepositoriesPage = () => {
  const { data: session, status } = useSession();
  const [repositories, setRepositories] = useState<GitHubRepository[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [commitCount2, setCommitCount2] = useState(0);
  const totalRef = useRef(0);

  useEffect(() => {
    const fetchRepositories = async () => {
      if (session && session.user && session.user.accessToken) {
        console.log("Fetching repositories...");
        setIsLoading(true);
        setError(null);
        if (!session.user.name) {
          return;
        }
        try {
          const octokit = new Octokit({ auth: session.user.accessToken });
          const authedUser = await octokit.rest.users.getAuthenticated();
          const reposResponse =
            await octokit.rest.repos.listForAuthenticatedUser();
          let totalCommits = 0;
          setRepositories(reposResponse.data as GitHubRepository[]);
          const repos = reposResponse.data as GitHubRepository[];
          for (const repo of repos) {
            try {
              const commitCountResponse =
                await octokit.rest.repos.getCommitActivityStats({
                  owner: authedUser.data.login,
                  repo: repo.name,
                });
              repo.commitCount = commitCountResponse.data.reduce(
                (sum, week) => sum + week.total,
                0,
              );
              totalCommits += repo.commitCount;
            } catch (commitError) {
              console.error(
                `Error fetching commits for repo ${repo.name}:`,
                commitError,
              );
            }
          }
          setCommitCount2(totalCommits);
        } catch (err) {
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchRepositories();
    if (session?.user?.accessToken) {
      fetchRepositories();
    } else {
      console.log("Access token not available, cannot fetch repositories.");
    }
  }, [session]);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (!session) {
    return (
      <div>
        <p>You are not signed in.</p>
        <button onClick={() => signIn()}>Sign in</button>
      </div>
    );
  }

  if (isLoading) {
    return <p>Loading repositories...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      <h1>Your GitHub Repositories</h1>
      <button onClick={() => signOut()}>Sign out</button>
      <div>
        {repositories.map((repo) => (
          <div key={repo.id}>
            {repo.commitCount && (
              <p>
                {repo.name} - Commits: {repo.commitCount}
              </p>
            )}
          </div>
        ))}
        total commits: {commitCount2}
      </div>
    </div>
  );
};

export default RepositoriesPage;
