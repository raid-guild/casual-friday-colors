"use client";

import { X, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import TokenColorItem from "./token-color-item";
import { EXPLORER_URL } from "@/lib/constants";
import { useState } from "react";

interface ColorHistoryModalProps {
  currentTokenId: bigint;
  currentColor: string;
  onClose: () => void;
  onSelectColor: (color: string) => void;
}

const ITEMS_PER_PAGE = 4;

export default function ColorHistoryModal({
  currentTokenId,
  currentColor,
  onClose,
  onSelectColor,
}: ColorHistoryModalProps) {
  const [currentPage, setCurrentPage] = useState(0);

  // Calculate total pages
  const totalPages = Math.ceil(
    Number(currentTokenId + BigInt(1)) / ITEMS_PER_PAGE
  );

  // Generate token IDs for the current page
  const tokenIds = Array.from({ length: ITEMS_PER_PAGE }, (_, i) => {
    const id = currentTokenId - BigInt(currentPage * ITEMS_PER_PAGE + i);
    return id >= BigInt(0) ? id : null;
  }).filter((id): id is bigint => id !== null);

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-black rounded-lg shadow-lg w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h2 className="text-lg font-semibold text-white">
            Raid Color History
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
          {/* Current Color Section */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-400 mb-2">
              Current Color
            </h3>
            <div className="flex items-center p-2 rounded bg-gray-900">
              <div
                className="w-10 h-10 rounded mr-3 border border-gray-800"
                style={{ backgroundColor: currentColor }}
              />
              <div>
                <div className="font-medium text-white">{currentColor}</div>
                <div className="text-sm text-gray-400">
                  Token #{currentTokenId.toString()}
                </div>
              </div>
            </div>
          </div>

          {/* History List */}
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-400 mb-2">
              Previous Colors
            </h3>
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

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 0}
                className="flex items-center gap-1 text-sm text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>
              <span className="text-sm text-gray-400">
                Page {currentPage + 1} of {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages - 1}
                className="flex items-center gap-1 text-sm text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
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
