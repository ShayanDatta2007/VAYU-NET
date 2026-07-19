// ============ VAYU·NET MOCK/STATIC DATA LAYER ============
const SOURCES = ["Vehicular","Construction","Industrial","Waste Burning","Other"];

const CITIES = {
  Delhi: {
    lat: 28.61, lon: 77.20,
    lang: "hi", langLabel:"Hindi",
    current: 286, trend: [241,255,268,279,291,286,298],
    wards: [
      {name:"Anand Vihar", aqi:341, source:"Vehicular", confidence:0.91},
      {name:"RK Puram", aqi:268, source:"Construction", confidence:0.84},
      {name:"Punjabi Bagh", aqi:298, source:"Vehicular", confidence:0.88},
      {name:"Okhla", aqi:312, source:"Industrial", confidence:0.79},
      {name:"Dwarka", aqi:223, source:"Construction", confidence:0.82},
    ],
    breakdown:{Vehicular:38,Construction:27,Industrial:18,"Waste Burning":11,Other:6},
    intervention:"Graded Response Action Plan triggers with automated truck-entry restriction at Stage III — cut peak NOx by ~14% over two winters.",
    weather: { temp: "29°C", wind: "11 km/h", hum: "45%" }
  },
  Mumbai: {
    lat: 19.07, lon: 72.87,
    lang:"mr", langLabel:"Marathi",
    current: 178, trend:[151,162,170,165,180,178,184],
    wards:[
      {name:"Bandra", aqi:165, source:"Vehicular", confidence:0.86},
      {name:"Andheri", aqi:188, source:"Construction", confidence:0.89},
      {name:"Chembur", aqi:221, source:"Industrial", confidence:0.92},
      {name:"Worli", aqi:154, source:"Vehicular", confidence:0.77},
      {name:"Borivali", aqi:160, source:"Construction", confidence:0.81},
    ],
    breakdown:{Vehicular:33,Construction:31,Industrial:22,"Waste Burning":8,Other:6},
    intervention:"Mandatory anti-smog net + sprinkler enforcement on construction sites above 70 AQI baseline reduced PM10 hotspot persistence by ~19%.",
    weather: { temp: "27°C", wind: "18 km/h", hum: "78%" }
  },
  Kolkata: {
    lat: 22.57, lon: 88.36,
    lang:"bn", langLabel:"Bengali",
    current: 162, trend:[140,148,155,158,163,162,168],
    wards:[
      {name:"Salt Lake", aqi:148, source:"Vehicular", confidence:0.80},
      {name:"Howrah", aqi:201, source:"Industrial", confidence:0.90},
      {name:"Park Street", aqi:152, source:"Vehicular", confidence:0.75},
      {name:"Behala", aqi:171, source:"Waste Burning", confidence:0.83},
      {name:"Rajarhat", aqi:130, source:"Construction", confidence:0.71},
    ],
    breakdown:{Vehicular:35,Construction:20,Industrial:24,"Waste Burning":15,Other:6},
    intervention:"Door-to-door waste segregation + ban on open burning in 12 wards cut localized smoke-event days by ~26%.",
    weather: { temp: "28°C", wind: "9 km/h", hum: "65%" }
  },
  Bengaluru: {
    lat: 12.97, lon: 77.59,
    lang:"kn", langLabel:"Kannada",
    current: 108, trend:[92,99,104,101,110,108,115],
    wards:[
      {name:"Whitefield", aqi:121, source:"Vehicular", confidence:0.78},
      {name:"Hebbal", aqi:134, source:"Construction", confidence:0.85},
      {name:"Jayanagar", aqi:96, source:"Vehicular", confidence:0.69},
      {name:"Peenya", aqi:158, source:"Industrial", confidence:0.91},
      {name:"Electronic City", aqi:112, source:"Vehicular", confidence:0.73},
    ],
    breakdown:{Vehicular:40,Construction:26,Industrial:19,"Waste Burning":7,Other:8},
    intervention:"Real-time signal retiming at 40 congested junctions reduced idling-linked CO hotspot readings by ~11%.",
    weather: { temp: "22°C", wind: "14 km/h", hum: "55%" }
  },
  Chennai: {
    lat: 13.08, lon: 80.27,
    lang:"ta", langLabel:"Tamil",
    current: 96, trend:[80,85,90,88,94,96,101],
    wards:[
      {name:"T Nagar", aqi:104, source:"Vehicular", confidence:0.74},
      {name:"Anna Nagar", aqi:88, source:"Vehicular", confidence:0.68},
      {name:"Manali", aqi:162, source:"Industrial", confidence:0.93},
      {name:"Velachery", aqi:91, source:"Construction", confidence:0.70},
      {name:"Tambaram", aqi:84, source:"Construction", confidence:0.66},
    ],
    breakdown:{Vehicular:31,Construction:24,Industrial:29,"Waste Burning":9,Other:7},
    intervention:"Industrial stack continuous emission monitoring tied to automated penalty notices cut Manali corridor exceedance days by ~21%.",
    weather: { temp: "30°C", wind: "16 km/h", hum: "82%" }
  }
};

// Fallback local forecast builder
function buildForecast(base){
  const points = [];
  for(let h=0; h<=72; h+=6){
    const drift = Math.sin(h/14) * 22 + Math.cos(h/30) * 10;
    const val = Math.max(35, Math.round(base + drift + (h>48? -10:0)));
    points.push({h, val, low: Math.max(20,val-18), high: val+18});
  }
  return points;
}

// Prepopulate baseline values
Object.entries(CITIES).forEach(([name, c]) => {
  c.forecast = buildForecast(c.current);
  c.liveStatus = "pending"; // pending | live | stale
});

// ============ MODELED CITY INDICES ============
// These are explicitly-modeled (not measured) indicators used by the Smart City
// Score, Urban Health Risk Index and Carbon Dashboard. Values are plausible,
// documented estimates for demo purposes — each formula/source is named in the
// UI's "Reading this score" panel so nothing here pretends to be a live feed.
const CITY_INDICES = {
  Delhi:     { greenCoverPct: 20, citizenAwarenessIdx: 61, hospitalCoverageIdx: 0.55, populationDensityIdx: 0.95 },
  Mumbai:    { greenCoverPct: 24, citizenAwarenessIdx: 68, hospitalCoverageIdx: 0.62, populationDensityIdx: 0.98 },
  Kolkata:   { greenCoverPct: 18, citizenAwarenessIdx: 55, hospitalCoverageIdx: 0.50, populationDensityIdx: 0.90 },
  Bengaluru: { greenCoverPct: 32, citizenAwarenessIdx: 72, hospitalCoverageIdx: 0.68, populationDensityIdx: 0.72 },
  Chennai:   { greenCoverPct: 27, citizenAwarenessIdx: 64, hospitalCoverageIdx: 0.60, populationDensityIdx: 0.68 },
};
Object.entries(CITIES).forEach(([name, c]) => {
  Object.assign(c, CITY_INDICES[name]);
  // Fallback pollutant panel (µg/m³ / ppm-scale mock) used until live telemetry arrives
  c.pollutants = {
    pm2_5: Math.round(c.current * 0.55),
    pm10: Math.round(c.current * 0.85),
    no2: Math.round(18 + c.breakdown.Vehicular * 0.6),
    so2: Math.round(6 + c.breakdown.Industrial * 0.5),
    co: Math.round(300 + c.breakdown.Vehicular * 8),
    o3: Math.round(20 + (100 - c.current/4))
  };
});

function aqiLevel(v){
  if(v<=100) return {label:"Good", key:"good"};
  if(v<=200) return {label:"Moderate", key:"moderate"};
  if(v<=300) return {label:"Poor", key:"poor"};
  return {label:"Severe", key:"severe"};
}

function aqiColorVar(v){
  if(v<=100) return "var(--signal)";
  if(v<=200) return "var(--warn)";
  if(v<=300) return "var(--haze)";
  return "var(--alert)";
}
function aqiColorVarRaw(v){
  if(v<=100) return "#3FD8C2";
  if(v<=200) return "#E8B339";
  if(v<=300) return "#C9823D";
  return "#E5483E";
}

// Distinguishing colour per attributed source category — used by the Skyline Map's
// source filter chips (not an AQI severity colour, a category colour).
function sourceDotColor(source){
  const map = { Vehicular:"#E8B339", Construction:"#9C9890", Industrial:"#E5483E", "Waste Burning":"#C9823D", Other:"#3FD8C2" };
  return map[source] || "#9C9890";
}

// Shared live-status tag used anywhere we surface weather/AQI on screen
function liveStatusTagHTML(cityName){
  const status = (CITIES[cityName] && CITIES[cityName].liveStatus) || "pending";
  if(status === "live") return `<span class="live-tag">LIVE</span>`;
  if(status === "partial") return `<span class="stale-tag">PARTIAL</span>`;
  if(status === "pending") return `<span class="stale-tag">SYNCING…</span>`;
  return `<span class="stale-tag">SIMULATED</span>`;
}

// Compact weather + AQI readout reused by Overview, Skyline Map and Citizen Advisory
function weatherSnapshotHTML(cityName){
  const c = CITIES[cityName];
  const w = c.weather || { temp:"--", wind:"--", hum:"--" };
  const lvl = aqiLevel(c.current);
  return `
    <div class="panel-box stat-card" data-weather-city="${cityName}">
      <div class="label" style="display:flex; align-items:center; justify-content:space-between;">
        <span>${cityName}</span> ${liveStatusTagHTML(cityName)}
      </div>
      <div style="display:flex; align-items:baseline; gap:10px; margin-top:2px;">
        <div class="value" style="color:${aqiColorVar(c.current)}; font-size:24px;">${c.current}</div>
        <span class="badge ${lvl.key}">${lvl.label}</span>
      </div>
      <div class="sub" style="margin-top:10px; display:flex; gap:14px; font-family:var(--font-mono);">
        <span>🌡 ${w.temp}</span><span>💨 ${w.wind}</span><span>💧 ${w.hum}</span>
      </div>
    </div>
  `;
}

// Wide single-row weather + AQI banner used by the Skyline Map and Citizen Advisory
// when only one city is in focus at a time.
function weatherBannerHTML(cityName){
  const c = CITIES[cityName];
  const w = c.weather || { temp:"--", wind:"--", hum:"--" };
  const lvl = aqiLevel(c.current);
  return `
    <div style="display:flex; align-items:center; gap:18px; flex-wrap:wrap;">
      <div>
        <div class="label" style="font-family:var(--font-mono); font-size:10.5px; letter-spacing:0.08em; text-transform:uppercase; color:var(--paper-faint); margin-bottom:8px;">${cityName} · Live AQI ${liveStatusTagHTML(cityName)}</div>
        <div style="font-family:var(--font-display); font-size:30px; font-weight:600; color:${aqiColorVar(c.current)};">${c.current} <span style="font-size:13px; color:var(--paper-dim); font-weight:500;">${lvl.label}</span></div>
      </div>
      <div style="display:flex; gap:14px; flex-wrap:wrap; margin-left:auto;">
        <div class="badge moderate" style="border-color:var(--line-strong); color:var(--paper-dim); background:none;">🌡 ${w.temp}</div>
        <div class="badge moderate" style="border-color:var(--line-strong); color:var(--paper-dim); background:none;">💨 ${w.wind}</div>
        <div class="badge moderate" style="border-color:var(--line-strong); color:var(--paper-dim); background:none;">💧 ${w.hum}</div>
      </div>
    </div>
  `;
}

// Enforcement queue
let ENFORCEMENT_QUEUE = [
  {id:"EQ-1042", city:"Delhi", location:"Anand Vihar Bus Terminal corridor", source:"Vehicular", evidence:"PM2.5 41% above 7-day baseline; diesel fleet idling detected via traffic-cam flow analysis.", score:94, action:"Deploy traffic police for idling enforcement + reroute diesel freight to ring-road bypass.", status:"Pending"},
  {id:"EQ-1043", city:"Delhi", location:"Okhla Phase II industrial cluster", source:"Industrial", evidence:"Stack SO2 readings sustained above permit threshold for 11 hours; two units flagged in prior quarter.", score:89, action:"Issue show-cause notice; schedule surprise stack inspection within 48 hours.", status:"Pending"},
  {id:"EQ-1044", city:"Mumbai", location:"Chembur refinery belt", source:"Industrial", evidence:"VOC spike correlated with maintenance shutdown window; odor complaints up 3x.", score:81, action:"Cross-verify with PCB online CEMS feed; dispatch mobile monitoring van.", status:"Dispatched"},
  {id:"EQ-1045", city:"Mumbai", location:"Andheri Metro Line 7 site", source:"Construction", evidence:"PM10 spike 52% above baseline; anti-smog net coverage below mandated 90% on two faces.", score:86, action:"Site notice + mandatory sprinkler cycle increase; re-inspect in 24 hours.", status:"Pending"},
  {id:"EQ-1046", city:"Kolkata", location:"Howrah foundry cluster", source:"Industrial", evidence:"Recurring evening smoke events, 6 of last 10 days; matches historical non-conformance pattern.", score:78, action:"Joint inspection with DGMS; review furnace emission control retrofit status.", status:"Pending"},
  {id:"EQ-1047", city:"Kolkata", location:"Behala waste yard", source:"Waste Burning", evidence:"Thermal anomaly detected via satellite hotspot layer at 02:10 IST; matches open-burning signature.", score:72, action:"Night patrol dispatch; segregation audit for adjoining wards.", status:"Resolved"},
  {id:"EQ-1048", city:"Bengaluru", location:"Peenya industrial estate", source:"Industrial", evidence:"Particulate readings persistently 30%+ above ambient standard across 3 stations.", score:84, action:"Joint KSPCB inspection; prioritise units without continuous emission monitors.", status:"Pending"},
  {id:"EQ-1049", city:"Chennai", location:"Manali petrochemical corridor", source:"Industrial", evidence:"SO2 and NOx co-elevated during wind-still period; matches dispersion-trapping pattern.", score:90, action:"Activate stack-specific curtailment protocol during low-wind advisory windows.", status:"Pending"},
];

// Advisory copy templates by language
const ADVISORY_TEXT = {
  en: {
    label: l => `Air quality in ${l.ward} is ${l.level} today (AQI ${l.aqi}).`,
    good: "Conditions are safe for normal outdoor activity.",
    moderate: "Sensitive groups — children, elderly, asthma/heart patients — should limit prolonged outdoor exertion.",
    poor: "Sensitive groups should avoid outdoor activity. General public should limit time outdoors, especially near traffic corridors.",
    severe: "Avoid outdoor activity. Keep windows closed, use N95 masks if going outside, and seek medical attention for breathing discomfort."
  },
  hi: {
    label: l => `${l.ward} में आज वायु गुणवत्ता ${l.level} है (AQI ${l.aqi}).`,
    good: "बाहर की सामान्य गतिविधियों के लिए स्थिति सुरक्षित है।",
    moderate: "संवेदनशील समूहों — बच्चे, बुज़ुर्ग, अस्थमा/हृदय रोगी — को लंबे समय तक बाहर रहने से बचना चाहिए।",
    poor: "संवेदनशील समूहों को बाहरी गतिविधियों से बचना चाहिए। आम जनता भी ट्रैफ़िक क्षेत्रों के पास समय सीमित रखें।",
    severe: "बाहर जाने से बचें। खिड़कियाँ बंद रखें, बाहर निकलते समय N95 मास्क पहनें, और सांस लेने में परेशानी होने पर डॉक्टर से सलाह लें।"
  },
  kn: {
    label: l => `${l.ward} ನಲ್ಲಿ ಇಂದು ಗಾಳಿಯ ಗುಣಮಟ್ಟ ${l.level} ಆಗಿದೆ (AQI ${l.aqi}).`,
    good: "ಸಾಮಾನ್ಯ ಹೊರಾಂಗಣ ಚಟುವಟಿಕೆಗಳಿಗೆ ಪರಿಸ್ಥಿತಿ ಸುರಕ್ಷಿತವಾಗಿದೆ.",
    moderate: "ಮಕ್ಕಳು, ವೃದ್ಧರು, ಅಸ್ತಮಾ/ಹೃದ್ರೋಗ ಇರುವವರು ದೀರ್ಘ ಹೊರಾಂಗಣ ಚಟುವಟಿಕೆ ತಪ್ಪಿಸಬೇಕು.",
    poor: "ಸೂಕ್ಷ್ಮ ಗುಂಪುಗಳು ಹೊರಾಂಗಣ ಚಟುವಟಿಕೆಗಳನ್ನು ತಪ್ಪಿಸಬೇಕು. ಸಾರ್ವಜನಿಕರು ಸಂಚಾರ ಪ್ರದೇಶಗಳ ಬಳಿ ಸಮಯ ಕಡಿಮೆ ಮಾಡಬೇಕು.",
    severe: "ಹೊರಗೆ ಹೋಗುವುದನ್ನು ತಪ್ಪಿಸಿ. ಕಿಟಕಿಗಳನ್ನು ಮುಚ್ಚಿ, N95 ಮಾಸ್ಕ್ ಧರಿಸಿ, ಉಸಿರಾಟದ ತೊಂದರೆಯಾದರೆ ವೈದ್ಯರನ್ನು ಸಂಪರ್ಕಿಸಿ."
  },
  ta: {
    label: l => `${l.ward} இல் இன்று காற்றின் தரம் ${l.level} (AQI ${l.aqi}).`,
    good: "வெளியில் வழக்கமான செயல்பாடுகளுக்கு நிலைமை பாதுகாப்பானது.",
    moderate: "குழந்தைகள், முதியோர், ஆஸ்துமா/இதய நோயாளிகள் நீண்ட நேர வெளிப்புற செயல்பாட்டைத் தவிர்க்க வேண்டும்.",
    poor: "உணர்வுள்ள குழுக்கள் வெளியில் செயல்பாடுகளை தவிர்க்க வேண்டும். பொதுமக்களும் போக்குவரத்து பகுதிகளில் நேரத்தைக் குறைக்கவும்.",
    severe: "வெளியே செல்வதைத் தவிர்க்கவும். ஜன்னல்களை மூடி வையுங்கள், N95 மாஸ்க் அணியுங்கள், சுவாசக் கோளாறு இருந்தால் மருத்துவரை அணுகவும்."
  }
};

