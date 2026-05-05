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

export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT",
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
  );

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  res.status(200).json({
    success: true,
    data: mockPressureHistory,
    mode: "DEMO",
  });
}
