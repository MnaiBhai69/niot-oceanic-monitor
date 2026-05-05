import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { StationReading, ApiResponse, PressurePoint } from '../models/station.model';

@Injectable({ providedIn: 'root' })
export class StationService {
  private api = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAllStations(): Observable<ApiResponse<StationReading[]>> {
    return this.http.get<ApiResponse<StationReading[]>>(`${this.api}/stations`);
  }

  getStation(key: string): Observable<ApiResponse<StationReading>> {
    return this.http.get<ApiResponse<StationReading>>(`${this.api}/stations/${key}`);
  }

  getPressureHistory(key: string): Observable<ApiResponse<PressurePoint[]>> {
    return this.http.get<ApiResponse<PressurePoint[]>>(`${this.api}/stations/${key}/pressure-history`);
  }
}
