const express = require("express");
const cors = require("cors");
require("dotenv").config();
const pool = require("./db");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

let dbConnected = false;
let mode = "DEMO";

// Mock data
const mockStations = [
  {
    station_key: "CHENNAI_AWS",
    station_name: "CHENNAI_AWS",
    latitude: 12.94538,
    longitude: 80.2117,
    altitude: 26.5,
    reading_id: 1,
    recorded_at: new Date().toISOString(),
    bat_volt: 12.88,
    air_pressure: 1007.69,
    cr_temp: 35.22,
    air_temp: 23.52,
    humidity: 46.48,
    sw_radiation: 679.46,
    lw_radiation: 479.02,
    wind_speed: 24.529,
    wind_dir: 226.9,
    wind_gust: 36.893,
    rain: 0,
    rain_cumulative: 0,
    g_wind_dir: 170,
    g_wind_spd: 3.38,
    c_wind_dir: 119,
    c_wind_spd: 3.38,
    g_heading: 308.5,
    gps_signal: 108,
    sunrise: "05:53 IST",
    sunset: "18:08 IST",
    record_id: "260923C1500",
  },
  {
    station_key: "MUMBAI_AWS",
    station_name: "MUMBAI_AWS",
    latitude: 18.9388,
    longitude: 72.8354,
    altitude: 14.2,
    reading_id: 2,
    recorded_at: new Date().toISOString(),
    bat_volt: 12.45,
    air_pressure: 1010.21,
    cr_temp: 33.1,
    air_temp: 29.85,
    humidity: 72.3,
    sw_radiation: 520.1,
    lw_radiation: 380.5,
    wind_speed: 12.3,
    wind_dir: 195.0,
    wind_gust: 18.5,
    rain: 2.4,
    rain_cumulative: 12.8,
    g_wind_dir: 190,
    g_wind_spd: 5.1,
    c_wind_dir: 180,
    c_wind_spd: 5.1,
    g_heading: 195.0,
    gps_signal: 95,
    sunrise: "06:10 IST",
    sunset: "18:30 IST",
    record_id: "260923M1500",
  },
  {
    station_key: "VIZAG_AWS",
    station_name: "VIZAG_AWS",
    latitude: 17.6868,
    longitude: 83.2185,
    altitude: 8.0,
    reading_id: 3,
    recorded_at: new Date().toISOString(),
    bat_volt: 13.1,
    air_pressure: 1005.8,
    cr_temp: 36.0,
    air_temp: 31.2,
    humidity: 68.5,
    sw_radiation: 710.2,
    lw_radiation: 500.0,
    wind_speed: 18.75,
    wind_dir: 245.0,
    wind_gust: 28.0,
    rain: 0,
    rain_cumulative: 0,
    g_wind_dir: 240,
    g_wind_spd: 4.2,
    c_wind_dir: 230,
    c_wind_spd: 4.2,
    g_heading: 282.0,
    gps_signal: 112,
    sunrise: "05:45 IST",
    sunset: "18:00 IST",
    record_id: "260923V1500",
  },
  {
    station_key: "KOCHI_AWS",
    station_name: "KOCHI_AWS",
    latitude: 9.9312,
    longitude: 76.2673,
    altitude: 5.0,
    reading_id: 4,
    recorded_at: new Date().toISOString(),
    bat_volt: 12.7,
    air_pressure: 1009.55,
    cr_temp: 30.5,
    air_temp: 28.1,
    humidity: 85.2,
    sw_radiation: 350.4,
    lw_radiation: 290.8,
    wind_speed: 9.5,
    wind_dir: 210.0,
    wind_gust: 14.0,
    rain: 8.6,
    rain_cumulative: 42.0,
    g_wind_dir: 200,
    g_wind_spd: 3.8,
    c_wind_dir: 215,
    c_wind_spd: 3.8,
    g_heading: 220.5,
    gps_signal: 102,
    sunrise: "06:22 IST",
    sunset: "18:25 IST",
    record_id: "260923K1500",
  },
  {
    station_key: "ANDAMAN_AWS",
    station_name: "ANDAMAN_AWS",
    latitude: 11.6234,
    longitude: 92.7265,
    altitude: 12.0,
    reading_id: 5,
    recorded_at: new Date().toISOString(),
    bat_volt: 12.95,
    air_pressure: 1003.4,
    cr_temp: 34.8,
    air_temp: 30.5,
    humidity: 79.0,
    sw_radiation: 600.0,
    lw_radiation: 420.0,
    wind_speed: 22.1,
    wind_dir: 180.0,
    wind_gust: 33.0,
    rain: 1.2,
    rain_cumulative: 5.6,
    g_wind_dir: 175,
    g_wind_spd: 6.1,
    c_wind_dir: 185,
    c_wind_spd: 6.1,
    g_heading: 198.0,
    gps_signal: 88,
    sunrise: "05:30 IST",
    sunset: "17:55 IST",
    record_id: "260923A1500",
  },
];

