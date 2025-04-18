"use client";

import Image from "next/image";
import { Share2 } from "lucide-react";
import { WARPCAST_SHARE_URL } from "@/lib/constants";

interface SuccessModalProps {
  onClose: () => void;
  color: string;
}

export default function SuccessModal({ onClose, color }: SuccessModalProps) {
  const handleShare = () => {
    window.open(`${WARPCAST_SHARE_URL}${color}`, "_blank");
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white shadow-lg w-full max-w-md mx-4 overflow-hidden rounded-[0.0625rem]">
        <div className="p-6 flex flex-col items-center">
          <div className="w-16 h-16 mb-4 relative">
            <Image
              src="/trumpet.svg"
              alt="Success"
              fill
              className="object-contain"
            />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Success!</h2>
          <p className="text-gray-600 text-center mb-6">
            Your Raid Color is now THE RAID COLOR!
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleShare}
              className="px-4 py-2 bg-raid text-white rounded-sm hover:bg-raid/90 transition-colors flex items-center"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share on Warpcast
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-sm hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
