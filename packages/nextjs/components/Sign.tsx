import { useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import { useSignMessage } from "wagmi";
import { FAUCET_LOCALSTORGAGE_KEY, REQUEST_SECRET } from "~~/utils/faucet";
import { getParsedError, notification } from "~~/utils/scaffold-eth";

export const Sign = () => {
  const { signMessageAsync, isPending } = useSignMessage();
  const [isLoading, setIsLoading] = useState(false);
  const [faucetSecret, setFaucetSecret] = useLocalStorage(FAUCET_LOCALSTORGAGE_KEY, "", {
    initializeWithValue: false,
  });

  const handleSign = async () => {
    setIsLoading(true);
    try {
      const signature = await signMessageAsync({ message: "Enable the testnet dropper" });

      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ signature }),
      });

      if (!res.ok) {
        const data = (await res.json()) as { error: string };
        console.log("The error data", data);
        throw new Error(data.error);
      }

      const data = (await res.json()) as { secret: string };
      setFaucetSecret(data.secret);
    } catch (e) {
      console.error(e);
      const parsedError = getParsedError(e);

      notification.error(parsedError);
    } finally {
      setIsLoading(false);
    }
  };

  if (faucetSecret && faucetSecret === REQUEST_SECRET) {
    return null;
  }

  return (
    <button className="btn btn-primary btn-sm mx-2" disabled={isPending || isLoading} onClick={handleSign}>
      {isLoading || isPending ? <span className="loading loading-spinner loading-sm"></span> : "Sign"}
    </button>
  );
};
