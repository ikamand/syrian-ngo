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

  const getColor = (count: number, isSelected: boolean) => {
    if (isSelected) return "#166534";
    if (count === 0) return "#e5e7eb";
    if (count <= 2) return "#bbf7d0";
    if (count <= 5) return "#86efac";
    if (count <= 10) return "#4ade80";
    return "#16a34a";
  };

  const style = (feature: GeoJSON.Feature | undefined) => {
    if (!feature?.properties) return {};
    const name = feature.properties.name;
    const count = getGovernorateCount(name);
    const isSelected = selectedGovernorate === name;
    
    return {
      fillColor: getColor(count, isSelected),
      weight: isSelected ? 3 : 1,
      opacity: 1,
      color: isSelected ? "#166534" : "#6b7280",
      fillOpacity: isSelected ? 0.9 : 0.7,
    };
  };

  const onEachFeature = (feature: GeoJSON.Feature, layer: L.Layer) => {
    const name = feature.properties?.name || "";
    const count = getGovernorateCount(name);
    
    layer.bindTooltip(
      `<div style="direction: rtl; font-family: Cairo, sans-serif; padding: 4px;">
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
  };

  return (
    <div className="relative w-full" dir="ltr">
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
          data={syriaGeoJson as GeoJSON.FeatureCollection}
          style={style}
          onEachFeature={onEachFeature}
        />
        <MapController selectedGovernorate={selectedGovernorate} />
      </MapContainer>
      
      <div className="mt-4 flex items-center justify-center gap-4 text-sm text-muted-foreground flex-wrap" dir="rtl">
        <div className="flex items-center gap-2" data-testid="legend-no-orgs">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: "#e5e7eb" }} />
          <span>لا توجد منظمات</span>
        </div>
        <div className="flex items-center gap-2" data-testid="legend-1-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: "#bbf7d0" }} />
          <span>1-2</span>
        </div>
        <div className="flex items-center gap-2" data-testid="legend-3-5">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: "#86efac" }} />
          <span>3-5</span>
        </div>
        <div className="flex items-center gap-2" data-testid="legend-6-10">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: "#4ade80" }} />
          <span>6-10</span>
        </div>
        <div className="flex items-center gap-2" data-testid="legend-10-plus">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: "#16a34a" }} />
          <span>10+</span>
        </div>
      </div>
      
      <style>{`
        .leaflet-tooltip-custom {
          background: white;
          border: 1px solid #e5e7eb;
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