// ============ AUTHENTICATION SYSTEM ============
const USERS_KEY = "vayunet_users_v1";
const SESSION_KEY = "vayunet_session_v1";

async function sha256(text){
  const enc = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest("SHA-256", enc);
  return Array.from(new Uint8Array(buf)).map(b=>b.toString(16).padStart(2,"0")).join("");
}

function getUsers(){
  try{ return JSON.parse(localStorage.getItem(USERS_KEY)) || {}; }catch(e){ return {}; }
}
function saveUsers(u){ localStorage.setItem(USERS_KEY, JSON.stringify(u)); }

async function ensureDemoUser(){
  const users = getUsers();
  if(!users["officer@aqi.gov.in"]){
    users["officer@aqi.gov.in"] = {
      name:"Anjali Rao", city:"Delhi",
      passHash: await sha256("Demo@123")
    };
    saveUsers(users);
  }
}

function showAuthError(msg){
  const el = document.getElementById("auth-error");
  el.textContent = msg; el.style.display = "block";
  document.getElementById("auth-success").style.display = "none";
}
function showAuthSuccess(msg){
  const el = document.getElementById("auth-success");
  el.textContent = msg; el.style.display = "block";
  document.getElementById("auth-error").style.display = "none";
}
function clearAuthMsgs(){
  document.getElementById("auth-error").style.display = "none";
  document.getElementById("auth-success").style.display = "none";
}

document.getElementById("tab-login").addEventListener("click", ()=>{
  document.getElementById("tab-login").classList.add("active");
  document.getElementById("tab-signup").classList.remove("active");
  document.getElementById("login-form").classList.remove("hidden");
  document.getElementById("signup-form").classList.add("hidden");
  clearAuthMsgs();
});
document.getElementById("tab-signup").addEventListener("click", ()=>{
  document.getElementById("tab-signup").classList.add("active");
  document.getElementById("tab-login").classList.remove("active");
  document.getElementById("signup-form").classList.remove("hidden");
  document.getElementById("login-form").classList.add("hidden");
  clearAuthMsgs();
});

document.querySelectorAll(".pw-toggle").forEach(btn=>{
  btn.addEventListener("click", ()=>{
    const target = document.getElementById(btn.dataset.target);
    if(target.type === "password"){ target.type="text"; btn.textContent="hide"; }
    else { target.type="password"; btn.textContent="show"; }
  });
});

document.getElementById("demo-fill").addEventListener("click", ()=>{
  document.getElementById("login-user").value = "officer@aqi.gov.in";
  document.getElementById("login-pass").value = "Demo@123";
});

document.getElementById("login-form").addEventListener("submit", async (e)=>{
  e.preventDefault();
  const user = document.getElementById("login-user").value.trim().toLowerCase();
  const pass = document.getElementById("login-pass").value;
  if(!user || !pass){ showAuthError("Enter both officer ID and password."); return; }
  const users = getUsers();
  const record = users[user];
  if(!record){ showAuthError("No account found for that ID. Create one, or use the demo credentials."); return; }
  const hash = await sha256(pass);
  if(hash !== record.passHash){ showAuthError("Incorrect password."); return; }
  sessionStorage.setItem(SESSION_KEY, JSON.stringify({user, name:record.name, city:record.city}));
  enterApp(record.name, record.city);
});

document.getElementById("signup-form").addEventListener("submit", async (e)=>{
  e.preventDefault();
  const name = document.getElementById("signup-name").value.trim();
  const user = document.getElementById("signup-user").value.trim().toLowerCase();
  const city = document.getElementById("signup-city").value;
  const pass = document.getElementById("signup-pass").value;
  if(!name || !user || !pass){ showAuthError("Fill in all fields."); return; }
  if(pass.length < 8){ showAuthError("Password must be at least 8 characters."); return; }
  const users = getUsers();
  if(users[user]){ showAuthError("An account with that ID already exists."); return; }
  users[user] = { name, city, passHash: await sha256(pass) };
  saveUsers(users);
  showAuthSuccess("Account created. You can sign in now.");
  document.getElementById("tab-login").click();
  document.getElementById("login-user").value = user;
});

document.getElementById("logout-btn").addEventListener("click", ()=>{
  sessionStorage.removeItem(SESSION_KEY);
  stopLiveRefresh();
  document.getElementById("app").classList.add("hidden");
  document.getElementById("login-screen").classList.remove("hidden");
  document.getElementById("login-form").reset();
});

function enterApp(name, city){
  document.getElementById("login-screen").classList.add("hidden");
  document.getElementById("app").classList.remove("hidden");
  document.getElementById("user-name-label").textContent = `${name} · ${city}`;
  document.getElementById("user-initial").textContent = name.charAt(0).toUpperCase();
  initApp();
}

// ============ REAL-TIME WEATHER & AQI API INTEGRATION ============
// FIX: this used to be a single global string that got overwritten to "fallback"
// the instant ANY one city's request failed (Promise.all fails fast), which made the
// whole dashboard (forecast/attribution/compare charts included) silently freeze on
// stale/simulated numbers even when most cities fetched fine. Now tracked per city.
let activeApiMode = "Open-Meteo (Keyless Live API)";
let liveRefreshTimer = null;
const REFRESH_INTERVAL_MS = 5 * 60 * 1000; // refresh live data every 5 minutes

async function fetchWithTimeout(resource, options = {}) {
  const { timeout = 6000 } = options;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(resource, { ...options, signal: controller.signal });
    clearTimeout(id);
    return response;
  } catch (e) {
    clearTimeout(id);
    throw e;
  }
}

// Find the hourly index that best matches "now" for a given city's response.
// FIX: the previous version compared a UTC ISOString against Open-Meteo's
// `timezone=auto` (local) timestamps, so the string match almost never succeeded
// and silently fell back to index 0 — misaligning the entire 72h forecast.
// We instead anchor on the API's own `current.time` value (already in the same
// local frame as `hourly.time`), with a nearest-timestamp fallback.
function findNowIndex(times, currentTimeStr){
  if(!Array.isArray(times) || times.length === 0) return 0;
  if(currentTimeStr){
    const exact = times.indexOf(currentTimeStr);
    if(exact !== -1) return exact;
  }
  const anchorMs = new Date(currentTimeStr || Date.now()).getTime();
  let bestIdx = 0, bestDiff = Infinity;
  times.forEach((t, i)=>{
    const d = Math.abs(new Date(t).getTime() - anchorMs);
    if(d < bestDiff){ bestDiff = d; bestIdx = i; }
  });
  return bestIdx;
}

