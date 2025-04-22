/* eslint-disable @next/next/no-img-element */
import { CONTRACT_ADDRESS } from "@/lib/constants";
import { ImageResponse } from "next/og";
import { createPublicClient, http } from "viem";
import { base } from "viem/chains";
import tokenAbi from "@/lib/abis/token.json";

export const contentType = "image/png";
export const size = {
  width: 1200,
  height: 630,
};

export default async function Image() {
  const publicClient = createPublicClient({
    chain: base,
    transport: http(),
  });

  const data = await publicClient.readContract({
    address: "0xF19DB47F7cCA0c3Aa501Ce61C158cbaE1830a3E7",
    abi: tokenAbi,
    functionName: "totalSupply",
  });

  console.log("data", data);

  const colorData = await publicClient.readContract({
    address: "0xF19DB47F7cCA0c3Aa501Ce61C158cbaE1830a3E7",
    abi: tokenAbi,
    functionName: "getTokenColor",
    args: [data ? (data as bigint) - BigInt(1) : BigInt(0)],
  });

  console.log("colorData", colorData);

  //  address: CONTRACT_ADDRESS,
  //   abi: tokenAbi,
  //   functionName: "getTokenColor",
  //   args: [totalSupply ? (totalSupply as bigint) - BigInt(1) : BigInt(0)],

  return new ImageResponse(
    (
      <div
        tw={`flex items-center justify-center h-full w-full bg-[#${
          colorData || "ff3864"
        }]`}
      ></div>
    ),
    size
  );
}
