# Housing Price Predictor

A simple Next.js application that predicts housing prices based on square footage and number of bedrooms using a linear regression model.

## Features

- React-based form for user input
- API route for price prediction
- Basic logging mechanism
- Simple linear regression model

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Next.js API routes
- **Data Storage**: JSON file for logging predictions
- **ML Model**: Simple linear regression (Python/scikit-learn)

## ML Model Training

The application uses a linear regression model trained on housing data to make price predictions. 

### Training Data

The model is trained using data from `ml/data.csv`. This file should contain:
- A header row with: `Square Footage,Number of Bedrooms,Price ($)`
- Data rows with values for each column (e.g., `1500,3,250000`)

### Training the Model

The model is automatically trained when:
- The model file (`ml/model.pkl`) doesn't exist
- The first prediction request is made

To manually train or retrain the model:

```bash
# Navigate to your project directory
cd <project-directory>

# Run the Python script without arguments to train the model
python ml/predict.py
```

You should see output showing the model coefficients, which indicate how square footage and bedroom count affect the predicted price.

### Customizing the Model

To improve prediction accuracy:
1. Replace `ml/data.csv` with your own housing data
2. Delete the existing `ml/model.pkl` file (if it exists)
3. Retrain the model using the command above

The more data points you provide, the more accurate the model will be.

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- Python 3.6+ (for ML model)
- Required Python packages:
  - scikit-learn
  - numpy

### Installation

1. Clone the repository
   ```
   git clone <repository-url>
   cd <project-directory>
   ```

2. Install JavaScript dependencies
   ```
   npm install
   ```

3. Install Python dependencies (optional, for ML model)
   ```
   pip install scikit-learn numpy
   ```

### Running the application

Start the development server:
```
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Enter the square footage of the property
2. Enter the number of bedrooms
3. Click "Predict Price" to get an estimated price

## How It Works

- The frontend collects user input (square footage and bedroom count)
- The data is sent to a Next.js API endpoint
- The API calls a Python script to make a prediction using a linear regression model
- The prediction is returned to the frontend and displayed to the user
- Each prediction is logged in a JSON file in the data directory

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── components/         # React components
│   │   ├── PredictionForm.tsx
│   │   └── PredictionResult.tsx
│   ├── layout.tsx          # App layout
│   └── page.tsx            # Home page
├── pages/                  # Next.js Pages Router (for API routes)
│   └── api/                # API endpoints
│       └── predict.ts      # Prediction API endpoint
├── ml/                     # Machine learning code
│   └── predict.py          # Python prediction script
├── data/                   # Data storage
│   └── predictions.json    # Logged predictions
├── public/                 # Static assets
└── styles/                 # CSS styles
    └── globals.css         # Global styles
``` 