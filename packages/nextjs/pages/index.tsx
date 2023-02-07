import type { NextPage } from "next";
import Head from "next/head";
import React from "react";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Testnet Dropper</title>
      </Head>

      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center mb-8">
            <span className="block text-2xl mb-2">BuidlGuidl's</span>
            <span className="block text-4xl font-bold">Testnet Faucet</span>
          </h1>
          <p className="text-center text-lg">
            Feed your address QR into the dropper's scanner and get some Goerli & Sepolia ETH!
          </p>
          <p className="text-center text-lg">
            <button className="btn">Get some ETH!</button>
          </p>
        </div>
      </div>
    </>
  );
};

export default Home;
