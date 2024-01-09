import React from 'react';
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css'
import Image from 'next/image'
import styles from '@/styles/Home.module.css'
import Link from 'next/link'


;


// Import your slide components
import TotalCommitsSlide from './TotalCommitsSlide';
import MostCommittedRepoSlide from './MostCommitedRepoSlide';
import LongestBreakSlide from './LongestBreakSlide';
import TotalLanguagesSlide from './TotalLanguagesSlide';

export default function Slideshow() {
  return (
    <div className={styles.slideshow}>
      <Slide>
        <TotalCommitsSlide />
        <MostCommittedRepoSlide />
        <LongestBreakSlide />
        <TotalLanguagesSlide />
        {/* Add more slides as needed */}
      </Slide>
    </div>
  );
}