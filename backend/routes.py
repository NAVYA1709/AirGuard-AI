from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from backend.model import rf_model, model_columns
from backend.weather_api import get_coordinates, get_air_pollution
from backend.utils import prepare_input

router = APIRouter()

class CityRequest(BaseModel):
    city: str

@router.post("/predict-city")
def predict_city(request: CityRequest):

    coordinates = get_coordinates(request.city)

    if coordinates is None:
        raise HTTPException(status_code=404, detail="City not found")

    lat, lon = coordinates

    pollutants = get_air_pollution(lat, lon)

    input_df = prepare_input(pollutants, model_columns)

    prediction = rf_model.predict(input_df)[0]

    return {
        "city": request.city,
        "Predicted AQI": round(prediction, 2)
    }