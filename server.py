"""
AuraGuard - Backend FastAPI Server
Provides REST APIs for real-time smog forecasts, GenAI-powered routines,
IAQ hacks, interactive chat, direct impact calculations, and advanced atmospheric physics.
"""

import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import List, Optional, Dict, Any

from data_knowledge import CITIES_DATA, DIURNAL_HOURLY_PATTERN, LIFESTYLE_PERSONAS, DIY_HACKS, COMMUNITY_ACTIONS
from ai_engine import generate_routine_ai, chat_with_assistant
from impact_engine import calculate_detailed_impact
from advanced_physics import (
    calculate_advanced_indices,
    generate_altitude_sounding_profile,
    AERODYNAMIC_SPECTRUM,
    simulate_room_decay
)

app = FastAPI(
    title="AuraGuard API",
    description="Winter Smog & Urban Air Intelligence Assistant API",
    version="2.5.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class RoutineRequest(BaseModel):
    city: str = "delhi"
    aqi: Optional[int] = 382
    persona_id: str = "family_toddler"
    persona_name: Optional[str] = "Family with Toddlers & Infants"
    housing: str = "Apartment (3rd Floor)"
    heating: str = "Electric Radiant / Heat Convector"
    commute_mode: str = "Metro / Subway + Short Walk"
    has_purifier: bool = True
    gemini_api_key: Optional[str] = None

class ChatRequest(BaseModel):
    message: str
    history: Optional[List[Dict[str, str]]] = []
    city: str = "delhi"
    aqi: Optional[int] = 382
    persona_name: Optional[str] = "Family"
    gemini_api_key: Optional[str] = None

class ImpactRequest(BaseModel):
    outdoor_aqi: float = 380.0
    outdoor_hours: float = 2.0
    mask_type: str = "n95"
    has_indoor_purifier: bool = True
    flash_ventilation_used: bool = True
    commute_mode: str = "metro_transit"
    commute_km_daily: float = 16.0
    heating_source: str = "electric_radiant"
    family_size: int = 3

class RoomDecayRequest(BaseModel):
    room_volume_m3: float = 45.0
    cadr_cfm: float = 320.0
    infiltration_ach: float = 0.65
    outdoor_pm25: float = 280.0

@app.get("/api/cities")
def get_cities():
    return CITIES_DATA

@app.get("/api/city/{city_key}")
def get_city(city_key: str):
    city_data = CITIES_DATA.get(city_key.lower())
    if not city_data:
        city_data = CITIES_DATA["custom"]
    return {
        "city": city_data,
        "diurnal_cycle": DIURNAL_HOURLY_PATTERN
    }

@app.get("/api/advanced-telemetry/{city_key}")
def get_advanced_telemetry(city_key: str):
    city_data = CITIES_DATA.get(city_key.lower())
    if not city_data:
        city_data = CITIES_DATA["custom"]
    indices = calculate_advanced_indices(city_data)
    sounding = generate_altitude_sounding_profile(float(city_data.get("aqi", 350)))
    return {
        "city": city_data,
        "indices": indices,
        "sounding_profile": sounding
    }

@app.get("/api/aerodynamic-spectrum")
def get_aerodynamic_spectrum():
    return AERODYNAMIC_SPECTRUM

@app.post("/api/simulate-room-decay")
def decay_simulation(req: RoomDecayRequest):
    curve = simulate_room_decay(
        room_volume_m3=req.room_volume_m3,
        cadr_cfm=req.cadr_cfm,
        infiltration_ach=req.infiltration_ach,
        outdoor_pm25=req.outdoor_pm25
    )
    return {"decay_curve": curve}

@app.get("/api/personas")
def get_personas():
    return LIFESTYLE_PERSONAS

@app.get("/api/hacks")
def get_hacks():
    return DIY_HACKS

@app.get("/api/community")
def get_community():
    return COMMUNITY_ACTIONS

@app.post("/api/routine")
def create_routine(req: RoutineRequest):
    profile = {
        "city": req.city,
        "aqi": req.aqi,
        "persona_id": req.persona_id,
        "persona_name": req.persona_name,
        "housing": req.housing,
        "heating": req.heating,
        "commute_mode": req.commute_mode,
        "has_purifier": req.has_purifier
    }
    result = generate_routine_ai(profile, api_key=req.gemini_api_key)
    return result

@app.post("/api/chat")
def chat(req: ChatRequest):
    profile = {
        "city": req.city,
        "aqi": req.aqi,
        "persona_name": req.persona_name
    }
    reply = chat_with_assistant(
        message=req.message,
        history=req.history or [],
        profile=profile,
        api_key=req.gemini_api_key
    )
    return {"reply": reply}

@app.post("/api/impact")
def calculate_impact(req: ImpactRequest):
    impact = calculate_detailed_impact(req.dict())
    return impact

# Mount static folder for frontend UI
static_dir = os.path.join(os.path.dirname(__file__), "static")
if os.path.exists(static_dir):
    app.mount("/static", StaticFiles(directory=static_dir), name="static")

@app.get("/")
def serve_index():
    index_file = os.path.join(static_dir, "index.html")
    if os.path.exists(index_file):
        return FileResponse(index_file)
    return {"message": "AuraGuard Backend Running. Static index.html not yet created."}
