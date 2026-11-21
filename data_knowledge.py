"""
AuraGuard - Winter Smog & Urban Air Intelligence Assistant
Domain Knowledge and Simulation Data
"""

CITIES_DATA = {
    "delhi": {
        "name": "Delhi NCR, India",
        "aqi": 382,
        "category": "Severe / Hazardous",
        "color": "#7E0023",
        "pm25": 285.4,
        "pm10": 412.0,
        "no2": 89.2,
        "co": 3.8,
        "temp": "13°C (55°F)",
        "humidity": "78%",
        "wind": "4 km/h NW (Stagnant)",
        "inversion_risk": "Critical (Ground inversion active < 120m)",
        "primary_sources": ["Vehicular Cold-Starts", "Biomass & Waste Burning", "Secondary Nitrates", "Stubble Residue Inflow", "Industrial Emissions"],
        "safe_ventilation_window": "1:30 PM - 3:00 PM (Brief thermal lifting)"
    },
    "lahore": {
        "name": "Lahore, Pakistan",
        "aqi": 425,
        "category": "Hazardous / Emergency",
        "color": "#7E0023",
        "pm25": 340.1,
        "pm10": 480.5,
        "no2": 95.0,
        "co": 4.2,
        "temp": "12°C (53°F)",
        "humidity": "82%",
        "wind": "3 km/h (Calm)",
        "inversion_risk": "Extreme (Thick radiational fog cap)",
        "primary_sources": ["Low-grade fuel combustion", "Brick Kilns", "Heavy Diesel Traffic", "Solid Waste Burning"],
        "safe_ventilation_window": "2:00 PM - 3:30 PM (Peak solar radiation)"
    },
    "beijing": {
        "name": "Beijing, China",
        "aqi": 168,
        "category": "Unhealthy",
        "color": "#FF0000",
        "pm25": 88.5,
        "pm10": 142.0,
        "no2": 52.3,
        "co": 1.4,
        "temp": "-2°C (28°F)",
        "humidity": "45%",
        "wind": "8 km/h N",
        "inversion_risk": "Moderate (Regional heating wave)",
        "primary_sources": ["District Heating Plants", "Heavy Freight Transit", "Regional Smog Transport"],
        "safe_ventilation_window": "12:30 PM - 2:30 PM"
    },
    "slc": {
        "name": "Salt Lake City, UT (USA)",
        "aqi": 142,
        "category": "Unhealthy for Sensitive Groups",
        "color": "#FF7E00",
        "pm25": 54.2,
        "pm10": 78.0,
        "no2": 38.0,
        "co": 1.1,
        "temp": "-4°C (24°F)",
        "humidity": "68%",
        "wind": "5 km/h (Basin Stagnation)",
        "inversion_risk": "High (Wasatch Front Valley Cold-Pool Inversion)",
        "primary_sources": ["Residential Wood & Gas Heating", "Commuter Vehicle Exhaust", "Refinery Stagnation"],
        "safe_ventilation_window": "1:00 PM - 3:00 PM"
    },
    "london": {
        "name": "London, United Kingdom",
        "aqi": 72,
        "category": "Moderate",
        "color": "#F0C808",
        "pm25": 22.0,
        "pm10": 34.5,
        "no2": 44.0,
        "co": 0.6,
        "temp": "6°C (43°F)",
        "humidity": "85%",
        "wind": "14 km/h SW",
        "inversion_risk": "Low (Maritime ventilation)",
        "primary_sources": ["Domestic Wood Burners", "Diesel Transport", "Urban Background"],
        "safe_ventilation_window": "11:00 AM - 4:00 PM"
    },
    "custom": {
        "name": "Custom Urban Zone",
        "aqi": 210,
        "category": "Very Unhealthy",
        "color": "#8F3F97",
        "pm25": 160.0,
        "pm10": 240.0,
        "no2": 65.0,
        "co": 2.2,
        "temp": "10°C (50°F)",
        "humidity": "70%",
        "wind": "6 km/h",
        "inversion_risk": "High Winter Thermal Inversion",
        "primary_sources": ["Local Heating & Transit", "Boundary Layer Trapping"],
        "safe_ventilation_window": "1:00 PM - 2:30 PM"
    }
}