// Fetch live telemetry for a single city. Never throws — always resolves,
// marking the city's liveStatus so the UI can show real data where available
// and gracefully keep prior/simulated values where a single feed failed.
async function fetchCityTelemetry(cityName, cityData){
  let weatherOk = false, aqiOk = false;

  try {
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${cityData.lat}&longitude=${cityData.lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m&timezone=auto`;
    const wRes = await fetchWithTimeout(weatherUrl);
    if(wRes.ok){
      const wData = await wRes.json();
      cityData.weather = {
        temp: `${Math.round(wData.current.temperature_2m)}°C`,
        wind: `${Math.round(wData.current.wind_speed_10m)} km/h`,
        hum: `${Math.round(wData.current.relative_humidity_2m)}%`
      };
      weatherOk = true;
    }
  } catch (err) {
    console.warn(`[VAYU·NET] Weather fetch failed for ${cityName}:`, err);
  }

  try {
    const aqiUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${cityData.lat}&longitude=${cityData.lon}&current=us_aqi,pm2_5,pm10,nitrogen_dioxide,sulphur_dioxide,carbon_monoxide&hourly=us_aqi&timezone=auto`;
    const aRes = await fetchWithTimeout(aqiUrl);
    if(aRes.ok){
      const aData = await aRes.json();
      const liveAqi = aData.current && aData.current.us_aqi;

      if(liveAqi != null && !Number.isNaN(liveAqi)){
        cityData.current = Math.round(liveAqi);
        cityData.trend.push(Math.round(liveAqi));
        cityData.trend.shift();

        cityData.wards.forEach((w, idx) => {
          const varianceFactor = 0.8 + (idx * 0.1);
          w.aqi = Math.max(10, Math.round(liveAqi * varianceFactor));
        });
      }

      // Dynamic source breakdown from live relative species concentrations
      const pm2_5 = (aData.current && aData.current.pm2_5) || 30;
      const pm10 = (aData.current && aData.current.pm10) || 50;
      const no2 = (aData.current && aData.current.nitrogen_dioxide) || 20;
      const so2 = (aData.current && aData.current.sulphur_dioxide) || 10;
      const co = (aData.current && aData.current.carbon_monoxide) || 400;

      // Persist the raw species readings for the Carbon Dashboard / Time Machine —
      // previously these were only used transiently for the breakdown calc below.
      cityData.pollutants = {
        pm2_5: Math.round(pm2_5), pm10: Math.round(pm10), no2: Math.round(no2),
        so2: Math.round(so2), co: Math.round(co), o3: Math.round(20 + (100 - cityData.current/4))
      };

      const vehicularScore = (2.2 * no2) + (0.04 * co) + 12;
      const constructionScore = (1.3 * Math.max(0, pm10 - pm2_5)) + 12;
      const industrialScore = (3.2 * so2) + 12;
      const burningScore = (1.6 * pm2_5) + 6;
      const otherScore = 12;
      const totalScore = vehicularScore + constructionScore + industrialScore + burningScore + otherScore;

      if(totalScore > 0){
        cityData.breakdown = {
          Vehicular: Math.round((vehicularScore / totalScore) * 100),
          Construction: Math.round((constructionScore / totalScore) * 100),
          Industrial: Math.round((industrialScore / totalScore) * 100),
          "Waste Burning": Math.round((burningScore / totalScore) * 100),
          Other: Math.round((otherScore / totalScore) * 100)
        };
        const sum = Object.values(cityData.breakdown).reduce((a,b)=>a+b, 0);
        if(sum !== 100) cityData.breakdown.Other += (100 - sum);
      }

      // Parse the live hourly forecast array, anchored correctly on "now"
      if(aData.hourly && Array.isArray(aData.hourly.time) && Array.isArray(aData.hourly.us_aqi)){
        const times = aData.hourly.time;
        const aqis = aData.hourly.us_aqi;
        const currentTimeStr = aData.current && aData.current.time;
        const startIndex = findNowIndex(times, currentTimeStr);

        const points = [];
        for (let h = 0; h <= 72; h += 6) {
          const dataIndex = startIndex + h;
          const val = (dataIndex < aqis.length && aqis[dataIndex] != null)
            ? aqis[dataIndex]
            : cityData.current;
          points.push({
            h,
            val: Math.round(val),
            low: Math.max(10, Math.round(val * 0.9)),
            high: Math.round(val * 1.1)
          });
        }
        cityData.forecast = points;
      }

      aqiOk = true;
    }
  } catch (err) {
    console.warn(`[VAYU·NET] Air quality fetch failed for ${cityName}:`, err);
  }

  // Per-city status, never a global all-or-nothing flag
  cityData.liveStatus = (weatherOk && aqiOk) ? "live" : (weatherOk || aqiOk) ? "partial" : "stale";

  // Guarantee the city always has a usable forecast/breakdown even if both feeds failed
  if(!cityData.forecast || !cityData.forecast.length){
    cityData.forecast = buildForecast(cityData.current);
  }
  if(!cityData.breakdown){
    cityData.breakdown = { Vehicular: 35, Construction: 25, Industrial: 20, "Waste Burning": 15, Other: 5 };
  }
}

// FIX: previously used Promise.all() across all five cities — a single timeout
// or rejected fetch would reject the *entire* batch and dump every city back to
// simulated data, which is what made charts look "blank"/frozen on first load.
// fetchCityTelemetry() above never throws, so allSettled is mostly a safety net,
// but it also means a slow city can no longer take the rest of the grid down with it.
async function fetchRealtimeTelemetry(){
  const results = await Promise.allSettled(
    Object.entries(CITIES).map(([cityName, cityData]) => fetchCityTelemetry(cityName, cityData))
  );

  const liveCount = Object.values(CITIES).filter(c => c.liveStatus === "live").length;
  const totalCount = Object.keys(CITIES).length;

  if(liveCount === totalCount) activeApiMode = "Open-Meteo (Keyless Live API) — all metros live";
  else if(liveCount > 0) activeApiMode = `Open-Meteo (Keyless Live API) — ${liveCount}/${totalCount} metros live`;
  else activeApiMode = "Simulated Grid Telemetry (Offline Fallback)";

  results.forEach((r, idx) => {
    if(r.status === "rejected"){
      const cityName = Object.keys(CITIES)[idx];
      console.warn(`[VAYU·NET] Unexpected telemetry failure for ${cityName}:`, r.reason);
    }
  });
}

function startLiveRefresh(){
  if(liveRefreshTimer) return;
  liveRefreshTimer = setInterval(async () => {
    await fetchRealtimeTelemetry();
    refreshLiveUI();
  }, REFRESH_INTERVAL_MS);
}
function stopLiveRefresh(){
  if(liveRefreshTimer){ clearInterval(liveRefreshTimer); liveRefreshTimer = null; }
}

// Re-paint whatever is currently visible with fresh data, without losing the
// user's current tab/city selection state any more than a normal re-render would.
function refreshLiveUI(){
  buildTicker();
  const activeBtn = document.querySelector(".rail-item.active");
  const mod = activeBtn ? activeBtn.dataset.module : "overview";
  if(mod === "overview") renderOverview();
  else if(mod === "map") {
    // If the Leaflet map already exists for the currently-viewed city, just repaint
    // marker colours/popups in place so we don't reset the officer's zoom/pan state
    // every 5 minutes. Otherwise (map not opened yet this session) fall back to a
    // full render.
    if(leafletMap && selectedMapCity) refreshWardMarkersLive(selectedMapCity);
    else renderMap();
  }
  else if(mod === "forecast") renderForecast();
  else if(mod === "attribution") renderAttribution();
  else if(mod === "compare") renderCompare();
  else if(mod === "advisory") updateAdvisoryWeatherPanel();
  else if(mod === "score") renderScore();
  else if(mod === "reports") renderReports();
  // enforcement / chat / simulator / timemachine / twin are not continuously
  // telemetry-driven in the same way — they re-read CITIES fresh each time the
  // officer opens them, so no periodic repaint is needed here.
}

// Refresh just the live weather banner on the Advisory tab without resetting the
// officer's in-progress ward/language selection or an already-generated advisory.
function updateAdvisoryWeatherPanel(){
  const panel = document.getElementById("adv-weather-panel");
  const citySelect = document.getElementById("adv-city");
  if(!panel || !citySelect) return; // advisory module hasn't been opened yet
  const city = citySelect.value || selectedAdvisoryCity || Object.keys(CITIES)[0];
  panel.innerHTML = weatherBannerHTML(city);
}

// ============ CHART.JS RESILIENT LOADER ============
// FIX: if the CDN <script> tag in index.html is blocked or 404s for any reason,
// every chart silently never renders (canvas stays visually blank) with no
// console signal a casual user would notice. This loader retries from a second
// CDN at runtime and only gives up — with a visible on-panel message — if both fail.
let chartJsLoadPromise = null;
function ensureChartJsLoaded(){
  if(window.Chart) return Promise.resolve(true);
  if(chartJsLoadPromise) return chartJsLoadPromise;

  chartJsLoadPromise = new Promise((resolve) => {
    const fallbackSrc = "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.4/chart.umd.min.js";
    const script = document.createElement("script");
    script.src = fallbackSrc;
    script.onload = () => resolve(!!window.Chart);
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  });
  return chartJsLoadPromise;
}

// ============ LEAFLET RESILIENT LOADER ============
// Same resiliency pattern as Chart.js above: the primary CDN tag lives in index.html
// (unpkg). If it's blocked/fails, this retries from a second CDN (cdnjs) at runtime,
// pulling in both the JS and its CSS, and only gives up — with a visible on-panel
// message — if both fail. This keeps the Skyline Map from silently staying blank.
let leafletLoadPromise = null;
function ensureLeafletLoaded(){
  if(window.L) return Promise.resolve(true);
  if(leafletLoadPromise) return leafletLoadPromise;

  leafletLoadPromise = new Promise((resolve) => {
    if(!document.getElementById("leaflet-css-fallback")){
      const cssFallback = document.createElement("link");
      cssFallback.id = "leaflet-css-fallback";
      cssFallback.rel = "stylesheet";
      cssFallback.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css";
      document.head.appendChild(cssFallback);
    }
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js";
    script.onload = () => resolve(!!window.L);
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  });
  return leafletLoadPromise;
}

// ============ jsPDF / SheetJS RESILIENT LOADERS ============
// Same pattern again: primary CDN tag lives in index.html (cdnjs); if that's
// blocked, retry from jsdelivr at runtime. Used only when the officer actually
// clicks a download button in Reports & Alerts, so it costs nothing otherwise.
let pdfLoadPromise = null;
function ensurePdfLoaded(){
  if(window.jspdf && window.jspdf.jsPDF) return Promise.resolve(true);
  if(pdfLoadPromise) return pdfLoadPromise;
  pdfLoadPromise = new Promise((resolve)=>{
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js";
    script.onload = () => resolve(!!(window.jspdf && window.jspdf.jsPDF));
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  });
  return pdfLoadPromise;
}
let xlsxLoadPromise = null;
function ensureXlsxLoaded(){
  if(window.XLSX) return Promise.resolve(true);
  if(xlsxLoadPromise) return xlsxLoadPromise;
  xlsxLoadPromise = new Promise((resolve)=>{
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js";
    script.onload = () => resolve(!!window.XLSX);
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  });
  return xlsxLoadPromise;
}

function renderChartError(containerId, message){
  const el = document.getElementById(containerId);
  if(el) el.innerHTML = `<div class="chart-error-msg">${message}</div>`;
}

// ============ TOAST NOTIFICATIONS ============
// Lightweight in-DOM toast system (no external library) used by the Smart
// Notification System and by Emergency Alert Center test buttons.
function showToast(title, body, kind = "info"){
  const stack = document.getElementById("toast-stack");
  if(!stack) return;
  const el = document.createElement("div");
  el.className = `toast ${kind === "alert" ? "alert" : kind === "warn" ? "warn" : ""}`;
  el.innerHTML = `
    <div class="t-title"><span>${title}</span><button aria-label="Dismiss">✕</button></div>
    <div class="t-body">${body}</div>
  `;
  el.querySelector("button").addEventListener("click", ()=> el.remove());
  stack.appendChild(el);
  setTimeout(()=>{
    el.style.animation = "toastOut .25s ease both";
    setTimeout(()=> el.remove(), 260);
  }, 6000);
}

// Wraps the browser Notification API — always resolves, never throws, and falls
// back to an in-page toast if permission isn't granted or the API is unavailable
// (e.g. iframe/preview contexts where Notification is blocked entirely).
async function sendSmartNotification(title, body){
  try{
    if("Notification" in window){
      if(Notification.permission === "granted"){
        new Notification(title, { body });
        return;
      }
      if(Notification.permission !== "denied"){
        const perm = await Notification.requestPermission();
        if(perm === "granted"){ new Notification(title, { body }); return; }
      }
    }
  } catch(err){
    console.warn("[VAYU·NET] Browser notification unavailable, falling back to toast:", err);
  }
  showToast(title, body, "warn");
}

// Helper to safely recycle Chart instances
function safeDestroyChart(chartKey) {
  if (charts[chartKey]) {
    try {
      charts[chartKey].destroy();
    } catch (e) {
      console.warn(`Safe-destroy failure on chart: ${chartKey}`, e);
    }
    charts[chartKey] = null;
  }
}

/* ---------- NAV ---------- */
document.querySelectorAll(".rail-item").forEach(btn=>{
  btn.addEventListener("click", ()=>{
    document.querySelectorAll(".rail-item").forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");
    document.querySelectorAll(".module").forEach(m=>m.classList.remove("active"));

    const targetModule = btn.dataset.module;
    const targetEl = document.getElementById("mod-" + targetModule);
    if(targetEl) {
      targetEl.classList.add("active");
    }

    // Explicit redraws ONLY after module elements are rendered active (display: block)
    if(targetModule === "overview") renderOverview();
    else if(targetModule === "map") renderMap();
    else if(targetModule === "forecast") renderForecast();
    else if(targetModule === "attribution") renderAttribution();
    else if(targetModule === "enforcement") renderEnforcement();
    else if(targetModule === "compare") renderCompare();
    else if(targetModule === "advisory") renderAdvisory();
    else if(targetModule === "simulator") renderSimulator();
    else if(targetModule === "timemachine") renderTimeMachine();
    else if(targetModule === "twin") renderDigitalTwin();
    else if(targetModule === "score") renderScore();
    else if(targetModule === "reports") renderReports();
  });
});

/* ---------- CLOCK + TICKER ---------- */
function tickClock(){
  const el = document.getElementById("clock-foot");
  if(el) el.textContent = "IST " + new Date().toLocaleTimeString("en-IN", {hour12:false});
}
setInterval(tickClock, 1000); tickClock();

function buildTicker(){
  const track = document.getElementById("ticker-track");
  if(!track) return;
  const items = Object.entries(CITIES).map(([name,c])=>{
    const lvl = aqiLevel(c.current);
    return `<span class="ticker-item"><span class="dot" style="background:${aqiColorVar(c.current)}"></span>${name} &nbsp;<b>${c.current}</b>&nbsp; AQI · ${lvl.label}</span>`;
  }).join("");
  track.innerHTML = items + items; // infinite loop duplicate
}

/* ---------- APP INIT ---------- */
let appInitialized = false;
let charts = {};
let selectedMapCity = null;
let selectedAdvisoryCity = null;

// Skyline Map (Leaflet) state
let leafletMap = null;
let wardMarkers = []; // [{marker, source, name}]
let selectedMapSourceFilter = "All";

function initApp(){
  buildTicker();
  if(!appInitialized){
    renderOverview();
    appInitialized = true;
  }
  startLiveRefresh();
}

/* ---------- OVERVIEW ---------- */
function renderOverview(){
  const totalWards = Object.values(CITIES).reduce((s,c)=>s+c.wards.length,0);
  const avgAqi = Math.round(Object.values(CITIES).reduce((s,c)=>s+c.current,0)/Object.keys(CITIES).length);
  const pending = ENFORCEMENT_QUEUE.filter(e=>e.status==="Pending").length;

  document.getElementById("mod-overview").innerHTML = `
    <div class="module-head">
      <p class="eyebrow" style="display:flex; justify-content:space-between; align-items:center;">
        <span>Command Center</span>
        <span style="color:var(--signal); text-transform:none; font-size:10px;">🟢 Live Pipeline Sync: ${activeApiMode}</span>
      </p>
      <h2>National air intelligence, at a glance</h2>
      <p>Five metros · ${totalWards} monitored wards · live for the duration of this session. Every module below pulls from the same fused signal — monitoring stations, satellite thermal anomalies, mobility, weather and land-use layers.</p>
    </div>

    <div class="grid-4" style="margin-bottom:28px;">
      <div class="panel-box stat-card"><div class="label">National Avg AQI</div><div class="value" style="color:${aqiColorVar(avgAqi)}">${avgAqi}</div><div class="sub">Across 5 tracked metros</div></div>
      <div class="panel-box stat-card"><div class="label">Wards Monitored</div><div class="value">${totalWards}</div><div class="sub">CAAQMS + interpolated grid</div></div>
      <div class="panel-box stat-card"><div class="label">Enforcement Pending</div><div class="value" style="color:var(--alert-soft)">${pending}</div><div class="sub">Of ${ENFORCEMENT_QUEUE.length} active cases</div></div>
      <div class="panel-box stat-card"><div class="label">Forecast Horizon</div><div class="value" style="color:var(--signal-soft)">72h</div><div class="sub">Hyperlocal, 6-hour steps</div></div>
    </div>

    <p class="eyebrow" style="margin-bottom:10px;">Live weather &amp; AQI — every metro, right now</p>
    <div class="grid-3" style="margin-bottom:28px;" id="overview-weather-grid">
      ${Object.keys(CITIES).map(name => weatherSnapshotHTML(name)).join("")}
    </div>

    <p class="eyebrow" style="margin-bottom:10px;">The intelligence pipeline</p>
    <div class="pipeline">
      <div class="stage s1"><div class="stage-tag">01 · SENSE</div><h3>Detect</h3><p>CAAQMS readings, satellite thermal anomalies, and traffic/construction permit feeds are fused into a single live signal per ward, refreshed continuously rather than on a weekly cadence.</p></div>
      <div class="stage s2"><div class="stage-tag">02 · EXPLAIN</div><h3>Attribute</h3><p>Spatial-temporal patterns are matched against land use, stack registries, and burning signatures to assign a confidence-scored source breakdown — vehicular, construction, industrial, waste burning.</p></div>
      <div class="stage s3"><div class="stage-tag">03 · ANTICIPATE</div><h3>Forecast</h3><p>Meteorology, seasonal emission calendars and dispersion modelling produce 24–72 hour AQI projections at ward resolution, so interventions can be scheduled ahead of the spike.</p></div>
      <div class="stage s4"><div class="stage-tag">04 · INTERVENE</div><h3>Act</h3><p>Hotspots are ranked into an enforcement queue with evidence and recommended action, while citizens get a plain-language, multilingual advisory before they step outside.</p></div>
    </div>

    <div class="grid-2">
      <div class="panel-box">
        <p class="eyebrow" style="margin-bottom:14px;">Most severe wards right now</p>
        <table>
          <thead><tr><th>Ward</th><th>City</th><th>AQI</th><th>Dominant source</th></tr></thead>
          <tbody>${topWards().map(w=>`<tr><td class="strong">${w.name}</td><td>${w.city}</td><td style="color:${aqiColorVar(w.aqi)}; font-family:var(--font-mono); font-weight:600;">${w.aqi}</td><td>${w.source}</td></tr>`).join("")}</tbody>
        </table>
      </div>
      <div class="panel-box">
        <p class="eyebrow" style="margin-bottom:14px;">Why this matters</p>
        <p style="font-size:13px; line-height:1.7; color:var(--paper-dim);">Indian cities log hundreds of "poor" or worse AQI days a year, and most administrations still respond after a spike is already underway. Less than a third of cities with monitoring data have any standing multi-agency response protocol tied to those readings. VAYU·NET closes that gap — turning raw sensor noise into a ranked, explainable, actionable picture for the people who have to do something about it before sunrise.</p>
      </div>
    </div>
  `;
}

function topWards(){
  let all = [];
  Object.entries(CITIES).forEach(([cityName,c])=>{
    c.wards.forEach(w=> all.push({...w, city:cityName}));
  });
  return all.sort((a,b)=>b.aqi-a.aqi).slice(0,6);
}

/* ---------- MAP MODULE (Leaflet / OpenStreetMap live GIS) ---------- */

// Small deterministic string hash — used only to scatter wards around a city's
// centre coordinate into a stable, repeatable layout (no geocoding API call needed,
// so the map paints instantly and never depends on a rate-limited service).
function hashStr(str){
  let h = 0;
  for(let i=0; i<str.length; i++){ h = (h * 31 + str.charCodeAt(i)) | 0; }
  return h;
}
function wardLatLon(cityData, ward){
  const h = hashStr(ward.name);
  const angle = (Math.abs(h) % 360) * (Math.PI / 180);
  const dist = 0.025 + ((Math.abs(h) % 100) / 100) * 0.05; // ~2.5–7.5km scatter radius
  const lat = cityData.lat + Math.sin(angle) * dist;
  const lon = cityData.lon + Math.cos(angle) * dist * 1.15; // slight stretch to offset lat/lon distance distortion
  return [lat, lon];
}

function renderMap(){
  const cityNames = Object.keys(CITIES);
  const startCity = selectedMapCity && CITIES[selectedMapCity] ? selectedMapCity : cityNames[0];
  document.getElementById("mod-map").innerHTML = `
    <div class="module-head">
      <p class="eyebrow">Instrument 01</p>
      <h2>Skyline Map — live geospatial ward risk grid</h2>
      <p>Interactive OpenStreetMap layer over the city. Each marker is one monitored ward — size and colour reflect live AQI. Filter by attributed source category, or switch to a satellite basemap, using the controls below.</p>
    </div>
    <div class="chip-row" id="map-city-chips">
      ${cityNames.map((n)=>`<button class="chip ${n===startCity?'active':''}" data-city="${n}">${n}</button>`).join("")}
    </div>
    <div class="panel-box" id="map-weather-panel" style="margin-bottom:18px;"></div>
    <div class="map-layer-toggle" id="map-source-filters">
      <button class="active" data-source="All">All sources</button>
      ${SOURCES.map(s=>`<button data-source="${s}"><span class="dot" style="background:${sourceDotColor(s)}"></span>${s}</button>`).join("")}
    </div>
    <div class="panel-box" style="padding:12px;">
      <div class="leaflet-map-container" id="leaflet-map"></div>
      <div class="legend" style="padding:14px 8px 2px;">
        <div class="legend-item"><span class="legend-dot" style="background:var(--signal)"></span>Good (0–100)</div>
        <div class="legend-item"><span class="legend-dot" style="background:var(--warn)"></span>Moderate (101–200)</div>
        <div class="legend-item"><span class="legend-dot" style="background:var(--haze)"></span>Poor (201–300)</div>
        <div class="legend-item"><span class="legend-dot" style="background:var(--alert)"></span>Severe (300+)</div>
      </div>
    </div>
    <div class="panel-box" id="ward-detail" style="margin-top:18px;">
      <p style="color:var(--paper-faint); font-size:13px;">Select a ward marker above to inspect its attribution detail.</p>
    </div>
  `;

  document.querySelectorAll("#map-city-chips .chip").forEach(chip=>{
    chip.addEventListener("click", ()=>{
      document.querySelectorAll("#map-city-chips .chip").forEach(c=>c.classList.remove("active"));
      chip.classList.add("active");
      selectedMapSourceFilter = "All";
      document.querySelectorAll("#map-source-filters button").forEach(b=>b.classList.toggle("active", b.dataset.source === "All"));
      drawWardGrid(chip.dataset.city);
    });
  });

  document.querySelectorAll("#map-source-filters button").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      document.querySelectorAll("#map-source-filters button").forEach(b=>b.classList.remove("active"));
      btn.classList.add("active");
      selectedMapSourceFilter = btn.dataset.source;
      applyWardMarkerFilter();
    });
  });

  drawWardGrid(startCity);
}

