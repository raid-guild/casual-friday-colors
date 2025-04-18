"use client";

import { useReadContract } from "wagmi";
import tokenAbi from "@/lib/abis/token.json";
import { CONTRACT_ADDRESS } from "@/lib/constants";
import AddressDisplay from "./address-display";

interface TokenColorItemProps {
  tokenId: bigint;
  onSelectColor: (color: string) => void;
}

export default function TokenColorItem({
  tokenId,
  onSelectColor,
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
      className="flex items-center p-2 rounded hover:bg-gray-50 cursor-pointer"
      onClick={() => onSelectColor(`#${color}`)}
    >
      <div
        className="w-10 h-10 rounded mr-3 border border-gray-200"
        style={{ backgroundColor: `#${color}` }}
      />
      <div className="flex-1">
        <div className="font-medium">{`#${color}`}</div>
        <div className="text-sm text-gray-500 flex justify-between items-center">
          <span>Token #{tokenId.toString()}</span>
          <AddressDisplay address={owner} />
        </div>
      </div>
    </li>
  );
}
