#!/usr/bin/env python3
import sys
import os
import json
import pickle
import csv
from pathlib import Path

# Get the absolute path to the model file and data file
BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "model.pkl"
DATA_PATH = BASE_DIR / "data.csv"

# Check if we need to train the model first
def train_model():
    """Train a simple linear regression model for house price prediction."""
    try:
        import numpy as np
        from sklearn.linear_model import LinearRegression
        
        # Load data from CSV file
        if DATA_PATH.exists():
            X = []
            y = []
            
            with open(DATA_PATH, 'r') as f:
                csv_reader = csv.reader(f)
                next(csv_reader)  # Skip header row
                
                for row in csv_reader:
                    if len(row) >= 3 and all(val.strip() for val in row[:3]):  # Ensure row has data
                        sq_ft = float(row[0])
                        bedrooms = float(row[1])
                        price = float(row[2])
                        
                        X.append([sq_ft, bedrooms])
                        y.append(price)
            
            if not X:  # If no data was loaded
                raise ValueError("No valid data found in CSV file")
                
            X = np.array(X)
            y = np.array(y)
            
            print(f"Training model with {len(X)} data points", file=sys.stderr)
        else:
           raise ValueError("No data found in CSV file")
        
        # Train the model
        model = LinearRegression()
        model.fit(X, y)
        
        # Print model coefficients
        print(f"Model coefficients: {model.coef_}", file=sys.stderr)
        print(f"Model intercept: {model.intercept_}", file=sys.stderr)
        
        # Save the model
        with open(MODEL_PATH, 'wb') as f:
            pickle.dump(model, f)
            
        return model
        
    except ImportError:
        print("scikit-learn not installed. Using fallback model.", file=sys.stderr)
        return None
    except Exception as e:
        print(f"Error training model: {e}", file=sys.stderr)
        return None

def predict(square_footage, num_bedrooms):
    """Predict house price using the trained model or fallback to simple formula."""
    # Convert inputs to appropriate types
    try:
        square_footage = float(square_footage)
        num_bedrooms = float(num_bedrooms)
    except ValueError:
        print("Error: Inputs must be numbers", file=sys.stderr)
        return 0
    
    # Check if model exists, otherwise train it
    if not MODEL_PATH.exists():
        model = train_model()
    else:
        try:
            with open(MODEL_PATH, 'rb') as f:
                model = pickle.load(f)
        except Exception as e:
            print(f"Error loading model: {e}", file=sys.stderr)
            model = None
    
    # Use the model if available
    if model:
        try:
            import numpy as np
            prediction = model.predict(np.array([[square_footage, num_bedrooms]]))[0]
            return prediction
        except Exception as e:
            print(f"Error during prediction: {e}", file=sys.stderr)
            # Fall back to simple formula
    
    # Fallback formula if model is not available or fails
    # This is a simple linear formula: base + (sq_ft * rate) + (bedrooms * value)
    base_price = 100000  # Base price
    sq_ft_rate = 150     # Price per sq ft
    bedroom_value = 25000  # Value per bedroom
    
    return base_price + (square_footage * sq_ft_rate) + (num_bedrooms * bedroom_value)

if __name__ == "__main__":
    # If no arguments are provided, just train the model and exit
    if len(sys.argv) == 1:
        print("Training model...", file=sys.stderr)
        model = train_model()
        if model:
            print("Model trained successfully!", file=sys.stderr)
            sys.exit(0)
        else:
            print("Failed to train model", file=sys.stderr)
            sys.exit(1)
    
    # Otherwise, predict price based on inputs
    if len(sys.argv) != 3:
        print("Usage: python predict.py <square_footage> <num_bedrooms>", file=sys.stderr)
        print("       python predict.py  # to train model only", file=sys.stderr)
        sys.exit(1)
    
    # Get inputs from command line
    square_footage = sys.argv[1]
    num_bedrooms = sys.argv[2]
    
    # Get prediction
    price = predict(square_footage, num_bedrooms)
    
    # Output the result (this will be captured by the Node.js process)
    print(int(price)) 