export const syriaGeoJson = {
  type: "FeatureCollection" as const,
  features: [
    {
      type: "Feature" as const,
      properties: { name: "دمشق", nameEn: "Damascus" },
      geometry: {
        type: "Polygon" as const,
        coordinates: [[[36.25, 33.52], [36.35, 33.52], [36.35, 33.48], [36.25, 33.48], [36.25, 33.52]]]
      }
    },
    {
      type: "Feature" as const,
      properties: { name: "ريف دمشق", nameEn: "Rif Dimashq" },
      geometry: {
        type: "Polygon" as const,
        coordinates: [[[35.8, 34.0], [37.2, 34.0], [37.5, 33.2], [36.8, 32.8], [35.8, 33.0], [35.8, 34.0]]]
      }
    },
    {
      type: "Feature" as const,
      properties: { name: "حلب", nameEn: "Aleppo" },
      geometry: {
        type: "Polygon" as const,
        coordinates: [[[36.0, 37.0], [38.2, 37.0], [38.5, 36.2], [37.8, 35.8], [36.5, 35.8], [36.0, 36.2], [36.0, 37.0]]]
      }
    },
    {
      type: "Feature" as const,
      properties: { name: "حمص", nameEn: "Homs" },
      geometry: {
        type: "Polygon" as const,
        coordinates: [[[36.0, 35.5], [39.0, 35.5], [39.0, 34.0], [37.5, 33.8], [36.0, 34.2], [36.0, 35.5]]]
      }
    },
    {
      type: "Feature" as const,
      properties: { name: "حماة", nameEn: "Hama" },
      geometry: {
        type: "Polygon" as const,
        coordinates: [[[36.2, 35.8], [37.5, 35.8], [37.5, 34.8], [36.2, 34.8], [36.2, 35.8]]]
      }
    },
    {
      type: "Feature" as const,
      properties: { name: "اللاذقية", nameEn: "Latakia" },
      geometry: {
        type: "Polygon" as const,
        coordinates: [[[35.7, 36.2], [36.3, 36.2], [36.3, 35.5], [35.7, 35.5], [35.7, 36.2]]]
      }
    },
    {
      type: "Feature" as const,
      properties: { name: "طرطوس", nameEn: "Tartus" },
      geometry: {
        type: "Polygon" as const,
        coordinates: [[[35.7, 35.5], [36.2, 35.5], [36.2, 34.6], [35.7, 34.6], [35.7, 35.5]]]
      }
    },
    {
      type: "Feature" as const,
      properties: { name: "إدلب", nameEn: "Idlib" },
      geometry: {
        type: "Polygon" as const,
        coordinates: [[[36.0, 36.2], [37.0, 36.2], [37.0, 35.5], [36.0, 35.5], [36.0, 36.2]]]
      }
    },
    {
      type: "Feature" as const,
      properties: { name: "الحسكة", nameEn: "Al-Hasakah" },
      geometry: {
        type: "Polygon" as const,
        coordinates: [[[39.5, 37.3], [42.4, 37.3], [42.4, 35.5], [40.5, 35.0], [39.5, 35.5], [39.5, 37.3]]]
      }
    },
    {
      type: "Feature" as const,
      properties: { name: "دير الزور", nameEn: "Deir ez-Zor" },
      geometry: {
        type: "Polygon" as const,
        coordinates: [[[39.0, 36.0], [41.5, 36.0], [42.0, 34.5], [40.5, 33.5], [39.0, 34.5], [39.0, 36.0]]]
      }
    },
    {
      type: "Feature" as const,
      properties: { name: "الرقة", nameEn: "Ar-Raqqah" },
      geometry: {
        type: "Polygon" as const,
        coordinates: [[[38.0, 36.5], [40.0, 36.5], [40.0, 35.5], [38.0, 35.5], [38.0, 36.5]]]
      }
    },
    {
      type: "Feature" as const,
      properties: { name: "درعا", nameEn: "Daraa" },
      geometry: {
        type: "Polygon" as const,
        coordinates: [[[35.8, 33.0], [36.6, 33.0], [36.6, 32.4], [35.8, 32.4], [35.8, 33.0]]]
      }
    },
    {
      type: "Feature" as const,
      properties: { name: "السويداء", nameEn: "As-Suwayda" },
      geometry: {
        type: "Polygon" as const,
        coordinates: [[[36.4, 33.2], [37.4, 33.2], [37.4, 32.4], [36.4, 32.4], [36.4, 33.2]]]
      }
    },
    {
      type: "Feature" as const,
      properties: { name: "القنيطرة", nameEn: "Quneitra" },
      geometry: {
        type: "Polygon" as const,
        coordinates: [[[35.7, 33.3], [36.0, 33.3], [36.0, 32.9], [35.7, 32.9], [35.7, 33.3]]]
      }
    }
  ]
};

export const governorateCoordinates: Record<string, [number, number]> = {
  "دمشق": [33.513, 36.292],
  "ريف دمشق": [33.65, 36.45],
  "حلب": [36.2, 37.16],
  "حمص": [34.73, 36.72],
  "حماة": [35.13, 36.75],
  "اللاذقية": [35.52, 35.79],
  "طرطوس": [34.89, 35.88],
  "إدلب": [35.93, 36.63],
  "الحسكة": [36.5, 40.75],
  "دير الزور": [35.33, 40.14],
  "الرقة": [35.95, 39.01],
  "درعا": [32.62, 36.10],
  "السويداء": [32.71, 36.57],
  "القنيطرة": [33.12, 35.82]
};
