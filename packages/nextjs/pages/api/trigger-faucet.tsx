import { NextApiRequest, NextApiResponse } from "next";
import { ethers } from "ethers";

// ToDo. Protect endpoint with
// ToDo. send funds
export default function handler(request: NextApiRequest, response: NextApiResponse) {
  if (request.method !== "POST") {
    response.status(405).json({ message: "Only POST requests allowed" });
    return;
  }

  const { address } = request.body;
  if (!ethers.utils.isAddress(address)) {
    response.status(400).json({ message: "Wrong address" });
  }

  response.status(200).end();
}
