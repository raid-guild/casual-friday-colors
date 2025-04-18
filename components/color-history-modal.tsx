"use client"

import { X } from "lucide-react"

type ColorHistoryEntry = {
  color: string
  owner: string
  timestamp: number
}

interface ColorHistoryModalProps {
  history: ColorHistoryEntry[]
  onClose: () => void
  onSelectColor: (color: string) => void
}

export default function ColorHistoryModal({ history, onClose, onSelectColor }: ColorHistoryModalProps) {
  // Format the timestamp
  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Color History</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100" aria-label="Close modal">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 max-h-[60vh] overflow-y-auto">
          {history.length === 0 ? (
            <p className="text-center text-gray-500">No color history yet</p>
          ) : (
            <ul className="space-y-3">
              {history.map((entry, index) => (
                <li
                  key={index}
                  className="flex items-center p-2 rounded hover:bg-gray-50 cursor-pointer"
                  onClick={() => onSelectColor(entry.color)}
                >
                  <div
                    className="w-10 h-10 rounded mr-3 border border-gray-200"
                    style={{ backgroundColor: entry.color }}
                  />
                  <div className="flex-1">
                    <div className="font-medium">{entry.color}</div>
                    <div className="text-sm text-gray-500 flex justify-between">
                      <span>{entry.owner}</span>
                      <span>{formatTime(entry.timestamp)}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="p-4 border-t flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
