import os
import requests
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("OPENWEATHER_API_KEY")

MEDIAN_VALUES = {
    "NOx": 23.79,
    "Benzene": 1.22,
    "Toluene": 3.37,
}

def get_coordinates(city):

    url = "https://api.openweathermap.org/geo/1.0/direct"

    params = {
        "q": city,
        "limit": 1,
        "appid": API_KEY
    }

    response = requests.get(url, params=params)

    data = response.json()

    

    if len(data) == 0:
        return None

    return data[0]["lat"], data[0]["lon"]

def get_air_pollution(lat, lon):

    url = "https://api.openweathermap.org/data/2.5/air_pollution"

    params = {
        "lat": lat,
        "lon": lon,
        "appid": API_KEY
    }

    response = requests.get(url, params=params)

    data = response.json()

    components = data["list"][0]["components"]

    pollutants = {
        "PM2.5": components["pm2_5"],
        "PM10": components["pm10"],
        "NO": components["no"],
        "NO2": components["no2"],
        "NH3": components["nh3"],
        "CO": components["co"] / 1000,
        "SO2": components["so2"],
        "O3": components["o3"],
        "NOx": MEDIAN_VALUES["NOx"],
        "Benzene": MEDIAN_VALUES["Benzene"],
        "Toluene": MEDIAN_VALUES["Toluene"],
    }

    return pollutants

def get_air_pollution_from_coordinates(lat, lon):

    url = "https://api.openweathermap.org/data/2.5/air_pollution"

    params = {
        "lat": lat,
        "lon": lon,
        "appid": API_KEY
    }

    response = requests.get(url, params=params)

    data = response.json()

    components = data["list"][0]["components"]

    pollutants = {
        "PM2.5": components["pm2_5"],
        "PM10": components["pm10"],
        "NO": components["no"],
        "NO2": components["no2"],
        "NH3": components["nh3"],
        "CO": components["co"],
        "SO2": components["so2"],
        "O3": components["o3"],
        "NOx": MEDIAN_VALUES["NOx"],
        "Benzene": MEDIAN_VALUES["Benzene"],
        "Toluene": MEDIAN_VALUES["Toluene"],
    }

    return pollutants

if __name__ == "__main__":

    lat, lon = get_coordinates("Delhi")

    pollution = get_air_pollution(lat, lon)

    print(pollution)