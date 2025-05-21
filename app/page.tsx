'use client'

import { useState } from 'react'
import PredictionForm from '@/app/components/PredictionForm'
import PredictionResult from '@/app/components/PredictionResult'

export default function Home() {
  const [prediction, setPrediction] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(squareFootage: number, numBedrooms: number) {
    setLoading(true)
    try {
      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          squareFootage,
          numBedrooms,
        }),
      })
      
      const data = await response.json()
      setPrediction(data.predictedPrice)
    } catch (error) {
      console.error('Error predicting price:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-center my-8">
        Housing Price Predictor
      </h1>
      <PredictionForm onSubmit={handleSubmit} isLoading={loading} />
      {prediction !== null && <PredictionResult price={prediction} />}
    </div>
  )
} 