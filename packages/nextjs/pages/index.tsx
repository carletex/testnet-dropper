import type { NextPage } from "next";
import Head from "next/head";
import React, { useState } from "react";
import { QrReader } from "react-qr-reader";

const Home: NextPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState("No result");

  const triggerFaucet = async () => {
    setIsLoading(true);
    let response;
    try {
      response = await fetch("/api/trigger-faucet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (e) {
      console.log("error", e);
    } finally {
      setIsLoading(false);
    }

    console.log("response", response);
  };

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
            <button className={`btn ${isLoading ? "loading" : ""}`} onClick={triggerFaucet}>
              Get some ETH!
            </button>
          </p>

          <QrReader
            onResult={(result, error) => {
              if (!!result) {
                // @ts-ignore
                setData(result?.text);
              }

              if (!!error) {
                console.info(error);
              }
            }}
            // @ts-ignore
            style={{ width: "100%" }}
          />
          <p>{data}</p>
        </div>
      </div>
    </>
  );
};

export default Home;
