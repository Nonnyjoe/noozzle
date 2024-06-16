import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import Head from 'next/head';
import Reviews from '../components/reviews';
import Header from '../components/header';

const Home: NextPage = () => {
  return (
    <div className="flex flex-col min-h-screen py-2 bg-slate-100">
      <Head>
        <title>Create Rainbowkit App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="">
        <div className="flex flex-col">
          <Header />
          <Reviews />

        </div>
      </main>
    </div>
  )
}

export default Home
