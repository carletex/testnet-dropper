import { NextApiRequest, NextApiResponse } from "next";
import { ethers } from "ethers";

// in ETH
const infura_api_key = process.env.INFURA_API_KEY;
const wallet_private_key = process.env.WALLET_PRIVATE_KEY;
const REQUEST_SECRET = process.env.REQUEST_SECRET ?? "HOLAAAAA";

// ToDo. Protect endpoint
export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  if (!wallet_private_key) return;
  if (request.method !== "POST") {
    response.status(405).json({ message: "Only POST requests allowed" });
    return;
  }

  const { address, secret } = request.body;

  if (secret !== REQUEST_SECRET) {
    response.status(401).json({ message: "Not authorized" });
    return;
  }
  if (!ethers.utils.isAddress(address)) {
    response.status(400).json({ message: "Wrong address" });
  }

  // Init providers
  const goerliProvider = new ethers.providers.InfuraProvider(5, infura_api_key);
  const sepoliaProvider = new ethers.providers.InfuraProvider(11155111, infura_api_key);

  // Init signers
  const goerliWallet = new ethers.Wallet(wallet_private_key, goerliProvider);
  const sepoliaWallet = new ethers.Wallet(wallet_private_key, sepoliaProvider);

  // Faucet value
  const random = Math.random() * 100;

  let faucet_value = "0.01";
  if (random > 98) {
    faucet_value = "1";
  } else if (random > 10 && random <= 44) {
    faucet_value = "0.25";
  } else if (random > 44 && random <= 98) {
    faucet_value = "0.1";
  }

  // ToDo. handle errors.
  const txGoerli = await goerliWallet.sendTransaction({
    to: address,
    value: ethers.utils.parseEther(faucet_value),
  });

  console.log("GOERLI TX", txGoerli);

  const txSepolia = await sepoliaWallet.sendTransaction({
    to: address,
    value: ethers.utils.parseEther(faucet_value),
  });

  console.log("SEPOLIA TX", txSepolia);

  console.log("value", faucet_value);
  response.status(200).json({ faucet_value });
}