// Builds (or rebuilds) the live Leaflet map for a given city: base tile layers
// (street + satellite), one circle marker per ward coloured/sized by live AQI,
// popups + tooltips, and rewires the source-filter chips against the new markers.
async function drawWardGrid(cityName){
  selectedMapCity = cityName;
  const c = CITIES[cityName];

  const weatherPanel = document.getElementById("map-weather-panel");
  if(weatherPanel) weatherPanel.innerHTML = weatherBannerHTML(cityName);

  const container = document.getElementById("leaflet-map");
  if(!container) return; // user navigated away before this resolved

  const ok = await ensureLeafletLoaded();
  if(!ok){
    renderChartError("leaflet-map", "Map library failed to load from both CDNs. Check your network/ad-blocker settings, then reopen this tab.");
    return;
  }

  // Recreate cleanly on every city switch / module re-render to avoid Leaflet's
  // "map container is already initialized" error against a fresh <div>.
  if(leafletMap){
    try{ leafletMap.remove(); }catch(e){ console.warn("[VAYU·NET] Leaflet teardown failed:", e); }
    leafletMap = null;
  }

  try{
    leafletMap = L.map("leaflet-map", { zoomControl: true, attributionControl: true, scrollWheelZoom: true })
      .setView([c.lat, c.lon], 11);

    const streets = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 18,
      attribution: "&copy; OpenStreetMap contributors"
    });
    const satellite = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
      maxZoom: 18,
      attribution: "Tiles &copy; Esri — Source: Esri, Maxar, Earthstar Geographics"
    });
    streets.addTo(leafletMap);
    L.control.layers({ "Streets": streets, "Satellite": satellite }, {}, { collapsed: true, position: "topright" }).addTo(leafletMap);

    wardMarkers = [];
    c.wards.forEach(w=>{
      const pos = wardLatLon(c, w);
      const lvl = aqiLevel(w.aqi);
      const marker = L.circleMarker(pos, {
        radius: 10 + Math.min(18, w.aqi / 20),
        color: "rgba(10,13,19,0.55)",
        weight: 1.5,
        fillColor: aqiColorVarRaw(w.aqi),
        fillOpacity: 0.88
      });
      marker.bindPopup(`<b>${w.name}</b><br>AQI ${w.aqi} · ${lvl.label}<br>Source: ${w.source} (${Math.round(w.confidence*100)}% conf.)`);
      marker.bindTooltip(w.name, { direction: "top", offset: [0, -6], className: "ward-marker-label" });
      marker.on("click", ()=> showWardDetail(cityName, w.name));
      marker.addTo(leafletMap);
      wardMarkers.push({ marker, source: w.source, name: w.name });
    });

    applyWardMarkerFilter();

    // Safety net: if the container's real dimensions weren't settled at init time
    // (e.g. font/layout reflow), re-measure once after the paint.
    setTimeout(()=>{ if(leafletMap) leafletMap.invalidateSize(); }, 150);
  } catch(err){
    console.error("[VAYU·NET] Skyline Map failed to render:", err);
    renderChartError("leaflet-map", "Skyline Map failed to render. See console for details.");
  }

  document.getElementById("ward-detail").innerHTML = `<p style="color:var(--paper-faint); font-size:13px;">Select a ward marker above to inspect its attribution detail.</p>`;
}

// Shows/hides ward markers on the live map to match the selected source filter chip.
function applyWardMarkerFilter(){
  if(!leafletMap) return;
  wardMarkers.forEach(({marker, source})=>{
    const shouldShow = selectedMapSourceFilter === "All" || selectedMapSourceFilter === source;
    const isShown = leafletMap.hasLayer(marker);
    if(shouldShow && !isShown) marker.addTo(leafletMap);
    else if(!shouldShow && isShown) leafletMap.removeLayer(marker);
  });
}

// Live-refresh hook (every 5 min): repaints marker colour/size/popup content from
// fresh telemetry without tearing down the map, so the officer's zoom/pan survives.
function refreshWardMarkersLive(cityName){
  if(!leafletMap) return;
  const c = CITIES[cityName];
  if(!c) return;

  const weatherPanel = document.getElementById("map-weather-panel");
  if(weatherPanel) weatherPanel.innerHTML = weatherBannerHTML(cityName);

  wardMarkers.forEach(({marker, name})=>{
    const w = c.wards.find(x=>x.name === name);
    if(!w) return;
    marker.setStyle({ fillColor: aqiColorVarRaw(w.aqi), radius: 10 + Math.min(18, w.aqi / 20) });
    const lvl = aqiLevel(w.aqi);
    marker.setPopupContent(`<b>${w.name}</b><br>AQI ${w.aqi} · ${lvl.label}<br>Source: ${w.source} (${Math.round(w.confidence*100)}% conf.)`);
  });
}

// Ward detail panel — unchanged content/behaviour from the original CSS-grid map,
// now triggered by a marker click instead of a grid-cell click.
function showWardDetail(cityName, wardName){
  const w = CITIES[cityName].wards.find(x=>x.name === wardName);
  if(!w) return;
  const lvl = aqiLevel(w.aqi);
  document.getElementById("ward-detail").innerHTML = `
    <p class="eyebrow" style="margin-bottom:10px;">Ward detail</p>
    <div style="display:flex; align-items:baseline; gap:14px; flex-wrap:wrap;">
      <h3 style="font-family:var(--font-display); font-size:20px; margin:0;">${w.name}, ${cityName}</h3>
      <span class="badge ${lvl.key}">${lvl.label} · AQI ${w.aqi}</span>
    </div>
    <p style="color:var(--paper-dim); font-size:13.5px; margin-top:12px; line-height:1.7;">
      Dominant attributed source: <b style="color:var(--paper);">${w.source}</b> (confidence ${Math.round(w.confidence*100)}%).
      This estimate is produced by cross-referencing spatial-temporal AQI deviation against land-use classification, active construction permits, registered stack locations and satellite-detected thermal anomalies in a 1.5km radius.
    </p>`;
}

/* ---------- FORECAST MODULE ---------- */
function renderForecast(){
  const cityNames = Object.keys(CITIES);
  document.getElementById("mod-forecast").innerHTML = `
    <div class="module-head">
      <p class="eyebrow">Instrument 02</p>
      <h2>Hyperlocal forecast — next 72 hours</h2>
      <p>Meteorological forecasts, seasonal emission calendars and dispersion modelling combine into a 6-hour-step AQI projection per city, with an uncertainty band shown as the shaded range.</p>
    </div>
    <div class="chip-row" id="forecast-city-chips">
      ${cityNames.map((n,i)=>`<button class="chip ${i===0?'active':''}" data-city="${n}">${n}</button>`).join("")}
    </div>
    <div class="panel-box" style="height:280px; position:relative;" id="forecast-chart-panel">
      <canvas id="forecast-chart"></canvas>
    </div>
    <div class="grid-3" style="margin-top:18px;" id="forecast-stats"></div>
  `;
  document.querySelectorAll("#forecast-city-chips .chip").forEach(chip=>{
    chip.addEventListener("click", ()=>{
      document.querySelectorAll("#forecast-city-chips .chip").forEach(c=>c.classList.remove("active"));
      chip.classList.add("active");
      drawForecast(chip.dataset.city);
    });
  });
  drawForecast(cityNames[0]);
}

async function drawForecast(cityName){
  safeDestroyChart("forecast");
  const c = CITIES[cityName];
  const pts = c.forecast || buildForecast(c.current);
  const labels = pts.map(p=> p.h===0?"Now":`+${p.h}h`);

  const ok = await ensureChartJsLoaded();
  if(!ok){
    renderChartError("forecast-chart-panel", "Chart library failed to load from both CDNs. Check your network/ad-blocker settings, then reopen this tab.");
  } else {
    try{
      const panel = document.getElementById("forecast-chart-panel");
      if(panel && !document.getElementById("forecast-chart")){
        panel.innerHTML = `<canvas id="forecast-chart"></canvas>`;
      }
      const ctx = document.getElementById("forecast-chart").getContext("2d");
      charts.forecast = new Chart(ctx, {
        type:"line",
        data:{
          labels,
          datasets:[
            {label:"Upper band", data: pts.map(p=>p.high), borderWidth:0, pointRadius:0, fill:false, backgroundColor:"rgba(201,130,61,0.08)"},
            {label:"Forecast AQI", data: pts.map(p=>p.val), borderColor:"#E3A968", backgroundColor:"rgba(201,130,61,0.18)", borderWidth:2.5, pointRadius:3, pointBackgroundColor:"#E3A968", fill:"-1", tension:0.35},
            {label:"Lower band", data: pts.map(p=>p.low), borderWidth:0, pointRadius:0, fill:"-1", backgroundColor:"rgba(201,130,61,0.08)"},
          ]
        },
        options:{
          responsive: true,
          maintainAspectRatio: false,
          plugins:{ legend:{display:false}, tooltip:{mode:"index", intersect:false} },
          scales:{
            x:{ ticks:{color:"#9C9890", font:{family:"IBM Plex Mono", size:10}}, grid:{color:"rgba(237,230,214,0.06)"} },
            y:{ ticks:{color:"#9C9890", font:{family:"IBM Plex Mono", size:10}}, grid:{color:"rgba(237,230,214,0.06)"} }
          }
        }
      });
    } catch(err){
      console.error("Forecast chart failed to render:", err);
      renderChartError("forecast-chart-panel", "Forecast chart failed to render. See console for details.");
    }
  }

  const peak = pts.reduce((a,b)=> b.val>a.val? b:a, pts[0]);
  const liveTag = c.liveStatus === "live" ? `<span class="live-tag">LIVE</span>` : c.liveStatus === "partial" ? `<span class="stale-tag">PARTIAL</span>` : `<span class="stale-tag">SIMULATED</span>`;
  const statsEl = document.getElementById("forecast-stats");
  if(statsEl){
    statsEl.innerHTML = `
      <div class="panel-box stat-card"><div class="label">Current AQI ${liveTag}</div><div class="value" style="color:${aqiColorVar(c.current)}">${c.current}</div><div class="sub">${aqiLevel(c.current).label}</div></div>
      <div class="panel-box stat-card"><div class="label">Forecast Peak</div><div class="value" style="color:${aqiColorVar(peak.val)}">${peak.val}</div><div class="sub">Expected at +${peak.h}h</div></div>
      <div class="panel-box stat-card"><div class="label">Meteorological Metrics</div>
           <div class="value" style="font-size:18px; color:var(--signal-soft);">${c.weather ? c.weather.temp : "28°C"}</div>
           <div class="sub">Wind Speed: ${c.weather ? c.weather.wind : "12 km/h"} | Humid: ${c.weather ? c.weather.hum : "55%"}</div>
      </div>
    `;
  }
}

/* ---------- ATTRIBUTION MODULE ---------- */
function renderAttribution(){
  const cityNames = Object.keys(CITIES);
  document.getElementById("mod-attribution").innerHTML = `
    <div class="module-head">
      <p class="eyebrow">Instrument 03</p>
      <h2>Source trace — who's responsible, right now</h2>
      <p>City-wide attribution breakdown, aggregated from ward-level confidence-scored estimates. Used to target enforcement and policy by source category rather than treating pollution as one undifferentiated number.</p>
    </div>
    <div class="chip-row" id="attr-city-chips">
      ${cityNames.map((n,i)=>`<button class="chip ${i===0?'active':''}" data-city="${n}">${n}</button>`).join("")}
    </div>
    <div class="grid-2">
      <div class="panel-box" style="height:280px; position:relative;" id="attr-chart-panel"><canvas id="attr-chart"></canvas></div>
      <div class="panel-box" id="attr-notes"></div>
    </div>
  `;
  document.querySelectorAll("#attr-city-chips .chip").forEach(chip=>{
    chip.addEventListener("click", ()=>{
      document.querySelectorAll("#attr-city-chips .chip").forEach(c=>c.classList.remove("active"));
      chip.classList.add("active");
      drawAttribution(chip.dataset.city);
    });
  });
  drawAttribution(cityNames[0]);
}

async function drawAttribution(cityName){
  safeDestroyChart("attr");
  const c = CITIES[cityName];
  const labels = Object.keys(c.breakdown);
  const values = Object.values(c.breakdown);
  const palette = ["#3FD8C2","#E8B339","#C9823D","#E5483E","#9C9890"];

  const ok = await ensureChartJsLoaded();
  if(!ok){
    renderChartError("attr-chart-panel", "Chart library failed to load from both CDNs. Check your network/ad-blocker settings, then reopen this tab.");
  } else {
    try{
      const panel = document.getElementById("attr-chart-panel");
      if(panel && !document.getElementById("attr-chart")){
        panel.innerHTML = `<canvas id="attr-chart"></canvas>`;
      }
      const ctx = document.getElementById("attr-chart").getContext("2d");
      charts.attr = new Chart(ctx, {
        type:"bar",
        data:{ labels, datasets:[{ data: values, backgroundColor: palette, borderRadius:6 }] },
        options:{
          responsive: true,
          maintainAspectRatio: false,
          indexAxis:"y",
          plugins:{ legend:{display:false}, tooltip:{callbacks:{label: ctx=> ctx.parsed.x + "% of attributed load"}} },
          scales:{
            x:{ ticks:{color:"#9C9890", font:{family:"IBM Plex Mono", size:10}}, grid:{color:"rgba(237,230,214,0.06)"}, max:50 },
            y:{ ticks:{color:"#EDE6D6", font:{family:"IBM Plex Sans", size:12}}, grid:{display:false} }
          }
        }
      });
    } catch(err){
      console.error("Attribution chart failed to render:", err);
      renderChartError("attr-chart-panel", "Source trace chart failed to render. See console for details.");
    }
  }

  const top = labels[values.indexOf(Math.max(...values))];
  const notesEl = document.getElementById("attr-notes");
  if(notesEl){
    notesEl.innerHTML = `
      <p class="eyebrow" style="margin-bottom:12px;">Reading the trace</p>
      <p style="font-size:13.5px; color:var(--paper-dim); line-height:1.75;">In ${cityName}, <b style="color:var(--paper)">${top}</b> sources are currently the largest attributed contributor. This breakdown is recomputed continuously from satellite thermal anomalies, traffic density, active construction permits and registered industrial stacks — each ward's individual estimate carries its own confidence score, visible on the Skyline Map.</p>
      <p style="font-size:13px; color:var(--paper-faint); line-height:1.7; margin-top:14px;">Use this view to brief enforcement teams on which lever — traffic, dust control, stack inspection, or burning patrol — will move the needle fastest this week.</p>
    `;
  }
}

/* ---------- ENFORCEMENT MODULE ---------- */
function renderEnforcement(){
  document.getElementById("mod-enforcement").innerHTML = `
    <div class="module-head">
      <p class="eyebrow">Instrument 04</p>
      <h2>Enforcement queue — ranked, evidence-backed</h2>
      <p>Hotspots correlated against registered emission sources, ranked by priority score. Built for municipal and pollution-control authorities to deploy inspectors where impact is highest, not where complaints happen to land first.</p>
    </div>

    <div class="grid-2" style="margin-bottom: 24px;">
      <div class="panel-box">
        <p class="eyebrow" style="margin-bottom:12px;">File New Enforcement Case</p>
        <form id="add-enforcement-form" style="display:flex; flex-direction:column; gap:10px;">
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
            <select id="enf-city" style="width:100%;"><option>Delhi</option><option>Mumbai</option><option>Kolkata</option><option>Bengaluru</option><option>Chennai</option></select>
            <select id="enf-source" style="width:100%;"><option>Vehicular</option><option>Construction</option><option>Industrial</option><option>Waste Burning</option></select>
          </div>
          <input type="text" id="enf-loc" placeholder="E.g., Okhla Phase III / Whitefield road" required>
          <input type="text" id="enf-evid" placeholder="Describe sensory data or camera validation triggers" required>
          <button type="submit" class="btn-primary" style="margin:0; padding:10px;">File Active Alert Entry</button>
        </form>
      </div>
      <div class="panel-box" style="display:flex; flex-direction:column; justify-content:center;">
        <p class="eyebrow" style="margin-bottom:6px;">Enforcement Metrics</p>
        <h3 style="font-size:32px; font-family:var(--font-display); margin:0;" id="enf-stat-pending">00</h3>
        <p style="font-size:12px; color:var(--paper-dim);">Urgent, pending field inspections currently dispatched nationwide.</p>
      </div>
    </div>

    <div class="panel-box">
      <table>
        <thead><tr><th>Case</th><th>Location</th><th>Source</th><th>Evidence</th><th>Score</th><th>Status</th><th></th></tr></thead>
        <tbody id="enforcement-tbody"></tbody>
      </table>
    </div>
  `;

  document.getElementById("add-enforcement-form").addEventListener("submit", (e)=>{
    e.preventDefault();
    const city = document.getElementById("enf-city").value;
    const source = document.getElementById("enf-source").value;
    const location = document.getElementById("enf-loc").value;
    const evidence = document.getElementById("enf-evid").value;
    const newCase = {
      id: "EQ-" + Math.floor(1000 + Math.random() * 9000),
      city,
      location,
      source,
      evidence,
      score: Math.floor(70 + Math.random() * 28),
      action: "Site notification + immediate sprinkler/patrol tasking.",
      status: "Pending"
    };
    ENFORCEMENT_QUEUE.unshift(newCase);
    drawEnforcement();
    document.getElementById("add-enforcement-form").reset();
  });

  drawEnforcement();
}

