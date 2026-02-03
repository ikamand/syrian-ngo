import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, GeoJSON, useMap, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { syriaGeoJson, governorateCoordinates } from "@/data/syriaGeoJson";

// Custom marker icon for branch locations (lighter green)
const branchIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Custom marker icon for headquarters (using black for clear distinction from green branch markers)
const headquartersIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-black.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface GovernorateData {
  id: string;
  name: string;
  nameEn: string;
  count: number;
}

interface BranchLocation {
  ngoId: number;
  ngoName: string;
  branchType: string;
  governorate: string;
  latitude: number;
  longitude: number;
  offeredServices?: string;
}

interface HeadquartersLocation {
  ngoId: number;
  ngoName: string;
  governorate: string;
  latitude: number;
  longitude: number;
}

interface SyriaMapProps {
  governoratesData: GovernorateData[];
  onGovernorateClick: (governorate: string) => void;
  selectedGovernorate: string | null;
  branchLocations?: BranchLocation[];
  headquartersLocations?: HeadquartersLocation[];
}

function MapController({ selectedGovernorate }: { selectedGovernorate: string | null }) {
  const map = useMap();
  
  useEffect(() => {
    // Zoom disabled on selection as per user request
    if (!selectedGovernorate) {
      map.flyTo([35.0, 38.5], 6.5, { duration: 0.5 });
    }
  }, [selectedGovernorate, map]);
  
  return null;
}

