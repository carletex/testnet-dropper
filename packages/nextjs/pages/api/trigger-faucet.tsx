import { NextApiRequest, NextApiResponse } from "next";
import { ethers } from "ethers";

// in ETH
const FAUCET_AMOUNT = "0.01";
const infura_api_key = process.env.INFURA_API_KEY;
const wallet_private_key = process.env.WALLET_PRIVATE_KEY;

// ToDo. Protect endpoint with
// ToDo. send funds
export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  if (!wallet_private_key) return;
  if (request.method !== "POST") {
    response.status(405).json({ message: "Only POST requests allowed" });
    return;
  }

  const { address } = request.body;
  if (!ethers.utils.isAddress(address)) {
    response.status(400).json({ message: "Wrong address" });
  }

  // Init providers
  const goerliProvider = new ethers.providers.InfuraProvider(5, infura_api_key);
  const sepoliaProvider = new ethers.providers.InfuraProvider(11155111, infura_api_key);

  // Init signers
  const goerliWallet = new ethers.Wallet(wallet_private_key, goerliProvider);
  const sepoliaWallet = new ethers.Wallet(wallet_private_key, sepoliaProvider);

  // ToDo. handle errors.
  const txGoerli = await goerliWallet.sendTransaction({
    to: address,
    value: ethers.utils.parseEther(FAUCET_AMOUNT),
  });

  console.log("GOERLI TX", txGoerli);

  const txSepolia = await sepoliaWallet.sendTransaction({
    to: address,
    value: ethers.utils.parseEther(FAUCET_AMOUNT),
  });

  console.log("SEPOLIA TX", txSepolia);

  response.status(200).end();
}
