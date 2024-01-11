import React from 'react';
import CountUp from 'react-countup';
import 'tailwindcss/tailwind.css';

export default function MostCommittedRepoSlide({ highestcommited, repo }: { repo : String ,highestcommited: number }) {
    return (
        <main className="bg-red-400 flex items-center justify-center h-[70vh] h-center">
            <div className="text-center">
                <h1 className="text-4xl mb-4">WOW! You had some highly commited Repos</h1>
                <p className="text-2xl mb-4">your highest commited repo was {repo} </p>
                <p className="text-2xl mb-4">You contributed {highestcommited} commits</p>
            </div>
        </main>
    );
}