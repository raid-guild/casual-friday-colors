"use client";

import { mainnet } from "viem/chains";
import { createConfig, http, useEnsName } from "wagmi";

interface AddressDisplayProps {
  address: string | undefined;
}

export const config = createConfig({
  chains: [mainnet],
  transports: {
    [mainnet.id]: http(),
  },
});
export default function AddressDisplay({ address }: AddressDisplayProps) {
  const { data: ensName } = useEnsName({
    config,
    address: address as `0x${string}`,
  });

  return (
    <span className="text-sm font-medium text-white bg-black/20 px-2 py-1 rounded-[0.0625rem]">
      {address
        ? ensName || `${address.slice(0, 6)}...${address.slice(-4)}`
        : "No owner"}
    </span>
  );
}
