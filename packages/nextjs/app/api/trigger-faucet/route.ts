import { NextResponse } from "next/server";
import { createWalletClient, fallback, http, isAddress, parseEther } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import scaffoldConfig from "~~/scaffold.config";
import { getAlchemyHttpUrl } from "~~/utils/scaffold-eth";

const FAUCET_AMOUNT = "0.25";
const wallet_private_key = process.env.WALLET_PRIVATE_KEY as `0x${string}`;
const REQUEST_SECRET = process.env.REQUEST_SECRET ?? "HOLAAAAA";

const { targetNetworks } = scaffoldConfig;

const mainNetwork = targetNetworks[0];
const alchemyHttpUrl = getAlchemyHttpUrl(mainNetwork.id);
const rpcFallbacks = alchemyHttpUrl ? [http(alchemyHttpUrl), http()] : [http()];

type ReqBody = {
  address?: string;
  secret?: string;
};

export async function POST(req: Request) {
  try {
    if (!wallet_private_key) {
      return NextResponse.json({ error: "Error getting funding wallet" }, { status: 500 });
    }

    const body: ReqBody = await req.json();
    const { address, secret } = body;

    if (secret !== REQUEST_SECRET) {
      return NextResponse.json({ error: "Not authorized" }, { status: 401 });
    }

    if (!address || isAddress(address)) {
      return NextResponse.json({ error: "Invalid address" }, { status: 400 });
    }

    const walletClient = createWalletClient({
      chain: mainNetwork,
      transport: fallback(rpcFallbacks),
      account: privateKeyToAccount(wallet_private_key),
    });

    const hash = await walletClient.sendTransaction({
      to: address,
      value: parseEther(FAUCET_AMOUNT),
    });

    return NextResponse.json({ hash }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Error triggering faucet" }, { status: 500 });
  }
}