const mockPressureHistory = [
  { air_pressure: 1005.1, recorded_at: "2026-04-27 15:00:00" },
  { air_pressure: 1005.4, recorded_at: "2026-04-27 16:00:00" },
  { air_pressure: 1005.8, recorded_at: "2026-04-27 17:00:00" },
  { air_pressure: 1006.1, recorded_at: "2026-04-27 18:00:00" },
  { air_pressure: 1006.3, recorded_at: "2026-04-27 19:00:00" },
  { air_pressure: 1006.5, recorded_at: "2026-04-27 20:00:00" },
  { air_pressure: 1006.7, recorded_at: "2026-04-27 21:00:00" },
  { air_pressure: 1006.9, recorded_at: "2026-04-27 22:00:00" },
  { air_pressure: 1007.1, recorded_at: "2026-04-27 23:00:00" },
  { air_pressure: 1007.2, recorded_at: "2026-04-28 00:00:00" },
  { air_pressure: 1007.3, recorded_at: "2026-04-28 01:00:00" },
  { air_pressure: 1007.5, recorded_at: "2026-04-28 02:00:00" },
];

setTimeout(() => {
  pool.on("connect", () => {
    dbConnected = true;
    mode = "LIVE";
    console.log("📊 Switched to LIVE mode - using SQL Server");
  });
}, 1000);

// ── Root route ────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "NIOT Backend API - Oceanic Monitor",
    version: "1.0.0",
    mode: mode,
    endpoints: {
      health: "/api/health",
      allStations: "/api/stations",
      singleStation: "/api/stations/:key",
      pressureHistory: "/api/stations/:key/pressure-history",
    },
  });
});

// ── GET all stations with latest reading ──────────────────
app.get("/api/stations", async (req, res) => {
  if (!dbConnected) {
    return res.json({ success: true, data: mockStations, mode: "DEMO" });
  }
  try {
    const result = await pool.request().query(`
      SELECT s.station_key, s.station_name, s.latitude, s.longitude, s.altitude,
             r.id AS reading_id, r.recorded_at,
             r.bat_volt, r.air_pressure, r.cr_temp, r.air_temp, r.humidity,
             r.sw_radiation, r.lw_radiation, r.wind_speed, r.wind_dir,
             r.wind_gust, r.rain, r.rain_cumulative,
             r.g_wind_dir, r.g_wind_spd, r.c_wind_dir, r.c_wind_spd,
             r.g_heading, r.gps_signal, r.sunrise, r.sunset, r.record_id
      FROM stations s
      LEFT JOIN (
        SELECT TOP 1 * FROM sensor_readings sr1
        WHERE sr1.station_key = s.station_key
        ORDER BY sr1.recorded_at DESC
      ) r ON 1=1
      ORDER BY s.station_key
    `);
    res.json({ success: true, data: result.recordset, mode: "LIVE" });
  } catch (err) {
    res.json({ success: true, data: mockStations, mode: "DEMO-FALLBACK" });
  }
});

