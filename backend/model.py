from pydantic import BaseModel

class AQIInput(BaseModel):
    PM2_5: float
    PM10: float
    NO: float
    NO2: float
    NOx: float
    NH3: float
    CO: float
    SO2: float
    O3: float
    Benzene: float
    Toluene: float
    Year: int
    Month: int
    Day: int
    DayOfWeek: int

    City: str
    Season: str