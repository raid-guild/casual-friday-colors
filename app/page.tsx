"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { History } from "lucide-react";
import Image from "next/image";
import {
  useAccount,
  useWriteContract,
  useReadContract,
  useWaitForTransactionReceipt,
  useEnsName,
  useSwitchChain,
} from "wagmi";
import { base } from "wagmi/chains";
import ColorHistoryModal from "@/components/color-history-modal";
import BuyColorModal from "@/components/buy-color-modal";
import SuccessModal from "@/components/success-modal";
import AddressDisplay from "@/components/address-display";

import tokenAbi from "@/lib/abis/token.json";
import { CONTRACT_ADDRESS, MINT_PRICE } from "@/lib/constants";

// Type for our color history entries
type ColorHistoryEntry = {
  color: string;
  owner?: string;
  timestamp: number;
};

export default function Home() {
  const { isConnected, address, chain } = useAccount();
  const { switchChain } = useSwitchChain();
  const {
    writeContract,
    data: hash,
    isError,
    error,
    reset,
  } = useWriteContract();
  const [isLoading, setIsLoading] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState("#000000"); // Default blue color
  const [pendingColor, setPendingColor] = useState<string | null>(null);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState("#000000");
  const [colorHistory, setColorHistory] = useState<ColorHistoryEntry[]>([
    { color: "#3b82f6", owner: address, timestamp: Date.now() },
  ]);

  // Wait for transaction receipt
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  // Query total supply to get the latest token ID
  const {
    data: totalSupply,
    isLoading: isLoadingSupply,
    refetch: refetchSupply,
  } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: tokenAbi,
    functionName: "totalSupply",
  });

  // Query the color for the latest token
  const {
    data: currentColor,
    isLoading: isLoadingColor,
    refetch: refetchColor,
  } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: tokenAbi,
    functionName: "getTokenColor",
    args: [totalSupply ? (totalSupply as bigint) - BigInt(1) : BigInt(0)],
  });

  // Query the owner of the latest token
  const {
    data: tokenOwner,
    isLoading: isLoadingOwner,
    refetch: refetchOwner,
  } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: tokenAbi,
    functionName: "ownerOf",
    args: [totalSupply ? (totalSupply as bigint) - BigInt(1) : BigInt(0)],
  }) as {
    data: string | undefined;
    isLoading: boolean;
    refetch: () => Promise<unknown>;
  };

  // Get ENS name for token owner
  const { data: ensName } = useEnsName({
    address: tokenOwner as `0x${string}`,
  });

  // Update background color when current color changes
  useEffect(() => {
    if (currentColor) {
      setBackgroundColor(`#${currentColor}`);
      setSelectedColor(`#${currentColor}`);
    }
  }, [currentColor]);

  // Handle transaction error
  useEffect(() => {
    if (isError) {
      setIsLoading(false);
      setIsBuyModalOpen(false);
      setPendingColor(null);
    }
  }, [isError]);

  // Handle transaction status changes
  useEffect(() => {
    if (isConfirmed && pendingColor) {
      setBackgroundColor(pendingColor);
      setSelectedColor(pendingColor);
      setPendingColor(null);
      setIsLoading(false);
      setIsSuccessModalOpen(true);
      reset();

      // Refetch contract data
      Promise.all([refetchSupply(), refetchColor(), refetchOwner()]).catch(
        console.error
      );
    }
  }, [
    isConfirming,
    isConfirmed,
    pendingColor,
    refetchSupply,
    refetchColor,
    refetchOwner,
  ]);

  // Switch to Base chain when connected
  useEffect(() => {
    if (isConnected && chain?.id !== base.id) {
      switchChain({ chainId: base.id });
    }
  }, [isConnected, chain?.id, switchChain]);

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setSelectedColor(newColor); // Store the selected color
    setPendingColor(newColor);
    // setBackgroundColor(newColor); // Update the background immediately

    // Open the buy modal after a short delay to allow the color change to be visible first
    setTimeout(() => {
      setIsBuyModalOpen(true);
    }, 300);
  };

  const handleBuyColor = () => {
    setIsLoading(true);
    try {
      // Call the contract function
      console.log("Buying color", selectedColor);
      writeContract({
        address: CONTRACT_ADDRESS, // Replace with your contract address
        abi: tokenAbi,
        functionName: "mintColor",
        args: [selectedColor],
        value: BigInt(MINT_PRICE), // 0.0001 ETH in wei
      });

      // Add to history after purchase
      setColorHistory((prev) => [
        { color: selectedColor, owner: address, timestamp: Date.now() },
        ...prev.slice(0, 9), // Keep only the 10 most recent entries
      ]);
      setIsBuyModalOpen(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const handleCancelBuy = () => {
    setIsBuyModalOpen(false);
  };

  const toggleHistoryModal = () => {
    setIsHistoryModalOpen(!isHistoryModalOpen);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor }}>
      {/* Loading overlay */}
      {(isLoading || isConfirming || isLoadingSupply || isLoadingColor) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-4 shadow-lg rounded-[0.0625rem]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-raid"></div>
            <p className="mt-2 text-gray-900">
              {isLoading || isConfirming
                ? "Processing transaction..."
                : "Loading color data..."}
            </p>
          </div>
        </div>
      )}

      {/* Main content area */}
      <div className="flex-grow"></div>

      {/* Footer with color picker */}
      <footer className="p-4 flex justify-between items-center bg-white/10 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <label
            htmlFor="colorPicker"
            className="text-sm font-medium text-white"
          >
            Choose background color:
          </label>
          <div className="relative">
            <input
              type="color"
              id="colorPicker"
              value={backgroundColor}
              onChange={handleColorChange}
              className="w-10 h-10 rounded-[0.0625rem] cursor-pointer"
              aria-label="Color picker"
              disabled={
                isLoading || isConfirming || isLoadingSupply || isLoadingColor
              }
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-white">{backgroundColor}</span>
            <span className="text-sm text-white opacity-80">picked by</span>
            <AddressDisplay address={tokenOwner} />
          </div>
          <button
            onClick={toggleHistoryModal}
            className="ml-4 p-2 rounded-[0.0625rem] bg-white/10 hover:bg-white/20 transition-colors"
            aria-label="View color history"
            disabled={
              isLoading || isConfirming || isLoadingSupply || isLoadingColor
            }
          >
            <History className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Raid Guild Attribution */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-white font-medium">🖤</span>
          <a
            href="https://www.raidguild.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-black/20 p-1 rounded hover:bg-black/30 transition-colors"
          >
            <Image
              src="/swords.svg"
              alt="Raid Guild Logo"
              width={20}
              height={20}
            />
          </a>
        </div>
      </footer>

      {/* Color History Modal */}
      {isHistoryModalOpen && (
        <ColorHistoryModal
          currentTokenId={
            totalSupply ? (totalSupply as bigint) - BigInt(1) : BigInt(0)
          }
          currentColor={backgroundColor}
          onClose={toggleHistoryModal}
          onSelectColor={(color) => {
            setBackgroundColor(color);
            toggleHistoryModal();
          }}
        />
      )}

      {/* Buy Color Modal */}
      {isBuyModalOpen && (
        <BuyColorModal
          color={selectedColor}
          onBuy={handleBuyColor}
          onCancel={handleCancelBuy}
          isConnected={isConnected}
          isLoading={isLoading || isConfirming}
          chainId={chain?.id}
        />
      )}

      {/* Success Modal */}
      {isSuccessModalOpen && (
        <SuccessModal
          onClose={() => setIsSuccessModalOpen(false)}
          color={backgroundColor}
        />
      )}
    </div>
  );
}
