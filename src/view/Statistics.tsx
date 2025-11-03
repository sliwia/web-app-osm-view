import { useEffect, useRef, useState, type ChangeEvent } from "react";
import Map from "ol/Map";
import View from "ol/View";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
import { OSM } from "ol/source";
import VectorSource from "ol/source/Vector";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { fromLonLat } from "ol/proj";
import { Fill, Stroke, Style } from "ol/style";
import Chart from "ol-ext/style/Chart.js";
import GeoJSON from "ol/format/GeoJSON";

import wojewodztwaPoints from "../data/wojewodztwa_centroidy.geo.json";

type ChartType = "pie" | "bar" | "pie3D" | "donut";

const Statistics = () => {
  const [chartType, setChartType] = useState<ChartType>("pie");
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
          type: chartType,
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
        new TileLayer({
          source: new OSM(),
        }),
        new VectorLayer({
          source: new VectorSource({
            url: "/wojewodztwa.geo.json",
            format: new GeoJSON({
              dataProjection: "EPSG:4326",
              featureProjection: "EPSG:3857",
            }),
          }),
          style: new Style({
            fill: new Fill({
              color: "rgba(0, 150, 255, 0.1)",
            }),
            stroke: new Stroke({
              color: "#0077cc",
              width: 2,
            }),
          }),
        }),
        vectorLayer,
      ],
      view: new View({
        center: fromLonLat([19.0, 52.0]),
        zoom: 6,
      }),
    });

    return () => map.setTarget(undefined);
  }, [chartType]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setChartType(event.target.value as ChartType);
  };

  return (
    <>
      <form>
        <label>
          <input
            type="radio"
            value="pie"
            checked={chartType === "pie"}
            onChange={handleChange}
          />
          Pie
        </label>

        <br />

        <label>
          <input
            type="radio"
            value="bar"
            checked={chartType === "bar"}
            onChange={handleChange}
          />
          Bar
        </label>

        <br />

        <label>
          <input
            type="radio"
            value="pie3D"
            checked={chartType === "pie3D"}
            onChange={handleChange}
          />
          Pie 3D
        </label>

        <br />

        <label>
          <input
            type="radio"
            value="donut"
            checked={chartType === "donut"}
            onChange={handleChange}
          />
          Donut
        </label>
      </form>
      <div
        ref={mapRef}
        style={{
          width: "100%",
          height: "100vh",
        }}
      />
    </>
  );
};

export default Statistics;
