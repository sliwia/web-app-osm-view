import {
  MapContainer,
  TileLayer,
  GeoJSON,
  LayersControl,
  FeatureGroup,
} from "react-leaflet";
import { latLngBounds } from "leaflet";
import "leaflet/dist/leaflet.css";

import linesGeoJson from "../data/linie2.geo.json";
import polandGeoJson from "../data/polska.geo.json";
import wojewodztwaGeoJson from "../data/wojewodztwa.geo.json";
import { wordCoordinates } from "../data/worldCoordinates";

const polandBounds = latLngBounds([49.0, 14.1], [55.0, 24.2]);

export default function MapWithStatistic() {
  const mask = {
    type: "Feature",
    geometry: {
      type: "Polygon",
      coordinates: [wordCoordinates, polandGeoJson.geometry.coordinates[0]],
    },
  };

  return (
    <MapContainer
      center={[52, 19]}
      zoom={6}
      style={{ width: "90vw", height: "100vh" }}
      maxBounds={polandBounds}
      maxBoundsViscosity={1.0}
    >
      <GeoJSON
        data={mask as any}
        style={{
          color: "#fff",
          weight: 1,
          fillColor: "#fff",
          fillOpacity: 0.9,
        }}
      />

      <LayersControl position="topright">
        <LayersControl.Overlay name="Open street map" checked>
          <FeatureGroup pathOptions={{ color: "purple" }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap"
            />
          </FeatureGroup>
        </LayersControl.Overlay>

        <LayersControl.Overlay name="Wojewodztwa" checked>
          <FeatureGroup pathOptions={{ color: "purple" }}>
            <GeoJSON
              data={wojewodztwaGeoJson as any}
              style={{
                color: "#1d1f1dff",
                weight: 2,
                fillColor: "#3a994fff",
                fillOpacity: 0.6,
              }}
            />
          </FeatureGroup>
        </LayersControl.Overlay>

        <LayersControl.Overlay name="Rzeki">
          <FeatureGroup>
            <GeoJSON
              data={linesGeoJson as any}
              style={{
                color: "#007BFF",
                weight: 2,
                opacity: 0.8,
                dashArray: "5,5",
              }}
            />
          </FeatureGroup>
        </LayersControl.Overlay>
      </LayersControl>
    </MapContainer>
  );
}
