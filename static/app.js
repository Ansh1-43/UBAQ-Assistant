/**
 * AuraGuard AI - Advanced Frontend Controller
 * Atmospheric physics, 3D card motion, particle aerodynamic sandbox,
 * mathematical indices, differential room decay, and GenAI routine synthesis.
 */

// Application State
let appState = {
  currentCityKey: 'delhi',
  cityData: null,
  citiesList: {},
  diurnalPattern: [],
  advancedTelemetry: null,
  aerodynamicSpectrum: [],
  personas: [],
  hacks: [],
  community: [],
  geminiApiKey: localStorage.getItem('auraguard_gemini_key') || '',
  soundEnabled: true,
  audioCtx: null,
  ambientOsc: null,
  activeTab: 'radar',
  auditCompletedCount: 0,
  chatHistory: [],
  
  // Particle Simulator State
  particleSim: {
    running: true,
    filterActive: true,
    shroudActive: true,
    particles: [],
    capturedCount: 0,
    mouseX: -1000,
    mouseY: -1000,
    canvas: null,
    ctx: null,
    animId: null
  }
};

// Initialize Application on DOM Ready
document.addEventListener('DOMContentLoaded', async () => {
  lucide.createIcons();
  checkApiKeyStatus();
  await loadCities();
  await loadCityDetails(appState.currentCityKey);
  await loadAdvancedTelemetry(appState.currentCityKey);
  await loadAerodynamicSpectrum();
  await loadHacksAndCommunity();
  
  setupDiurnalChart();
  setupSoundingChart();
  setupDecayChart();
  
  startVentilationCountdown();
  runImpactCalc();
  runRoomDecaySim();
  initParticleSimulator();
  
  // Auto-generate initial routine preview
  triggerGenerateRoutine();
});

