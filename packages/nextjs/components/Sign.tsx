import { useLocalStorage } from "usehooks-ts";
import { useSignMessage } from "wagmi";
import { getParsedError, notification } from "~~/utils/scaffold-eth";

export const Sign = () => {
  const { signMessageAsync } = useSignMessage();
  const [, setFaucetSecret] = useLocalStorage("faucet_secret", "", {
    initializeWithValue: false,
  });

  const handleSign = async () => {
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
        const data = await res.json();
        console.log("The error data", data);
        throw new Error("Error logging in");
      }

      const data = (await res.json()) as { secret: string };
      setFaucetSecret(data.secret);
    } catch (e) {
      console.error(e);
      const parsedError = getParsedError(e);

      notification.error(parsedError);
    }
  };

  return (
    <button className="btn btn-primary" onClick={handleSign}>
      Sign
    </button>
  );
};
