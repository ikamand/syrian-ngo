import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { syriaGeoJson, governorateCoordinates } from "@/data/syriaGeoJson";

interface GovernorateData {
  id: string;
  name: string;
  nameEn: string;
  count: number;
}

interface SyriaMapProps {
  governoratesData: GovernorateData[];
  onGovernorateClick: (governorate: string) => void;
  selectedGovernorate: string | null;
}

function MapController({ selectedGovernorate }: { selectedGovernorate: string | null }) {
  const map = useMap();
  
  useEffect(() => {
    if (selectedGovernorate && governorateCoordinates[selectedGovernorate]) {
      const coords = governorateCoordinates[selectedGovernorate];
      map.flyTo(coords, 8, { duration: 0.5 });
    } else {
      map.flyTo([35.0, 38.5], 6, { duration: 0.5 });
    }
  }, [selectedGovernorate, map]);
  
  return null;
}

export function SyriaMapLeaflet({ governoratesData, onGovernorateClick, selectedGovernorate }: SyriaMapProps) {
  const geoJsonRef = useRef<L.GeoJSON | null>(null);
  
  const getGovernorateCount = (name: string) => {
    const data = governoratesData.find(g => g.name === name);
    return data?.count || 0;
  };

  const getColorClass = (count: number, isSelected: boolean): string => {
    if (isSelected) return "var(--map-selected)";
    if (count === 0) return "var(--map-empty)";
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
    if (cssVar.includes("map-empty")) return "hsl(220 9% 91%)";
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
        zoom={6}
        style={{ height: "500px", width: "100%", borderRadius: "0" }}
        scrollWheelZoom={true}
        className="z-0"
        data-testid="leaflet-map-container"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <GeoJSON
          ref={geoJsonRef as any}
          data={syriaGeoJson as any}
          style={style}
          onEachFeature={onEachFeature}
        />
        <MapController selectedGovernorate={selectedGovernorate} />
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
      `}</style>
    </div>
  );
}