// 3D Motion Card Tilt Handlers
function handleCardTilt(e, card) {
  const rect = card.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;
  
  const rotateX = ((y - centerY) / centerY) * -7;
  const rotateY = ((x - centerX) / centerX) * 7;
  
  card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.015, 1.015, 1.015)`;
  card.style.setProperty('--mouse-x', `${x}px`);
  card.style.setProperty('--mouse-y', `${y}px`);
}

function resetCardTilt(card) {
  card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
}

// Sound Synthesizer via Web Audio API
function initAudio() {
  if (!appState.audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      appState.audioCtx = new AudioContext();
    }
  }
}

function playCleanAirChime() {
  if (!appState.soundEnabled) return;
  try {
    initAudio();
    if (!appState.audioCtx) return;
    const now = appState.audioCtx.currentTime;
    
    // Harmonic clean air triad (528 Hz - Solfeggio clean energy, 660 Hz, 792 Hz)
    [528, 660, 792].forEach((freq, idx) => {
      const osc = appState.audioCtx.createOscillator();
      const gain = appState.audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.07);
      
      gain.gain.setValueAtTime(0.08, now + idx * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.07 + 1.2);
      
      osc.connect(gain);
      gain.connect(appState.audioCtx.destination);
      osc.start(now + idx * 0.07);
      osc.stop(now + idx * 0.07 + 1.25);
    });
  } catch (e) {
    console.warn("Audio synthesis error:", e);
  }
}

function playWarningTone() {
  if (!appState.soundEnabled) return;
  try {
    initAudio();
    if (!appState.audioCtx) return;
    const now = appState.audioCtx.currentTime;
    const osc = appState.audioCtx.createOscillator();
    const gain = appState.audioCtx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.linearRampToValueAtTime(180, now + 0.35);
    
    gain.gain.setValueAtTime(0.09, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
    
    osc.connect(gain);
    gain.connect(appState.audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.45);
  } catch (e) {
    console.warn("Audio warning error:", e);
  }
}

function toggleSound() {
  appState.soundEnabled = !appState.soundEnabled;
  const icon = document.getElementById('soundIcon');
  if (appState.soundEnabled) {
    icon.setAttribute('data-lucide', 'volume-2');
    playCleanAirChime();
  } else {
    icon.setAttribute('data-lucide', 'volume-x');
  }
  lucide.createIcons();
}

// Tab Switching
function switchTab(tabId) {
  appState.activeTab = tabId;
  const tabs = ['radar', 'simulator', 'routine', 'chat', 'impact', 'hacks', 'community'];
  
  tabs.forEach(t => {
    const el = document.getElementById(`tab-${t}`);
    const btn = document.getElementById(`tabBtn-${t}`);
    if (el) {
      if (t === tabId) {
        el.classList.remove('hidden');
      } else {
        el.classList.add('hidden');
      }
    }
    if (btn) {
      if (t === tabId) {
        btn.className = "tab-btn active flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-medium transition bg-cyan-500/20 text-cyan-300 border border-cyan-500/40";
      } else {
        btn.className = "tab-btn flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-medium transition text-slate-400 hover:text-white hover:bg-slate-800/60";
      }
    }
  });

  if (tabId === 'radar') {
    if (window.diurnalChartInstance) window.diurnalChartInstance.update();
    if (window.soundingChartInstance) window.soundingChartInstance.update();
  }
  if (tabId === 'simulator') {
    if (!appState.particleSim.running) {
      appState.particleSim.running = true;
      requestAnimationFrame(particleLoop);
    }
    if (window.decayChartInstance) window.decayChartInstance.update();
  }
  if (tabId === 'impact') {
    runImpactCalc();
  }
}

// Load Cities List
async function loadCities() {
  try {
    const res = await fetch('/api/cities');
    if (res.ok) {
      appState.citiesList = await res.json();
    }
  } catch (err) {
    console.error("Error loading cities:", err);
  }
}

// Load City Details
async function loadCityDetails(cityKey) {
  try {
    const res = await fetch(`/api/city/${cityKey}`);
    if (res.ok) {
      const data = await res.json();
      appState.cityData = data.city;
      appState.diurnalPattern = data.diurnal_cycle;
      updateRadarUI();
    }
  } catch (err) {
    console.error("Error loading city telemetry:", err);
  }
}

// Load Advanced Atmospheric Indices & Sounding Profile
async function loadAdvancedTelemetry(cityKey) {
  try {
    const res = await fetch(`/api/advanced-telemetry/${cityKey}`);
    if (res.ok) {
      const data = await res.json();
      appState.advancedTelemetry = data;
      updateAdvancedIndicesUI(data.indices);
      renderSoundingChart(data.sounding_profile);
    }
  } catch (err) {
    console.error("Error loading advanced telemetry:", err);
  }
}

// Load Aerodynamic Particulate Spectrum
async function loadAerodynamicSpectrum() {
  try {
    const res = await fetch('/api/aerodynamic-spectrum');
    if (res.ok) {
      appState.aerodynamicSpectrum = await res.json();
      renderSpectrumTable();
    }
  } catch (err) {
    console.error("Error loading aerodynamic spectrum:", err);
  }
}

function renderSpectrumTable() {
  const tbody = document.getElementById('spectrumTableBody');
  if (!tbody) return;
  tbody.innerHTML = '';

  appState.aerodynamicSpectrum.forEach(item => {
    const row = document.createElement('tr');
    row.className = 'hover:bg-slate-800/40 transition border-b border-slate-800/40';
    row.innerHTML = `
      <td class="px-4 py-3 font-semibold text-white flex items-center gap-2">
        <span class="w-2 h-2 rounded-full ${item.size_um <= 0.3 ? 'bg-rose-500' : 'bg-amber-400'}"></span>
        ${item.particle}
      </td>
      <td class="px-3 py-3 font-mono text-cyan-300 font-bold">${item.size_um} µm</td>
      <td class="px-3 py-3 text-slate-300 text-[11px] leading-relaxed">${item.hazard}</td>
      <td class="px-3 py-3 font-mono font-bold text-cyan-400">${item.hepa_eff}%</td>
      <td class="px-3 py-3 font-mono font-bold text-emerald-400">${item.merv13_eff}%</td>
      <td class="px-3 py-3 font-mono font-bold text-rose-400">${item.cloth_eff}%</td>
    `;
    tbody.appendChild(row);
  });
}

function switchCity(cityKey) {
  appState.currentCityKey = cityKey;
  loadCityDetails(cityKey);
  loadAdvancedTelemetry(cityKey);
  playWarningTone();
}

function updateRadarUI() {
  const c = appState.cityData;
  if (!c) return;

  document.getElementById('aqiNumber').textContent = c.aqi;
  document.getElementById('aqiBadge').textContent = c.category;
  document.getElementById('pm25Val').textContent = c.pm25.toFixed(1);
  document.getElementById('pm10Val').textContent = c.pm10.toFixed(1);
  document.getElementById('bannerWindowTime').textContent = c.safe_ventilation_window;

  // Set ambient atmospheric fog glow based on AQI
  const fog = document.getElementById('ambientFog');
  if (c.aqi > 300) {
    fog.style.background = 'radial-gradient(circle at 50% -25%, rgba(239, 68, 68, 0.3), transparent 75%)';
    document.getElementById('aqiBadge').className = 'px-2 py-0.5 rounded-full text-xs font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30';
  } else if (c.aqi > 200) {
    fog.style.background = 'radial-gradient(circle at 50% -25%, rgba(168, 85, 247, 0.25), transparent 75%)';
    document.getElementById('aqiBadge').className = 'px-2 py-0.5 rounded-full text-xs font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30';
  } else if (c.aqi > 100) {
    fog.style.background = 'radial-gradient(circle at 50% -25%, rgba(245, 158, 11, 0.2), transparent 75%)';
    document.getElementById('aqiBadge').className = 'px-2 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30';
  } else {
    fog.style.background = 'radial-gradient(circle at 50% -25%, rgba(16, 185, 129, 0.2), transparent 75%)';
    document.getElementById('aqiBadge').className = 'px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
  }

  renderDiurnalChart();
}

function updateAdvancedIndicesUI(indices) {
  if (!indices) return;

  const bvi = indices.bvi;
  const sti = indices.sti;
  const adr = indices.adr;
  const cvi = indices.cvi;

  document.getElementById('bviNumber').textContent = bvi.value;
  document.getElementById('bviRating').textContent = `${bvi.rating} (${bvi.value < 2000 ? '< 2000' : 'Safe'})`;
  document.getElementById('bviHmix').textContent = `${bvi.mixing_height_m}m`;
  document.getElementById('bviWind').textContent = `${bvi.wind_ms} m/s`;

  document.getElementById('stiGradient').textContent = `${sti.gradient > 0 ? '+' : ''}${sti.gradient}°C`;
  document.getElementById('stiCategory').textContent = sti.category;

  document.getElementById('adrNumber').textContent = adr.value;

  // Matrix section
  document.getElementById('matrixBvi').textContent = `${bvi.value} m²/s`;
  document.getElementById('matrixSti').textContent = `${sti.gradient > 0 ? '+' : ''}${sti.gradient} °C / 100m`;
  document.getElementById('matrixAdr').textContent = `${adr.value} µg / min`;
  document.getElementById('matrixCvi').textContent = `${cvi.ratio} (${cvi.status.split('(')[0].trim()})`;
}

// Chart 1: Diurnal Chart
function setupDiurnalChart() {
  const ctx = document.getElementById('diurnalChart').getContext('2d');
  const labels = ['00:00', '03:00', '06:00', '08:00', '10:00', '12:00', '14:00 (Vent)', '16:00', '18:00', '20:00', '22:00'];
  const baseAqi = 380;
  const factors = [1.15, 1.25, 1.35, 1.30, 1.10, 0.85, 0.70, 0.85, 1.15, 1.25, 1.20];
  const data = factors.map(f => Math.round(baseAqi * f));

  window.diurnalChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Ground Smog Inversion AQI',
          data: data,
          borderColor: '#06b6d4',
          borderWidth: 2.5,
          tension: 0.4,
          fill: true,
          backgroundColor: (context) => {
            const chart = context.chart;
            const { ctx, chartArea } = chart;
            if (!chartArea) return null;
            const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
            gradient.addColorStop(0, 'rgba(6, 182, 212, 0.35)');
            gradient.addColorStop(0.6, 'rgba(239, 68, 68, 0.15)');
            gradient.addColorStop(1, 'rgba(16, 185, 129, 0.02)');
            return gradient;
          },
          pointBackgroundColor: (context) => {
            return context.dataIndex === 6 ? '#10b981' : '#06b6d4';
          },
          pointRadius: (context) => context.dataIndex === 6 ? 7 : 4,
          pointHoverRadius: 8
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(6, 9, 17, 0.95)',
          borderColor: 'rgba(6, 182, 212, 0.4)',
          borderWidth: 1,
          padding: 10,
          callbacks: {
            label: (ctx) => ` AQI: ${ctx.parsed.y} ${ctx.dataIndex === 6 ? '✨ Safe Flash Vent Pocket' : '(Inversion Trap)'}`
          }
        }
      },
      scales: {
        x: {
          grid: { color: 'rgba(255, 255, 255, 0.04)' },
          ticks: { color: '#94a3b8', font: { size: 10, family: 'JetBrains Mono' } }
        },
        y: {
          grid: { color: 'rgba(255, 255, 255, 0.04)' },
          ticks: { color: '#94a3b8', font: { size: 10, family: 'JetBrains Mono' } }
        }
      }
    }
  });
}

function renderDiurnalChart() {
  if (!window.diurnalChartInstance || !appState.cityData) return;
  const baseAqi = appState.cityData.aqi;
  const factors = [1.15, 1.25, 1.35, 1.30, 1.10, 0.85, 0.70, 0.85, 1.15, 1.25, 1.20];
  const newData = factors.map(f => Math.round(baseAqi * f));
  window.diurnalChartInstance.data.datasets[0].data = newData;
  window.diurnalChartInstance.update();
}

// Chart 2: Radiosonde Sounding Chart (Altitude vs Temperature & PM2.5 Stratification)
function setupSoundingChart() {
  const ctx = document.getElementById('soundingChart').getContext('2d');
  
  window.soundingChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['0m', '50m', '100m', '150m', '200m', '300m', '500m', '750m', '1000m', '1200m'],
      datasets: [
        {
          label: 'Temperature (°C)',
          data: [11.0, 12.2, 13.5, 14.8, 15.5, 14.7, 13.4, 11.8, 10.2, 8.8],
          borderColor: '#c084fc',
          borderWidth: 2,
          tension: 0.3,
          yAxisID: 'yTemp'
        },
        {
          label: 'PM2.5 Density Factor',
          data: [1.0, 0.95, 0.90, 0.82, 0.75, 0.35, 0.12, 0.05, 0.04, 0.03],
          borderColor: '#ef4444',
          borderWidth: 2,
          borderDash: [4, 4],
          tension: 0.3,
          yAxisID: 'yPm'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: { color: '#cbd5e1', font: { size: 10, family: 'JetBrains Mono' } }
        },
        tooltip: {
          backgroundColor: 'rgba(6, 9, 17, 0.95)',
          borderColor: 'rgba(192, 132, 252, 0.4)',
          borderWidth: 1
        }
      },
      scales: {
        x: {
          grid: { color: 'rgba(255, 255, 255, 0.04)' },
          ticks: { color: '#94a3b8', font: { size: 10, family: 'JetBrains Mono' } }
        },
        yTemp: {
          type: 'linear',
          position: 'left',
          grid: { color: 'rgba(255, 255, 255, 0.04)' },
          ticks: { color: '#c084fc', font: { size: 10, family: 'JetBrains Mono' } },
          title: { display: true, text: 'Temp (°C)', color: '#c084fc' }
        },
        yPm: {
          type: 'linear',
          position: 'right',
          grid: { drawOnChartArea: false },
          ticks: { color: '#ef4444', font: { size: 10, family: 'JetBrains Mono' } },
          title: { display: true, text: 'PM2.5 Factor', color: '#ef4444' }
        }
      }
    }
  });
}

function renderSoundingChart(soundingProfile) {
  if (!window.soundingChartInstance || !soundingProfile) return;
  const labels = soundingProfile.map(p => `${p.altitude_m}m`);
  const temps = soundingProfile.map(p => p.temp_c);
  const pms = soundingProfile.map(p => p.pm25_factor);

  window.soundingChartInstance.data.labels = labels;
  window.soundingChartInstance.data.datasets[0].data = temps;
  window.soundingChartInstance.data.datasets[1].data = pms;
  window.soundingChartInstance.update();
}

// Chart 3: Digital Twin Room Particulate Decay Differential Equation
function setupDecayChart() {
  const ctx = document.getElementById('decayChart').getContext('2d');
  
  window.decayChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['0m', '5m', '10m', '15m', '20m', '25m', '30m', '35m', '40m', '45m', '50m', '55m', '60m'],
      datasets: [
        {
          label: 'Indoor PM2.5 Concentration (µg/m³)',
          data: [210, 142, 98, 68, 48, 34, 25, 19, 15, 13, 12, 11, 10.8],
          borderColor: '#10b981',
          borderWidth: 2.5,
          tension: 0.35,
          fill: true,
          backgroundColor: 'rgba(16, 185, 129, 0.1)'
        },
        {
          label: 'WHO Clean Air Target (15 µg/m³)',
          data: Array(13).fill(15),
          borderColor: '#38bdf8',
          borderWidth: 1.5,
          borderDash: [6, 6],
          pointRadius: 0
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: { color: '#cbd5e1', font: { size: 10, family: 'JetBrains Mono' } }
        },
        tooltip: {
          backgroundColor: 'rgba(6, 9, 17, 0.95)',
          borderColor: 'rgba(16, 185, 129, 0.4)',
          borderWidth: 1
        }
      },
      scales: {
        x: {
          grid: { color: 'rgba(255, 255, 255, 0.04)' },
          ticks: { color: '#94a3b8', font: { size: 10, family: 'JetBrains Mono' } }
        },
        y: {
          grid: { color: 'rgba(255, 255, 255, 0.04)' },
          ticks: { color: '#10b981', font: { size: 10, family: 'JetBrains Mono' } },
          title: { display: true, text: 'PM2.5 (µg/m³)', color: '#10b981' }
        }
      }
    }
  });
}

async function runRoomDecaySim() {
  const roomVol = parseFloat(document.getElementById('dtRoomVol').value);
  const cadr = parseFloat(document.getElementById('dtCadr').value);
  const ach = parseFloat(document.getElementById('dtAch').value);

  document.getElementById('dtRoomVolVal').textContent = `${roomVol.toFixed(1)} m³`;
  document.getElementById('dtCadrVal').textContent = `${cadr} CFM`;
  document.getElementById('dtAchVal').textContent = `${ach.toFixed(2)} ACH`;

  const outdoorPm25 = appState.cityData ? appState.cityData.pm25 : 280.0;

  try {
    const res = await fetch('/api/simulate-room-decay', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        room_volume_m3: roomVol,
        cadr_cfm: cadr,
        infiltration_ach: ach,
        outdoor_pm25: outdoorPm25
      })
    });

    if (res.ok) {
      const data = await res.json();
      const points = data.decay_curve;
      
      const labels = points.map(p => `${p.minute}m`);
      const pmVals = points.map(p => p.pm25);

      if (window.decayChartInstance) {
        window.decayChartInstance.data.labels = labels;
        window.decayChartInstance.data.datasets[0].data = pmVals;
        window.decayChartInstance.data.datasets[1].data = Array(points.length).fill(15);
        window.decayChartInstance.update();
      }

      // Find time to target < 15
      const targetPoint = points.find(p => p.pm25 <= 15.0);
      const steadyPoint = points[points.length - 1];

      document.getElementById('dtTimeToTarget').textContent = targetPoint ? `~${targetPoint.minute} minutes` : '> 60 minutes';
      document.getElementById('dtSteadyStateVal').textContent = `${steadyPoint.pm25} µg/m³`;
    }
  } catch (err) {
    console.error("Room decay simulation error:", err);
  }
}

// ========================================================
// REAL-TIME 2D AERODYNAMIC PARTICLE WIND-TUNNEL SIMULATOR
// ========================================================
function initParticleSimulator() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;

  appState.particleSim.canvas = canvas;
  appState.particleSim.ctx = canvas.getContext('2d');

  function resizeCanvas() {
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = 260;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Track mouse
  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    appState.particleSim.mouseX = e.clientX - rect.left;
    appState.particleSim.mouseY = e.clientY - rect.top;
  });

  canvas.addEventListener('mouseleave', () => {
    appState.particleSim.mouseX = -1000;
    appState.particleSim.mouseY = -1000;
  });

  // Spawn 140 initial particles
  appState.particleSim.particles = [];
  for (let i = 0; i < 140; i++) {
    spawnParticle(true);
  }

  requestAnimationFrame(particleLoop);
}

function spawnParticle(randomX = false) {
  const canvas = appState.particleSim.canvas;
  if (!canvas) return;

  const isUltrafine = Math.random() < 0.65;
  appState.particleSim.particles.push({
    x: randomX ? Math.random() * canvas.width : Math.random() * -40,
    y: Math.random() * canvas.height,
    vx: 1.8 + Math.random() * 2.2,
    vy: (Math.random() - 0.5) * 0.8,
    radius: isUltrafine ? 1.5 : 3.0,
    isUltrafine: isUltrafine,
    filtered: false,
    alpha: 0.85
  });
}

function particleLoop() {
  if (!appState.particleSim.running) return;

  const sim = appState.particleSim;
  const ctx = sim.ctx;
  const canvas = sim.canvas;
  if (!ctx || !canvas) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const filterX = canvas.width * 0.5;

  // Draw Airflow Streamlines
  ctx.strokeStyle = 'rgba(6, 182, 212, 0.04)';
  ctx.lineWidth = 1;
  for (let y = 20; y < canvas.height; y += 30) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }

  // Draw Filter Barrier Media in Center
  if (sim.filterActive) {
    ctx.fillStyle = 'rgba(6, 182, 212, 0.15)';
    ctx.fillRect(filterX - 8, 10, 16, canvas.height - 20);

    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 2.5;
    ctx.setLineDash([6, 6]);
    ctx.beginPath();
    ctx.moveTo(filterX, 10);
    ctx.lineTo(filterX, canvas.height - 10);
    ctx.stroke();
    ctx.setLineDash([]);

    // Filter label
    ctx.fillStyle = '#38bdf8';
    ctx.font = '10px JetBrains Mono';
    ctx.fillText('MERV 13 / C-R BOX FILTER MEDIA', filterX - 85, 22);
  } else {
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(filterX, 10);
    ctx.lineTo(filterX, canvas.height - 10);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#ef4444';
    ctx.font = '10px JetBrains Mono';
    ctx.fillText('UNFILTERED OPEN AIRWAY', filterX - 60, 22);
  }

  // Update & Draw Particles
  for (let i = sim.particles.length - 1; i >= 0; i--) {
    const p = sim.particles[i];

    // Mouse fluid disturbance
    const dx = p.x - sim.mouseX;
    const dy = p.y - sim.mouseY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 80 && dist > 0) {
      p.vx += (dx / dist) * 0.4;
      p.vy += (dy / dist) * 0.4;
    }

    // Shroud effect: accelerates laminar flow when filtered
    if (p.filtered && sim.shroudActive) {
      p.vx = Math.min(6.5, p.vx * 1.02);
      p.vy *= 0.94; // Laminar collimation
    }

    p.x += p.vx;
    p.y += p.vy;

    // Boundary bounces
    if (p.y < 5) { p.y = 5; p.vy *= -1; }
    if (p.y > canvas.height - 5) { p.y = canvas.height - 5; p.vy *= -1; }

    // Filter interception
    if (sim.filterActive && !p.filtered && p.x >= filterX - 8 && p.x <= filterX + 8) {
      // 95% capture efficiency
      if (Math.random() < 0.948) {
        sim.capturedCount++;
        p.filtered = true;
        // Turn into clean oxygen/emerald particle
        p.radius = 1.2;
      }
    }

    // Draw particle
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    if (p.filtered) {
      ctx.fillStyle = 'rgba(16, 185, 129, 0.9)'; // Clean Emerald
      ctx.shadowColor = '#10b981';
      ctx.shadowBlur = 4;
    } else {
      ctx.fillStyle = p.isUltrafine ? 'rgba(239, 68, 68, 0.85)' : 'rgba(245, 158, 11, 0.75)'; // Soot Amber/Red
      ctx.shadowBlur = 0;
    }
    ctx.fill();

    // Respawn if off screen
    if (p.x > canvas.width + 20) {
      sim.particles.splice(i, 1);
      spawnParticle(false);
    }
  }

  // Update telemetry overlay
  const capturedEl = document.getElementById('canvasCapturedCount');
  if (capturedEl) capturedEl.textContent = `${sim.capturedCount} soot particles`;

  requestAnimationFrame(particleLoop);
}

function toggleCanvasFilter() {
  appState.particleSim.filterActive = !appState.particleSim.filterActive;
  const btn = document.getElementById('btnToggleFilter');
  const txt = document.getElementById('filterStatusText');
  const effEl = document.getElementById('canvasEffVal');

  if (appState.particleSim.filterActive) {
    btn.className = "px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/25";
    txt.textContent = "C-R Filter: ACTIVE";
    effEl.textContent = "94.8%";
    playCleanAirChime();
  } else {
    btn.className = "px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 bg-rose-900/80 hover:bg-rose-800 text-rose-200 border border-rose-700";
    txt.textContent = "C-R Filter: BYPASSED";
    effEl.textContent = "0.0%";
    playWarningTone();
  }
}

function toggleCanvasShroud() {
  appState.particleSim.shroudActive = !appState.particleSim.shroudActive;
  const txt = document.getElementById('shroudStatusText');
  const airflowEl = document.getElementById('canvasAirflowVal');

  if (appState.particleSim.shroudActive) {
    txt.textContent = "Shroud: ON (+42% CFM)";
    airflowEl.textContent = "520 CFM";
    playCleanAirChime();
  } else {
    txt.textContent = "Shroud: OFF (Turbulent)";
    airflowEl.textContent = "365 CFM";
  }
}

// Ventilation Countdown Timer
function startVentilationCountdown() {
  function update() {
    const now = new Date();
    const target = new Date();
    target.setHours(13, 30, 0, 0);

    let diff = target - now;
    if (diff <= 0 && now.getHours() < 15) {
      document.getElementById('countdownTimer').innerHTML = '<span class="text-emerald-400 font-bold animate-pulse">VENT WINDOW ACTIVE (Flash 12m)</span>';
      return;
    }
    if (diff < 0) {
      target.setDate(target.getDate() + 1);
      diff = target - now;
    }

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);
    document.getElementById('countdownTimer').textContent = `Vent Window in: ${String(hours).padStart(2, '0')}h ${String(mins).padStart(2, '0')}m ${String(secs).padStart(2, '0')}s`;
  }
  update();
  setInterval(update, 1000);
}

// Load IAQ Hacks & Community Actions
async function loadHacksAndCommunity() {
  try {
    const [resHacks, resComm] = await Promise.all([
      fetch('/api/hacks'),
      fetch('/api/community')
    ]);
    if (resHacks.ok) {
      appState.hacks = await resHacks.json();
      renderHacks();
    }
    if (resComm.ok) {
      appState.community = await resComm.json();
    }
  } catch (err) {
    console.error("Error loading hacks/community:", err);
  }
}

function renderHacks() {
  const container = document.getElementById('dynamicHacksContainer');
  if (!container) return;
  container.innerHTML = '';

  appState.hacks.slice(1).forEach(h => {
    const card = document.createElement('div');
    card.className = 'motion-card glass-card p-5 rounded-2xl space-y-3';
    card.setAttribute('onmousemove', 'handleCardTilt(event, this)');
    card.setAttribute('onmouseleave', 'resetCardTilt(this)');
    card.innerHTML = `
      <div class="spotlight"></div>
      <div class="flex items-center justify-between">
        <span class="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 font-medium font-mono border border-cyan-500/20">${h.category}</span>
        <span class="text-xs text-amber-400 font-mono font-medium">${h.rating}</span>
      </div>
      <h3 class="text-sm font-bold text-white font-['Space_Grotesk']">${h.title}</h3>
      <p class="text-xs text-slate-300 leading-relaxed">${h.why_it_works}</p>
      <div class="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-emerald-300 font-mono">
        <strong>Pro-Tip:</strong> ${h.pro_tip}
      </div>
      <div class="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-slate-800/80 font-mono">
        <span>Cost: <strong class="text-slate-200">${h.cost}</strong></span>
        <span>Hardware: <strong class="text-slate-200">${(h.materials || []).join(', ')}</strong></span>
      </div>
    `;
    container.appendChild(card);
  });
}

function updateAuditScore() {
  let count = 0;
  for (let i = 1; i <= 6; i++) {
    const chk = document.getElementById(`chkAudit${i}`);
    if (chk && chk.checked) count++;
  }
  appState.auditCompletedCount = count;
  const badge = document.getElementById('auditScoreBadge');
  badge.textContent = `${count} / 6 Completed`;
  if (count === 6) {
    badge.className = 'text-xs px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono font-bold';
    triggerConfetti();
    playCleanAirChime();
  } else {
    badge.className = 'text-xs px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 font-mono font-bold';
  }
}

function triggerConfetti() {
  if (window.confetti) {
    window.confetti({
      particleCount: 90,
      spread: 75,
      origin: { y: 0.6 }
    });
  }
}

// GenAI Routine Generator
async function triggerGenerateRoutine() {
  const btn = document.getElementById('generateRoutineBtn');
  const loading = document.getElementById('routineLoading');
  const card = document.getElementById('routineContentCard');
  const mdOutput = document.getElementById('routineMarkdownOutput');
  
  if (btn) btn.disabled = true;
  if (loading) loading.classList.remove('hidden');
  if (card) card.classList.add('opacity-50');

  const payload = {
    city: appState.cityData ? appState.cityData.name : 'Delhi NCR',
    aqi: appState.cityData ? appState.cityData.aqi : 382,
    persona_id: document.getElementById('routinePersona').value,
    persona_name: document.getElementById('routinePersona').selectedOptions[0].text,
    housing: document.getElementById('routineHousing').value,
    heating: document.getElementById('routineHeating').value,
    commute_mode: document.getElementById('routineCommute').value,
    has_purifier: document.getElementById('routineHasPurifier').checked,
    gemini_api_key: appState.geminiApiKey || undefined
  };

  try {
    const res = await fetch('/api/routine', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      const data = await res.json();
      mdOutput.innerHTML = marked.parse(data.content);
      document.getElementById('routineTimestamp').textContent = `Generated for ${payload.persona_name} • ${new Date().toLocaleTimeString()}`;
      document.getElementById('routineSourceBadge').textContent = data.source === 'gemini-live' ? '✨ Live Google Gemini 2.5' : '⚡ AuraGuard Domain AI';
      playCleanAirChime();
    }
  } catch (err) {
    console.error("Error generating routine:", err);
    mdOutput.innerHTML = `<p class="text-rose-400">Error generating routine. Please verify network or try again.</p>`;
  } finally {
    if (btn) btn.disabled = false;
    if (loading) loading.classList.add('hidden');
    if (card) card.classList.remove('opacity-50');
  }
}

// GenAI Chat Assistant
async function handleChatSubmit(e) {
  e.preventDefault();
  const input = document.getElementById('chatInput');
  const message = input.value.trim();
  if (!message) return;

  appendChatMessage('user', message);
  input.value = '';

  const placeholderId = appendTypingIndicator();

  try {
    const payload = {
      message: message,
      history: appState.chatHistory,
      city: appState.cityData ? appState.cityData.name : 'Delhi NCR',
      aqi: appState.cityData ? appState.cityData.aqi : 382,
      persona_name: document.getElementById('routinePersona').selectedOptions[0].text,
      gemini_api_key: appState.geminiApiKey || undefined
    };

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    removeTypingIndicator(placeholderId);

    if (res.ok) {
      const data = await res.json();
      appendChatMessage('assistant', data.reply);
      appState.chatHistory.push({ role: 'user', content: message });
      appState.chatHistory.push({ role: 'assistant', content: data.reply });
      playCleanAirChime();
    } else {
      appendChatMessage('assistant', 'Sorry, I encountered an error processing your query. Please try again.');
    }
  } catch (err) {
    removeTypingIndicator(placeholderId);
    console.error("Chat error:", err);
    appendChatMessage('assistant', 'Network communication error. Please check your connection.');
  }
}

function sendQuickPrompt(promptText) {
  switchTab('chat');
  const input = document.getElementById('chatInput');
  input.value = promptText;
  document.getElementById('chatForm').dispatchEvent(new Event('submit'));
}

function appendChatMessage(role, content) {
  const container = document.getElementById('chatMessages');
  const msgDiv = document.createElement('div');
  msgDiv.className = 'flex gap-3 ' + (role === 'user' ? 'justify-end' : '');

  if (role === 'assistant') {
    msgDiv.innerHTML = `
      <div class="w-8 h-8 rounded-full bg-cyan-500/20 flex-shrink-0 flex items-center justify-center text-cyan-400">
        <i data-lucide="bot" class="w-4 h-4"></i>
      </div>
      <div class="glass-card p-4 rounded-2xl rounded-tl-none max-w-2xl text-xs sm:text-sm text-slate-200 markdown-body">
        ${marked.parse(content)}
      </div>
    `;
  } else {
    msgDiv.innerHTML = `
      <div class="bg-cyan-600/90 text-white p-3.5 rounded-2xl rounded-tr-none max-w-lg text-xs sm:text-sm shadow-md">
        ${content}
      </div>
    `;
  }

  container.appendChild(msgDiv);
  container.scrollTop = container.scrollHeight;
  lucide.createIcons();
}

function appendTypingIndicator() {
  const container = document.getElementById('chatMessages');
  const id = 'typing-' + Date.now();
  const div = document.createElement('div');
  div.id = id;
  div.className = 'flex gap-3';
  div.innerHTML = `
    <div class="w-8 h-8 rounded-full bg-cyan-500/20 flex-shrink-0 flex items-center justify-center text-cyan-400 animate-pulse">
      <i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i>
    </div>
    <div class="glass-card p-3 rounded-2xl rounded-tl-none text-xs text-slate-400 flex items-center gap-1.5 font-mono">
      <span>AuraGuard AI analyzing telemetry...</span>
    </div>
  `;
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
  lucide.createIcons();
  return id;
}

function removeTypingIndicator(id) {
  const el = document.getElementById(id);
  if (el) el.remove();
}

function clearChat() {
  const container = document.getElementById('chatMessages');
  container.innerHTML = `
    <div class="flex gap-3">
      <div class="w-8 h-8 rounded-full bg-cyan-500/20 flex-shrink-0 flex items-center justify-center text-cyan-400">
        <i data-lucide="shield" class="w-4 h-4"></i>
      </div>
      <div class="glass-card p-4 rounded-2xl rounded-tl-none max-w-2xl text-xs sm:text-sm text-slate-200 markdown-body">
        <p><strong>Chat memory reset.</strong> How can I assist your family today with winter smog or IAQ hacks?</p>
      </div>
    </div>
  `;
  appState.chatHistory = [];
  lucide.createIcons();
}

// Scientific Impact Calculation
async function runImpactCalc() {
  const outdoorHours = parseFloat(document.getElementById('sliderOutdoorHours').value);
  const commuteKm = parseFloat(document.getElementById('sliderCommuteKm').value);
  const familySize = parseInt(document.getElementById('sliderFamilySize').value);

  document.getElementById('sliderOutdoorHoursVal').textContent = `${outdoorHours.toFixed(1)} hrs`;
  document.getElementById('sliderCommuteKmVal').textContent = `${commuteKm} km`;
  document.getElementById('sliderFamilySizeVal').textContent = `${familySize} ${familySize === 1 ? 'person' : 'persons'}`;

  const payload = {
    outdoor_aqi: appState.cityData ? appState.cityData.aqi : 380,
    outdoor_hours: outdoorHours,
    mask_type: document.getElementById('calcMaskType').value,
    has_indoor_purifier: document.getElementById('calcHasPurifier').checked,
    flash_ventilation_used: document.getElementById('calcFlashVentilation').checked,
    commute_mode: document.getElementById('calcCommuteMode').value,
    commute_km_daily: commuteKm,
    heating_source: document.getElementById('calcHeatingSource').value,
    family_size: familySize
  };

  try {
    const res = await fetch('/api/impact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      const data = await res.json();
      const p = data.personal;
      const c = data.community;

      document.getElementById('impactReductionBadge').textContent = `-${p.reduction_percentage}% PM2.5 Intake`;
      document.getElementById('valFamilyAvoidedUg').textContent = `${p.total_family_avoided_ug} µg`;
      document.getElementById('valCigsAvoided').textContent = `~${p.cigarette_equivalent_avoided_daily} / day`;
      document.getElementById('valBaselineUg').textContent = `${p.baseline_inhaled_ug} µg / person`;
      document.getElementById('valProtectedUg').textContent = `${p.protected_inhaled_ug} µg / person`;

      const remainingPct = Math.max(5, Math.min(100, Math.round(100 - p.reduction_percentage)));
      document.getElementById('protectedProgressBar').style.width = `${remainingPct}%`;

      document.getElementById('valCo2SavedKg').textContent = `${c.daily_co2_saved_kg} kg`;
      document.getElementById('valPm25SavedG').textContent = `${c.daily_pm25_saved_g} g`;
      document.getElementById('valNoxSavedG').textContent = `${c.daily_nox_saved_g} g`;
      document.getElementById('valCommunityCo2').textContent = `${c.community_cluster_monthly_co2_tonnes} Tonnes`;
      document.getElementById('valCommunityPm25').textContent = `${c.community_cluster_monthly_pm25_kg} Kilograms`;
    }
  } catch (err) {
    console.error("Impact calculation error:", err);
  }
}

function downloadAntiIdlingKit() {
  const text = `
