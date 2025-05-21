'use client'

import { useState, FormEvent } from 'react'

interface PredictionFormProps {
  onSubmit: (squareFootage: number, numBedrooms: number) => void
  isLoading: boolean
}

export default function PredictionForm({ onSubmit, isLoading }: PredictionFormProps) {
  const [squareFootage, setSquareFootage] = useState<number>(1000)
  const [numBedrooms, setNumBedrooms] = useState<number>(2)
  
  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    onSubmit(squareFootage, numBedrooms)
  }
  
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Enter Property Details</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="squareFootage" className="block text-sm font-medium text-gray-700 mb-1">
            Square Footage
          </label>
          <input
            id="squareFootage"
            type="number"
            min="100"
            value={squareFootage}
            onChange={(e) => setSquareFootage(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div>
          <label htmlFor="numBedrooms" className="block text-sm font-medium text-gray-700 mb-1">
            Number of Bedrooms
          </label>
          <input
            id="numBedrooms"
            type="number"
            min="1"
            max="10"
            value={numBedrooms}
            onChange={(e) => setNumBedrooms(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Calculating... do not leave this page' : 'Predict Price'}
        </button>
      </form>
    </div>
  )
} 