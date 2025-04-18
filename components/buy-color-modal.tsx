"use client"

import { X, ShoppingCart } from "lucide-react"

interface BuyColorModalProps {
  color: string
  onBuy: () => void
  onCancel: () => void
}

export default function BuyColorModal({ color, onBuy, onCancel }: BuyColorModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Buy This Color</h2>
          <button onClick={onCancel} className="p-1 rounded-full hover:bg-gray-100" aria-label="Close modal">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-center mb-6">
            <div
              className="w-16 h-16 rounded-lg mr-4 border border-gray-200 shadow-inner"
              style={{ backgroundColor: color }}
            />
            <div>
              <h3 className="font-bold text-xl">{color}</h3>
              <p className="text-gray-600">Become the owner of this beautiful color!</p>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <div className="flex justify-between mb-2">
              <span>Color price:</span>
              <span className="font-medium">0.01 ETH</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Network fee:</span>
              <span className="font-medium">~0.001 ETH</span>
            </div>
            <div className="border-t pt-2 mt-2 flex justify-between font-bold">
              <span>Total:</span>
              <span>0.011 ETH</span>
            </div>
          </div>

          <p className="text-sm text-gray-500 mb-6">
            By purchasing this color, you'll become its owner on the blockchain. Your ENS name (skuhl.eth) will be
            displayed as the owner.
          </p>
        </div>

        <div className="p-4 border-t flex justify-between">
          <button onClick={onCancel} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors">
            Cancel
          </button>
          <button
            onClick={onBuy}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Buy Color
          </button>
        </div>
      </div>
    </div>
  )
}