======================================================
     AURA GUARD ANTI-IDLING CLEAN AIR ZONE
======================================================
ATTENTION PARENTS, BUS DRIVERS & COMMUTERS:

Severe winter thermal inversions trap toxic exhaust
within breathing height of school children.

ENGINE IDLING RULES IN THIS 200m ZONE:
1. Turn off your vehicle engine if waiting > 30 seconds.
2. An idling SUV emits 20x more toxic NO2 than a moving car.
3. Keep our children's developing lungs safe from PM2.5 soot.

PROTECT OUR CHILDREN | BREATHE CLEAN AIR
Initiated by School PTA & AuraGuard Community Shield
======================================================
`;
  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'AuraGuard-Anti-Idling-School-Poster.txt';
  a.click();
  URL.revokeObjectURL(url);
}

// API Key Modal Handlers
function openApiKeyModal() {
  document.getElementById('geminiApiKeyInput').value = appState.geminiApiKey;
  document.getElementById('apiKeyModal').classList.remove('hidden');
}

function closeApiKeyModal() {
  document.getElementById('apiKeyModal').classList.add('hidden');
}

function saveApiKey() {
  const val = document.getElementById('geminiApiKeyInput').value.trim();
  appState.geminiApiKey = val;
  if (val) {
    localStorage.setItem('auraguard_gemini_key', val);
  } else {
    localStorage.removeItem('auraguard_gemini_key');
  }
  checkApiKeyStatus();
  closeApiKeyModal();
  triggerGenerateRoutine();
}

function clearSavedApiKey() {
  appState.geminiApiKey = '';
  localStorage.removeItem('auraguard_gemini_key');
  document.getElementById('geminiApiKeyInput').value = '';
  checkApiKeyStatus();
  closeApiKeyModal();
}

function checkApiKeyStatus() {
  const label = document.getElementById('apiKeyStatusLabel');
  if (appState.geminiApiKey) {
    label.textContent = 'Gemini AI: Live API Key';
    label.className = 'hidden md:inline text-cyan-400 font-semibold font-mono';
  } else {
    label.textContent = 'Gemini AI: Built-In Engine';
    label.className = 'hidden md:inline text-slate-300 font-mono';
  }
}