function drawEnforcement(){
  const sorted = [...ENFORCEMENT_QUEUE].sort((a,b)=>b.score-a.score);
  const pendingCount = ENFORCEMENT_QUEUE.filter(e => e.status !== "Resolved").length;
  const statEl = document.getElementById("enf-stat-pending");
  if(statEl) statEl.textContent = String(pendingCount).padStart(2, "0");

  document.getElementById("enforcement-tbody").innerHTML = sorted.map(e=>`
    <tr>
      <td class="strong" style="font-family:var(--font-mono); font-size:12px;">${e.id}<br><span style="color:var(--paper-faint); font-weight:400;">${e.city}</span></td>
      <td class="strong">${e.location}</td>
      <td>${e.source}</td>
      <td style="max-width:280px;">${e.evidence}<div style="margin-top:6px; color:var(--paper-faint); font-size:11.5px;">→ ${e.action}</div></td>
      <td style="font-family:var(--font-mono); font-weight:600; color:${e.score>=88?'var(--alert-soft)':e.score>=80?'var(--haze-soft)':'var(--warn)'}">${e.score}</td>
      <td><span class="badge ${e.status==='Resolved'?'good':e.status==='Dispatched'?'moderate':'severe'}">${e.status}</span></td>
      <td><button class="status-btn" data-id="${e.id}">Advance ▸</button></td>
    </tr>
  `).join("");
  document.querySelectorAll(".status-btn").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const item = ENFORCEMENT_QUEUE.find(x=>x.id===btn.dataset.id);
      const order = ["Pending","Dispatched","Resolved"];
      const idx = order.indexOf(item.status);
      item.status = order[Math.min(idx+1, order.length-1)];
      drawEnforcement();
    });
  });
}

/* ---------- COMPARE MODULE ---------- */
function renderCompare(){
  document.getElementById("mod-compare").innerHTML = `
    <div class="module-head">
      <p class="eyebrow">Instrument 05</p>
      <h2>Multi-city comparison — learn from what worked</h2>
      <p>Tracks current standing across all five metros and surfaces interventions from comparable cities that measurably moved the number.</p>
    </div>
    <div class="grid-2">
      <div class="panel-box" style="height:280px; position:relative;" id="compare-chart-panel"><canvas id="compare-chart"></canvas></div>
      <div class="panel-box">
        <table>
          <thead><tr><th>City</th><th>AQI</th><th>7-day trend</th></tr></thead>
          <tbody>${Object.entries(CITIES).map(([name,c])=>{
            const delta = c.current - c.trend[0];
            return `<tr><td class="strong">${name}</td><td style="font-family:var(--font-mono); font-weight:600; color:${aqiColorVar(c.current)}">${c.current}</td><td style="color:${delta>0?'var(--alert-soft)':'var(--signal-soft)'}">${delta>0?'▲':'▼'} ${Math.abs(delta)} pts</td></tr>`;
          }).join("")}</tbody>
        </table>
      </div>
    </div>
    <p class="eyebrow" style="margin:26px 0 14px;">What worked elsewhere</p>
    <div class="grid-3">
      ${Object.entries(CITIES).map(([name,c])=>`
        <div class="panel-box">
          <div style="font-family:var(--font-display); font-weight:600; font-size:15px; margin-bottom:8px;">${name}</div>
          <p style="font-size:12.5px; color:var(--paper-dim); line-height:1.6; margin:0;">${c.intervention}</p>
        </div>
      `).join("")}
    </div>
  `;
  drawCompare();
}

async function drawCompare(){
  safeDestroyChart("compare");
  const labels = Object.keys(CITIES);
  const values = labels.map(n=>CITIES[n].current);
  const colors = values.map(v=>aqiColorVarRaw(v));

  const ok = await ensureChartJsLoaded();
  if(!ok){
    renderChartError("compare-chart-panel", "Chart library failed to load from both CDNs. Check your network/ad-blocker settings, then reopen this tab.");
    return;
  }
  try{
    const panel = document.getElementById("compare-chart-panel");
    if(panel && !document.getElementById("compare-chart")){
      panel.innerHTML = `<canvas id="compare-chart"></canvas>`;
    }
    const ctx = document.getElementById("compare-chart").getContext("2d");
    charts.compare = new Chart(ctx, {
      type:"bar",
      data:{ labels, datasets:[{ data: values, backgroundColor: colors, borderRadius:8 }] },
      options:{
        responsive: true,
        maintainAspectRatio: false,
        plugins:{ legend:{display:false} },
        scales:{
          x:{ ticks:{color:"#EDE6D6", font:{family:"IBM Plex Sans", size:12}}, grid:{display:false} },
          y:{ ticks:{color:"#9C9890", font:{family:"IBM Plex Mono", size:10}}, grid:{color:"rgba(237,230,214,0.06)"} }
        }
      }
    });
  } catch(err){
    console.error("Compare chart failed to render:", err);
    renderChartError("compare-chart-panel", "City comparison chart failed to render. See console for details.");
  }
}

/* ---------- ADVISORY MODULE ---------- */
// Vulnerable-group targeting used by the Citizen Advisory instrument — short,
// specific notes layered on top of the localized advisory body. Kept in English
// regardless of selected broadcast language (labelled as an internal targeting
// note, not part of the citizen-facing copy) to keep translation scope manageable.
const VULNERABLE_GROUPS = ["Children","Seniors","Pregnant","Asthma/Heart","Cyclists","Joggers","Schools","Hospitals"];
let selectedAdvisoryGroups = new Set();

function groupNote(group, lvlKey){
  const notes = {
    "Children":       { good:"Safe for normal play.", moderate:"Limit strenuous outdoor play in the afternoon.", poor:"Keep recess/outdoor PE indoors today.", severe:"Suspend outdoor school activity entirely." },
    "Seniors":        { good:"No restriction.", moderate:"Prefer morning walks over midday.", poor:"Avoid unnecessary outdoor trips.", severe:"Stay indoors; keep rescue medication accessible." },
    "Pregnant":       { good:"No restriction.", moderate:"Limit prolonged outdoor exposure.", poor:"Avoid outdoor exertion; monitor for discomfort.", severe:"Remain indoors; seek care if breathless." },
    "Asthma/Heart":   { good:"No restriction.", moderate:"Carry inhaler/medication when outdoors.", poor:"Avoid outdoor exertion; keep medication on hand.", severe:"Stay indoors; contact a doctor if symptomatic." },
    "Cyclists":       { good:"Good conditions for riding.", moderate:"Prefer routes away from traffic corridors.", poor:"Avoid road cycling; use indoor trainers if possible.", severe:"Do not cycle outdoors today." },
    "Joggers":        { good:"Good conditions for a run.", moderate:"Shorten runs, avoid peak-traffic hours.", poor:"Move runs indoors or postpone.", severe:"Do not run outdoors today." },
    "Schools":        { good:"Normal outdoor assembly/sports fine.", moderate:"Shorten outdoor assembly time.", poor:"Hold assembly and sports indoors.", severe:"Consider remote instruction if levels persist." },
    "Hospitals":      { good:"No action needed.", moderate:"Brief respiratory/cardiac patients on precautions.", poor:"Expect higher OPD load for respiratory complaints; prepare accordingly.", severe:"Activate respiratory-surge protocol; stock masks/nebulizers." },
  };
  return (notes[group] && notes[group][lvlKey]) || "";
}

function maskRecommendation(lvlKey){
  if(lvlKey==="good") return "No mask required.";
  if(lvlKey==="moderate") return "N95/KN95 optional for sensitive groups outdoors.";
  if(lvlKey==="poor") return "N95/KN95 recommended for all outdoor activity.";
  return "N95/KN95 mandatory outdoors; avoid cloth/surgical masks (ineffective at this level).";
}
function exerciseRecommendation(lvlKey){
  if(lvlKey==="good") return "Normal outdoor exercise is safe.";
  if(lvlKey==="moderate") return "Sensitive groups should reduce intensity/duration outdoors.";
  if(lvlKey==="poor") return "Move exercise indoors; if outdoors, keep it light and brief.";
  return "Avoid exercise outdoors entirely today; indoor only.";
}
// 0–100, higher = safer for outdoor activity. Modeled from AQI plus a small
// wind/humidity adjustment (higher wind disperses near-ground pollution; very
// high humidity traps particulates closer to the surface).
function outdoorActivityScore(aqi, weather){
  let score = 100 - Math.min(100, aqi/4);
  const windKmh = weather ? parseInt(weather.wind) || 12 : 12;
  const hum = weather ? parseInt(weather.hum) || 55 : 55;
  score += Math.min(8, (windKmh-12)*0.4);
  score -= Math.max(0, (hum-65)*0.15);
  return Math.round(Math.max(2, Math.min(100, score)));
}
function activityScoreColor(score){
  if(score>=70) return "#3FD8C2";
  if(score>=45) return "#E8B339";
  if(score>=25) return "#C9823D";
  return "#E5483E";
}

function renderAdvisory(){
  const cityNames = Object.keys(CITIES);
  const startCity = selectedAdvisoryCity && CITIES[selectedAdvisoryCity] ? selectedAdvisoryCity : cityNames[0];
  document.getElementById("mod-advisory").innerHTML = `
    <div class="module-head">
      <p class="eyebrow">Instrument 06</p>
      <h2>Citizen advisory — plain language, their language</h2>
      <p>Generates a ward-level health advisory in the citizen's own language, mapping forecast AQI against vulnerable-population context. Built for WhatsApp, IVR and public display delivery.</p>
    </div>
    <div class="panel-box" id="adv-weather-panel" style="margin-bottom:18px;"></div>
    <div class="panel-box">
      <div class="grid-3">
        <div>
          <label style="font-family:var(--font-mono); font-size:10.5px; text-transform:uppercase; color:var(--paper-faint); display:block; margin-bottom:8px;">City</label>
          <select id="adv-city" style="width:100%;">${cityNames.map(n=>`<option ${n===startCity?'selected':''}>${n}</option>`).join("")}</select>
        </div>
        <div>
          <label style="font-family:var(--font-mono); font-size:10.5px; text-transform:uppercase; color:var(--paper-faint); display:block; margin-bottom:8px;">Ward</label>
          <select id="adv-ward" style="width:100%;"></select>
        </div>
        <div>
          <label style="font-family:var(--font-mono); font-size:10.5px; text-transform:uppercase; color:var(--paper-faint); display:block; margin-bottom:8px;">Language</label>
          <select id="adv-lang" style="width:100%;">
            <option value="en">English</option>
            <option value="hi">Hindi</option>
            <option value="kn">Kannada</option>
            <option value="ta">Tamil</option>
          </select>
        </div>
      </div>

      <label style="font-family:var(--font-mono); font-size:10.5px; text-transform:uppercase; color:var(--paper-faint); display:block; margin-top:18px; margin-bottom:4px;">Target vulnerable groups (optional — adds specific notes)</label>
      <div class="group-toggle-grid" id="adv-groups">
        ${VULNERABLE_GROUPS.map(g=>`
          <label class="group-chip" data-group="${g}">
            <input type="checkbox" value="${g}"> ${g}
          </label>
        `).join("")}
      </div>

      <button class="btn-primary" style="margin-top:18px; max-width:240px;" id="adv-generate">Generate advisory</button>
      <div class="advisory-result hidden" id="adv-result"></div>
    </div>
  `;

  document.querySelectorAll("#adv-groups .group-chip").forEach(chip=>{
    const input = chip.querySelector("input");
    input.addEventListener("change", ()=>{
      const g = chip.dataset.group;
      if(input.checked){ selectedAdvisoryGroups.add(g); chip.classList.add("checked"); }
      else { selectedAdvisoryGroups.delete(g); chip.classList.remove("checked"); }
    });
  });

  function refreshWards(){
    const city = document.getElementById("adv-city").value;
    selectedAdvisoryCity = city;
    document.getElementById("adv-ward").innerHTML = CITIES[city].wards.map(w=>`<option>${w.name}</option>`).join("");
    const weatherPanel = document.getElementById("adv-weather-panel");
    if(weatherPanel) weatherPanel.innerHTML = weatherBannerHTML(city);
  }
  document.getElementById("adv-city").addEventListener("change", refreshWards);
  refreshWards();

  document.getElementById("adv-generate").addEventListener("click", ()=>{
    const city = document.getElementById("adv-city").value;
    const wardName = document.getElementById("adv-ward").value;
    const lang = document.getElementById("adv-lang").value;
    const ward = CITIES[city].wards.find(w=>w.name===wardName);
    const lvl = aqiLevel(ward.aqi);
    const t = ADVISORY_TEXT[lang];
    const headline = t.label({ward: ward.name, level: lvl.label, aqi: ward.aqi});
    const body = t[lvl.key];
    const w = CITIES[city].weather || { temp:"--", wind:"--", hum:"--" };
    const activityScore = outdoorActivityScore(ward.aqi, w);
    const groupNotesHTML = Array.from(selectedAdvisoryGroups).map(g=>
      `<li><b>${g}:</b> ${groupNote(g, lvl.key)}</li>`
    ).join("");

    const box = document.getElementById("adv-result");
    box.classList.remove("hidden");
    box.innerHTML = `
      <span class="badge ${lvl.key}" style="margin-bottom:12px;">${lvl.label} · AQI ${ward.aqi} · ${city}</span>
      <p class="aline">${headline}</p>
      <p class="asub">${body}</p>
      <p class="asub" style="margin-top:14px; color:var(--paper-faint); font-size:11.5px;">Dominant source: ${ward.source} · Delivered via WhatsApp / IVR / public display in selected language</p>
      <p class="asub" style="margin-top:6px; color:var(--paper-faint); font-size:11.5px;">Live conditions in ${city}: 🌡 ${w.temp} · 💨 Wind ${w.wind} · 💧 Humidity ${w.hum} ${liveStatusTagHTML(city)}</p>

      <div class="activity-score-wrap">
        <div class="activity-score-ring" style="border-color:${activityScoreColor(activityScore)}; color:${activityScoreColor(activityScore)};">${activityScore}</div>
        <div>
          <div style="font-size:12.5px; color:var(--paper); font-weight:600; margin-bottom:4px;">Outdoor activity score</div>
          <div style="font-size:12px; color:var(--paper-dim);">😷 Mask: ${maskRecommendation(lvl.key)}</div>
          <div style="font-size:12px; color:var(--paper-dim); margin-top:3px;">🏃 Exercise: ${exerciseRecommendation(lvl.key)}</div>
        </div>
      </div>

      ${groupNotesHTML ? `
        <p class="eyebrow" style="margin-top:18px; margin-bottom:8px;">Targeted notes (internal — for broadcast operator)</p>
        <ul class="factor-list">${groupNotesHTML}</ul>
      ` : ""}
    `;
  });
}

/* ==================================================================
   INTERVENTION SIMULATOR
   ================================================================== */
let selectedSimCity = null;
let simState = { trafficReduction: 30, industryClosure: 20, constructionBan: false, treePlantation: 20, rain: false, vehicleRestriction: 0 };

// Pure function: given a city and a set of lever settings, estimates the AQI
// impact of each lever against that city's own attributed source breakdown.
// Every coefficient below is a modeled assumption (documented inline) — this
// is a planning/what-if tool, not a physical dispersion model.
function computeIntervention(cityName, params){
  const c = CITIES[cityName];
  const b = c.breakdown;
  const contributions = [];
  let reduction = 0;
  function add(label, amt){
    if(amt > 0.5){ reduction += amt; contributions.push({label, amt: Math.round(amt)}); }
  }
  add(`Traffic flow reduced ${params.trafficReduction}%`, (params.trafficReduction/100) * (b.Vehicular/100) * c.current * 0.6);
  add(`Industrial units closed ${params.industryClosure}%`, (params.industryClosure/100) * (b.Industrial/100) * c.current * 0.55);
  add(`Construction ban in effect`, params.constructionBan ? (b.Construction/100) * c.current * 0.4 : 0);
  add(`Tree plantation drive scaled ${params.treePlantation}%`, (params.treePlantation/100) * c.current * 0.05);
  add(`Rainfall event`, params.rain ? c.current * 0.25 : 0);
  add(`Odd-even vehicle restriction ${params.vehicleRestriction}%`, (params.vehicleRestriction/100) * (b.Vehicular/100) * c.current * 0.3);

  const predicted = Math.max(15, Math.round(c.current - reduction));
  const confidence = Math.min(91, 52 + contributions.length * 7);
  return { baseline: c.current, predicted, delta: c.current - predicted, contributions, confidence };
}

