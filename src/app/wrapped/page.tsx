"use client";

// pages/repositories.tsx
import { Octokit } from "@octokit/rest";
import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect, useState } from "react";

interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
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
        console.log("Fetching repositories..."); // Debug log
        setIsLoading(true);
        setError(null);

        try {
          const octokit = new Octokit({ auth: session.user.accessToken });
          const reposResponse =
            await octokit.rest.repos.listForAuthenticatedUser();
          console.log("Repositories:", reposResponse.data); // Debug log
          setRepositories(reposResponse.data as GitHubRepository[]);
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
            <p>{repo.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RepositoriesPage;
