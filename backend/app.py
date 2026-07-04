from fastapi import FastAPI
import joblib

from backend.model import AQIInput
from backend.utils import prepare_input

app = FastAPI(
    title="AirGuard AI",
    description="AQI Prediction API",
    version="1.0"
)

model = joblib.load("models/random_forest_model.pkl")
model_columns = joblib.load("models/model_columns.pkl")


@app.get("/")
def home():
    return {
        "message": "Welcome to AirGuard AI API!"
    }


@app.get("/health")
def health():
    return {
        "status": "Model Loaded Successfully",
        "features": len(model_columns)
    }


@app.post("/predict")
def predict(data: AQIInput):

    # Convert request into dictionary
    input_data = data.model_dump()

    # Rename PM2_5 to match training column
    input_data["PM2.5"] = input_data.pop("PM2_5")

    # Prepare dataframe
    df = prepare_input(input_data, model_columns)

    # Predict
    prediction = model.predict(df)[0]

    return {
        "Predicted AQI": round(float(prediction), 2)
    }