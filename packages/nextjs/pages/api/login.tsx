import { NextApiRequest, NextApiResponse } from "next";
import { ethers } from "ethers";

// in ETH
const REQUEST_SECRET = process.env.REQUEST_SECRET ?? "HOLAAAAA";
const adminAddresses = [
  "0x60583563d5879c2e59973e5718c7de2147971807",
  "0x5dcb5f4f39caa6ca25380cfc42280330b49d3c93",
  "0x34aa3f359a9d614239015126635ce7732c18fdf3",
  "0x38F84e92B468a1885e73CedC9A4d5632DE07EABB",
  "0x2dDC12E691F44f12A4BF5650317321fd996fB2F2",
  "0x2D143b3Ae28Fa31E7c821D138c58c32A30aA36Ae",
  "0x8Bd9d92bD8B7877239bf8Be19f7F2eeF4f93F0Ec",
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