DIURNAL_HOURLY_PATTERN = [
    {"hour": "00:00", "aqi_factor": 1.15, "inversion": "Extreme", "desc": "Ground radiational cooling intensifies, pollutants trapped < 80m"},
    {"hour": "03:00", "aqi_factor": 1.25, "inversion": "Peak Stagnation", "desc": "Coldest surface temperatures; dense smog blanket at ground level"},
    {"hour": "06:00", "aqi_factor": 1.35, "inversion": "Hazardous Maximum", "desc": "Morning freight traffic + heating fires ignite; worst air of the day"},
    {"hour": "08:00", "aqi_factor": 1.30, "inversion": "Severe Rush Peak", "desc": "Heavy morning commuter emissions trapped; strictly avoid outdoor cardio"},
    {"hour": "10:00", "aqi_factor": 1.10, "inversion": "Gradual Break", "desc": "Sun begins heating the surface; atmospheric mixing layer starts rising"},
    {"hour": "12:00", "aqi_factor": 0.85, "inversion": "Boundary Rising", "desc": "Pollutants dilute into higher altitude troposphere"},
    {"hour": "14:00", "aqi_factor": 0.70, "inversion": "Optimal Window", "desc": "Daily minimum smog concentration. Best window for flash ventilation"},
    {"hour": "16:00", "aqi_factor": 0.85, "inversion": "Re-inversion Begins", "desc": "Solar angle decreases; boundary layer descends rapidly"},
    {"hour": "18:00", "aqi_factor": 1.15, "inversion": "Evening Trap", "desc": "Evening commute exhaust + night heating trapped as surface cools"},
    {"hour": "20:00", "aqi_factor": 1.25, "inversion": "Severe Trapping", "desc": "Cooking emissions and biomass heating accumulate at street level"},
    {"hour": "22:00", "aqi_factor": 1.20, "inversion": "Night Inversion", "desc": "Wind speeds drop to zero; persistent winter blanket settles"}
]

LIFESTYLE_PERSONAS = [
    {
        "id": "family_toddler",
        "name": "Family with Toddlers & Infants",
        "badge": "High Vulnerability",
        "icon": "baby",
        "key_risk": "Infants breathe 2-3x faster per kg of body weight; lung alveoli developing until age 8.",
        "top_rules": [
            "Never air out baby room before 1:00 PM",
            "Corsi-Rosenthal DIY box in nursery running at low speed continuously",
            "Replace stroller walks with indoor sensory play games",
            "Damp-mop floors daily (dry sweeping kicks up settled ultrafine soot)"
        ]
    },
    {
        "id": "elderly_asthma",
        "name": "Seniors & Respiratory/Cardiac Care",
        "badge": "Critical Health Focus",
        "icon": "heart-pulse",
        "key_risk": "PM2.5 crosses alveoli into bloodstream, causing systemic inflammation, blood clotting, and bronchospasms.",
        "top_rules": [
            "Switch morning park walks to afternoon indoor mobility routine",
            "Keep pulse oximeter and prescribed rescue inhaler pre-warmed",
            "Maintain indoor relative humidity at 42-48% to protect mucosal cilia",
            "Strict N95 fit with exhalation check whenever stepping outdoors"
        ]
    },
    {
        "id": "daily_commuter",
        "name": "Daily Urban Commuter / Transit",
        "badge": "Exposure & Emission Reducer",
        "icon": "bike",
        "key_risk": "Street canyon effect traps vehicular exhaust at tailpipe level, yielding 5x higher PM2.5 + NO2 exposure.",
        "top_rules": [
            "Shift departure 35 minutes earlier or later to avoid peak idling gridlock",
            "Set car AC to strict RECIRCULATE mode with clean cabin HEPA filter",
            "Never use open cloth masks on two-wheelers; use NIOSH-certified N95/FFP2 with silicone seal",
            "Pool trips with neighbors to cut vehicle cold-start emissions"
        ]
    },
    {
        "id": "school_community",
        "name": "School Children & PTA Organizers",
        "badge": "Community Shield",
        "icon": "graduation-cap",
        "key_risk": "Idling school buses and morning physical assembly spike child exposure during the daily inversion peak.",
        "top_rules": [
            "Advocate for 'No-Idling Zones' 200m around school gates",
            "Shift morning physical education (PE) classes to post-lunch indoor gym",
            "Crowdfund DIY Corsi-Rosenthal boxes for classrooms ($65 vs $500 commercial)",
            "Promote neighborhood school carpool walking/driving clusters"
        ]
    },
    {
        "id": "work_from_home",
        "name": "Remote Worker & Apartment Living",
        "badge": "IAQ Optimizer",
        "icon": "home",
        "key_risk": "Sealed apartments with poor air exchange build up indoor CO2 (>1200 ppm) + cooking VOCs + secondary smog seepage.",
        "top_rules": [
            "Schedule 'Flash Ventilation' (cross-breeze for 12 mins) strictly at 2:00 PM",
            "Seal window draft crevices with removable V-seal weatherstripping",
            "Always run kitchen range hood during and 10 mins post cooking",
            "Run bedroom DIY air cleaner on timer 1 hour before sleeping"
        ]
    }
]

