import type { NextPage } from "next";
import Head from "next/head";
import React, { useRef, useState } from "react";
// @ts-ignore
import QrReader from "react-qr-reader";
import { QrCodeIcon } from "@heroicons/react/24/outline";
import { useOutsideClick } from "~~/hooks/scaffold-eth";
import { ethers } from "ethers";
import { toast } from "~~/utils/scaffold-eth";

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

    toast.success("TX sent! You should receive your test ETH shorty.");
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
            <button
              className={`btn ${isLoading ? "loading" : ""}`}
              onClick={() => setTimeout(() => setScanOpen(true), 0)}
            >
              Get some ETH!
            </button>
          </p>

          {scanOpen && (
            <div className="modal modal-open">
              <div className="modal-box" ref={modalRef}>
                <h3 className="font-bold text-lg">
                  <QrCodeIcon className="w-6 inline-block" /> Scan your Wallet Address
                </h3>
                <div className="py-4">
                  <QrReader
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
                    // @ts-ignore
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
