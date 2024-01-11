import React from 'react';
import CountUp from 'react-countup';
import 'tailwindcss/tailwind.css';

export default function MostCommittedRepoSlide({ commitCount2 }: { commitCount2: number }) {
    return (
        <main className="bg-red-400 flex items-center justify-center h-96">
            <div className="text-center">
                <h1 className="text-4xl mb-4">Most Committed Repository</h1>
                <CountUp start={0} end={commitCount2} duration={2.75} />
            </div>
        </main>
    );
}