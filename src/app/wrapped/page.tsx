"use client";

import MostCommittedRepoSlide from "@/components/MostCommitedRepoSlide";
import TotalCommitsSlide from "@/components/TotalCommitsSlide";
import styles from "@/styles/Home.module.css";
// pages/repositories.tsx
import { Octokit } from "@octokit/rest";
import { Event, Streaks } from "@octokit/webhooks-definitions/schema";
import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import React from "react";
import { Slide } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";
import { set } from "zod";


interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  commitCount?: number;
}

interface Streaks {
  longestStreak: number;
  longestBreak: number;
}

const RepositoriesPage = () => {
  const { data: session, status } = useSession();
  const [repositories, setRepositories] = useState<GitHubRepository[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [commitCount2, setCommitCount2] = useState(0);
  const [highestCommitRepo, setHighestCommitRepo] = useState("");
  const [highestCommitCount, setHighestCommitCount] = useState(0);
  const [streaks, setStreaks] = useState(0);

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
          let highestCommitCount = 0;
          let highestCommitRepo = "";
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
              if (repo.commitCount > highestCommitCount) {
                highestCommitCount = repo.commitCount;
                highestCommitRepo = repo.name;
              }
              totalCommits += repo.commitCount;
            } catch (commitError) {
              // console.error(
              //   `Error fetching commits for repo ${repo.name}:`,
              // );
            }
         try {
           const repoResponse = await octokit.rest.repos.get({
             owner: authedUser.data.login,
             repo: repo.name,
           });

           if (repoResponse.status === 200) {
             const commitsResponse = await octokit.rest.repos.listCommits({
               owner: authedUser.data.login,
               repo: repo.name,
             });

             for (const commit of commitsResponse.data) {
               if (
                 commit.commit.author != null &&
                 commit.commit.author.date != null
               ) {
                 console.log(
                   `Commit SHA: ${commit.sha}, Author: ${commit.commit.author.name}, Date: ${commit.commit.author.date}`,
                 );
               }
             }
           } else {
             console.log(`Repository ${repo.name} does not exist.`);
           }
         } catch (error) {
           console.error(
             `Error fetching commits for repository ${repo.name}: ${error}`,
           );
         }
          }
          setCommitCount2(totalCommits);
          setHighestCommitRepo(highestCommitRepo);
          setHighestCommitCount(highestCommitCount);
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
    <div className="flex items-center justify-center h-screen bg-black">
      <div className="w-1/2 mx-auto ">
        <Slide>
          <TotalCommitsSlide commitCount2={commitCount2} />
          <MostCommittedRepoSlide
            highestcommited={highestCommitCount}
            repo={highestCommitRepo}
          />
          {/* Add more slides as needed */}
        </Slide>
      </div>
    </div>
  );
};

export default RepositoriesPage;