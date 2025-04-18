"use client"

import type React from "react"

import { useState } from "react"
import { History } from "lucide-react"
import Image from "next/image"
import ColorHistoryModal from "@/components/color-history-modal"
import BuyColorModal from "@/components/buy-color-modal"

// Type for our color history entries
type ColorHistoryEntry = {
  color: string
  owner: string
  timestamp: number
}

export default function Home() {
  const [backgroundColor, setBackgroundColor] = useState("#3b82f6") // Default blue color
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false)
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false)
  const [selectedColor, setSelectedColor] = useState("#3b82f6")
  const [colorHistory, setColorHistory] = useState<ColorHistoryEntry[]>([
    { color: "#3b82f6", owner: "skuhl.eth", timestamp: Date.now() },
  ])

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value
    setSelectedColor(newColor) // Store the selected color
    setBackgroundColor(newColor) // Update the background immediately

    // Open the buy modal after a short delay to allow the color change to be visible first
    setTimeout(() => {
      setIsBuyModalOpen(true)
    }, 300)
  }

  const handleBuyColor = () => {
    // Add to history after purchase
    setColorHistory((prev) => [
      { color: selectedColor, owner: "skuhl.eth", timestamp: Date.now() },
      ...prev.slice(0, 9), // Keep only the 10 most recent entries
    ])
    setIsBuyModalOpen(false)
  }

  const handleCancelBuy = () => {
    // Optionally revert to the previous color if you want
    // setBackgroundColor(colorHistory[0].color)
    setIsBuyModalOpen(false)
  }

  const toggleHistoryModal = () => {
    setIsHistoryModalOpen(!isHistoryModalOpen)
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor }}>
      {/* Main content area - intentionally empty */}
      <div className="flex-grow"></div>

      {/* Footer with color picker */}
      <footer className="p-4 flex justify-between items-center bg-white/10 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <label htmlFor="colorPicker" className="text-sm font-medium text-white">
            Choose background color:
          </label>
          <div className="relative">
            <input
              type="color"
              id="colorPicker"
              value={backgroundColor}
              onChange={handleColorChange}
              className="w-10 h-10 rounded cursor-pointer"
              aria-label="Color picker"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-white">{backgroundColor}</span>
            <span className="text-sm text-white opacity-80">owned by</span>
            <span className="text-sm font-medium text-white bg-black/20 px-2 py-1 rounded">skuhl.eth</span>
          </div>
          <button
            onClick={toggleHistoryModal}
            className="ml-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            aria-label="View color history"
          >
            <History className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Raid Guild Attribution */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-white font-medium">Built by Raid Guild</span>
          <div className="bg-black/20 p-1 rounded">
            <Image src="/swords.svg" alt="Raid Guild Logo" width={20} height={20} />
          </div>
        </div>
      </footer>

      {/* Color History Modal */}
      {isHistoryModalOpen && (
        <ColorHistoryModal
          history={colorHistory}
          onClose={toggleHistoryModal}
          onSelectColor={(color) => {
            setBackgroundColor(color)
            toggleHistoryModal()
          }}
        />
      )}

      {/* Buy Color Modal */}
      {isBuyModalOpen && <BuyColorModal color={selectedColor} onBuy={handleBuyColor} onCancel={handleCancelBuy} />}
    </div>
  )
}
