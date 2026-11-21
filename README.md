# 🛡️ AuraGuard AI (v2.5 Advanced Telemetry Edition)

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/Ansh1-43/UBAQ-Assistant)

> **Advanced Winter Smog & Atmospheric Command Center: Powered by Gemini 3.8 Flash, Radiosonde Inversion Soundings, Fluid Aerodynamic Particle Simulation, and Alveolar Deposition Mathematics.**

---

## 🌟 What's New in v2.5

### 1. 🎛️ 3D Motion Telemetry & Dynamic Cursor Spotlight
- **Interactive 3D Motion Cards**: Cards respond in real-time to cursor movement with true 3D perspective tilt (`rotateX`, `rotateY`, `scale3d`) and dynamic radial spotlight glow.
- **Cyber-Meteorological Visual Language**: Designed like an advanced NASA/NOAA Atmospheric Command Console with glassmorphism, radar scan overlays, and real-time telemetry metrics.

### 2. 🔬 Rigorous Mathematical & Atmospheric Physics Indices
1. **$BVI$ (Boundary Layer Ventilation Index)**:
   $$\text{BVI} = u_{10} \times H_{mix}$$
   Classifies urban dispersion capacity ($< 2000\,\text{m}^2/\text{s}$ indicates critical stagnation where vertical and horizontal transport cease).
2. **$STI$ (Smog Trap Inversion Strength / Thermal Lapse Rate)**:
   $$\frac{dT}{dz} > 0$$
   Quantifies the positive temperature inversion lid capping cold surface air in $^{\circ}\text{C} / 100\text{m}$.
3. **$ADR$ (Alveolar Deposition Rate - ICRP Respiratory Model)**:
   $$\text{ADR} = C_{PM2.5} \times V_{min} \times F_{alv}$$
   Calculates the exact rate ($\mu g / \text{min}$) at which ultrafine soot penetrates past the bronchial mucociliary escalator directly into deep pulmonary alveoli.
4. **$CVI$ (Cross-Ventilation Safety Influx Ratio)**:
   $$\text{CVI} = \frac{Q_{CO_2\_purge}}{A_{window} \times v_{soot\_influx}}$$
   Assesses the fluid boundary risk of flash cross-ventilation during inversion hours.

### 3. 📊 Creative Meteorological & Physical Graphs
- **Atmospheric Radiosonde Sounding Profile ($0 - 1200\text{m}$)**:
  Simulates radiosonde balloon telemetry showing altitude vs. temperature ($^{\circ}\text{C}$) and particulate stratification, visually revealing the inversion ceiling where warm air traps pollution below.
- **24-Hour Diurnal Boundary Layer Trapping Cycle**:
  Plots hourly AQI variations with distinct peak inversion traps (dawn radiational peak and dusk re-inversion) alongside the highlighted **Solar Convection Flash Vent Pocket** ($1:30\,\text{PM} - 3:00\,\text{PM}$).
- **Digital Twin Dynamic Room Particulate Decay Differential Solution**:
  $$\frac{dC}{dt} = \text{ACH} \cdot C_{out} - \left(\text{ACH} + \frac{\text{CADR}}{V}\right) C(t)$$
  Plots real-time $PM_{2.5}$ concentration decay curves ($0 - 60\,\text{min}$) with live sliders for Room Volume ($m^3$), Purifier CADR (CFM), and Infiltration Rate (ACH).

### 4. 🌪️ Real-Time 2D Particle Aerodynamic Wind-Tunnel Simulator
- An interactive `<canvas>` fluid simulation featuring 140+ dynamic particulate physics agents.
- **Live Filter Interception**: Toggle the MERV 13 / Corsi-Rosenthal filter on/off to watch toxic red/amber soot particles captured in real time and transformed into clean emerald air streams.
- **Cardboard Shroud Fluid Dynamics**: Toggle the cardboard shroud to visualize the elimination of fan blade-tip reverse vortex flow, collimating airflow into a laminar stream with +42% CFM velocity.
- **Interactive Cursor Disturbances**: Move the mouse through the wind-tunnel to simulate aerodynamic pressure gradients and vortex disturbances.

### 5. 🤖 Gemini 3.8 Flash Integration & Domain Reasoning
- Integrated with `gemini-3.8-flash` for high-speed generative routines and contextual chat.
- Built-in failover to high-fidelity domain synthesis when operating without an API key.

---

## 🏃 Launch Instructions

Open your browser to:
**[http://127.0.0.1:8000](http://127.0.0.1:8000)**

Run anytime locally via:
```bash
python main.py
```
or double-click `run_app.bat`.
