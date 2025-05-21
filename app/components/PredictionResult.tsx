'use client'

interface PredictionResultProps {
  price: number
}

export default function PredictionResult({ price }: PredictionResultProps) {
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price)

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-2">Predicted Price</h2>
      <p className="text-3xl font-bold text-blue-600">{formattedPrice}</p>
      <p className="text-sm text-gray-500 mt-2">
        This estimate is based on the property details you provided.
      </p>
    </div>
  )
} 