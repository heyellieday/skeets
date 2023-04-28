import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'

const inter = Inter({ subsets: ['latin'] })

import { useEffect, useState } from 'react';

const getLatestSkeets = async () => {
  const response = await fetch('/api/skeets');
  console.log(response)
  return (await response.json()).skeets;
}

function SkeetList({ skeets }) {
  const [loadedSkeets, setLoadedSkeets] = useState(skeets);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    function handleScroll() {
      const scrollTop =
        document.documentElement.scrollTop ||
        document.body.scrollTop;
      const scrollHeight =
        document.documentElement.scrollHeight ||
        document.body.scrollHeight;
      const clientHeight =
        document.documentElement.clientHeight || window.innerHeight;
      if (scrollTop + clientHeight >= scrollHeight - 1 && !loading) {
        setLoading(true);
        // Load more skeets
        // For this example, we'll just append the current list of skeets
        const newSkeets = [...loadedSkeets, ...skeets];
        setLoadedSkeets(newSkeets);
        setLoading(false);
      }
    }

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadedSkeets]);

  async function handleLoadSkeets() {
    const latestSkeets = await getLatestSkeets();
    setLoadedSkeets(latestSkeets);
  }

  return (
    <div>
      <button onClick={handleLoadSkeets}>Load New Skeets</button>
      {loadedSkeets.map(({ post: { record: skeet, uri } }) => (
        <div key={uri}>
          <p>{skeet.text}</p>
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles.main} ${inter.className}`}>
        <div className={styles.grid}>
          <SkeetList skeets={[]} />
        </div>
      </main>
    </>
  )
}
