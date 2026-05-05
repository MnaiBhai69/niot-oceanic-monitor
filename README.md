# NIOT Oceanic Monitor — Angular + MySQL

## Project Structure
```
niot-final/
├── backend/
│   ├── src/
│   │   ├── server.js       ← Express API (port 3000)
│   │   └── db.js           ← MySQL pool
│   ├── .env                ← DB credentials
│   ├── niot_db.sql         ← MySQL schema + sample data
│   └── package.json
└── frontend/
    ├── src/app/
    │   ├── dashboard/      ← Main dashboard component
    │   ├── services/       ← StationService (HTTP)
    │   └── models/         ← TypeScript interfaces
    └── proxy.conf.json     ← Proxies /api → localhost:3000
```

## Setup Steps

### 1. MySQL Database
```sql
CREATE DATABASE niot_db;
USE niot_db;
SOURCE backend/niot_db.sql;
```

### 2. Backend
```bash
cd backend
npm install
# Edit .env — set your MySQL password
npm start
# Backend runs at http://localhost:3000
# Test: http://localhost:3000/api/stations
```

### 3. Frontend
```bash
cd frontend
npm install
ng serve
# Open http://localhost:4200
```

## API Endpoints
- `GET /api/stations`              — All stations with latest reading
- `GET /api/stations/:key`         — Single station latest reading
- `GET /api/stations/:key/pressure-history` — Last 25 pressure readings

## Features
- Live data from MySQL via Express REST API
- Auto-refresh every 30 seconds
- Station switcher dropdown
- Interactive Leaflet map with station markers
- Canvas speedometer + compass rose
- Pressure trend chart (Chart.js)
- Status bar with refresh countdown
