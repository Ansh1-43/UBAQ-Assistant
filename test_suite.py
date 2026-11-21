"""
AuraGuard - Comprehensive Test Suite
Validates all endpoints, advanced indices, sounding profiles, and AI modules.
"""

import asyncio
import httpx
from server import app

async def run_all_tests():
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://test") as client:
        print("1. Testing Cities & Advanced Telemetry Endpoint...")
        res = await client.get("/api/cities")
        assert res.status_code == 200
        cities = res.json()
        assert "delhi" in cities and "lahore" in cities and "slc" in cities
        
        res_adv = await client.get("/api/advanced-telemetry/delhi")
        assert res_adv.status_code == 200
        adv_data = res_adv.json()
        assert "indices" in adv_data and "bvi" in adv_data["indices"]
        assert "sounding_profile" in adv_data and len(adv_data["sounding_profile"]) >= 5
        print("   ✅ Cities and Advanced Mathematical Indices passed")

        print("2. Testing Aerodynamic Particle Spectrum & Room Decay Simulation...")
        res_spec = await client.get("/api/aerodynamic-spectrum")
        assert res_spec.status_code == 200
        spectrum = res_spec.json()
        assert len(spectrum) >= 4

        decay_req = {
            "room_volume_m3": 45.0,
            "cadr_cfm": 320.0,
            "infiltration_ach": 0.65,
            "outdoor_pm25": 280.0
        }
        res_decay = await client.post("/api/simulate-room-decay", json=decay_req)
        assert res_decay.status_code == 200
        decay_data = res_decay.json()
        assert "decay_curve" in decay_data and len(decay_data["decay_curve"]) >= 10
        print("   ✅ Aerodynamic spectrum and differential room decay simulation passed")

        print("3. Testing Routine Generator...")
        routine_req = {
            "city": "Delhi NCR",
            "aqi": 382,
            "persona_id": "family_toddler",
            "persona_name": "Family with Toddlers & Infants",
            "housing": "Apartment (3rd Floor)",
            "heating": "Electric Radiant / Heat Convector",
            "commute_mode": "Metro / Subway + Short Walk",
            "has_purifier": True
        }
        res_routine = await client.post("/api/routine", json=routine_req)
        assert res_routine.status_code == 200
        print("   ✅ GenAI routine generation passed")

        print("4. Testing Scientific Impact Engine...")
        impact_req = {
            "outdoor_aqi": 380.0,
            "outdoor_hours": 2.0,
            "mask_type": "n95",
            "has_indoor_purifier": True,
            "flash_ventilation_used": True,
            "commute_mode": "metro_transit",
            "commute_km_daily": 16.0,
            "heating_source": "electric_radiant",
            "family_size": 3
        }
        res_impact = await client.post("/api/impact", json=impact_req)
        assert res_impact.status_code == 200
        print("   ✅ Scientific impact calculation passed")

    print("\n🎉 ALL TESTS PASSED FLAWLESSLY!")

if __name__ == "__main__":
    asyncio.run(run_all_tests())
