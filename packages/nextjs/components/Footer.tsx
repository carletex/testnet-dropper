import React from "react";
import { HeartIcon } from "@heroicons/react/24/outline";
/**
 * Site footer
 */
export default function Footer() {
  return (
    <div className="min-h-0 p-5 flex justify-between items-center flex-col sm:flex-row gap-4">
      <ul className="menu menu-horizontal px-1 m-auto">
        <div className="flex items-center gap-2 text-sm">
          <div>
            <a
              href="https://github.com/carletex/testnet-dropper"
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-2"
            >
              Fork me
            </a>
          </div>
          <span>·</span>
          <div>
            Built with <HeartIcon className="inline-block h-4 w-4" /> with 🏗️{" "}
            <a
              href="https://github.com/scaffold-eth/se-2/"
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-2"
            >
              Scaffold-ETH 2
            </a>
          </div>
        </div>
      </ul>
    </div>
  );
}
