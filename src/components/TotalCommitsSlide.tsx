import React from "react";
import CountUp from "react-countup";
import "tailwindcss/tailwind.css";

export default function TotalCommitsSlide({commitCount2,}: {commitCount2: number;}) {
  return (
    <main className="bg-red-500 flex items-center justify-center h-[70vh] h-center">
      <div className="text-center">
        <h1 className="text-4xl mb-4">You got busy this year</h1>
        <p className="text-2xl mb-4">Total Commits</p>
        <CountUp start={0} end={commitCount2} duration={2.75} />
      </div>
    </main>
  );
}
