"use client";

import { X, ShoppingCart } from "lucide-react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { MINT_PRICE } from "@/lib/constants";
import { formatEther } from "viem";

interface BuyColorModalProps {
  color: string;
  onBuy: () => void;
  onCancel: () => void;
  isConnected: boolean;
  isLoading: boolean;
}

export default function BuyColorModal({
  color,
  onBuy,
  onCancel,
  isConnected,
  isLoading,
}: BuyColorModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">
            Claim your Raid Color
          </h2>
          <button
            onClick={onCancel}
            className="p-1 rounded-full hover:bg-gray-100"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-center mb-6">
            <div
              className="w-16 h-16 rounded-lg mr-4 border border-gray-200 shadow-inner"
              style={{ backgroundColor: color }}
            />
            <div>
              <h3 className="font-bold text-xl text-gray-900">{color}</h3>
              <p className="text-gray-600">Make this THE RAID COLOR!</p>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg mb-6 text-gray-600">
            <div className="flex justify-between mb-2 ">
              <span>Color price:</span>
              <span className="font-medium">
                {formatEther(BigInt(MINT_PRICE))} ETH
              </span>
            </div>
          </div>

          {!isConnected && (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-lg mb-6">
              <p className="text-sm mb-4">
                Please connect your wallet to purchase this color.
              </p>
              <div className="flex justify-center">
                <ConnectButton />
              </div>
            </div>
          )}

          <p className="text-sm text-gray-600 mb-6">
            Raid Colors will display your color as long as it's the most
            recently minted!
          </p>
        </div>

        <div className="p-4 border-t flex justify-between">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-sm hover:bg-gray-300 transition-colors"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={onBuy}
            disabled={!isConnected || isLoading}
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
