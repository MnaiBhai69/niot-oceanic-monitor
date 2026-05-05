import {
  Component, OnInit, OnDestroy, AfterViewInit,
  ViewChild, ElementRef, NgZone, ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { interval, Subscription } from 'rxjs';
import { StationService } from '../services/station.service';
import { StationReading, PressurePoint } from '../models/station.model';

declare const L: any;
declare const Chart: any;

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {

  stations: StationReading[] = [];
  currentStation: StationReading | null = null;
  currentKey = '';
  currentTime = '--:--:--';
  currentDate = '';
  pressureHistory: PressurePoint[] = [];
  errorMsg = '';
  isLoading = true;
  refreshSec = 0;

  readonly pollIntervalSec = 30;
  private readonly P_MIN = 980;
  private readonly P_RNG = 60;

  @ViewChild('speedoCanvas')  speedoRef!:  ElementRef<HTMLCanvasElement>;
  @ViewChild('compassCanvas') compassRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('pressCanvas')   pressRef!:   ElementRef<HTMLCanvasElement>;
  @ViewChild('mapContainer')  mapRef!:     ElementRef<HTMLDivElement>;

  private map: any = null;
  private mapMarkers: Record<string, any> = {};
  private pressChart: any = null;
  private subs: Subscription[] = [];
  private clockSub!: Subscription;
  private refreshSub!: Subscription;
  private pollSub!: Subscription;

  constructor(
    private stationSvc: StationService,
    private zone: NgZone,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.startClock();
    this.loadAllStations();
    this.pollSub = interval(this.pollIntervalSec * 1000)
      .subscribe(() => { if (this.currentKey) this.refreshCurrentStation(); });
  }

  ngAfterViewInit(): void {
    // map init happens after *ngIf renders the DOM — called in loadAllStations setTimeout
  }

  ngOnDestroy(): void {
    [this.clockSub, this.refreshSub, this.pollSub, ...this.subs]
      .forEach(s => s?.unsubscribe());
    this.pressChart?.destroy();
    this.map?.remove();
  }

  /* ── CLOCK ── */
  startClock(): void {
    this.tick();
    this.clockSub  = interval(1000).subscribe(() => this.tick());
    this.refreshSub = interval(1000).subscribe(() => { this.refreshSec++; this.cdr.detectChanges(); });
  }
  tick(): void {
    const n = new Date();
    this.currentTime = n.toLocaleTimeString('en-IN', { hour12: false });
    this.currentDate = n.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();
    this.cdr.detectChanges();
  }

  /* ── LOAD STATIONS ── */
  loadAllStations(): void {
    this.isLoading = true;
    const s = this.stationSvc.getAllStations().subscribe({
      next: res => {
        this.isLoading = false;
        if (res.success && res.data.length) {
          this.stations = res.data;
          this.currentKey = this.stations[0].station_key;
          this.currentStation = this.stations[0];
          this.cdr.detectChanges();
          // Wait for *ngIf to show canvases, then draw
          setTimeout(() => {
            this.initMap();
            this.loadPressureHistory(this.currentKey);
            this.rebuildMapMarkers();
            this.flyToStation(this.currentStation!);
            this.drawSpeedo();
            this.drawCompass();
          }, 200);
        } else {
          this.errorMsg = 'No station data. Import niot_db.sql into MySQL first.';
        }
      },
      error: err => {
        this.isLoading = false;
        this.errorMsg = `Backend error: ${err.message || 'Cannot reach localhost:3000'}`;
        this.cdr.detectChanges();
      }
    });
    this.subs.push(s);
  }

  loadPressureHistory(key: string): void {
    const s = this.stationSvc.getPressureHistory(key).subscribe({
      next: res => {
        this.pressureHistory = res.success && res.data.length
          ? res.data
          : this.syntheticHistory(this.currentStation?.air_pressure || 1007);
        this.cdr.detectChanges();
        setTimeout(() => this.drawPressureChart(), 100);
      },
      error: () => {
        this.pressureHistory = this.syntheticHistory(this.currentStation?.air_pressure || 1007);
        this.cdr.detectChanges();
        setTimeout(() => this.drawPressureChart(), 100);
      }
    });
    this.subs.push(s);
  }

  syntheticHistory(base: number): PressurePoint[] {
    const pts: PressurePoint[] = [];
    const now = Date.now();
    for (let i = 23; i >= 0; i--)
      pts.push({ air_pressure: +(base + (Math.random() - .5) * 4).toFixed(2), recorded_at: new Date(now - i * 3600000).toISOString() });
    pts.push({ air_pressure: base, recorded_at: new Date(now).toISOString() });
    return pts;
  }

  refreshCurrentStation(): void {
    const s = this.stationSvc.getStation(this.currentKey).subscribe({
      next: res => {
        if (!res.success) return;
        const idx = this.stations.findIndex(x => x.station_key === this.currentKey);
        if (idx >= 0) this.stations[idx] = res.data;
        this.currentStation = res.data;
        this.refreshSec = 0;
        this.cdr.detectChanges();
        setTimeout(() => { this.drawSpeedo(); this.drawCompass(); }, 100);
        this.loadPressureHistory(this.currentKey);
      },
      error: () => {}
    });
    this.subs.push(s);
  }

  switchStation(key: string): void {
    this.currentKey = key;
    this.currentStation = this.stations.find(s => s.station_key === key) || null;
    if (!this.currentStation) return;
    this.refreshSec = 0;
    this.pressChart?.destroy(); this.pressChart = null;
    this.pressureHistory = [];
    this.cdr.detectChanges();
    setTimeout(() => {
      this.loadPressureHistory(key);
      this.flyToStation(this.currentStation!);
      this.rebuildMapMarkers();
      this.drawSpeedo();
      this.drawCompass();
    }, 100);
  }

  /* ── MAP ── */
  initMap(): void {
    if (!this.mapRef?.nativeElement) return;
    this.zone.runOutsideAngular(() => {
      this.map = L.map(this.mapRef.nativeElement, {
        center: [15, 80], zoom: 5, zoomControl: true, attributionControl: false
      });
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);
    });
  }

  rebuildMapMarkers(): void {
    if (!this.map) return;
    this.zone.runOutsideAngular(() => {
      Object.values(this.mapMarkers).forEach((m: any) => m.remove());
      this.mapMarkers = {};
      this.stations.forEach(sta => {
        if (!sta.latitude || !sta.longitude) return;
        const active = sta.station_key === this.currentKey;
        const col = active ? '#00e5ff' : '#00e676';
        const ic = L.divIcon({
          html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 40" width="30" height="40">
            <path d="M15 0C6.72 0 0 6.72 0 15c0 11.25 15 25 15 25S30 26.25 30 15C30 6.72 23.28 0 15 0z" fill="${col}"/>
            <circle cx="15" cy="15" r="6" fill="white" opacity=".9"/>
            <circle cx="15" cy="15" r="3" fill="${col}"/>
          </svg>`,
          iconSize: [30,40], iconAnchor: [15,40], popupAnchor: [0,-42], className: ''
        });
        const marker = L.marker([sta.latitude, sta.longitude], { icon: ic }).addTo(this.map);
        marker.bindPopup(`
          <div style="background:#151820;border:1px solid rgba(0,229,255,.3);border-radius:10px;padding:12px;min-width:175px;color:#e8eaf6;font-family:'Exo 2',sans-serif">
            <div style="color:#00e5ff;font-weight:800;font-size:.85rem;margin-bottom:8px">${sta.station_name}</div>
            <div style="font-size:.72rem;line-height:2;color:#8892b0">
              🌡️ Temp: <b style="color:#e8eaf6">${(sta.air_temp||0).toFixed(1)}°C</b><br>
              💧 Humidity: <b style="color:#e8eaf6">${(sta.humidity||0).toFixed(1)}%</b><br>
              🌐 Pressure: <b style="color:#e8eaf6">${(sta.air_pressure||0).toFixed(2)} hPa</b><br>
              💨 Wind: <b style="color:#e8eaf6">${(sta.wind_speed||0).toFixed(2)} m/s</b>
            </div>
            <button onclick="window.__ns('${sta.station_key}')"
              style="margin-top:8px;width:100%;padding:5px;border-radius:6px;cursor:pointer;background:rgba(0,229,255,.1);border:1px solid rgba(0,229,255,.35);color:#00e5ff;font-family:'Exo 2',sans-serif;font-size:.72rem;font-weight:700">
              Switch to ${sta.station_key}
            </button>
          </div>`, { className: '' });
        this.mapMarkers[sta.station_key] = marker;
      });
    });
    (window as any).__ns = (k: string) => this.zone.run(() => this.switchStation(k));
  }

  flyToStation(sta: StationReading): void {
    if (this.map && sta?.latitude && sta?.longitude)
      this.zone.runOutsideAngular(() => this.map.flyTo([sta.latitude, sta.longitude], 8, { duration: 1.2 }));
  }

  /* ── SPEEDOMETER ── */
  drawSpeedo(): void {
    const canvas = this.speedoRef?.nativeElement;
    if (!canvas || !this.currentStation) return;

    // Size canvas to its CSS-rendered size
    const rect = canvas.getBoundingClientRect();
    const W = rect.width  || 260;
    const H = rect.height || 160;
    canvas.width  = W;
    canvas.height = H;

    const ctx = canvas.getContext('2d')!;
    const cx = W / 2, cy = H - 12, r = Math.min(W * .46, H * .95);
    const max = 50, spd = this.currentStation.wind_speed || 0;

    ctx.clearRect(0, 0, W, H);

    // Track BG
    ctx.beginPath(); ctx.arc(cx, cy, r, Math.PI, 2*Math.PI);
    ctx.strokeStyle = 'rgba(0,229,255,.1)'; ctx.lineWidth = 14; ctx.lineCap = 'round'; ctx.stroke();

    // Zone arcs
    ([[0,10,'#00e676'],[10,25,'#00e5ff'],[25,38,'#ffab00'],[38,50,'#ff1744']] as [number,number,string][])
      .forEach(([s,e,c]) => {
        ctx.beginPath(); ctx.arc(cx,cy,r, Math.PI+s/max*Math.PI, Math.PI+e/max*Math.PI);
        ctx.strokeStyle=c; ctx.lineWidth=14; ctx.globalAlpha=.28; ctx.stroke(); ctx.globalAlpha=1;
      });

    // Active fill
    const ratio = Math.min(spd/max, 1);
    const g = ctx.createLinearGradient(cx-r,cy,cx+r,cy);
    g.addColorStop(0,'#00e676'); g.addColorStop(.5,'#00e5ff'); g.addColorStop(1,'#ff1744');
    ctx.beginPath(); ctx.arc(cx,cy,r, Math.PI, Math.PI+ratio*Math.PI);
    ctx.strokeStyle=g; ctx.lineWidth=14; ctx.lineCap='round';
    ctx.shadowColor='#00e5ff'; ctx.shadowBlur=12; ctx.stroke(); ctx.shadowBlur=0;

    // Tick marks + labels
    for (let i=0; i<=10; i++) {
      const a = Math.PI + i/10*Math.PI, isM = i%2===0;
      ctx.beginPath();
      ctx.moveTo(cx+Math.cos(a)*(r-(isM?20:12)), cy+Math.sin(a)*(r-(isM?20:12)));
      ctx.lineTo(cx+Math.cos(a)*(r-4),           cy+Math.sin(a)*(r-4));
      ctx.strokeStyle = isM ? 'rgba(232,234,246,.6)' : 'rgba(232,234,246,.2)';
      ctx.lineWidth = isM ? 1.5 : 1; ctx.lineCap='butt'; ctx.shadowBlur=0; ctx.stroke();
      if (isM) {
        ctx.fillStyle='rgba(232,234,246,.5)';
        ctx.font=`${Math.max(8,r*.1)}px "Share Tech Mono",monospace`;
        ctx.textAlign='center';
        ctx.fillText(String(i*5), cx+Math.cos(a)*(r-30), cy+Math.sin(a)*(r-30)+3);
      }
    }

    // Needle
    const na = Math.PI + ratio*Math.PI;
    ctx.save(); ctx.translate(cx,cy); ctx.rotate(na);
    ctx.beginPath(); ctx.moveTo(-12,0); ctx.lineTo(r-10,0);
    ctx.strokeStyle='#fff'; ctx.lineWidth=2; ctx.lineCap='round';
    ctx.shadowColor='rgba(255,255,255,.8)'; ctx.shadowBlur=8; ctx.stroke(); ctx.restore();

    // Hub
    ctx.beginPath(); ctx.arc(cx,cy,7,0,Math.PI*2);
    ctx.fillStyle='#00e5ff'; ctx.shadowColor='#00e5ff'; ctx.shadowBlur=14; ctx.fill();
    ctx.shadowBlur=0;
    ctx.beginPath(); ctx.arc(cx,cy,3.5,0,Math.PI*2); ctx.fillStyle='#fff'; ctx.fill();
  }

  /* ── COMPASS ── */
  drawCompass(): void {
    const canvas = this.compassRef?.nativeElement;
    if (!canvas || !this.currentStation) return;
    const W=canvas.width, H=canvas.height;
    const ctx=canvas.getContext('2d')!, cx=W/2, cy=H/2, r=W/2-6;
    const dir = this.currentStation.wind_dir || 0;
    ctx.clearRect(0,0,W,H);

    ctx.beginPath(); ctx.arc(cx,cy,r,0,Math.PI*2); ctx.strokeStyle='rgba(0,229,255,.2)'; ctx.lineWidth=1.5; ctx.stroke();
    ctx.beginPath(); ctx.arc(cx,cy,r*.65,0,Math.PI*2); ctx.strokeStyle='rgba(0,229,255,.07)'; ctx.lineWidth=1; ctx.stroke();

    for (let i=0;i<36;i++) {
      const a=i/36*Math.PI*2-Math.PI/2, isM=i%9===0;
      ctx.beginPath();
      ctx.moveTo(cx+Math.cos(a)*(r-(isM?7:3)), cy+Math.sin(a)*(r-(isM?7:3)));
      ctx.lineTo(cx+Math.cos(a)*r,             cy+Math.sin(a)*r);
      ctx.strokeStyle=isM?'rgba(0,229,255,.5)':'rgba(0,229,255,.15)'; ctx.lineWidth=isM?1.5:.8; ctx.stroke();
    }
    ['N','E','S','W'].forEach((l,i) => {
      const a=i*Math.PI/2-Math.PI/2;
      ctx.fillStyle=l==='N'?'#ff1744':'rgba(0,229,255,.8)';
      ctx.font='bold 9px "Exo 2",sans-serif'; ctx.textAlign='center'; ctx.textBaseline='middle';
      ctx.fillText(l, cx+Math.cos(a)*(r-9), cy+Math.sin(a)*(r-9));
    });

    const a2=(dir-90)*Math.PI/180, al=r*.52;
    ctx.save(); ctx.translate(cx,cy); ctx.rotate(a2);
    ctx.beginPath(); ctx.moveTo(-al*.35,0); ctx.lineTo(al,0);
    ctx.strokeStyle='#00e5ff'; ctx.lineWidth=2; ctx.lineCap='round';
    ctx.shadowColor='#00e5ff'; ctx.shadowBlur=10; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(al,0); ctx.lineTo(al-12,-5); ctx.lineTo(al-7,0); ctx.lineTo(al-12,5); ctx.closePath();
    ctx.fillStyle='#00e5ff'; ctx.fill();
    ctx.restore(); ctx.shadowBlur=0;
    ctx.beginPath(); ctx.arc(cx,cy,4,0,Math.PI*2); ctx.fillStyle='#fff'; ctx.fill();
  }

  /* ── PRESSURE CHART ── */
  drawPressureChart(): void {
    const canvas = this.pressRef?.nativeElement;
    if (!canvas) return;
    this.pressChart?.destroy(); this.pressChart = null;

    // Explicitly size canvas to container
    const wrap = canvas.parentElement!;
    canvas.width  = wrap.clientWidth  || 400;
    canvas.height = wrap.clientHeight || 180;

    const pts = this.pressureHistory;
    if (!pts?.length) return;

    const data   = pts.map(p => p.air_pressure);
    const labels = pts.map((_,i) => i===pts.length-1 ? 'Now' : `-${pts.length-1-i}h`);
    const ctx2   = canvas.getContext('2d')!;
    const gr = ctx2.createLinearGradient(0,0,0,canvas.height);
    gr.addColorStop(0,'rgba(255,171,0,.38)'); gr.addColorStop(1,'rgba(255,171,0,0)');

    this.pressChart = new (window as any).Chart(ctx2, {
      type: 'line',
      data: { labels, datasets: [{ data, borderColor:'#ffab00', borderWidth:2, pointRadius:0, fill:true, backgroundColor:gr, tension:.45 }] },
      options: {
        responsive: false, animation: { duration: 500 },
        plugins: { legend: { display: false } },
        scales: {
          x: { grid:{color:'rgba(255,255,255,.03)'}, ticks:{color:'rgba(140,150,180,.4)',font:{size:7,family:'Share Tech Mono'},maxTicksLimit:7} },
          y: { grid:{color:'rgba(255,255,255,.04)'}, ticks:{color:'rgba(140,150,180,.5)',font:{size:7,family:'Share Tech Mono'}} }
        }
      }
    });
  }

  /* ── HELPERS ── */
  formatDate(dt: string): string {
    try { return new Date(dt).toLocaleString('en-IN'); } catch { return dt; }
  }
  dirLabel(deg: number): string {
    return ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW'][Math.round((deg||0)/22.5)%16];
  }
  pct(val: number, max: number): string {
    return Math.min(100,((val||0)/max)*100).toFixed(1)+'%';
  }
  pressurePct(p: number): string {
    return Math.min(100,(((p||0)-this.P_MIN)/this.P_RNG)*100).toFixed(1)+'%';
  }
}
