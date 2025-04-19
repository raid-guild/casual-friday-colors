"use client";

import { useReadContract } from "wagmi";
import { Crown } from "lucide-react";
import tokenAbi from "@/lib/abis/token.json";
import { CONTRACT_ADDRESS } from "@/lib/constants";
import AddressDisplay from "./address-display";

interface TokenColorItemProps {
  tokenId: bigint;
  onSelectColor: (color: string) => void;
  isCurrent?: boolean;
}

export default function TokenColorItem({
  tokenId,
  onSelectColor,
  isCurrent = false,
}: TokenColorItemProps) {
  const { data: color } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: tokenAbi,
    functionName: "getTokenColor",
    args: [tokenId],
  }) as { data: string | undefined };

  const { data: owner } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: tokenAbi,
    functionName: "ownerOf",
    args: [tokenId],
  }) as { data: string | undefined };

  if (!color || !owner) return null;

  return (
    <li
      className="flex items-center p-2 rounded hover:bg-gray-800 cursor-pointer group"
      onClick={() => onSelectColor(`#${color}`)}
    >
      <div
        className="w-10 h-10 rounded mr-3 border border-gray-800 relative"
        style={{ backgroundColor: `#${color}` }}
      >
        {isCurrent && (
          <div className="absolute -top-1 -right-1 bg-raid p-1 rounded-full">
            <Crown className="w-3 h-3 text-white" />
          </div>
        )}
      </div>
      <div className="flex-1">
        <div className="font-medium text-white">{`#${color}`}</div>
        <div className="text-sm text-gray-400 flex justify-between items-center">
          <span>Token #{tokenId.toString()}</span>
          <AddressDisplay address={owner} />
        </div>
      </div>
    </li>
  );
}
