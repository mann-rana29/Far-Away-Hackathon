"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Dehradun Municipal Corporation depot
const DEPOT: [number, number] = [30.3245, 78.0467];

function severityHex(score: number): string {
  if (score >= 8) return "#FF0000"; // Urgent Danger
  if (score >= 5) return "#FF6B00"; // Warning
  return "#FFD600"; // Caution
}

const colors = [
  "#EF4444", "#10B981", "#3B82F6", "#F59E0B", "#8B5CF6", 
  "#EC4899", "#06B6D4", "#84CC16", "#F97316", "#6366F1"
];

async function fetchOSRMRoute(coordinates: [number, number][]) {
  if (coordinates.length < 2) return null;
  
  // OSRM expects {lon},{lat}
  const coordsStr = coordinates.map(c => `${c[1]},${c[0]}`).join(";");
  const url = `https://router.project-osrm.org/route/v1/driving/${coordsStr}?overview=full&geometries=geojson`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.code === "Ok" && data.routes && data.routes.length > 0) {
      // GeoJSON coordinates are [lon, lat], Leaflet needs [lat, lon]
      return data.routes[0].geometry.coordinates.map((c: [number, number]) => [c[1], c[0]]);
    }
  } catch (error) {
    console.error("OSRM Fetch Error:", error);
  }
  return null;
}

const depotIcon = new L.DivIcon({
  className: "bg-transparent",
  html: `
    <div style="display:flex;align-items:center;justify-content:center;">
      <div style="
        width: 22px; height: 22px; border-radius: 4px;
        background: #10B981; border: 2px solid #fff;
        box-shadow: 0 0 12px rgba(16,185,129,0.5), 0 2px 6px rgba(0,0,0,0.3);
        display: flex; align-items: center; justify-content: center;
        font-size: 11px; font-weight: 800; color: #fff;
      ">D</div>
    </div>
  `,
  iconSize: [22, 22],
  iconAnchor: [11, 11],
});

export interface MapProps {
  type: "worker-route" | "admin-routes" | "heatmap";
  data?: any;
  workerLocation?: [number, number] | null;
}

