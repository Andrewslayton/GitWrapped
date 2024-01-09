"use client"
import { Octokit } from "@octokit/rest";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
}

const GitHubRepositories = () => {
  const { data: session } = useSession();
  const [repositories, setRepositories] = useState<GitHubRepository[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRepositories = async () => {
      if (session) {
        setIsLoading(true);
        setError(null);

        try {
          const octokit = new Octokit({ auth: session.user.accessToken });
          const reposResponse =
            await octokit.rest.repos.listForAuthenticatedUser();
          setRepositories(reposResponse.data as GitHubRepository[]);
        } catch (err) {
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchRepositories();
  }, [session]);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>YOURE A NIMROD</p>;

  return (
    <div>
      {repositories.map((repo) => (
        <div key={repo.id}>
          <p>{repo.name}</p>
        </div>
      ))}
    </div>
  );
};

export default GitHubRepositories;