// ── GET single station latest reading ────────────────────
app.get("/api/stations/:key", async (req, res) => {
  if (!dbConnected) {
    const station = mockStations.find((s) => s.station_key === req.params.key);
    if (!station)
      return res
        .status(404)
        .json({ success: false, error: "Station not found" });
    return res.json({ success: true, data: station, mode: "DEMO" });
  }
  try {
    const result = await pool.request().input("key", req.params.key).query(`
      SELECT s.station_key, s.station_name, s.latitude, s.longitude, s.altitude,
             r.id AS reading_id, r.recorded_at,
             r.bat_volt, r.air_pressure, r.cr_temp, r.air_temp, r.humidity,
             r.sw_radiation, r.lw_radiation, r.wind_speed, r.wind_dir,
             r.wind_gust, r.rain, r.rain_cumulative,
             r.g_wind_dir, r.g_wind_spd, r.c_wind_dir, r.c_wind_spd,
             r.g_heading, r.gps_signal, r.sunrise, r.sunset, r.record_id
      FROM stations s
      LEFT JOIN (
        SELECT TOP 1 * FROM sensor_readings sr1
        WHERE sr1.station_key = s.station_key
        ORDER BY sr1.recorded_at DESC
      ) r ON 1=1
      WHERE s.station_key = @key
    `);
    if (!result.recordset.length)
      return res
        .status(404)
        .json({ success: false, error: "Station not found" });
    res.json({ success: true, data: result.recordset[0], mode: "LIVE" });
  } catch (err) {
    const station = mockStations.find((s) => s.station_key === req.params.key);
    if (!station)
      return res
        .status(404)
        .json({ success: false, error: "Station not found" });
    res.json({ success: true, data: station, mode: "DEMO-FALLBACK" });
  }
});

// ── GET pressure history (last 25 readings) ───────────────
app.get("/api/stations/:key/pressure-history", async (req, res) => {
  if (!dbConnected) {
    return res.json({
      success: true,
      data: mockPressureHistory,
      mode: "DEMO",
    });
  }
  try {
    const result = await pool.request().input("key", req.params.key).query(`
      SELECT TOP 25 air_pressure, recorded_at
      FROM sensor_readings
      WHERE station_key = @key
      ORDER BY recorded_at DESC
    `);
    res.json({
      success: true,
      data: result.recordset.reverse(),
      mode: "LIVE",
    });
  } catch (err) {
    res.json({
      success: true,
      data: mockPressureHistory,
      mode: "DEMO-FALLBACK",
    });
  }
});

// ── Health check ──────────────────────────────────────────
app.get("/api/health", async (req, res) => {
  if (!dbConnected) {
    return res.json({
      success: true,
      message: "Backend online (DEMO MODE - using mock data)",
      mode: "DEMO",
      timestamp: new Date(),
      database: "Not connected",
    });
  }
  try {
    await pool.request().query("SELECT 1 AS status");
    res.json({
      success: true,
      message: "Backend online, DB connected",
      mode: "LIVE",
      timestamp: new Date(),
      database: "Connected",
    });
  } catch (err) {
    res.json({
      success: true,
      message: "Backend online (DEMO MODE - using mock data)",
      mode: "DEMO-FALLBACK",
      timestamp: new Date(),
      database: "Connection failed",
    });
  }
});

app.listen(PORT, () => {
  console.log(`\n✅ NIOT Backend running at http://localhost:${PORT}`);
  console.log(`📊 Mode: ${mode}`);
  console.log(`   http://localhost:${PORT}/api/stations`);
  console.log(`   http://localhost:${PORT}/api/stations/:key`);
  console.log(
    `   http://localhost:${PORT}/api/stations/:key/pressure-history\n`,
  );
});