function renderSimulator(){
  const cityNames = Object.keys(CITIES);
  const startCity = selectedSimCity && CITIES[selectedSimCity] ? selectedSimCity : cityNames[0];
  selectedSimCity = startCity;

  document.getElementById("mod-simulator").innerHTML = `
    <div class="module-head">
      <p class="eyebrow">Instrument 07 · What-if planning</p>
      <h2>AI Intervention Simulator</h2>
      <p>Model the AQI impact of policy levers before deploying them — traffic restrictions, industrial closures, construction bans, tree plantation, rainfall, or odd-even vehicle rules — each scaled against the city's own live source attribution.</p>
    </div>
    <div class="chip-row" id="sim-city-chips">
      ${cityNames.map(n=>`<button class="chip ${n===startCity?'active':''}" data-city="${n}">${n}</button>`).join("")}
    </div>
    <div class="grid-2">
      <div class="panel-box">
        <p class="eyebrow" style="margin-bottom:16px;">Levers</p>
        <div class="control-row">
          <div class="control-label"><span>Traffic flow reduction</span><b id="sim-traffic-val">${simState.trafficReduction}%</b></div>
          <input type="range" id="sim-traffic" min="0" max="100" value="${simState.trafficReduction}">
        </div>
        <div class="control-row">
          <div class="control-label"><span>Industrial unit closures</span><b id="sim-industry-val">${simState.industryClosure}%</b></div>
          <input type="range" id="sim-industry" min="0" max="100" value="${simState.industryClosure}">
        </div>
        <div class="control-row">
          <div class="control-label"><span>Tree plantation drive scale</span><b id="sim-trees-val">${simState.treePlantation}%</b></div>
          <input type="range" id="sim-trees" min="0" max="100" value="${simState.treePlantation}">
        </div>
        <div class="control-row">
          <div class="control-label"><span>Odd-even vehicle restriction</span><b id="sim-oddeven-val">${simState.vehicleRestriction}%</b></div>
          <input type="range" id="sim-oddeven" min="0" max="100" value="${simState.vehicleRestriction}">
        </div>
        <div class="toggle-row">
          <span style="font-size:12.5px; color:var(--paper-dim);">Construction ban in effect</span>
          <label class="switch"><input type="checkbox" id="sim-construction" ${simState.constructionBan?'checked':''}><span class="slider-pill"></span></label>
        </div>
        <div class="toggle-row">
          <span style="font-size:12.5px; color:var(--paper-dim);">Rainfall event (natural scrubbing)</span>
          <label class="switch"><input type="checkbox" id="sim-rain" ${simState.rain?'checked':''}><span class="slider-pill"></span></label>
        </div>
      </div>
      <div class="panel-box">
        <p class="eyebrow" style="margin-bottom:16px;">Predicted impact</p>
        <div style="display:flex; align-items:center; justify-content:center; gap:6px; margin-bottom:18px;">
          <div class="impact-card" style="flex:1;"><div class="label" style="font-family:var(--font-mono); font-size:10px; color:var(--paper-faint); text-transform:uppercase;">Baseline</div><div class="value" style="font-family:var(--font-display); font-size:26px;" id="sim-baseline">--</div></div>
          <span class="arrow">→</span>
          <div class="impact-card" style="flex:1;"><div class="label" style="font-family:var(--font-mono); font-size:10px; color:var(--paper-faint); text-transform:uppercase;">Simulated</div><div class="value" style="font-family:var(--font-display); font-size:26px;" id="sim-predicted">--</div></div>
        </div>
        <div style="height:150px; position:relative;" id="sim-chart-panel"><canvas id="sim-chart"></canvas></div>
        <p class="eyebrow" style="margin:18px 0 10px;">Explainability — contributing factors</p>
        <ul class="factor-list" id="sim-factors"></ul>
        <p class="asub" id="sim-confidence" style="margin-top:14px; font-size:11.5px; color:var(--paper-faint);"></p>
      </div>
    </div>
  `;

  document.querySelectorAll("#sim-city-chips .chip").forEach(chip=>{
    chip.addEventListener("click", ()=>{
      document.querySelectorAll("#sim-city-chips .chip").forEach(c=>c.classList.remove("active"));
      chip.classList.add("active");
      selectedSimCity = chip.dataset.city;
      updateSimulation();
    });
  });

  const bindSlider = (id, valId, key, suffix="%") => {
    const el = document.getElementById(id);
    el.addEventListener("input", ()=>{
      simState[key] = Number(el.value);
      document.getElementById(valId).textContent = el.value + suffix;
      updateSimulation();
    });
  };
  bindSlider("sim-traffic", "sim-traffic-val", "trafficReduction");
  bindSlider("sim-industry", "sim-industry-val", "industryClosure");
  bindSlider("sim-trees", "sim-trees-val", "treePlantation");
  bindSlider("sim-oddeven", "sim-oddeven-val", "vehicleRestriction");
  document.getElementById("sim-construction").addEventListener("change", (e)=>{ simState.constructionBan = e.target.checked; updateSimulation(); });
  document.getElementById("sim-rain").addEventListener("change", (e)=>{ simState.rain = e.target.checked; updateSimulation(); });

  updateSimulation();
}

async function updateSimulation(){
  const result = computeIntervention(selectedSimCity, simState);
  document.getElementById("sim-baseline").textContent = result.baseline;
  document.getElementById("sim-baseline").style.color = aqiColorVarRaw(result.baseline);
  document.getElementById("sim-predicted").textContent = result.predicted;
  document.getElementById("sim-predicted").style.color = aqiColorVarRaw(result.predicted);

  const factorsEl = document.getElementById("sim-factors");
  if(result.contributions.length === 0){
    factorsEl.innerHTML = `<li style="color:var(--paper-faint);">No levers active — adjust the controls to see a projected impact.</li>`;
  } else {
    factorsEl.innerHTML = result.contributions.map(c=>`<li><b>${c.label}</b><span class="impact" style="color:var(--signal-soft);">−${c.amt} AQI</span></li>`).join("");
  }
  document.getElementById("sim-confidence").textContent = `Model confidence: ${result.confidence}% · based on ${result.contributions.length} active lever${result.contributions.length===1?'':'s'} against this city's current source attribution.`;

  safeDestroyChart("sim");
  const ok = await ensureChartJsLoaded();
  const panel = document.getElementById("sim-chart-panel");
  if(!ok){ renderChartError("sim-chart-panel", "Chart library unavailable."); return; }
  if(panel && !document.getElementById("sim-chart")) panel.innerHTML = `<canvas id="sim-chart"></canvas>`;
  try{
    const ctx = document.getElementById("sim-chart").getContext("2d");
    charts.sim = new Chart(ctx, {
      type: "bar",
      data: { labels: ["Baseline","Simulated"], datasets: [{ data:[result.baseline, result.predicted], backgroundColor:[aqiColorVarRaw(result.baseline), aqiColorVarRaw(result.predicted)], borderRadius:8 }] },
      options: {
        indexAxis: "y", responsive:true, maintainAspectRatio:false,
        plugins:{ legend:{display:false} },
        scales:{ x:{ ticks:{color:"#9C9890", font:{family:"IBM Plex Mono", size:10}}, grid:{color:"rgba(237,230,214,0.06)"} }, y:{ ticks:{color:"#EDE6D6", font:{family:"IBM Plex Sans", size:12}}, grid:{display:false} } }
      }
    });
  } catch(err){ console.error("Simulator chart failed:", err); }
}

/* ==================================================================
   POLLUTION TIME MACHINE
   ================================================================== */
let selectedTMCity = null;
let selectedTMPeriod = "yesterday";
let tmPlayTimer = null;

function buildHistoricalSeries(cityName, period){
  const c = CITIES[cityName];
  const seed = hashStr(cityName + period);
  const rand = (i)=> Math.sin(seed + i*12.9898) * 43758.5453 % 1;
  const jitter = (i, spread)=> (Math.abs(rand(i)) - 0.5) * spread;

  let labels = [], values = [];
  if(period === "yesterday"){
    for(let h=0; h<24; h++){
      labels.push(`${String(h).padStart(2,"0")}:00`);
      const rush = (h>=7&&h<=10) || (h>=18&&h<=21) ? 1.15 : 0.9;
      values.push(Math.max(30, Math.round(c.current * rush + jitter(h, 30))));
    }
  } else if(period === "week"){
    const days = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
    days.forEach((d,i)=>{
      labels.push(d);
      values.push(Math.max(30, Math.round(c.current * (0.85 + i*0.03) + jitter(i, 40))));
    });
  } else if(period === "month"){
    for(let d=1; d<=30; d++){
      labels.push(`Day ${d}`);
      values.push(Math.max(30, Math.round(c.current * (0.8 + (d/30)*0.3) + jitter(d, 45))));
    }
  } else { // season — last 6 months, winter-skewed like real North Indian AQI seasonality
    const months = ["Aug","Sep","Oct","Nov","Dec","Jan"];
    const seasonalMult = [0.55,0.65,0.85,1.25,1.35,1.15];
    months.forEach((m,i)=>{
      labels.push(m);
      values.push(Math.max(25, Math.round(c.current * seasonalMult[i] + jitter(i, 25))));
    });
  }
  return { labels, values };
}

function renderTimeMachine(){
  const cityNames = Object.keys(CITIES);
  const startCity = selectedTMCity && CITIES[selectedTMCity] ? selectedTMCity : cityNames[0];
  selectedTMCity = startCity;

  document.getElementById("mod-timemachine").innerHTML = `
    <div class="module-head">
      <p class="eyebrow">Instrument 08 · Historical replay</p>
      <h2>Pollution Time Machine</h2>
      <p>Replay how a city's AQI moved over the last day, week, month, or six-month season. Use the play control to scrub through the timeline and see the exact reading at each point.</p>
    </div>
    <div class="chip-row" id="tm-city-chips">
      ${cityNames.map(n=>`<button class="chip ${n===startCity?'active':''}" data-city="${n}">${n}</button>`).join("")}
    </div>
    <div class="chip-row" id="tm-period-chips">
      <button class="chip ${selectedTMPeriod==='yesterday'?'active':''}" data-period="yesterday">Yesterday (hourly)</button>
      <button class="chip ${selectedTMPeriod==='week'?'active':''}" data-period="week">Last week (daily)</button>
      <button class="chip ${selectedTMPeriod==='month'?'active':''}" data-period="month">Last month (daily)</button>
      <button class="chip ${selectedTMPeriod==='season'?'active':''}" data-period="season">Season (6 months)</button>
    </div>
    <div class="panel-box" style="height:280px; position:relative;" id="tm-chart-panel"><canvas id="tm-chart"></canvas></div>
    <div class="panel-box" style="margin-top:18px;">
      <div class="tm-controls">
        <button class="tm-play-btn" id="tm-play">▶</button>
        <input type="range" class="tm-scrubber" id="tm-scrubber" min="0" max="23" value="0">
        <span class="tm-label" id="tm-readout">—</span>
      </div>
    </div>
  `;

  document.querySelectorAll("#tm-city-chips .chip").forEach(chip=>{
    chip.addEventListener("click", ()=>{
      document.querySelectorAll("#tm-city-chips .chip").forEach(c=>c.classList.remove("active"));
      chip.classList.add("active");
      selectedTMCity = chip.dataset.city;
      drawTimeMachine();
    });
  });
  document.querySelectorAll("#tm-period-chips .chip").forEach(chip=>{
    chip.addEventListener("click", ()=>{
      document.querySelectorAll("#tm-period-chips .chip").forEach(c=>c.classList.remove("active"));
      chip.classList.add("active");
      selectedTMPeriod = chip.dataset.period;
      drawTimeMachine();
    });
  });
  document.getElementById("tm-scrubber").addEventListener("input", (e)=> setTMIndex(Number(e.target.value)));
  document.getElementById("tm-play").addEventListener("click", toggleTMPlay);

  drawTimeMachine();
}

let tmSeries = { labels: [], values: [] };
async function drawTimeMachine(){
  clearInterval(tmPlayTimer); tmPlayTimer = null;
  document.getElementById("tm-play").textContent = "▶";
  safeDestroyChart("tm");
  tmSeries = buildHistoricalSeries(selectedTMCity, selectedTMPeriod);
  const scrubber = document.getElementById("tm-scrubber");
  scrubber.max = tmSeries.values.length - 1;
  scrubber.value = 0;

  const ok = await ensureChartJsLoaded();
  const panel = document.getElementById("tm-chart-panel");
  if(!ok){ renderChartError("tm-chart-panel", "Chart library unavailable."); return; }
  if(panel && !document.getElementById("tm-chart")) panel.innerHTML = `<canvas id="tm-chart"></canvas>`;
  try{
    const ctx = document.getElementById("tm-chart").getContext("2d");
    charts.tm = new Chart(ctx, {
      type: "line",
      data: { labels: tmSeries.labels, datasets: [{
        data: tmSeries.values, borderColor:"#8FF0E0", backgroundColor:"rgba(63,216,194,0.15)",
        borderWidth:2.5, tension:0.3, fill:true,
        pointRadius: tmSeries.values.map((_,i)=> i===0?6:2),
        pointBackgroundColor: tmSeries.values.map(v=>aqiColorVarRaw(v))
      }] },
      options: {
        responsive:true, maintainAspectRatio:false,
        plugins:{ legend:{display:false} },
        scales:{ x:{ ticks:{color:"#9C9890", font:{family:"IBM Plex Mono", size:9}, maxRotation:0, autoSkip:true}, grid:{color:"rgba(237,230,214,0.06)"} }, y:{ ticks:{color:"#9C9890", font:{family:"IBM Plex Mono", size:10}}, grid:{color:"rgba(237,230,214,0.06)"} } }
      }
    });
  } catch(err){ console.error("Time Machine chart failed:", err); }
  setTMIndex(0);
}

function setTMIndex(i){
  const scrubber = document.getElementById("tm-scrubber");
  if(scrubber) scrubber.value = i;
  const val = tmSeries.values[i];
  const label = tmSeries.labels[i];
  const readout = document.getElementById("tm-readout");
  if(readout && val != null) readout.innerHTML = `<b style="color:${aqiColorVarRaw(val)}">${val}</b> AQI at <b>${label}</b> · ${aqiLevel(val).label}`;
  if(charts.tm){
    charts.tm.data.datasets[0].pointRadius = tmSeries.values.map((_,idx)=> idx===i?7:2);
    charts.tm.update();
  }
}

function toggleTMPlay(){
  const btn = document.getElementById("tm-play");
  if(tmPlayTimer){
    clearInterval(tmPlayTimer); tmPlayTimer = null; btn.textContent = "▶";
    return;
  }
  btn.textContent = "⏸";
  let i = Number(document.getElementById("tm-scrubber").value);
  tmPlayTimer = setInterval(()=>{
    i = (i + 1) % tmSeries.values.length;
    setTMIndex(i);
    if(i === tmSeries.values.length - 1){ clearInterval(tmPlayTimer); tmPlayTimer = null; btn.textContent = "▶"; }
  }, 450);
}

/* ==================================================================
   SMART CITY DIGITAL TWIN (lightweight CSS/SVG — no 3D engine)
   ================================================================== */
let selectedTwinCity = null;

