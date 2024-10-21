"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import type { NextPage } from "next";
import { useLocalStorage } from "usehooks-ts";
import { isAddress } from "viem";
import { TxnNotification } from "~~/hooks/scaffold-eth";
import scaffoldConfig from "~~/scaffold.config";
import { FAUCET_LOCALSTORGAGE_KEY } from "~~/utils/faucet";
import { getBlockExplorerTxLink, notification } from "~~/utils/scaffold-eth";

const { targetNetworks } = scaffoldConfig;

const mainNetwork = targetNetworks[0];

const LazyScanner = dynamic(() => import("@yudiel/react-qr-scanner").then(module => ({ default: module.Scanner })), {
  ssr: false,
});

const Home: NextPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [faucetSecret] = useLocalStorage(FAUCET_LOCALSTORGAGE_KEY, "", {
    initializeWithValue: false,
  });

  const handleFund = async (address: string) => {
    setIsLoading(true);
    let notificationId = null;

    try {
      const shortAddress = address?.slice(0, 6) + "..." + address?.slice(-4);
      notificationId = notification.loading(<TxnNotification message={`Funding address ${shortAddress}`} />);

      const res = await fetch("/api/trigger-faucet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ address: address, secret: faucetSecret }),
      });

      if (!res.ok) {
        const data = (await res.json()) as { error: string };
        throw new Error(data.error);
      }

      const data = (await res.json()) as { hash: string };

      const blockExplorerTxURL = mainNetwork ? getBlockExplorerTxLink(mainNetwork.id, data.hash) : "";

      notification.remove(notificationId);

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
      if (notificationId) {
        notification.remove(notificationId);
      }

      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="mt-8">
          <LazyScanner
            onScan={result => {
              const firstValue = result[0];
              const address = firstValue.rawValue;
              if (address && isAddress(address)) {
                handleFund(address);
              }
            }}
            styles={{
              container: { width: "300px", height: "300px" },
            }}
            onError={(error: any) => console.log(error)}
            paused={isLoading}
          />
        </div>
      </div>
    </>
  );
};

export default Home;
