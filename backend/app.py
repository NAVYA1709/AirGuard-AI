from fastapi import FastAPI
from pydantic import BaseModel
import joblib

from backend.model import AQIInput
from backend.utils import prepare_input
from fastapi.middleware.cors import CORSMiddleware
from backend.weather_api import get_coordinates, get_air_pollution

app = FastAPI(
    title="AirGuard AI",
    description="AQI Prediction API",
    version="1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = joblib.load("models/random_forest_model.pkl")
model_columns = joblib.load("models/model_columns.pkl")

class CityRequest(BaseModel):
    city: str


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

@app.post("/predict-city")
def predict_city(request: CityRequest):

    coordinates = get_coordinates(request.city)

    if coordinates is None:
        return {
            "error": "City not found"
        }

    lat, lon = coordinates

    input_data = get_air_pollution(lat, lon)

    # Date features
    from datetime import datetime

    today = datetime.now()

    input_data["Year"] = today.year
    input_data["Month"] = today.month
    input_data["Day"] = today.day
    input_data["DayOfWeek"] = today.weekday()

    # City & Season
    input_data["City"] = request.city

    month = today.month

    if month in [12, 1, 2]:
        season = "Winter"
    elif month in [3, 4, 5]:
        season = "Summer"
    elif month in [6, 7, 8, 9]:
        season = "Monsoon"
    else:
        season = "Post-Monsoon"

    input_data["Season"] = season

    df = prepare_input(input_data, model_columns)

    prediction = model.predict(df)[0]

    return {
        "City": request.city,
        "Predicted AQI": round(float(prediction), 2)
    }