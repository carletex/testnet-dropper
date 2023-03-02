import { NextApiRequest, NextApiResponse } from "next";
import { ethers } from "ethers";

// in ETH
const REQUEST_SECRET = process.env.REQUEST_SECRET ?? "HOLAAAAA";
const adminAddresses = [
  "0x60583563D5879C2E59973E5718c7DE2147971807",
  "0x5dcb5f4f39caa6ca25380cfc42280330b49d3c93",
  "0x34aA3F359A9D614239015126635CE7732c18fDF3",
  "0x38F84e92B468a1885e73CedC9A4d5632DE07EABB",
  "0x2dDC12E691F44f12A4BF5650317321fd996fB2F2",
  "0x2D143b3Ae28Fa31E7c821D138c58c32A30aA36Ae",
  "0xc1470707Ed388697A15B9B9f1f5f4cC882E28a45",
  "0xf40D36a4fEbD8aA52DB8b93f6D7dad0FF7fa2B6c",
  // burner
  "0x8393A66F048F181FFD8044Ad7E260222848Dff8f",
];

// ToDo. Protect endpoint
export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  if (request.method !== "POST") {
    response.status(405).json({ message: "Only POST requests allowed" });
    return;
  }

  const { signature } = request.body;

  const signingAddress = ethers.utils.verifyMessage("Enable the testnet dropper", signature);

  if (!adminAddresses.includes(signingAddress)) {
    response.status(401).json({ message: "Not admin" });
    return;
  }

  response.status(200).json({ secret: REQUEST_SECRET });
}
