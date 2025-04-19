"use client";

import { X, ExternalLink } from "lucide-react";
import TokenColorItem from "./token-color-item";
import { COLOR_HISTORY_LENGTH, EXPLORER_URL } from "@/lib/constants";

interface ColorHistoryModalProps {
  currentTokenId: bigint;
  currentColor: string;
  onClose: () => void;
  onSelectColor: (color: string) => void;
}

export default function ColorHistoryModal({
  currentTokenId,
  currentColor,
  onClose,
  onSelectColor,
}: ColorHistoryModalProps) {
  // Generate token IDs for the last 3 tokens
  const tokenIds = Array.from({ length: COLOR_HISTORY_LENGTH }, (_, i) => {
    const id = currentTokenId - BigInt(i);
    return id >= BigInt(0) ? id : null;
  }).filter((id): id is bigint => id !== null);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-black rounded-lg shadow-lg w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h2 className="text-lg font-semibold text-white">
            The Last {COLOR_HISTORY_LENGTH} Raid Colors
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-800"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="p-4 max-h-[60vh] overflow-y-auto">
          {tokenIds.length === 0 ? (
            <p className="text-center text-gray-400">No color history yet</p>
          ) : (
            <ul className="space-y-3">
              {tokenIds.map((tokenId) => (
                <TokenColorItem
                  key={tokenId.toString()}
                  tokenId={tokenId}
                  onSelectColor={onSelectColor}
                  isCurrent={tokenId === currentTokenId}
                />
              ))}
            </ul>
          )}
        </div>

        <div className="p-4 border-t border-gray-800 flex justify-between items-center">
          <a
            href={EXPLORER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-400 hover:text-white flex items-center gap-1"
          >
            View contract on BaseScan
            <ExternalLink className="w-4 h-4" />
          </a>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