export function SyriaMapLeaflet({ governoratesData, onGovernorateClick, selectedGovernorate, branchLocations = [], headquartersLocations = [] }: SyriaMapProps) {
  const geoJsonRef = useRef<L.GeoJSON | null>(null);
  
  const getGovernorateCount = (name: string) => {
    const data = governoratesData.find(g => g.name === name);
    return data?.count || 0;
  };

  const getColorClass = (count: number, isSelected: boolean): string => {
    if (isSelected) return "var(--map-selected)";
    if (count === 0) return "transparent";
    if (count <= 2) return "var(--map-low)";
    if (count <= 5) return "var(--map-medium)";
    if (count <= 10) return "var(--map-high)";
    return "var(--map-very-high)";
  };

  const getCSSColorValue = (cssVar: string): string => {
    const root = document.documentElement;
    const computedStyle = getComputedStyle(root);
    const hslValue = computedStyle.getPropertyValue(cssVar.replace("var(--", "--").replace(")", "")).trim();
    if (hslValue) {
      return `hsl(${hslValue})`;
    }
    if (cssVar === "transparent") return "transparent";
    if (cssVar.includes("map-empty")) return "transparent";
    if (cssVar.includes("map-low")) return "hsl(141 76% 85%)";
    if (cssVar.includes("map-medium")) return "hsl(142 70% 73%)";
    if (cssVar.includes("map-high")) return "hsl(142 70% 55%)";
    if (cssVar.includes("map-very-high")) return "hsl(142 76% 36%)";
    if (cssVar.includes("map-selected")) return "hsl(140 60% 20%)";
    if (cssVar.includes("map-border")) return "hsl(215 14% 45%)";
    return "#e5e7eb";
  };

  const style = (feature: GeoJSON.Feature | undefined) => {
    if (!feature?.properties) return {};
    const name = feature.properties.name;
    const count = getGovernorateCount(name);
    const isSelected = selectedGovernorate === name;
    const colorVar = getColorClass(count, isSelected);
    
    return {
      fillColor: getCSSColorValue(colorVar),
      weight: isSelected ? 3 : 1,
      opacity: 1,
      color: isSelected ? getCSSColorValue("var(--map-selected)") : getCSSColorValue("var(--map-border)"),
      fillOpacity: isSelected ? 0.9 : 0.7,
    };
  };

  const onEachFeature = (feature: GeoJSON.Feature, layer: L.Layer) => {
    const name = feature.properties?.name || "";
    const govId = feature.properties?.id || name;
    const count = getGovernorateCount(name);
    
    if (layer instanceof L.Path) {
      const pathElement = (layer as any)._path;
      if (pathElement) {
        pathElement.setAttribute("data-testid", `map-governorate-${govId}`);
      }
    }
    
    layer.bindTooltip(
      `<div style="direction: rtl; font-family: Cairo, sans-serif; padding: 4px;" data-testid="tooltip-${govId}">
        <strong>${name}</strong><br/>
        ${count} منظمة
      </div>`,
      { 
        permanent: false, 
        direction: "top",
        className: "leaflet-tooltip-custom"
      }
    );

    layer.on({
      mouseover: (e) => {
        const target = e.target;
        target.setStyle({
          weight: 2,
          fillOpacity: 0.85,
        });
        target.bringToFront();
      },
      mouseout: (e) => {
        if (geoJsonRef.current) {
          geoJsonRef.current.resetStyle(e.target);
        }
      },
      click: () => {
        onGovernorateClick(name);
      }
    });
    
    layer.on("add", () => {
      if (layer instanceof L.Path) {
        const pathElement = (layer as any)._path;
        if (pathElement) {
          pathElement.setAttribute("data-testid", `map-governorate-${govId}`);
        }
      }
    });
  };

  return (
    <div className="relative w-full" dir="ltr" data-testid="syria-map-wrapper">
      <MapContainer
        center={[35.0, 38.5]}
        zoom={6.5}
        style={{ height: "500px", width: "100%", borderRadius: "0" }}
        scrollWheelZoom={true}
        className="z-0"
        data-testid="leaflet-map-container"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        <GeoJSON
          ref={geoJsonRef as any}
          data={syriaGeoJson as any}
          style={style}
          onEachFeature={onEachFeature}
        />
        <MapController selectedGovernorate={selectedGovernorate} />
        
        {/* Branch location markers (lighter green) */}
        {branchLocations.map((branch, index) => (
          <Marker
            key={`branch-${branch.ngoId}-${index}`}
            position={[branch.latitude, branch.longitude]}
            icon={branchIcon}
          >
            <Popup>
              <div style={{ direction: "rtl", fontFamily: "Cairo, sans-serif", minWidth: "150px" }}>
                <strong style={{ color: "hsl(142 76% 36%)", fontSize: "14px" }}>{branch.ngoName}</strong>
                <div style={{ marginTop: "4px", fontSize: "12px", color: "#666" }}>
                  <div><strong>نوع الفرع:</strong> {branch.branchType || "—"}</div>
                  <div><strong>المحافظة:</strong> {branch.governorate || "—"}</div>
                  {branch.offeredServices && (
                    <div style={{ marginTop: "4px" }}><strong>الخدمات:</strong> {branch.offeredServices}</div>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
        
        {/* Headquarters location markers (darker - black) */}
        {headquartersLocations.map((hq) => (
          <Marker
            key={`hq-${hq.ngoId}`}
            position={[hq.latitude, hq.longitude]}
            icon={headquartersIcon}
          >
            <Popup>
              <div style={{ direction: "rtl", fontFamily: "Cairo, sans-serif", minWidth: "150px" }}>
                <strong style={{ color: "#1a1a1a", fontSize: "14px" }}>{hq.ngoName}</strong>
                <div style={{ marginTop: "4px", fontSize: "12px", color: "#666" }}>
                  <div><strong>النوع:</strong> المقر الرئيسي</div>
                  <div><strong>المحافظة:</strong> {hq.governorate || "—"}</div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      <div className="mt-4 flex items-center justify-center gap-4 text-sm text-muted-foreground flex-wrap" dir="rtl" data-testid="map-legend">
        <div className="flex items-center gap-2" data-testid="legend-no-orgs">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: "hsl(var(--map-empty))" }} />
          <span>لا توجد منظمات</span>
        </div>
        <div className="flex items-center gap-2" data-testid="legend-1-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: "hsl(var(--map-low))" }} />
          <span>1-2</span>
        </div>
        <div className="flex items-center gap-2" data-testid="legend-3-5">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: "hsl(var(--map-medium))" }} />
          <span>3-5</span>
        </div>
        <div className="flex items-center gap-2" data-testid="legend-6-10">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: "hsl(var(--map-high))" }} />
          <span>6-10</span>
        </div>
        <div className="flex items-center gap-2" data-testid="legend-10-plus">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: "hsl(var(--map-very-high))" }} />
          <span>10+</span>
        </div>
      </div>
      
      <style>{`
        .leaflet-tooltip-custom {
          background: white;
          border: 1px solid hsl(var(--border));
          border-radius: 4px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .leaflet-container {
          font-family: Cairo, sans-serif;
        }
        /* Remove focus outline (square box) from governorate paths */
        .leaflet-container path:focus {
          outline: none;
        }
        .leaflet-interactive:focus {
          outline: none;
        }
      `}</style>
    </div>
  );
}
