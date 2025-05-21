import { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'
import { spawn } from 'child_process'

// Simple logging function
function logPrediction(data: {
  squareFootage: number
  numBedrooms: number
  predictedPrice: number
  timestamp: string
}) {
  const logFile = path.join(process.cwd(), 'data', 'predictions.json')
  
  // Create data directory if it doesn't exist
  const dataDir = path.join(process.cwd(), 'data')
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
  
  // Initialize log file if it doesn't exist
  if (!fs.existsSync(logFile)) {
    fs.writeFileSync(logFile, JSON.stringify([]))
  }
  
  // Read existing logs
  const logs = JSON.parse(fs.readFileSync(logFile, 'utf-8'))
  
  // Add new log
  logs.push(data)
  
  // Write updated logs
  fs.writeFileSync(logFile, JSON.stringify(logs, null, 2))
}

// Call the Python prediction script
function predictPrice(squareFootage: number, numBedrooms: number): Promise<number> {
  const mlDir = path.join(process.cwd(), 'ml')
  const modelPath = path.join(mlDir, 'model.pkl')
  
  // Check if model exists, train it if it doesn't
  if (!fs.existsSync(modelPath)) {
    console.log('Model not found, training first...')
    // Train the model without arguments
    const trainProcess = spawn('python', [
      path.join(mlDir, 'predict.py')
    ])
    
    trainProcess.stderr.on('data', (data) => {
      console.log(`Training output: ${data}`)
    })
    
    // Wait for training to complete
    return new Promise((resolve, reject) => {
      trainProcess.on('close', (code) => {
        if (code !== 0) {
          reject(new Error('Failed to train model'))
          return
        }
        // Now make the prediction with the newly trained model
        makePrediction(squareFootage, numBedrooms).then(resolve).catch(reject)
      })
    })
  }
  
  // Model exists, make prediction directly
  return makePrediction(squareFootage, numBedrooms)
}

// Helper function to make the actual prediction
function makePrediction(squareFootage: number, numBedrooms: number): Promise<number> {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn('python', [
      path.join(process.cwd(), 'ml', 'predict.py'),
      squareFootage.toString(),
      numBedrooms.toString()
    ])
    
    let result = ''
    let errorOutput = ''
    
    pythonProcess.stdout.on('data', (data) => {
      result += data.toString()
    })
    
    pythonProcess.stderr.on('data', (data) => {
      errorOutput += data.toString()
    })
    
    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Python script failed with code ${code}: ${errorOutput}`))
        return
      }
      
      try {
        const predictedPrice = parseFloat(result.trim())
        if (isNaN(predictedPrice)) {
          reject(new Error(`Invalid prediction result: ${result}`))
          return
        }
        resolve(predictedPrice)
      } catch (error) {
        reject(new Error(`Error parsing Python output: ${error}`))
      }
    })
  })
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }
  
  try {
    const { squareFootage, numBedrooms } = req.body
    
    // Validate inputs
    if (!squareFootage || !numBedrooms) {
      return res.status(400).json({ error: 'Missing required fields' })
    }
    
    if (isNaN(squareFootage) || isNaN(numBedrooms)) {
      return res.status(400).json({ error: 'Invalid input types' })
    }
    
    // Get prediction
    const predictedPrice = await predictPrice(Number(squareFootage), Number(numBedrooms))
    
    // Log prediction
    logPrediction({
      squareFootage: Number(squareFootage),
      numBedrooms: Number(numBedrooms),
      predictedPrice,
      timestamp: new Date().toISOString()
    })
    
    // Return result
    return res.status(200).json({ predictedPrice })
  } catch (error) {
    console.error('Prediction error:', error)
    return res.status(500).json({ 
      error: 'Failed to generate prediction', 
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
} 