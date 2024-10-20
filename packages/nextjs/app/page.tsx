"use client";

import { useState } from "react";
import type { NextPage } from "next";
import { useLocalStorage } from "usehooks-ts";
import { useAccount } from "wagmi";
import { TxnNotification } from "~~/hooks/scaffold-eth";
import scaffoldConfig from "~~/scaffold.config";
import { FAUCET_LOCALSTORGAGE_KEY } from "~~/utils/faucet";
import { getBlockExplorerTxLink, notification } from "~~/utils/scaffold-eth";

const { targetNetworks } = scaffoldConfig;

const mainNetwork = targetNetworks[0];

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [faucetSecret] = useLocalStorage(FAUCET_LOCALSTORGAGE_KEY, "", {
    initializeWithValue: false,
  });

  const handleFund = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/trigger-faucet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ address: connectedAddress, secret: faucetSecret }),
      });

      if (!res.ok) {
        const data = (await res.json()) as { error: string };
        throw new Error(data.error);
      }

      const data = (await res.json()) as { hash: string };
      console.log("The data", data);

      notification.success("Funded");

      const blockExplorerTxURL = mainNetwork ? getBlockExplorerTxLink(mainNetwork.id, data.hash) : "";

      notification.success(
        <TxnNotification message="Transaction completed successfully!" blockExplorerLink={blockExplorerTxURL} />,
        {
          icon: "🎉",
        },
      );
    } catch (e) {
      console.error(e);
      notification.error("Failed to fund");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <button className="btn btn-primary btn-md" onClick={handleFund}>
          {isLoading ? <span className="loading loading-spinner loading-sm"></span> : "Fund me"}
        </button>
      </div>
    </>
  );
};

export default Home;
