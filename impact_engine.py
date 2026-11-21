"""
AuraGuard - Scientific Impact Calculation Engine
Computes personal exposure reduction and collective community emission savings.
"""

from typing import Dict, Any

def calculate_detailed_impact(params: Dict[str, Any]) -> Dict[str, Any]:
    """
    Computes rigorous personal and community impact based on lifestyle parameters.
    
    Inputs in params:
    - outdoor_aqi: e.g. 380
    - outdoor_hours: hours spent outside daily (e.g. 2.0)
    - mask_type: "none", "cloth", "surgical", "n95"
    - has_indoor_purifier: bool
    - flash_ventilation_used: bool
    - commute_mode: "solo_car", "carpool", "metro_transit", "bike_walk"
    - commute_km_daily: float (e.g. 15.0)
    - heating_source: "biomass_wood", "gas_stove", "electric_radiant", "heat_pump"
    - family_size: int (e.g. 3)
    """
    outdoor_aqi = float(params.get("outdoor_aqi", 350))
    # Approximate PM2.5 concentration from AQI (US EPA piecewise approximation)
    if outdoor_aqi <= 50:
        outdoor_pm25 = (outdoor_aqi / 50.0) * 12.0
    elif outdoor_aqi <= 100:
        outdoor_pm25 = 12.0 + ((outdoor_aqi - 50) / 50.0) * (35.4 - 12.0)
    elif outdoor_aqi <= 150:
        outdoor_pm25 = 35.4 + ((outdoor_aqi - 100) / 50.0) * (55.4 - 35.4)
    elif outdoor_aqi <= 200:
        outdoor_pm25 = 55.4 + ((outdoor_aqi - 150) / 50.0) * (150.4 - 55.4)
    elif outdoor_aqi <= 300:
        outdoor_pm25 = 150.4 + ((outdoor_aqi - 200) / 100.0) * (250.4 - 150.4)
    else:
        # Above 300
        outdoor_pm25 = 250.4 + ((outdoor_aqi - 300) / 200.0) * (500.0 - 250.4)

    outdoor_hours = float(params.get("outdoor_hours", 2.0))
    indoor_hours = max(0.0, 24.0 - outdoor_hours)
    mask_type = params.get("mask_type", "n95").lower()
    has_indoor_purifier = bool(params.get("has_indoor_purifier", True))
    flash_ventilation_used = bool(params.get("flash_ventilation_used", True))
    commute_mode = params.get("commute_mode", "metro_transit").lower()
    commute_km = float(params.get("commute_km_daily", 16.0))
    heating = params.get("heating_source", "electric_radiant").lower()
    family_size = int(params.get("family_size", 3))

    # --- 1. PERSONAL EXPOSURE CALCULATIONS ---
    # Normal adult inhalation rate: ~12 cubic meters of air per 24 hours (~0.5 m3/hour)
    inhalation_rate_m3_per_hour = 0.52

    # Baseline Scenario (No AuraGuard, standard unsealed house, no purifier, no mask)
    # Natural infiltration ratio for unsealed urban homes: ~0.70 of outdoor PM2.5
    baseline_indoor_pm25 = outdoor_pm25 * 0.72
    baseline_outdoor_pm25 = outdoor_pm25
    baseline_inhaled_ug = (
        (baseline_outdoor_pm25 * outdoor_hours * inhalation_rate_m3_per_hour) +
        (baseline_indoor_pm25 * indoor_hours * inhalation_rate_m3_per_hour)
    )

    # Protected Scenario with AuraGuard Choices
    # Mask filtration efficiency:
    mask_eff = {
        "none": 0.0,
        "cloth": 0.20,
        "surgical": 0.45,
        "n95": 0.93
    }.get(mask_type, 0.93)

    protected_outdoor_pm25 = outdoor_pm25 * (1.0 - mask_eff)

    # Protected Indoor Air Quality
    if has_indoor_purifier:
        if flash_ventilation_used:
            # Purifier + timed flash ventilation = lowest indoor PM2.5 without CO2 build-up
            protected_indoor_pm25 = min(18.0, outdoor_pm25 * 0.08)
        else:
            # Purifier alone without timed ventilation
            protected_indoor_pm25 = min(25.0, outdoor_pm25 * 0.12)
    else:
        if flash_ventilation_used:
            protected_indoor_pm25 = outdoor_pm25 * 0.45
        else:
            protected_indoor_pm25 = outdoor_pm25 * 0.70

    protected_inhaled_ug = (
        (protected_outdoor_pm25 * outdoor_hours * inhalation_rate_m3_per_hour) +
        (protected_indoor_pm25 * indoor_hours * inhalation_rate_m3_per_hour)
    )

    avoided_inhaled_ug_per_person = max(0.0, baseline_inhaled_ug - protected_inhaled_ug)
    total_family_avoided_ug = avoided_inhaled_ug_per_person * family_size
    reduction_percentage = round(((baseline_inhaled_ug - protected_inhaled_ug) / max(1.0, baseline_inhaled_ug)) * 100, 1)

    # Berkeley Earth cigarette equivalence: ~22 µg/m3 over 24 hrs = 1 cigarette
    # Baseline inhaled volume = 12.48 m3. Inhaling 22 µg/m3 * 12.48 m3 = ~274 µg of PM2.5
    cigs_avoided_per_person = round(avoided_inhaled_ug_per_person / 274.0, 1)

    # --- 2. COLLECTIVE COMMUNITY EMISSIONS CALCULATIONS ---
    # Baseline Commute: Solo gasoline car emitting ~190g CO2/km, 0.045g PM2.5/km, 0.35g NOx/km
    baseline_car_co2_kg = (commute_km * 0.192)
    baseline_car_pm25_g = (commute_km * 0.048)
    baseline_car_nox_g = (commute_km * 0.36)

    # Chosen commute mode factors compared to solo car:
    commute_savings_ratio = {
        "solo_car": 0.0,
        "carpool": 0.65,        # 65% reduction per rider
        "metro_transit": 0.88,  # Electric subway / rail cuts 88%
        "bike_walk": 1.0        # 100% emission reduction
    }.get(commute_mode, 0.65)

    daily_transit_co2_saved_kg = baseline_car_co2_kg * commute_savings_ratio
    daily_transit_pm25_saved_g = baseline_car_pm25_g * commute_savings_ratio
    daily_transit_nox_saved_g = baseline_car_nox_g * commute_savings_ratio

    # Heating choices impact
    # Biomass/wood burning vs electric/heat pump
    if heating == "biomass_wood":
        heating_co2_saved_kg = 0.0
        heating_pm25_saved_g = 0.0
    elif heating == "gas_stove":
        heating_co2_saved_kg = 1.2
        heating_pm25_saved_g = 15.0  # avoided heavy wood soot
    elif heating == "electric_radiant":
        heating_co2_saved_kg = 2.4
        heating_pm25_saved_g = 45.0  # zero local soot
    else:  # heat_pump
        heating_co2_saved_kg = 4.8
        heating_pm25_saved_g = 45.0

    total_daily_co2_saved_kg = round(daily_transit_co2_saved_kg + heating_co2_saved_kg, 2)
    total_daily_pm25_saved_g = round(daily_transit_pm25_saved_g + (heating_pm25_saved_g / 10.0), 2)
    total_daily_nox_saved_g = round(daily_transit_nox_saved_g, 2)

    # 30-day family projection
    monthly_co2_saved_kg = round(total_daily_co2_saved_kg * 30, 1)
    monthly_pm25_saved_g = round(total_daily_pm25_saved_g * 30, 1)

    # Community Neighborhood Multiplier (e.g. 250 participating homes in an apartment cluster)
    community_monthly_co2_tonnes = round((monthly_co2_saved_kg * 250) / 1000.0, 1)
    community_monthly_pm25_kg = round((monthly_pm25_saved_g * 250) / 1000.0, 1)

    return {
        "personal": {
            "baseline_inhaled_ug": round(baseline_inhaled_ug, 1),
            "protected_inhaled_ug": round(protected_inhaled_ug, 1),
            "avoided_inhaled_ug_per_person": round(avoided_inhaled_ug_per_person, 1),
            "total_family_avoided_ug": round(total_family_avoided_ug, 1),
            "reduction_percentage": reduction_percentage,
            "cigarette_equivalent_avoided_daily": cigs_avoided_per_person,
            "indoor_pm25_achieved": round(protected_indoor_pm25, 1),
            "outdoor_pm25_effective": round(protected_outdoor_pm25, 1),
            "health_score": min(98, max(40, int(reduction_percentage * 1.15)))
        },
        "community": {
            "daily_co2_saved_kg": total_daily_co2_saved_kg,
            "daily_pm25_saved_g": total_daily_pm25_saved_g,
            "daily_nox_saved_g": total_daily_nox_saved_g,
            "monthly_co2_saved_kg": monthly_co2_saved_kg,
            "monthly_pm25_saved_g": monthly_pm25_saved_g,
            "community_cluster_monthly_co2_tonnes": community_monthly_co2_tonnes,
            "community_cluster_monthly_pm25_kg": community_monthly_pm25_kg
        }
    }
