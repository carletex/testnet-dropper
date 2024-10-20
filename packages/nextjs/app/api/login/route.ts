import { NextResponse } from "next/server";
import { recoverMessageAddress } from "viem";
import { ADMIN_ADDRESSES, REQUEST_SECRET } from "~~/utils/faucet";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { signature?: `0x${string}` };
    if (!body.signature) {
      return NextResponse.json({ error: "No signature provided" }, { status: 400 });
    }

    const signingAddress = await recoverMessageAddress({
      message: "Enable the testnet dropper",
      signature: body.signature,
    });

    if (!ADMIN_ADDRESSES.includes(signingAddress)) {
      return NextResponse.json({ error: "Not admin" }, { status: 401 });
    }

    return NextResponse.json({ secret: REQUEST_SECRET }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Error logging in" }, { status: 500 });
  }
}
