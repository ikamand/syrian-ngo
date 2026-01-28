import { useState } from "react";

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

const governoratesPaths: Record<string, string> = {
  "دمشق": "M 285 320 L 295 315 L 305 320 L 305 335 L 295 340 L 285 335 Z",
  "ريف دمشق": "M 250 280 L 320 280 L 340 300 L 340 360 L 320 380 L 280 380 L 250 350 L 250 310 Z",
  "حلب": "M 280 80 L 380 60 L 420 100 L 420 180 L 380 200 L 320 200 L 280 160 L 260 120 Z",
  "حمص": "M 200 180 L 320 200 L 380 200 L 380 280 L 320 320 L 240 320 L 180 280 L 180 220 Z",
  "حماة": "M 180 140 L 280 120 L 280 160 L 320 200 L 200 180 L 160 160 Z",
  "اللاذقية": "M 80 100 L 140 80 L 180 100 L 180 160 L 140 180 L 80 160 Z",
  "طرطوس": "M 80 160 L 140 180 L 160 220 L 140 260 L 80 240 Z",
  "إدلب": "M 140 80 L 200 60 L 260 80 L 260 120 L 180 140 L 140 120 Z",
  "الحسكة": "M 420 60 L 520 40 L 560 80 L 560 160 L 500 200 L 420 180 L 420 100 Z",
  "دير الزور": "M 420 180 L 500 200 L 560 240 L 560 320 L 480 360 L 420 320 L 380 280 Z",
  "الرقة": "M 320 120 L 420 100 L 420 180 L 380 200 L 320 200 L 280 160 Z",
  "درعا": "M 280 380 L 320 380 L 340 420 L 300 450 L 260 420 Z",
  "السويداء": "M 320 380 L 380 360 L 400 400 L 380 450 L 340 450 L 320 420 Z",
  "القنيطرة": "M 240 360 L 280 360 L 280 400 L 260 420 L 240 400 Z"
};

const governoratesPositions: Record<string, { x: number; y: number }> = {
  "دمشق": { x: 295, y: 328 },
  "ريف دمشق": { x: 295, y: 330 },
  "حلب": { x: 340, y: 130 },
  "حمص": { x: 280, y: 250 },
  "حماة": { x: 220, y: 150 },
  "اللاذقية": { x: 130, y: 130 },
  "طرطوس": { x: 120, y: 210 },
  "إدلب": { x: 200, y: 100 },
  "الحسكة": { x: 490, y: 120 },
  "دير الزور": { x: 480, y: 270 },
  "الرقة": { x: 360, y: 160 },
  "درعا": { x: 300, y: 410 },
  "السويداء": { x: 360, y: 400 },
  "القنيطرة": { x: 260, y: 380 }
};

export function SyriaMap({ governoratesData, onGovernorateClick, selectedGovernorate }: SyriaMapProps) {
  const [hoveredGovernorate, setHoveredGovernorate] = useState<string | null>(null);

  const getGovernorateCount = (name: string) => {
    const data = governoratesData.find(g => g.name === name);
    return data?.count || 0;
  };

  const getColor = (name: string) => {
    const count = getGovernorateCount(name);
    if (selectedGovernorate === name) return "hsl(var(--primary))";
    if (hoveredGovernorate === name) return "hsl(var(--primary) / 0.7)";
    if (count === 0) return "#e5e7eb";
    if (count <= 5) return "hsl(var(--primary) / 0.3)";
    if (count <= 10) return "hsl(var(--primary) / 0.5)";
    return "hsl(var(--primary) / 0.7)";
  };

  return (
    <div className="relative w-full" dir="ltr">
      <svg
        viewBox="0 0 600 500"
        className="w-full h-auto max-h-[500px]"
        style={{ fontFamily: "Cairo, sans-serif" }}
      >
        <defs>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.15" />
          </filter>
        </defs>
        
        {Object.entries(governoratesPaths).map(([name, path]) => {
          const count = getGovernorateCount(name);
          const isSelected = selectedGovernorate === name;
          const isHovered = hoveredGovernorate === name;
          
          return (
            <g key={name}>
              <path
                d={path}
                fill={getColor(name)}
                stroke={isSelected ? "hsl(var(--primary))" : "#9ca3af"}
                strokeWidth={isSelected ? 3 : 1.5}
                className="cursor-pointer transition-all duration-200"
                onMouseEnter={() => setHoveredGovernorate(name)}
                onMouseLeave={() => setHoveredGovernorate(null)}
                onClick={() => onGovernorateClick(name)}
                filter={isSelected || isHovered ? "url(#shadow)" : undefined}
                data-testid={`map-governorate-${name}`}
              />
              {count > 0 && (
                <circle
                  cx={governoratesPositions[name]?.x || 0}
                  cy={(governoratesPositions[name]?.y || 0) - 20}
                  r="12"
                  fill="hsl(var(--primary))"
                  className="pointer-events-none"
                />
              )}
              {count > 0 && (
                <text
                  x={governoratesPositions[name]?.x || 0}
                  y={(governoratesPositions[name]?.y || 0) - 16}
                  textAnchor="middle"
                  className="text-[10px] font-bold fill-white pointer-events-none"
                >
                  {count}
                </text>
              )}
            </g>
          );
        })}
        
        {Object.entries(governoratesPositions).map(([name, pos]) => (
          <text
            key={`label-${name}`}
            x={pos.x}
            y={pos.y}
            textAnchor="middle"
            className="text-[11px] font-medium fill-gray-700 pointer-events-none"
            style={{ fontFamily: "Cairo, sans-serif" }}
          >
            {name}
          </text>
        ))}
      </svg>
      
      {hoveredGovernorate && (
        <div className="absolute top-4 left-4 bg-white shadow-lg rounded-lg p-3 border z-10" dir="rtl">
          <p className="font-bold text-primary">{hoveredGovernorate}</p>
          <p className="text-sm text-muted-foreground">
            {getGovernorateCount(hoveredGovernorate)} منظمة
          </p>
        </div>
      )}
      
      <div className="mt-4 flex items-center justify-center gap-4 text-sm text-muted-foreground flex-wrap" dir="rtl">
        <div className="flex items-center gap-2" data-testid="legend-no-orgs">
          <div className="w-4 h-4 rounded bg-gray-200" />
          <span>لا توجد منظمات</span>
        </div>
        <div className="flex items-center gap-2" data-testid="legend-1-5">
          <div className="w-4 h-4 rounded bg-primary/30" />
          <span>1-5</span>
        </div>
        <div className="flex items-center gap-2" data-testid="legend-6-10">
          <div className="w-4 h-4 rounded bg-primary/50" />
          <span>6-10</span>
        </div>
        <div className="flex items-center gap-2" data-testid="legend-10-plus">
          <div className="w-4 h-4 rounded bg-primary/70" />
          <span>10+</span>
        </div>
      </div>
    </div>
  );
}
