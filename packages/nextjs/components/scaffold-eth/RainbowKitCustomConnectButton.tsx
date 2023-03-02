import { ConnectButton } from "@rainbow-me/rainbowkit";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { TAutoConnect, useAutoConnect } from "~~/hooks/scaffold-eth";
import { useSigner, useSwitchNetwork } from "wagmi";
import * as chain from "wagmi/chains";
import { toast } from "~~/utils/scaffold-eth";
import React from "react";

// todo: move this later scaffold config.  See TAutoConnect for comments on each prop
const tempAutoConnectConfig: TAutoConnect = {
  enableBurnerWallet: true,
  autoConnect: true,
};

type ChainName = keyof typeof chain;

/**
 * Custom Wagmi Connect Button (watch balance + custom design)set
 */
export default function RainbowKitCustomConnectButton({
  setFaucetSecret,
  faucetSecret,
}: {
  setFaucetSecret: React.Dispatch<React.SetStateAction<string>>;
  faucetSecret: string;
}) {
  useAutoConnect(tempAutoConnectConfig);
  const { switchNetwork } = useSwitchNetwork();
  const { data: signer } = useSigner();

  const publicNetworkName = String(process.env.NEXT_PUBLIC_NETWORK).toLowerCase() as ChainName;
  const definedChain = chain[publicNetworkName];

  const onSwitchNetwork = () => {
    if (definedChain && switchNetwork) {
      switchNetwork(definedChain?.id);
      return;
    }
  };

  const handleSign = async () => {
    const signature = await signer?.signMessage("Enable the testnet dropper");

    let response;
    try {
      response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ signature }),
      });
    } catch (e) {
      toast.error(`Login error ${JSON.stringify(e)}`);
    }

    const responseBody = await response?.json();
    setFaucetSecret(responseBody.secret);
  };

  if (faucetSecret) return null;

  return (
    <ConnectButton.Custom>
      {({ account, chain, openAccountModal, openConnectModal, mounted }) => {
        const ready = mounted;
        const connected = ready && account && chain;

        return (
          <>
            {(() => {
              if (!connected) {
                return (
                  <button className="btn btn-primary btn-sm" onClick={openConnectModal} type="button">
                    Connect Wallet
                  </button>
                );
              }

              if (chain.unsupported || chain.id !== definedChain?.id) {
                return (
                  <div className="rounded-md shadow-lg p-2">
                    <span className="text-error mr-2">Wrong network selected - ({chain.name})</span>
                    <span className="text-primary mr-2">Switch network to</span>
                    <button className="btn btn-xs btn-primary btn-outline" onClick={onSwitchNetwork}>
                      {publicNetworkName}
                    </button>
                  </div>
                );
              }

              return (
                <div className="px-2 flex justify-end items-center">
                  <div className="flex justify-center items-center border-1 rounded-lg">
                    <button onClick={openAccountModal} type="button" className="btn btn-primary btn-sm">
                      <span className="m-1">{account.displayName}</span>
                      <span>
                        <ChevronDownIcon className="h-6 w-4" />
                      </span>
                    </button>
                    <button onClick={handleSign} type="button" className="btn btn-secondary btn-sm ml-2">
                      SIGN
                    </button>
                  </div>
                </div>
              );
            })()}
          </>
        );
      }}
    </ConnectButton.Custom>
  );
}
