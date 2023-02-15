import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import React, { useRef, useState } from "react";
import { QrCodeIcon } from "@heroicons/react/24/outline";
import { useOutsideClick } from "~~/hooks/scaffold-eth";
import { ethers } from "ethers";
import { toast } from "~~/utils/scaffold-eth";
import dynamic from "next/dynamic";

// @ts-ignore
const QrReader = dynamic(() => import("react-qr-reader"), { ssr: false });

const Home: NextPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [scanOpen, setScanOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useOutsideClick(modalRef, () => {
    if (scanOpen) {
      setScanOpen(false);
    }
  });

  const triggerFaucet = async (address: string) => {
    setIsLoading(true);
    setScanOpen(false);
    const toastId = toast.loading("Processing request...");
    try {
      await fetch("/api/trigger-faucet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ address }),
      });
    } catch (e) {
      toast.error(`Dropper error ${JSON.stringify(e)}`);
    } finally {
      setIsLoading(false);
      toast.remove(toastId);
    }

    toast.success(
      <>
        <p className="font-bold mt-0">TX sent!</p> You should receive your test ETH shorty.
      </>,
    );
  };

  return (
    <>
      <Head>
        <title>Testnet Dropper</title>
      </Head>

      <div className="flex items-center flex-col flex-grow pt-10 bg-[url('/assets/clouds.svg')] bg-no-repeat bg-[center_5rem] bg-[length:1000px]">
        <div className="mt-[150px] px-5">
          <div className="text-center">
            <Image
              src="/assets/logo.svg"
              alt="BG Logo"
              width={257}
              height={50}
              className="inline-block"
              onClick={() => setTimeout(() => setScanOpen(true), 0)}
            />
          </div>
          <h1 className="text-center mb-8">
            <span className="block text-2xl font-bold">Testnet Faucet</span>
          </h1>
          <p className="text-center text-lg">
            Feed your address QR into the dropper's scanner and get some Goerli & Sepolia ETH!
          </p>
          <div className="text-center text-lg">
            <Image
              src="/assets/button.png"
              alt="Get some ETH!"
              width={287}
              height={63}
              className={`inline-block cursor-pointer relative active:top-2 mt-[50px] ${isLoading ? "opacity-20" : ""}`}
              onClick={() => setTimeout(() => setScanOpen(true), 0)}
            />
          </div>

          <div className="text-center">
            <Image
              src="/assets/chest.svg"
              alt="BG chest"
              width={354}
              height={98}
              className={`inline-block cursor-pointer relative active:top-2 mt-[50px] ${isLoading ? "opacity-20" : ""}`}
              onClick={() => setTimeout(() => setScanOpen(true), 0)}
            />
          </div>

          {scanOpen && (
            <div className="modal modal-open">
              <div className="modal-box" ref={modalRef}>
                <h3 className="font-bold text-lg">
                  <QrCodeIcon className="w-6 inline-block" /> Scan your Wallet Address
                </h3>
                <div className="py-4">
                  <QrReader
                    // @ts-ignore
                    onScan={(result: string) => {
                      if (!!result) {
                        // @ts-ignore
                        if (ethers.utils.isAddress(result)) {
                          triggerFaucet(result);
                        } else {
                          // Invalid address. ToDo. toast?
                          console.error("Invalid address");
                        }
                      }
                    }}
                    onError={(error: any) => console.log(error)}
                    style={{ width: "100%" }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
