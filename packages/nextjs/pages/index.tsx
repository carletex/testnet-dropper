import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import React, { useRef, useState } from "react";
import { ethers } from "ethers";
import { toast } from "~~/utils/scaffold-eth";
import dynamic from "next/dynamic";
import RainbowKitCustomConnectButton from "~~/components/scaffold-eth/RainbowKitCustomConnectButton";
import { useLocalStorage, useWindowSize } from "usehooks-ts";
import { Address } from "~~/components/scaffold-eth";
import Confetti from "react-confetti";
import { useOutsideClick } from "~~/hooks/scaffold-eth";

// @ts-ignore
const QrReader = dynamic(() => import("react-qr-reader"), { ssr: false });

const Home: NextPage = () => {
  const [sleep, setSleep] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [showConfeti, setShowConfeti] = useState(false);
  const [faucetSecret, setFaucetSecret] = useLocalStorage("faucet_secret", "");
  const [drops, setDrops] = useLocalStorage<string[]>("faucet_drops", []);
  const { width, height } = useWindowSize();
  const modalRef = useRef<HTMLDivElement>(null);
  const [clickCount, setClickCount] = useState(0);
  const [lastClickTimestamp, setLastClickTimestamp] = useState(0);
  useOutsideClick(modalRef, () => {
    if (modalOpen) {
      setModalOpen(false);
    }
  });

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

    console.log("Trigger response", response);

    if (response?.status === 200) {
      const dropsCopy: string[] = [...drops];
      dropsCopy.push(address);

      if (dropsCopy.length > 10) {
        dropsCopy.shift();
      }

      setDrops(dropsCopy);

      toast.success(
        <>
          <p className="font-bold mt-0">TX sent!</p> You should receive your test ETH shorty.
        </>,
      );
      setShowConfeti(true);

      setTimeout(() => {
        setShowConfeti(false);
      }, 8000);
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
        {showConfeti && <Confetti width={width} height={height} gravity={0.2} />}
        <div>
          <RainbowKitCustomConnectButton setFaucetSecret={setFaucetSecret} faucetSecret={faucetSecret} />
        </div>
        <div className="mt-[150px] px-5">
          <div className="text-center">
            <Image src="/assets/logo.svg" alt="BG Logo" width={385} height={75} className="inline-block" />
          </div>
          <h1 className="text-center mb-8">
            <span className="block font-bold mt-4 text-[80px]">Testnet Faucet</span>
          </h1>
          <p className="text-center text-4xl px-[50px]">
            Show us your wallet receive QR and get dropped
            <br /> <strong>💲Goerli💲</strong> & <strong>Sepolia</strong> ETH!
          </p>

          <div className="text-center">
            <Image
              src="/assets/chest.svg"
              alt="BG chest"
              width={354}
              height={98}
              className="inline-block relative active:top-2 mt-[50px]"
              onClick={() => {
                if (lastClickTimestamp === 0) {
                  setLastClickTimestamp(Date.now());
                }
                let count = clickCount;
                if (Date.now() > lastClickTimestamp + 1000) {
                  count = 0;
                }
                setLastClickTimestamp(Date.now());
                setClickCount(count + 1);
                if (count === 4) {
                  setTimeout(() => setModalOpen(true), 0);
                  setClickCount(0);
                }
              }}
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
        <div className="mt-14 mb-10 text-center">
          <h3 className="text-2xl font-bold">Recent drops</h3>
          <ul>
            {drops
              .slice(0)
              .reverse()
              .map((add, index) => (
                <li key={`${add}_${index}`} className="mt-2 flex justify-center">
                  <Address address={add} disableAddressLink={true} />
                </li>
              ))}
          </ul>
        </div>
        <div className={`modal ${modalOpen ? "modal-open" : ""}`}>
          <div className="modal-box" ref={modalRef}>
            <h3 className="font-bold text-lg text-center">Fund the faucet!</h3>
            <p className="py-4">
              <img src="/faucet_qr.png" alt="qr" />
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
