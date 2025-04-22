"use client";

import { X, ShoppingCart } from "lucide-react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { MINT_PRICE, TARGET_CHAIN, CONTRACT_ADDRESS } from "@/lib/constants";
import { formatEther } from "viem";
import { useConnect, useReadContract } from "wagmi";
import tokenAbi from "@/lib/abis/token.json";
import { useFrame } from "./providers/frame-provider";
import { config } from "./providers/providers";
import { Button } from "./ui/button";

interface BuyColorModalProps {
  color: string;
  onBuy: () => void;
  onCancel: () => void;
  isConnected: boolean;
  isLoading: boolean;
  chainId?: number;
}

export default function BuyColorModal({
  color,
  onBuy,
  onCancel,
  isConnected,
  isLoading,
  chainId,
}: BuyColorModalProps) {
  const isOnBase = chainId === TARGET_CHAIN.id;

  const { context } = useFrame();
  const { connect } = useConnect();

  console.log("context", context);

  // Remove # from color if present for contract call
  const colorHex = color.startsWith("#") ? color.slice(1) : color;

  // Check if color is already minted
  const { data: isColorMinted } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: tokenAbi,
    functionName: "isColorMinted",
    args: [colorHex],
  }) as { data: boolean | undefined };

  const isDisabled = !isConnected || isLoading || !isOnBase || isColorMinted;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-black rounded-lg shadow-lg w-full max-w-md mx-4 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h2 className="text-lg font-semibold text-white">
            Claim your Raid Color
          </h2>
          <button
            onClick={onCancel}
            className="p-1 rounded-full hover:bg-gray-800"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-center mb-6">
            <div
              className="w-16 h-16 rounded-lg mr-4 border border-gray-800 shadow-inner"
              style={{ backgroundColor: color }}
            />
            <div>
              <h3 className="font-bold text-xl text-white">{color}</h3>
              <p className="text-gray-400">Make this THE RAID COLOR!</p>
            </div>
          </div>

          <div className="bg-gray-900 p-4 rounded-lg mb-6 text-gray-400">
            <div className="flex justify-between mb-2">
              <span>Color price:</span>
              <span className="font-medium text-white">
                {formatEther(BigInt(MINT_PRICE))} ETH
              </span>
            </div>
          </div>

          {!isConnected && context && (
            <div className="bg-yellow-900/20 border border-yellow-800 text-yellow-400 p-4 rounded-lg mb-6">
              <p className="text-sm mb-4">
                Please connect your Warpcaste wallet to purchase this color.
              </p>
              <div className="flex justify-center">
                <Button
                  onClick={() => connect({ connector: config.connectors[0] })}
                >
                  Connect Wallet
                </Button>
              </div>
            </div>
          )}

          {!isConnected && !context && (
            <div className="bg-yellow-900/20 border border-yellow-800 text-yellow-400 p-4 rounded-lg mb-6">
              <p className="text-sm mb-4">
                Please connect your wallet to purchase this color.
              </p>
              <div className="flex justify-center">
                <ConnectButton />
              </div>
            </div>
          )}

          {isConnected && !isOnBase && (
            <div className="bg-yellow-900/20 border border-yellow-800 text-yellow-400 p-4 rounded-lg mb-6">
              <p className="text-sm">
                Please switch to Base network to purchase this color.
              </p>
            </div>
          )}

          {isColorMinted && (
            <div className="bg-red-900/20 border border-red-800 text-red-400 p-4 rounded-lg mb-6">
              <p className="text-sm">
                This color has already been minted! Please choose a different
                color.
              </p>
            </div>
          )}

          <p className="text-sm text-gray-400 mb-6">
            Raid Colors will display your color as long as it's the most
            recently minted!
          </p>
        </div>

        <div className="p-4 border-t border-gray-800 flex justify-between">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-800 text-white rounded-sm hover:bg-gray-700 transition-colors"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={onBuy}
            disabled={isDisabled}
            className="px-4 py-2 bg-raid text-white rounded-sm hover:bg-raid/90 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            {isLoading ? "Processing..." : "Mint Color"}
          </button>
        </div>
      </div>
    </div>
  );
}
