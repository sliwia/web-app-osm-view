import polandGeoJson from "../../data/polska.geo.json";

const wordCoordinates = [
  [-90, -180],
  [-90, 180],
  [90, 180],
  [90, -180],
  [-90, -180],
];
export const whiteMask = {
  type: "Feature",
  geometry: {
    type: "Polygon",
    coordinates: [
      wordCoordinates,
      polandGeoJson.features[0].geometry.coordinates[0][0],
    ],
  },
};