export default function BaseMap({ type, data, workerLocation }: MapProps) {
  const [osrmRoutes, setOsrmRoutes] = useState<Record<string, [number, number][]>>({});
  const center: [number, number] = [30.3165, 78.0322];
  const tileUrl = "https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png";
  const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

  useEffect(() => {
    if (type === "worker-route" && data && data.length > 0) {
      const sorted = [...data].sort((a: any, b: any) => (a.sequenceNo || 0) - (b.sequenceNo || 0));
      const stops: [number, number][] = sorted.map((s: any) => [s.latitude, s.longitude]);
      // Depot → stops in sequence order (one-way, no return)
      const fullRoute = [DEPOT, ...stops];
      fetchOSRMRoute(fullRoute).then(route => {
        if (route) setOsrmRoutes({ worker: route });
      });
    } else if (type === "admin-routes" && data && data.length > 0) {
      data.forEach((routeObj: any) => {
        const sorted = [...(routeObj.stops || [])].sort((a: any, b: any) => (a.sequenceNo || 0) - (b.sequenceNo || 0));
        const stops: [number, number][] = sorted.map((s: any) => [s.latitude, s.longitude]);
        if (stops.length > 0) {
          // Depot → stops in sequence order (one-way, no return)
          const fullRoute = [DEPOT, ...stops];
          fetchOSRMRoute(fullRoute).then(route => {
            if (route) setOsrmRoutes(prev => ({ ...prev, [routeObj.id]: route }));
          });
        }
      });
    }
  }, [type, data]);

  const createColoredPin = (color: string, isHeatmap = false) => {
    return new L.DivIcon({
      className: "bg-transparent",
      html: `
        <div class="heat-marker-container">
          <div class="heat-marker" style="background-color: ${color}; color: ${color};">
            ${isHeatmap ? '<div class="heat-marker-pulse"></div>' : ''}
          </div>
        </div>
      `,
      iconSize: [14, 14],
      iconAnchor: [7, 7],
    });
  };

  // Numbered marker for worker route stops showing sequence
  const createSequencePin = (seqNo: number, color: string, isCleaned: boolean) => {
    const bg = isCleaned ? "#10B981" : color;
    const opacity = isCleaned ? "0.5" : "1";
    return new L.DivIcon({
      className: "bg-transparent",
      html: `
        <div style="display:flex;align-items:center;justify-content:center;opacity:${opacity};">
          <div style="
            width: 26px; height: 26px; border-radius: 50%;
            background: ${bg}; border: 2.5px solid #fff;
            box-shadow: 0 0 10px ${bg}66, 0 2px 6px rgba(0,0,0,0.4);
            display: flex; align-items: center; justify-content: center;
            font-size: 11px; font-weight: 800; color: #fff;
            font-family: system-ui, -apple-system, sans-serif;
          ">${isCleaned ? '✓' : seqNo}</div>
        </div>
      `,
      iconSize: [26, 26],
      iconAnchor: [13, 13],
    });
  };

  if (type === "worker-route") {
    const rawStops = data || [];
    // Sort by sequence number so the route line connects 1→2→3→...
    const stops = [...rawStops].sort((a: any, b: any) => (a.sequenceNo || 0) - (b.sequenceNo || 0));
    const sortedCoords: [number, number][] = stops.map((s: any) => [s.latitude, s.longitude] as [number, number]);
    const fallback: [number, number][] = [DEPOT, ...sortedCoords];
    const polylinePositions = osrmRoutes.worker || fallback;
    
    return (
      <MapContainer center={stops.length > 0 ? [stops[0].latitude, stops[0].longitude] : center} zoom={13} zoomControl={false} attributionControl={false} style={{ height: "100%", width: "100%", zIndex: 1 }}>
        <TileLayer url={tileUrl} attribution={attribution} />
        
        {/* Route outline for depth — white glow visible on dark map */}
        <Polyline positions={polylinePositions} color="#ffffff" weight={6} opacity={0.15} />
        {/* Main route line — orange, dashed */}
        <Polyline positions={polylinePositions} color="#F97316" weight={3} opacity={0.9} dashArray="8 4" />
        
        {/* Depot Marker */}
        <Marker position={DEPOT} icon={depotIcon}>
          <Popup>
            <div className="font-sans p-2">
              <p className="font-bold text-sm">MCD Office — Depot</p>
              <p className="text-[10px] text-muted-foreground mt-1">Route start & end point</p>
            </div>
          </Popup>
        </Marker>

        {stops.map((s: any, idx: number) => {
          const isCleaned = s.status === "CLEANED" || s.complaintStatus === "RESOLVED" || s.complaintStatus === "CLEANED";
          const seqNo = s.sequenceNo || idx + 1;
          return (
            <Marker key={s.id || s.complaintId} position={[s.latitude, s.longitude]} icon={createSequencePin(seqNo, severityHex(s.severityScore), isCleaned)}>
              <Popup>
                <div className="font-sans p-2 min-w-[180px]">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <div style={{
                      width: '24px', height: '24px', borderRadius: '50%',
                      background: isCleaned ? '#10B981' : severityHex(s.severityScore),
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '11px', fontWeight: '800', color: '#fff',
                    }}>{isCleaned ? '✓' : seqNo}</div>
                    <div>
                      <p style={{ fontWeight: '600', fontSize: '13px', margin: 0 }}>{s.location || s.area || 'Stop'}</p>
                      <p style={{ fontSize: '10px', color: '#888', margin: 0 }}>Stop #{seqNo}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', background: severityHex(s.severityScore) + '20', color: severityHex(s.severityScore), fontWeight: '600' }}>
                      Severity: {s.severityScore}
                    </span>
                    <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', background: isCleaned ? '#10B98120' : '#FFD60020', color: isCleaned ? '#10B981' : '#FFD600', fontWeight: '600' }}>
                      {isCleaned ? 'Cleaned' : 'Pending'}
                    </span>
                  </div>
                  {s.imageUrl && (
                    <img src={s.imageUrl} alt="Complaint" style={{ marginTop: '8px', width: '100%', height: '80px', objectFit: 'cover', borderRadius: '6px' }} />
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Worker's live location — pulsing blue dot */}
        {workerLocation && (
          <Marker position={workerLocation} icon={new L.DivIcon({
            className: 'bg-transparent',
            html: `
              <div class="worker-location-marker">
                <div class="worker-location-dot"></div>
                <div class="worker-location-pulse"></div>
              </div>
            `,
            iconSize: [24, 24],
            iconAnchor: [12, 12],
          })}>
            <Popup>
              <div className="font-sans p-2">
                <p style={{ fontWeight: '600', fontSize: '13px', margin: 0 }}>📍 Your Location</p>
                <p style={{ fontSize: '10px', color: '#888', margin: '4px 0 0 0' }}>Live GPS position</p>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    );
  }

  if (type === "admin-routes") {
    const routes = data || [];
    return (
      <div style={{ position: 'relative', height: '100%', width: '100%' }}>
        <MapContainer center={center} zoom={13} zoomControl={false} attributionControl={false} style={{ height: "100%", width: "100%", zIndex: 1 }}>
          <TileLayer url={tileUrl} attribution={attribution} />
          
          {/* Depot Marker */}
          <Marker position={DEPOT} icon={depotIcon}>
            <Popup>
              <div className="font-sans p-2">
                <p className="font-bold text-sm">MCD Office — Depot</p>
                <p className="text-[10px] text-muted-foreground mt-1">All routes start & return here</p>
              </div>
            </Popup>
          </Marker>

          {routes.map((route: any, i: number) => {
            const rawStops = route.stops || [];
            const sortedStops = [...rawStops].sort((a: any, b: any) => (a.sequenceNo || 0) - (b.sequenceNo || 0));
            const sortedCoords: [number, number][] = sortedStops.map((s: any) => [s.latitude, s.longitude] as [number, number]);
            const fallback: [number, number][] = [DEPOT, ...sortedCoords];
            const polylinePositions = osrmRoutes[route.id] || fallback;
            const color = colors[i % colors.length];

            return (
              <div key={route.id}>
                {/* Route outline — white glow visible on dark map */}
                <Polyline positions={polylinePositions} color="#ffffff" weight={6} opacity={0.1} />
                {/* Main route line — dashed, colored */}
                <Polyline positions={polylinePositions} color={color} weight={3} opacity={0.9} dashArray="8 4" />
                {sortedStops.map((stop: any, stopIdx: number) => {
                  const seqNo = stop.sequenceNo || stopIdx + 1;
                  const isCleaned = stop.status === "CLEANED" || stop.complaintStatus === "RESOLVED" || stop.complaintStatus === "CLEANED";
                  return (
                    <Marker key={`${route.id}-${stop.id || stop.complaintId}`} position={[stop.latitude, stop.longitude]} icon={createSequencePin(seqNo, color, isCleaned)}>
                      <Popup>
                        <div className="font-sans p-2 min-w-[180px]">
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                            <div style={{
                              width: '24px', height: '24px', borderRadius: '50%',
                              background: isCleaned ? '#10B981' : color,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: '11px', fontWeight: '800', color: '#fff',
                            }}>{isCleaned ? '✓' : seqNo}</div>
                            <div>
                              <p style={{ fontWeight: '600', fontSize: '13px', margin: 0 }}>{stop.location || stop.area || 'Stop'}</p>
                              <p style={{ fontSize: '10px', color: '#888', margin: 0 }}>Stop #{seqNo} • {route.vehicleNo || route.formattedId || route.id}</p>
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', background: color + '20', color: color, fontWeight: '600' }}>
                              {route.workerName || 'Unassigned'}
                            </span>
                            <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', background: isCleaned ? '#10B98120' : '#FFD60020', color: isCleaned ? '#10B981' : '#FFD600', fontWeight: '600' }}>
                              {isCleaned ? 'Cleaned' : 'Pending'}
                            </span>
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  );
                })}
              </div>
            );
          })}
        </MapContainer>

        {/* Legend Overlay — positioned outside MapContainer */}
        {routes.length > 0 && (
          <div className="route-legend-overlay">
            <div className="route-legend-title">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6l3 1 3-1 3 1 3-1 3 1V17l-3-1-3 1-3-1-3 1-3-1z"/></svg>
              Routes
            </div>
            {routes.map((route: any, i: number) => {
              const color = colors[i % colors.length];
              return (
                <div key={route.id} className="route-legend-item">
                  <div className="route-legend-swatch" style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}55` }}></div>
                  <div className="route-legend-info">
                    <span className="route-legend-vehicle">{route.vehicleNo || `Route ${i + 1}`}</span>
                    <span className="route-legend-worker">{route.workerName || 'Unassigned'}</span>
                  </div>
                </div>
              );
            })}
            <div className="route-legend-item">
              <div className="route-legend-swatch" style={{ backgroundColor: '#10B981', borderRadius: '3px', boxShadow: '0 0 6px #10B98155' }}></div>
              <div className="route-legend-info">
                <span className="route-legend-vehicle">Depot</span>
                <span className="route-legend-worker">MCD Office</span>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (type === "heatmap") {
    const complaints = data || [];
    return (
      <MapContainer center={center} zoom={12} zoomControl={false} attributionControl={false} style={{ height: "100%", width: "100%", zIndex: 1 }}>
        <TileLayer url={tileUrl} attribution={attribution} />
        
        {complaints.map((s: any, i: number) => {
          const color = severityHex(s.severityScore);

          return (
            <Marker 
              key={`heat-${i}`} 
              position={[s.latitude, s.longitude]} 
              icon={createColoredPin(color, true)}
            >
              <Tooltip permanent={false} direction="top" offset={[0, -10]} opacity={1}>
                <div className="w-40 bg-card overflow-hidden">
                  {s.imageUrl ? (
                    <img src={s.imageUrl} alt="Complaint" className="w-full h-28 object-cover" />
                  ) : (
                    <div className="w-full h-24 bg-muted flex items-center justify-center">
                       <span className="text-[10px] text-muted-foreground">No image</span>
                    </div>
                  )}
                </div>
              </Tooltip>
              <Popup>
                <div className="w-64 bg-card">
                  {s.imageUrl ? (
                    <img src={s.imageUrl} alt="Complaint" className="w-full h-auto max-h-48 object-contain" />
                  ) : (
                    <div className="p-4 text-center">
                      <p className="text-xs text-muted-foreground">No detailed image available</p>
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    );
  }

  return null;
}
