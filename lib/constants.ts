import { base, sepolia } from "viem/chains";

export const TARGET_CHAIN =
  process.env.NEXT_PUBLIC_TARGET_CHAIN === "base" ? base : sepolia;
export const CONTRACT_ADDRESS =
  TARGET_CHAIN.id === base.id
    ? "0xF19DB47F7cCA0c3Aa501Ce61C158cbaE1830a3E7"
    : "0x62b79442D62d302201016512FBCB390aC9C6fe8A";
export const MINT_PRICE = "100000000000000";

export const WARPCAST_SHARE_URL = `https://warpcast.com/~/compose?text=I HAVE THE RAID COLOR!&embeds[]=https://colors.raidguild.org?color=`;

export const COLOR_HISTORY_LENGTH = 4;

export const EXPLORER_URL = `https://basescan.org/token/${CONTRACT_ADDRESS}`;