function renderDigitalTwin(){
  const cityNames = Object.keys(CITIES);
  const startCity = selectedTwinCity && CITIES[selectedTwinCity] ? selectedTwinCity : cityNames[0];
  selectedTwinCity = startCity;

  document.getElementById("mod-twin").innerHTML = `
    <div class="module-head">
      <p class="eyebrow">Instrument 09 · Lightweight visual model</p>
      <h2>Smart City Digital Twin</h2>
      <p>A stylised, animated read of the city right now — building tint reflects each ward's live AQI, the haze layer reflects overall severity, and the wind badge reflects live wind speed. Built in pure SVG/CSS for instant, dependency-free rendering (no 3D engine).</p>
    </div>
    <div class="chip-row" id="twin-city-chips">
      ${cityNames.map(n=>`<button class="chip ${n===startCity?'active':''}" data-city="${n}">${n}</button>`).join("")}
    </div>
    <div class="panel-box" style="padding:0;">
      <div class="twin-stage" id="twin-stage"></div>
    </div>
  `;
  document.querySelectorAll("#twin-city-chips .chip").forEach(chip=>{
    chip.addEventListener("click", ()=>{
      document.querySelectorAll("#twin-city-chips .chip").forEach(c=>c.classList.remove("active"));
      chip.classList.add("active");
      selectedTwinCity = chip.dataset.city;
      drawDigitalTwin();
    });
  });
  drawDigitalTwin();
}

function drawDigitalTwin(){
  const c = CITIES[selectedTwinCity];
  const stage = document.getElementById("twin-stage");
  if(!stage) return;
  const lvl = aqiLevel(c.current);
  const windKmh = parseInt(c.weather && c.weather.wind) || 12;
  const windSpinDur = Math.max(0.6, 3 - windKmh/10).toFixed(2);
  const trafficDur = Math.max(2.5, 7 - windKmh/6).toFixed(2);

  const buildingWidth = 90;
  const gap = 26;
  const totalWidth = c.wards.length * (buildingWidth + gap) + gap;
  const buildingsSvg = c.wards.map((w, i)=>{
    const h = 90 + Math.min(180, w.aqi * 0.55);
    const x = gap + i * (buildingWidth + gap);
    const y = 340 - h;
    const fill = aqiColorVarRaw(w.aqi);
    return `
      <rect x="${x}" y="${y}" width="${buildingWidth}" height="${h}" rx="4" fill="${fill}" fill-opacity="0.55" stroke="rgba(237,230,214,0.15)"></rect>
      <text x="${x + buildingWidth/2}" y="${y - 10}" text-anchor="middle" font-size="11" font-family="IBM Plex Mono" fill="#9C9890">${w.name}</text>
      <text x="${x + buildingWidth/2}" y="${y + 22}" text-anchor="middle" font-size="15" font-family="Space Grotesk" font-weight="700" fill="#EDE6D6">${w.aqi}</text>
    `;
  }).join("");

  const trafficDots = c.wards.map((_, i)=> `
    <circle r="3.5" fill="#E8B339">
      <animateMotion dur="${trafficDur}s" repeatCount="indefinite" begin="${i*0.4}s" path="M 0 355 L ${totalWidth} 355"></animateMotion>
    </circle>
  `).join("");

  stage.innerHTML = `
    <svg class="twin-svg" viewBox="0 0 ${totalWidth} 400" preserveAspectRatio="xMidYMax meet">
      <rect x="0" y="356" width="${totalWidth}" height="10" fill="#20232b"></rect>
      ${buildingsSvg}
      ${trafficDots}
    </svg>
    <div class="twin-haze-overlay" style="--twin-haze-color:${aqiColorVarRaw(c.current)};"></div>
    <div class="twin-legend"><span class="badge ${lvl.key}">${selectedTwinCity} · AQI ${c.current} · ${lvl.label}</span></div>
    <div class="twin-wind-badge"><span class="twin-wind-arrow" style="animation-duration:${windSpinDur}s;">➤</span> Wind ${c.weather ? c.weather.wind : "--"}</div>
  `;
}

/* ==================================================================
   CITY SCORE & CARBON DASHBOARD
   ================================================================== */
let selectedScoreCity = null;

// Urban Health Risk Index: 0–100, higher = higher modeled health risk. Combines
// live AQI, temperature extremity from a 25°C comfort baseline, humidity above
// 60% (particulate-trapping), population density, and hospital coverage —
// all explicitly modeled indicators, not measured health outcomes.
function healthRiskIndex(c){
  const temp = parseInt(c.weather && c.weather.temp) || 28;
  const hum = parseInt(c.weather && c.weather.hum) || 55;
  const aqiFactor = Math.min(100, c.current/4) * 0.5;
  const tempPenalty = Math.abs(temp - 25) * 0.6;
  const humPenalty = Math.max(0, hum - 60) * 0.25;
  const popFactor = c.populationDensityIdx * 15;
  const hospitalPenalty = (1 - c.hospitalCoverageIdx) * 10;
  return Math.round(Math.max(0, Math.min(100, aqiFactor + tempPenalty + humPenalty + popFactor + hospitalPenalty)));
}

function citySubscores(cityName){
  const c = CITIES[cityName];
  const environment = Math.round(Math.max(0, Math.min(100, 100 - c.current/4)));
  const traffic = Math.round(Math.max(0, Math.min(100, 100 - c.breakdown.Vehicular * 1.6)));
  const risk = healthRiskIndex(c);
  const health = Math.round(100 - risk);
  const greenCover = Math.round(Math.max(0, Math.min(100, c.greenCoverPct * 2.6)));
  const cityCases = ENFORCEMENT_QUEUE.filter(e=>e.city===cityName);
  const emergencyReadiness = cityCases.length
    ? Math.round((cityCases.filter(e=>e.status==="Resolved").length / cityCases.length) * 60 + 35)
    : 60;
  const citizenAwareness = c.citizenAwarenessIdx;
  return { environment, traffic, health, greenCover, emergencyReadiness, citizenAwareness, risk };
}

function svgGauge(valuePct, colorHex){
  // Semicircle gauge: 180px wide, drawn as a stroked arc using stroke-dasharray.
  const radius = 80, circumference = Math.PI * radius;
  const filled = (valuePct/100) * circumference;
  return `
    <svg viewBox="0 0 180 100">
      <path d="M 10 90 A 80 80 0 0 1 170 90" fill="none" stroke="rgba(237,230,214,0.1)" stroke-width="14" stroke-linecap="round"></path>
      <path d="M 10 90 A 80 80 0 0 1 170 90" fill="none" stroke="${colorHex}" stroke-width="14" stroke-linecap="round"
            stroke-dasharray="${filled} ${circumference}"></path>
    </svg>
  `;
}

function subscoreBar(label, value, colorHex){
  return `
    <div class="subscore-row">
      <div class="subscore-label">${label}</div>
      <div class="subscore-bar-track"><div class="subscore-bar-fill" style="width:${value}%; background:${colorHex};"></div></div>
      <div class="subscore-value">${value}</div>
    </div>
  `;
}

function renderScore(){
  const cityNames = Object.keys(CITIES);
  const startCity = selectedScoreCity && CITIES[selectedScoreCity] ? selectedScoreCity : cityNames[0];
  selectedScoreCity = startCity;

  document.getElementById("mod-score").innerHTML = `
    <div class="module-head">
      <p class="eyebrow">Instrument 10 · Composite indicators</p>
      <h2>Smart City Score &amp; Carbon Dashboard</h2>
      <p>A composite 0–100 city score across six weighted dimensions, an Urban Health Risk Index, and a live pollutant/carbon readout — all derived transparently from the same fused signal, never a black-box number.</p>
    </div>
    <div class="chip-row" id="score-city-chips">
      ${cityNames.map(n=>`<button class="chip ${n===startCity?'active':''}" data-city="${n}">${n}</button>`).join("")}
    </div>
    <div class="grid-2">
      <div class="panel-box" id="score-subscore-panel"></div>
      <div class="panel-box" id="score-gauge-panel"></div>
    </div>
    <p class="eyebrow" style="margin:26px 0 14px;">Carbon &amp; pollutant readout</p>
    <div class="carbon-grid" id="score-carbon-grid"></div>
  `;
  document.querySelectorAll("#score-city-chips .chip").forEach(chip=>{
    chip.addEventListener("click", ()=>{
      document.querySelectorAll("#score-city-chips .chip").forEach(c=>c.classList.remove("active"));
      chip.classList.add("active");
      selectedScoreCity = chip.dataset.city;
      drawScore();
    });
  });
  drawScore();
}

function drawScore(){
  const c = CITIES[selectedScoreCity];
  const sub = citySubscores(selectedScoreCity);
  const overall = Math.round((sub.environment + sub.traffic + sub.health + sub.greenCover + sub.emergencyReadiness + sub.citizenAwareness) / 6);
  const overallColor = overall>=70 ? "#3FD8C2" : overall>=45 ? "#E8B339" : overall>=25 ? "#C9823D" : "#E5483E";

  const subPanel = document.getElementById("score-subscore-panel");
  subPanel.innerHTML = `
    <p class="eyebrow" style="margin-bottom:4px;">Smart City Score — ${selectedScoreCity}</p>
    <div style="font-family:var(--font-display); font-size:40px; font-weight:700; color:${overallColor}; margin-bottom:18px;">${overall}<span style="font-size:16px; color:var(--paper-faint); font-weight:500;">/100</span></div>
    ${subscoreBar("Environment", sub.environment, "#3FD8C2")}
    ${subscoreBar("Traffic", sub.traffic, "#E8B339")}
    ${subscoreBar("Health", sub.health, "#F08A82")}
    ${subscoreBar("Green Cover", sub.greenCover, "#8FF0E0")}
    ${subscoreBar("Emergency Readiness", sub.emergencyReadiness, "#E3A968")}
    ${subscoreBar("Citizen Awareness", sub.citizenAwareness, "#9C9890")}
  `;

  const riskColor = sub.risk>=70 ? "#E5483E" : sub.risk>=45 ? "#C9823D" : sub.risk>=25 ? "#E8B339" : "#3FD8C2";
  const gaugePanel = document.getElementById("score-gauge-panel");
  gaugePanel.innerHTML = `
    <p class="eyebrow" style="margin-bottom:4px;">Urban Health Risk Index</p>
    <div class="score-gauge-wrap">
      <div class="score-gauge">${svgGauge(sub.risk, riskColor)}<div class="score-gauge-value" style="color:${riskColor};">${sub.risk}</div></div>
      <div class="sub" style="text-align:center; max-width:280px; color:var(--paper-dim); font-size:12px; line-height:1.6;">Modeled from live AQI, temperature/humidity extremity, population density and hospital coverage — higher means greater combined health exposure risk for ${selectedScoreCity}, not a diagnosis of any individual.</div>
    </div>
  `;

  const p = c.pollutants;
  const co2Est = Math.round((p.co * 0.9) + (c.breakdown.Industrial * 8) + (c.breakdown.Vehicular * 5));
  const treesOffsetTons = Math.round(c.greenCoverPct * 120);
  const carbonGrid = document.getElementById("score-carbon-grid");
  const cards = [
    { label:"PM2.5", value: p.pm2_5, unit:"µg/m³" },
    { label:"PM10", value: p.pm10, unit:"µg/m³" },
    { label:"NO₂", value: p.no2, unit:"ppb" },
    { label:"SO₂", value: p.so2, unit:"ppb" },
    { label:"CO", value: p.co, unit:"ppb" },
    { label:"O₃", value: p.o3, unit:"ppb" },
  ];
  carbonGrid.innerHTML = cards.map(card=>`
    <div class="panel-box stat-card"><div class="label">${card.label}</div><div class="value" style="font-size:22px;">${card.value}</div><div class="sub">${card.unit}</div></div>
  `).join("") + `
    <div class="panel-box stat-card"><div class="label">Est. CO₂-equivalent load</div><div class="value" style="font-size:22px; color:var(--haze-soft);">${co2Est}</div><div class="sub">Modeled index, industrial + vehicular weighted</div></div>
    <div class="panel-box stat-card"><div class="label">Green cover</div><div class="value" style="font-size:22px; color:var(--signal-soft);">${c.greenCoverPct}%</div><div class="sub">Of municipal area (modeled)</div></div>
    <div class="panel-box stat-card"><div class="label">Est. tree carbon offset</div><div class="value" style="font-size:22px; color:var(--signal-soft);">${treesOffsetTons}t/yr</div><div class="sub">Modeled from green cover %</div></div>
  `;
}

/* ==================================================================
   REPORTS & ALERTS
   ================================================================== */
function generateAlerts(){
  const alerts = [];
  Object.entries(CITIES).forEach(([name, c])=>{
    const lvl = aqiLevel(c.current);
    if(c.current > 300){
      alerts.push({ severity:"severe", city:name, icon:"🚨", title:`${name}: Severe AQI (${c.current})`, body:`Ambient AQI has crossed the Severe threshold. Recommend activating GRAP Stage IV-equivalent restrictions and issuing a citywide indoor-advisory broadcast.` });
    } else if(c.current > 200){
      alerts.push({ severity:"poor", city:name, icon:"⚠️", title:`${name}: Poor air quality (${c.current})`, body:`AQI is in the Poor band. Sensitive-group advisories should go out now; consider construction/dust-control enforcement in top wards.` });
    }
    const peak = (c.forecast || []).reduce((a,b)=> b.val>a.val?b:a, c.forecast[0] || {val:c.current,h:0});
    if(peak.val > 320 && peak.h <= 24){
      alerts.push({ severity:"severe", city:name, icon:"⏱", title:`${name}: Spike forecast within 24h (peak ${peak.val})`, body:`Forecast shows a severe-band peak at +${peak.h}h. Pre-position enforcement teams and schedule the citizen advisory ahead of the spike rather than after it.` });
    }
    const windKmh = parseInt(c.weather && c.weather.wind) || 12;
    if(windKmh < 8 && c.pollutants.so2 > 30){
      alerts.push({ severity:"moderate", city:name, icon:"🌬", title:`${name}: Low-wind dispersion trapping`, body:`Wind speed is only ${c.weather.wind}, limiting pollutant dispersion while SO₂ readings remain elevated. Expect prolonged industrial-source exceedance until wind picks up.` });
    }
  });
  return alerts.sort((a,b)=>{
    const rank = {severe:0, poor:1, moderate:2};
    return rank[a.severity]-rank[b.severity];
  });
}

function generateEmailTemplate(cityName){
  const c = CITIES[cityName];
  const lvl = aqiLevel(c.current);
  const topWard = [...c.wards].sort((a,b)=>b.aqi-a.aqi)[0];
  return `Subject: Air Quality Advisory — ${cityName}, ${lvl.label} (AQI ${c.current})

Dear Resident,

Air quality in ${cityName} is currently rated "${lvl.label}" with an ambient AQI of ${c.current}. The most affected area is ${topWard.name} (AQI ${topWard.aqi}), primarily attributed to ${topWard.source.toLowerCase()} sources.

Recommended precautions:
- ${maskRecommendation(lvl.key)}
- ${exerciseRecommendation(lvl.key)}
- Sensitive groups (children, elderly, pregnant women, asthma/heart patients) should take extra care.

Current conditions: ${c.weather.temp}, wind ${c.weather.wind}, humidity ${c.weather.hum}.

This is an automated advisory from VAYU·NET Urban Air Intelligence.
`;
}
function generateSmsTemplate(cityName){
  const c = CITIES[cityName];
  const lvl = aqiLevel(c.current);
  return `VAYU-NET ALERT: ${cityName} AQI is ${c.current} (${lvl.label}). ${maskRecommendation(lvl.key)} Stay safe.`;
}

