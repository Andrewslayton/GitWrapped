"use client";

// pages/repositories.tsx
import { Octokit } from "@octokit/rest";
import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect, useState } from "react";


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

  useEffect(() => {
    console.log("Session user object:", session?.user); // Debug log to check user object
    console.log("Access Token:", session?.user?.accessToken); // Debug log to check access token
    const fetchRepositories = async () => {
      if (session && session.user && session.user.accessToken) {
        console.log("Fetching repositories...");
        setIsLoading(true);
        setError(null);

        if (!session.user.name) {
          console.log("User name not available, cannot fetch repositories.");
          return;
        }

        try {
          const octokit = new Octokit({ auth: session.user.accessToken });
          const authedUser = await octokit.rest.users.getAuthenticated();
          const reposResponse =
            await octokit.rest.repos.listForAuthenticatedUser();
          console.log("Repositories:", reposResponse.data);
          setRepositories(reposResponse.data as GitHubRepository[]);

          const repos = reposResponse.data as GitHubRepository[];
          for (const repo of repos) {
            try {
              const commitCountResponse =
                await octokit.rest.repos.getCommitActivityStats({
                  owner: authedUser.data.login,
                  repo: repo.name,
                });
              console.log("Commit count response:", commitCountResponse.data);
              repo.commitCount = commitCountResponse.data.reduce(
                (sum, week) => sum + week.total,
                0,
              );
            } catch (commitError) {
              console.error(
                `Error fetching commits for repo ${repo.name}:`,
                commitError,
              );
            }
          }
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
            <p>
              {repo.name} - Commits: {repo.commitCount}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RepositoriesPage;