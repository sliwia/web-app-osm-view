import { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  GeoJSON,
  LayersControl,
  FeatureGroup,
  TileLayer,
} from "react-leaflet";

import type { Map as LeafletMap } from "leaflet";
import Chart from "ol-ext/style/Chart.js";
import { Tile as TileLayerOl, Vector as VectorLayer } from "ol/layer";
import View from "ol/View";
import { fromLonLat } from "ol/proj";
import { Feature } from "ol";
import Point from "ol/geom/Point";
import Map from "ol/Map";
import { OSM, Vector as VectorSource } from "ol/source";
import "leaflet/dist/leaflet.css";
import { Stroke, Style } from "ol/style";

import wojewodztwaGeoJson from "../data/wojewodztwa.geo.json";
import lines from "../data/linie84.geo.json";
import wojewodztwaPoints from "../data/wojewodztwa_centroidy.geo.json";
import { whiteMask } from "../data/utils/whitemask";
import { polandBounds } from "../data/utils/polandBounds";

// Uncomment below to use canvas renderer for lines
// const canvasRenderer = L.canvas({ padding: 0.5 });

const LayersView = () => {
  const [showStatistics, setShowStatistics] = useState(false);
  const mapMainViewRef = useRef<LeafletMap | null>(null);
  const mapRef = useRef(null);

  useEffect(() => {
    const vectorLayerSource = new VectorSource();

    wojewodztwaPoints.features.forEach((item) => {
      const feature = new Feature({
        geometry: new Point(fromLonLat(item.geometry.coordinates)),
        values: [
          item.properties.dane1,
          item.properties.dane2,
          item.properties.dane3,
        ],
        name: `${item.properties.dane1}, ${item.properties.dane2}, ${item.properties.dane3}`,
      });

      const chartStyle = new Style({
        image: new Chart({
          type: "pie",
          radius: 25,
          data: [
            item.properties.dane1,
            item.properties.dane2,
            item.properties.dane3,
          ],
          colors: ["#ec2020ff", "#1f6bb8ff", "#71f571ff"],
          stroke: new Stroke({ color: "#0a0a0aff", width: 0.7 }),
          rotateWithView: true,
        }),
      });

      feature.setStyle(chartStyle);
      vectorLayerSource.addFeature(feature);
    });

    const vectorLayer = new VectorLayer({
      source: vectorLayerSource,
    });

    const map = new Map({
      target: mapRef.current as unknown as HTMLElement,
      layers: [
        new TileLayerOl({
          source: new OSM(),
          opacity: 0,
        }),
        vectorLayer,
      ],
      view: new View({
        center: fromLonLat([19.0, 52.0]),
        zoom: 6,
      }),
      controls: [],
      interactions: [],
    });

    return () => map.setTarget(undefined);
  }, [showStatistics]);

  const handleZoomMap = () => {
    const map = mapMainViewRef.current;
    if (map) {
      map.flyTo([52, 19], 6);
    }
  };

  const changeMapView = () => {
    setShowStatistics((prevState) => !prevState);
    handleZoomMap();
  };

  return (
    <div>
      <button
        onClick={changeMapView}
        style={{
          border: "1px solid black",
          padding: "6px 10px",
          margin: "4px",
          borderRadius: "4px",
          backgroundColor: "white",
          cursor: "pointer",
          fontSize: "14px",
          fontWeight: "600",
          background: "#c5ffd5a6",
          color: "#161616ff",
        }}
      >
        {showStatistics ? "Hide statistics" : "Show statistics"}
      </button>
      <div style={{ position: "relative" }}>
        {showStatistics && (
          <div
            ref={mapRef}
            style={{
              width: "100%",
              height: "95vh",
              position: "absolute",
              top: 0,
              left: 0,
              zIndex: 1000,
            }}
          />
        )}

        <MapContainer
          ref={mapMainViewRef}
          center={[52, 19]}
          zoom={6}
          style={{ width: "100%", height: "95vh" }}
          maxBounds={polandBounds}
          maxBoundsViscosity={1.0}
          zoomControl={false}
        >
          <GeoJSON
            data={whiteMask as any}
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
            <LayersControl.Overlay name="Linie">
              <FeatureGroup>
                <GeoJSON
                  data={lines as any}
                  // renderer={canvasRenderer}
                  style={{
                    color: "#007BFF",
                    weight: 1,
                    fillOpacity: 0.8,
                  }}
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
          </LayersControl>
        </MapContainer>
      </div>
    </div>
  );
};

export default LayersView;