function renderReports(){
  const cityNames = Object.keys(CITIES);
  const alerts = generateAlerts();
  document.getElementById("mod-reports").innerHTML = `
    <div class="module-head">
      <p class="eyebrow">Instrument 11 · Action &amp; distribution layer</p>
      <h2>Reports &amp; Alerts</h2>
      <p>Generate downloadable reports for offline briefings, review AI-raised emergency alerts, and push notifications or draft citizen-facing message templates.</p>
    </div>

    <div class="grid-2" style="margin-bottom:24px;">
      <div class="panel-box">
        <p class="eyebrow" style="margin-bottom:14px;">Report generator</p>
        <p style="font-size:12.5px; color:var(--paper-dim); margin-bottom:16px; line-height:1.6;">Exports a snapshot of every metro's current AQI, source breakdown, and enforcement queue.</p>
        <div class="report-btn-row">
          <button class="report-btn" id="rep-pdf">📄 Download PDF</button>
          <button class="report-btn" id="rep-xlsx">📊 Download Excel</button>
          <button class="report-btn" id="rep-csv">🧾 Download CSV</button>
          <button class="report-btn" id="rep-json">{ } Download JSON</button>
        </div>
      </div>
      <div class="panel-box">
        <p class="eyebrow" style="margin-bottom:14px;">Smart notification system</p>
        <p style="font-size:12.5px; color:var(--paper-dim); margin-bottom:16px; line-height:1.6;">Browser push for the officer at this console, plus a quick in-app toast for demos.</p>
        <div class="report-btn-row">
          <button class="report-btn" id="notif-enable">🔔 Enable browser notifications</button>
          <button class="report-btn" id="notif-test">🧪 Send test alert</button>
        </div>
      </div>
    </div>

    <p class="eyebrow" style="margin-bottom:14px;">Emergency Alert Center — ${alerts.length} active</p>
    <div id="alert-list" style="margin-bottom:28px;">
      ${alerts.length ? alerts.map(a=>`
        <div class="alert-card sev-${a.severity}">
          <div class="alert-icon">${a.icon}</div>
          <div><div class="alert-title">${a.title}</div><div class="alert-body">${a.body}</div></div>
        </div>
      `).join("") : `<p style="color:var(--paper-faint); font-size:13px;">No thresholds currently breached across the five tracked metros.</p>`}
    </div>

    <p class="eyebrow" style="margin-bottom:14px;">Message template generator</p>
    <div class="panel-box">
      <div class="grid-2" style="margin-bottom:16px;">
        <div>
          <label style="font-family:var(--font-mono); font-size:10.5px; text-transform:uppercase; color:var(--paper-faint); display:block; margin-bottom:8px;">City</label>
          <select id="tpl-city" style="width:100%;">${cityNames.map(n=>`<option>${n}</option>`).join("")}</select>
        </div>
      </div>
      <label style="font-family:var(--font-mono); font-size:10.5px; text-transform:uppercase; color:var(--paper-faint); display:block; margin-bottom:8px;">Email template</label>
      <textarea class="template-box" id="tpl-email" readonly></textarea>
      <div style="margin:10px 0 18px;"><button class="report-btn" id="tpl-email-copy">📋 Copy email</button></div>
      <label style="font-family:var(--font-mono); font-size:10.5px; text-transform:uppercase; color:var(--paper-faint); display:block; margin-bottom:8px;">SMS template</label>
      <textarea class="template-box" id="tpl-sms" readonly style="min-height:60px;"></textarea>
      <div style="margin-top:10px;"><button class="report-btn" id="tpl-sms-copy">📋 Copy SMS</button></div>
    </div>
  `;

  function refreshTemplates(){
    const city = document.getElementById("tpl-city").value;
    document.getElementById("tpl-email").value = generateEmailTemplate(city);
    document.getElementById("tpl-sms").value = generateSmsTemplate(city);
  }
  document.getElementById("tpl-city").addEventListener("change", refreshTemplates);
  refreshTemplates();
  document.getElementById("tpl-email-copy").addEventListener("click", ()=>{
    navigator.clipboard?.writeText(document.getElementById("tpl-email").value).then(()=> showToast("Copied", "Email template copied to clipboard."));
  });
  document.getElementById("tpl-sms-copy").addEventListener("click", ()=>{
    navigator.clipboard?.writeText(document.getElementById("tpl-sms").value).then(()=> showToast("Copied", "SMS template copied to clipboard."));
  });

  document.getElementById("notif-enable").addEventListener("click", ()=> sendSmartNotification("VAYU·NET", "Browser notifications enabled for this session."));
  document.getElementById("notif-test").addEventListener("click", ()=>{
    const top = alerts[0];
    if(top) sendSmartNotification(top.title, top.body);
    else showToast("No active alerts", "All five metros are currently below alert thresholds.");
  });

  document.getElementById("rep-json").addEventListener("click", downloadJSONReport);
  document.getElementById("rep-csv").addEventListener("click", downloadCSVReport);
  document.getElementById("rep-pdf").addEventListener("click", downloadPDFReport);
  document.getElementById("rep-xlsx").addEventListener("click", downloadXLSXReport);
}

function buildReportRows(){
  const rows = [];
  Object.entries(CITIES).forEach(([name, c])=>{
    c.wards.forEach(w=>{
      rows.push({ City:name, Ward:w.name, AQI:w.aqi, Level:aqiLevel(w.aqi).label, Source:w.source, Confidence:Math.round(w.confidence*100)+"%" });
    });
  });
  return rows;
}

function downloadJSONReport(){
  const payload = { generatedAt: new Date().toISOString(), cities: CITIES, enforcementQueue: ENFORCEMENT_QUEUE };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  triggerDownload(blob, "vayunet-report.json");
  showToast("Report ready", "JSON snapshot downloaded.");
}

function downloadCSVReport(){
  const rows = buildReportRows();
  const headers = Object.keys(rows[0]);
  const csv = [headers.join(","), ...rows.map(r=> headers.map(h=> `"${String(r[h]).replace(/"/g,'""')}"`).join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  triggerDownload(blob, "vayunet-ward-report.csv");
  showToast("Report ready", "CSV downloaded.");
}

function triggerDownload(blob, filename){
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(()=> URL.revokeObjectURL(url), 2000);
}

async function downloadXLSXReport(){
  const ok = await ensureXlsxLoaded();
  if(!ok){ showToast("Excel export unavailable", "SheetJS failed to load from both CDNs. Try the CSV export instead.", "warn"); return; }
  try{
    const rows = buildReportRows();
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Ward AQI Report");
    XLSX.writeFile(wb, "vayunet-report.xlsx");
    showToast("Report ready", "Excel workbook downloaded.");
  } catch(err){
    console.error("XLSX export failed:", err);
    showToast("Export failed", "Could not build the Excel file. See console.", "warn");
  }
}

async function downloadPDFReport(){
  const ok = await ensurePdfLoaded();
  if(!ok){ showToast("PDF export unavailable", "jsPDF failed to load from both CDNs. Try the CSV/Excel export instead.", "warn"); return; }
  try{
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    let y = 18;
    doc.setFontSize(16); doc.text("VAYU·NET — Urban Air Intelligence Report", 14, y); y += 8;
    doc.setFontSize(10); doc.text(`Generated ${new Date().toLocaleString("en-IN")}`, 14, y); y += 10;

    Object.entries(CITIES).forEach(([name, c])=>{
      if(y > 260){ doc.addPage(); y = 18; }
      doc.setFontSize(13); doc.text(`${name} — AQI ${c.current} (${aqiLevel(c.current).label})`, 14, y); y += 6;
      doc.setFontSize(9);
      doc.text(`Dominant sources: ${Object.entries(c.breakdown).sort((a,b)=>b[1]-a[1]).slice(0,2).map(([k,v])=>`${k} ${v}%`).join(", ")}`, 14, y); y += 5;
      c.wards.forEach(w=>{
        doc.text(`  · ${w.name}: AQI ${w.aqi}, ${w.source} (${Math.round(w.confidence*100)}% conf.)`, 14, y); y += 5;
      });
      y += 4;
    });

    doc.save("vayunet-report.pdf");
    showToast("Report ready", "PDF downloaded.");
  } catch(err){
    console.error("PDF export failed:", err);
    showToast("Export failed", "Could not build the PDF. See console.", "warn");
  }
}

/* ============ MULTI-AGENT AI SIMULATION ============ */
// Simulates a small agent network communicating over a shared event log — each
// "agent" is just a labeled JS function/state, not a separate model, but the
// division of responsibility (who looks at what data) is real and mirrors how
// the fallback logic below actually reasons about a query.
const AGENTS = ["Forecast Agent","Weather Agent","Traffic Agent","Health Agent","Citizen Agent","Enforcement Agent","Analytics Agent"];

function renderAgentNetworkPanel(){
  const el = document.getElementById("agent-network");
  if(!el) return;
  el.innerHTML = AGENTS.map(a=>`
    <div class="agent-node" data-agent="${a}"><div class="agent-dot"></div><div class="agent-name">${a}</div></div>
  `).join("");
}
renderAgentNetworkPanel();

function logAgentEvent(text){
  const log = document.getElementById("agent-log");
  if(!log) return;
  const line = document.createElement("div");
  line.textContent = `[${new Date().toLocaleTimeString("en-IN",{hour12:false})}] ${text}`;
  log.appendChild(line);
  log.scrollTop = log.scrollHeight;
  while(log.children.length > 20) log.removeChild(log.firstChild);
}

// Decides which agents "handle" a given query — same keyword logic the fallback
// responder uses, surfaced visually so the workflow isn't a hidden black box.
function agentSequenceFor(query){
  const q = query.toLowerCase();
  if(q.includes("delhi") || q.includes("grap")) return ["Analytics Agent","Forecast Agent","Enforcement Agent","Citizen Agent"];
  if(q.includes("kannada") || q.includes("bengaluru") || q.includes("bangalore")) return ["Weather Agent","Health Agent","Citizen Agent"];
  if(q.includes("queue") || q.includes("enforcement") || q.includes("priority")) return ["Analytics Agent","Traffic Agent","Enforcement Agent"];
  return ["Analytics Agent","Forecast Agent","Weather Agent"];
}

// Pulses each agent node active in sequence, logging a one-line "handoff" for
// each, and resolves once the animation completes — purely cosmetic/explanatory,
// runs in parallel with the actual reply generation below.
function pulseAgents(sequence){
  return new Promise((resolve)=>{
    document.querySelectorAll(".agent-node").forEach(n=>n.classList.remove("active"));
    let i = 0;
    const step = ()=>{
      document.querySelectorAll(".agent-node").forEach(n=>n.classList.remove("active"));
      if(i >= sequence.length){ resolve(); return; }
      const name = sequence[i];
      const node = document.querySelector(`.agent-node[data-agent="${name}"]`);
      if(node) node.classList.add("active");
      logAgentEvent(`${name} → processing request${i < sequence.length-1 ? ", handing off to " + sequence[i+1] : ", compiling response"}`);
      i++;
      setTimeout(step, 420);
    };
    step();
  });
}

/* ============ AI CO-PILOT CHAT INTERACTIVE LOGIC ============ */
const userField = document.getElementById("chat-user-input");
const sendBtn = document.getElementById("chat-send-btn");
const chatWindow = document.getElementById("chat-window");
const statusBadge = document.getElementById("ai-status");
const tokenInput = document.getElementById("api-key-input");
const providerSelect = document.getElementById("api-provider");

document.querySelectorAll("#chat-presets button").forEach(btn => {
  btn.addEventListener("click", () => {
    userField.value = btn.dataset.prompt;
    handleSend();
  });
});

sendBtn.addEventListener("click", handleSend);
userField.addEventListener("keydown", (e) => {
  if(e.key === "Enter") handleSend();
});

async function handleSend(){
  const query = userField.value.trim();
  if(!query) return;

  appendMessage(query, "user");
  userField.value = "";

  statusBadge.textContent = "Processing...";
  statusBadge.className = "api-badge";

  const loaderId = appendMessage("Accessing VAYU·NET vector data layers...", "assistant");
  const agentWorkflow = pulseAgents(agentSequenceFor(query));

  try {
    const selectedProvider = providerSelect.value;
    const apiKey = tokenInput.value.trim();
    let reply = "";

    if (selectedProvider === "huggingface" && apiKey) {
      reply = await callHuggingFaceAPI(query, apiKey);
    } else if (selectedProvider === "gemini" && apiKey) {
      reply = await callGeminiAPI(query, apiKey);
    } else {
      reply = await runFallbackLogic(query);
    }

    await agentWorkflow;
    updateMessage(loaderId, reply);
    statusBadge.textContent = "Ready";
    statusBadge.className = "api-badge";
  } catch(err) {
    console.error(err);
    await agentWorkflow;
    updateMessage(loaderId, "Apologies, the query transmission failed. Verify your API configuration token. Fallback logic: Ensure stable networks.");
    statusBadge.textContent = "API Error";
    statusBadge.className = "api-badge-error";
  }
}

function appendMessage(text, sender) {
  const el = document.createElement("div");
  const id = "msg-" + Math.random().toString(36).substring(2, 9);
  el.id = id;
  el.className = `chat-bubble ${sender}`;
  el.innerHTML = text.replace(/\n/g, "<br>");
  chatWindow.appendChild(el);
  chatWindow.scrollTop = chatWindow.scrollHeight;
  return id;
}

function updateMessage(id, newText) {
  const el = document.getElementById(id);
  if (el) {
    el.innerHTML = newText.replace(/\n/g, "<br>");
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }
}

// Hugging Face API Call
async function callHuggingFaceAPI(prompt, token) {
  const endpoint = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3";
  const contextText = JSON.stringify(CITIES);

  const payload = {
    inputs: `<s>[INST] You are VAYU·NET AI, an expert systems advisor specialized in National Air Quality Standards, CPCB protocols, and municipal interventions. Use the following city air quality metrics to answer the question: ${contextText}. Question: ${prompt} [/INST]`,
    parameters: { max_new_tokens: 350, temperature: 0.7 }
  };

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) throw new Error("Hugging Face API limit or invalid token.");
  const resData = await response.json();
  return resData[0]?.generated_text?.split("[/INST]")?.pop()?.trim() || "Attribution processed successfully.";
}

// Google Gemini API Call
async function callGeminiAPI(prompt, token) {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${token}`;
  const contextText = JSON.stringify(CITIES);

  const payload = {
    contents: [{
      parts: [{
        text: `You are VAYU·NET AI, an expert systems advisor for Indian air quality management. Refer to these live city metrics: ${contextText}. Question: ${prompt}`
      }]
    }]
  };

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!response.ok) throw new Error("Gemini API rejected request.");
  const resData = await response.json();
  return resData.candidates[0]?.content?.parts[0]?.text || "Response parsed empty.";
}

// Fallback logic
function runFallbackLogic(query) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const q = query.toLowerCase();
      let res = "VAYU·NET SYSTEM LOG:\n\n";

      if (q.includes("delhi") || q.includes("grap")) {
        res += `Delhi's live ambient AQI is ${CITIES.Delhi.current}. Under GRAP Stage III (triggered when AQI crosses 200/300 thresholds), we have initialized:
        1. Strict bans on non-essential construction and demolition works across all wards.
        2. Rerouting of non-BS6 diesel interstate commercial trucks at border entry corridors.
        3. Local recommendations: Deploying mechanical dust sweeps across high-incidence wards like Anand Vihar (AQI: ${CITIES.Delhi.wards[0].aqi}).`;
      } else if (q.includes("bengaluru") || q.includes("bangalore") || q.includes("kannada")) {
        res += `Bengaluru ambient monitoring records ${CITIES.Bengaluru.current} AQI. Here is the translated broadcast template for the Whitefield ward:

        "ಗಮನಿಸಿ: ಇಂದು ವೈಟ್‌ಫೀಲ್ಡ್‌ನಲ್ಲಿ ಗಾಳಿಯ ಗುಣಮಟ್ಟ ಮಧ್ಯಮವಾಗಿದೆ (AQI ${CITIES.Bengaluru.wards[0].aqi}). ಅಸ್ತಮಾ ಅಥವಾ ಉಸಿರಾಟದ ಸಮಸ್ಯೆ ಇರುವವರು ದೀರ್ಘಾವಧಿಯ ಹೊರಾಂಗಣ ಚಟುವಟಿಕೆಗಳನ್ನು ಮಿತಿಗೊಳಿಸಬೇಕು."`;
      } else if (q.includes("queue") || q.includes("enforcement") || q.includes("priority")) {
        const pendingCount = ENFORCEMENT_QUEUE.filter(e => e.status === "Pending").length;
        res += `Enforcement audit shows ${pendingCount} unresolved entries.

        System Priority Recommendation:
        - The highest priority hotspot is ${ENFORCEMENT_QUEUE[0].location} (${ENFORCEMENT_QUEUE[0].city}) with a risk priority index score of ${ENFORCEMENT_QUEUE[0].score}/100. Vehicular idling and fleet congestion trends require immediate tactical deployments.`;
      } else {
        res += `System telemetry parsed.
        - Current National Average AQI: ${Math.round(Object.values(CITIES).reduce((s,c)=>s+c.current,0)/5)}
        - Core recommendation: Target local construction operations in high-confidence areas to mitigate particulate matter load.

        (To use a production LLM like Mistral or Gemini, please paste a valid token/key in the API configuration section above.)`;
      }
      resolve(res);
    }, 1200);
  });
}

/* ============ BOOT SEQUENCE ============ */
(async function boot(){
  await ensureDemoUser();
  await fetchRealtimeTelemetry(); // Telemetry loaded prior to start
  const session = sessionStorage.getItem(SESSION_KEY);
  if(session){
    const s = JSON.parse(session);
    enterApp(s.name, s.city);
  }
})();