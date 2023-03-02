import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import React, { useState } from "react";
import { ethers } from "ethers";
import { toast } from "~~/utils/scaffold-eth";
import dynamic from "next/dynamic";
import RainbowKitCustomConnectButton from "~~/components/scaffold-eth/RainbowKitCustomConnectButton";
import { useLocalStorage } from "usehooks-ts";

// @ts-ignore
const QrReader = dynamic(() => import("react-qr-reader"), { ssr: false });

const Home: NextPage = () => {
  const [sleep, setSleep] = useState(false);
  const [faucetSecret, setFaucetSecret] = useLocalStorage("faucet_secret", "");

  const triggerFaucet = async (address: string) => {
    if (sleep) return;

    const toastId = toast.loading("Processing request...");
    setSleep(true);

    setTimeout(() => {
      setSleep(false);
    }, 10000);

    let response;
    try {
      response = await fetch("/api/trigger-faucet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ address, secret: faucetSecret }),
      });
    } catch (e) {
      toast.error(`Dropper error ${JSON.stringify(e)}`);
    } finally {
      toast.remove(toastId);
    }

    console.log("re", response);

    if (response?.status === 200) {
      toast.success(
        <>
          <p className="font-bold mt-0">TX sent!</p> You should receive your test ETH shorty.
        </>,
      );
    } else {
      toast.error(
        <>
          <p className="font-bold mt-0">Noooop!</p>
        </>,
      );
    }
  };

  return (
    <>
      <Head>
        <title>Testnet Dropper</title>
      </Head>

      <div className="flex items-center flex-col flex-grow pt-10 bg-[url('/assets/clouds.svg')] bg-no-repeat bg-[center_5rem] bg-[length:1000px]">
        <div>
          <RainbowKitCustomConnectButton setFaucetSecret={setFaucetSecret} faucetSecret={faucetSecret} />
        </div>
        <div className="mt-[150px] px-5">
          <div className="text-center">
            <Image src="/assets/logo.svg" alt="BG Logo" width={257} height={50} className="inline-block" />
          </div>
          <h1 className="text-center mb-8">
            <span className="block text-2xl font-bold">Testnet Faucet</span>
          </h1>
          <p className="text-center text-lg">
            Feed your address QR into the dropper's scanner and get some Goerli & Sepolia ETH!
          </p>

          <div className="text-center">
            <Image
              src="/assets/chest.svg"
              alt="BG chest"
              width={354}
              height={98}
              className="inline-block relative active:top-2 mt-[50px]"
            />
          </div>

          <div className={`py-4 max-w-md mt-12 m-auto ${sleep ? "opacity-20" : ""}`}>
            <QrReader
              // @ts-ignore
              onScan={(result: string) => {
                if (!!result) {
                  // @ts-ignore
                  const cleanedAddress = result.replace("ethereum:", "").split("@")[0];
                  if (ethers.utils.isAddress(cleanedAddress)) {
                    triggerFaucet(cleanedAddress);
                  } else {
                    // Invalid address. ToDo. toast?
                    console.error("Invalid address", cleanedAddress);
                  }
                }
              }}
              onError={(error: any) => console.log(error)}
              style={{ width: "100%" }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