DIY_HACKS = [
    {
        "id": "corsi_rosenthal",
        "title": "The Corsi-Rosenthal Box (Legendary Low-Cost DIY Purifier)",
        "category": "Filtration Hardware",
        "rating": "4.9/5 Science-Backed",
        "cost": "$55 - $75 (vs $400+ commercial units)",
        "clean_air_delivery": "450 - 600 CFM (Cleans a 500 sq ft room in 14 mins)",
        "materials": [
            "1x Standard 20\" Box Fan (3-speed, ~$22)",
            "4x 20\"x20\"x2\" MERV 13 (or MERV 14) Furnace Filters (~$10 each)",
            "1x Roll of Heavy-Duty Duct Tape or Gorilla Tape",
            "Cardboard base + 14\" diameter cardboard circle shroud"
        ],
        "why_it_works": "The 4-filter cube offers gigantic surface area (over 30 sq ft of pleated media), dramatically reducing resistance on the fan motor while delivering hospital-grade particulate clearance.",
        "pro_tip": "The Cardboard Shroud hack: Cutting a 14-inch circular opening on the fan faceplate stops air recirculation around blade tips and boosts airflow efficiency by 42%!",
        "lifespan": "6 to 9 months of continuous winter smog operation."
    },
    {
        "id": "airlock_entryway",
        "title": "The 'Airlock' Entryway soot-containment protocol",
        "category": "Home Sealing",
        "rating": "4.8/5 Practical",
        "cost": "$12 - $20",
        "materials": ["Damp microfiber door runner mat", "Shoe rack placed strictly outside/in vestibule", "Coat rack near door"],
        "why_it_works": "Up to 60% of indoor particulate matter is tracked in on shoe soles, jackets, and pet fur. Winter smog soot contains heavy polycyclic aromatic hydrocarbons (PAHs) that adhere to fabric.",
        "pro_tip": "Wipe pet paws and shake coats outside the doorway before stepping into living areas."
    },
    {
        "id": "micro_ventilation_window",
        "title": "Inversion-Smart 'Flash Ventilation' Method",
        "category": "Ventilation Strategy",
        "rating": "4.9/5 Crucial",
        "cost": "$0 (Free)",
        "materials": ["Smartphone alarm / AuraGuard ventilation timer"],
        "why_it_works": "Opening windows in early morning floods your house with peak inversion smog (AQI 400+). Keeping windows sealed all day causes indoor CO2 to exceed 1800 ppm, causing headaches and sluggishness.",
        "pro_tip": "Open opposing windows for exactly 10-15 minutes between 1:30 PM and 3:00 PM when solar convective currents temporarily dilute ground-level smog. Immediately close and run purifiers on High for 20 minutes."
    },
    {
        "id": "active_carbon_cooking",
        "title": "Kitchen Backdraft & Smog Defense",
        "category": "Cooking & Gas Hacks",
        "rating": "4.7/5 Health Essential",
        "cost": "$15 - $30",
        "materials": ["Activated carbon pre-filter pad", "Exhaust hood damper check"],
        "why_it_works": "Cooking on gas produces intense NO2, PM2.5, and acrolein. When outdoor air is bad, turning on an exhaust fan can create negative pressure, pulling toxic smog into your home through cracks.",
        "pro_tip": "Crack open a window in the kitchen slightly while the exhaust fan is running so it draws outside air from the kitchen only, rather than depressurizing your sealed bedrooms."
    },
    {
        "id": "humidity_mucosa_barrier",
        "title": "The 45% Relative Humidity Mucosal Shield",
        "category": "Respiratory Defense",
        "rating": "4.8/5 Medical Science",
        "cost": "$25 (Evaporative or Ultrasonic Humidifier)",
        "materials": ["Hygrometer", "Humidifier or wide ceramic water bowl near radiator"],
        "why_it_works": "Severe winter smog coincides with bone-dry cold indoor air (often RH < 25%). Dry air dries out the nasal mucosa and bronchial cilia, disabling your body's primary mechanical defense against PM2.5.",
        "pro_tip": "Keep room humidity between 40% and 50%. Do not exceed 55% to avoid dust mite and fungal spore proliferation."
    }
]

