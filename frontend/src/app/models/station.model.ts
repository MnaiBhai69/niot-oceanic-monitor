export interface StationReading {
  station_key: string;
  station_name: string;
  latitude: number;
  longitude: number;
  altitude: number;
  reading_id: number;
  recorded_at: string;
  bat_volt: number;
  air_pressure: number;
  cr_temp: number;
  air_temp: number;
  humidity: number;
  sw_radiation: number;
  lw_radiation: number;
  wind_speed: number;
  wind_dir: number;
  wind_gust: number;
  rain: number;
  rain_cumulative: number;
  g_wind_dir: number;
  g_wind_spd: number;
  c_wind_dir: number;
  c_wind_spd: number;
  g_heading: number;
  gps_signal: number;
  sunrise: string;
  sunset: string;
  record_id: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

export interface PressurePoint {
  air_pressure: number;
  recorded_at: string;
}