COMMUNITY_ACTIONS = [
    {
        "id": "school_no_idling",
        "title": "School Gate Anti-Idling Zone",
        "tag": "Child Health Action",
        "impact": "Reduces child PM2.5 exposure by 40% during afternoon pickup",
        "description": "Engage the school administration and parent committee to establish a strict 200m engine-cutoff rule. A single idling SUV produces 20x more toxic emissions than a moving vehicle.",
        "action_steps": [
            "Download AuraGuard's printable Anti-Idling Gate Poster",
            "Propose a 3-minute max drop-off zone",
            "Set up volunteer parent marshals during first 2 smog weeks"
        ]
    },
    {
        "id": "anti_biomass_patrol",
        "title": "Dignified Alternatives to Security Guard Trash Fires",
        "tag": "Neighborhood Social Impact",
        "impact": "Eliminates highly toxic localized dioxin and soot hotspots",
        "description": "During cold winter nights, night watchmen and outdoor workers burn plastic, leaves, and trash to stay warm, creating toxic 1000+ AQI pockets right outside residential gates.",
        "action_steps": [
            "Pool $15/month per household to provide electric radiant heaters or heated vests to guards",
            "Provide thermal windproof cabin insulation or insulated blankets",
            "Direct leaves and garden clippings to local municipal composting pits rather than curbside burning"
        ]
    },
    {
        "id": "carpool_cluster",
        "title": "Neighborhood Commute & School Carpool Pods",
        "tag": "Direct Emission Cut",
        "impact": "Cuts up to 3.2 kg CO2 and 18g tailpipe PM2.5 per family weekly",
        "description": "Cold engine starts during winter mornings run fuel-rich and emit 50% of the entire trip's pollutants in the first 5 minutes. Combining rides eliminates multiple cold-starts.",
        "action_steps": [
            "Group families on the same school or work corridor into 3-4 person pods",
            "Stagger departure by 20 minutes to escape stop-and-go congestion",
            "Use AuraGuard's collective emission savings calculator to track progress"
        ]
    },
    {
        "id": "mesh_sensor_network",
        "title": "Community Hyper-Local AQI Sensor Mesh",
        "tag": "Data Transparency",
        "impact": "Identifies street-level pollution plumes missed by distant official monitors",
        "description": "Government monitoring stations can be 10 km away and report averages. Micro-climates, valley trapping, and road proximity vary dramatically block-by-block.",
        "action_steps": [
            "Set up 1-2 open-source sensors (e.g. PurpleAir or Plantower PMS5003 DIY) per block",
            "Stream readings to community WhatsApp / Slack channels for timely morning alerts"
        ]
    }
]
