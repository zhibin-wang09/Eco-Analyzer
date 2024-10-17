import React, { useEffect, useRef, useCallback, useState } from "react";
import L from "leaflet";
import { GeoJsonObject, Feature, Geometry } from "geojson";
import axios from "axios";
import statesData from "./state";
import { VStack, Center } from "@chakra-ui/react";
import "../style/legend.css";
import "leaflet/dist/leaflet.css";

interface FeatureCollection {
  type: "FeatureCollection";
  features: Array<{
    type: "Feature";
    properties: { [key: string]: any };
    geometry: Geometry;
  }>;
}

interface StateData {
  state: string;
  district: any;
  precinct: any;
}

interface USMapProps {
  onStateSelect: (state: string) => void;
  selectedState: string | null;
  selectedData: string | null;
}

function validateAndFixGeoJSON(data: any): FeatureCollection {
  if (data && data.geometries) {
    // This is for district data
    return {
      type: "FeatureCollection",
      features: data.geometries.map((item: any) => ({
        type: "Feature",
        properties: {},
        geometry: item.geometry,
      })),
    };
  } else if (data && data.features) {
    // This is for precinct data
    return {
      type: "FeatureCollection",
      features: data.features.map((feature: any) => ({
        type: "Feature",
        properties: feature.properties || {},
        geometry: feature.geometry,
      })),
    };
  } else {
    console.error("Invalid GeoJSON data:", data);
    return {
      type: "FeatureCollection",
      features: [],
    };
  }
}

const USMap: React.FC<USMapProps> = ({
  onStateSelect,
  selectedState,
  selectedData,
}) => {
  // const [arkansasPrecincts, setArkansasPrecincts] = useState<FeatureCollection | null>(null);
  // const [newyorkPrecincts, setNewYorkPrecincts] = useState<FeatureCollection | null>(null);
  const [arkansasCd, setArkansasCd] = useState<FeatureCollection | null>(null);
  const [newyorkCd, setNewYorkCd] = useState<FeatureCollection | null>(null);
  const [map, setMap] = useState<L.Map | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  // const precinctLayerRef = useRef<L.GeoJSON | null>(null);
  const cdLayerRef = useRef<L.GeoJSON | null>(null);

  const highlightFeatures = useCallback((e: L.LeafletMouseEvent) => {
    const layer = e.target;
    layer.setStyle({
      weight: 5,
      color: "#666",
      dashArray: "",
      fillOpacity: 0.7,
    });
  }, []);

  const resetHighlight = useCallback(
    (e: L.LeafletMouseEvent, geojson: L.GeoJSON) => {
      geojson.resetStyle(e.target);
    },
    []
  );

  const zoomToFeature = useCallback((e: L.LeafletMouseEvent, map: L.Map) => {
    map.fitBounds(e.target.getBounds());
    console.log(e.target.getBounds());
  }, []);

  const onClick = useCallback(
    (e: L.LeafletMouseEvent, map: L.Map, feature: Feature) => {
      const stateName = feature.properties?.name || null;
      if (stateName === "New York" || stateName === "Arkansas") {
        onStateSelect(stateName);
        zoomToFeature(e, map);
      } else {
        onStateSelect("State");
      }
    },
    [onStateSelect, zoomToFeature]
  );

  useEffect(() => {
    if (mapRef.current) {
      const map = L.map(mapRef.current).setView([37.8, -96], 4);

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        minZoom: 3,
        maxZoom: 24,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      const onEachFeature = (feature: Feature, layer: L.Layer) => {
        layer.on({
          mouseover: highlightFeatures,
          mouseout: (e) => resetHighlight(e, geojson),
          click: (e) => onClick(e, map, feature),
        });
      };

      const geojson = L.geoJSON(statesData as GeoJsonObject, {
        style: (feature) => {
          return {
            fillColor:
              feature?.properties!.name === "New York"
                ? "#0000FF"
                : feature?.properties!.name === "Arkansas"
                ? "#FF5733"
                : "#FFFFFF",
            color: "#000",
            weight: 0.7,
            fillOpacity: 0.7,
          };
        },
        onEachFeature: onEachFeature,
      }).addTo(map);

      var legend = new L.Control({ position: "bottomleft" });

      legend.onAdd = function (map) {
        var div = L.DomUtil.create("div", "info");
        div.innerHTML += `
            <i style="background:#0000FF"></i>
            <Text>New York (Democratic)</Text>
          <br/>
            <i style="background:#FF5733"></i>
            <Text>Arkansas (Republican)</Text>`;
        return div;
      };

      legend.addTo(map);

      setMap(map);

      // Fetch data from backend
      const fetchMapData = async () => {
        try {
          const response = await axios.get(
            "http://localhost:8080/getcoordinates"
          );
          const responseData = response.data;
          console.log("Received data:", JSON.stringify(responseData, null, 2));

          if (
            responseData &&
            responseData.data &&
            Array.isArray(responseData.data) &&
            responseData.data.length >= 2
          ) {
            const arkansasData = responseData.data.find(
              (item: StateData) => item.state === "Arkansas"
            );
            const newYorkData = responseData.data.find(
              (item: StateData) => item.state === "New York"
            );

            if (arkansasData) {
              setArkansasCd(validateAndFixGeoJSON(arkansasData.district));
            }

            if (newYorkData) {
              setNewYorkCd(validateAndFixGeoJSON(newYorkData.district));
            }
          } else {
            console.error("Unexpected data structure:", responseData);
          }
        } catch (error) {
          console.error("Error fetching map data:", error);
        }
      };

      fetchMapData();

      return () => {
        map.remove();
      };
    }
  }, [highlightFeatures, onClick, resetHighlight]);

  useEffect(() => {
    if (!map) return;

    const fitToBound = (selectedState: string | null) => {
      setTimeout(function () {
        map.invalidateSize();
      }, 0);
      if (selectedState === "Arkansas") {
        map.fitBounds(
          new L.LatLngBounds(
            new L.LatLng(36.501861, -89.730812),
            new L.LatLng(33.002096, -94.616242)
          )
        );
      } else if (selectedState === "New York") {
        map.fitBounds(
          new L.LatLngBounds(
            new L.LatLng(45.018503, -72.100541),
            new L.LatLng(40.543843, -79.76278)
          )
        );
      }
    };

    if (selectedState !== "State") {
      if (cdLayerRef.current) {
        map.removeLayer(cdLayerRef.current);
        cdLayerRef.current = null;
      }

      let congressionalDistrict: FeatureCollection | null = null;

      if (selectedState === "New York") {
        congressionalDistrict = newyorkCd;
      } else if (selectedState === "Arkansas") {
        congressionalDistrict = arkansasCd;
      }

      if (congressionalDistrict) {
        const onEachFeature = (feature: Feature, layer: L.Layer) => {
          layer.on({
            mouseover: highlightFeatures,
            mouseout: (e) => resetHighlight(e, cdLayerRef.current!),
          });
        };

        cdLayerRef.current = L.geoJSON(congressionalDistrict, {
          style: { color: "#000000", weight: 0.5 },
          onEachFeature: onEachFeature,
        }).addTo(map);
      }
    } else {
      // Remove layers when no state is selected

      if (cdLayerRef.current) {
        map.removeLayer(cdLayerRef.current);
        cdLayerRef.current = null;
      }
    }
    fitToBound(selectedState);
  }, [
    map,
    selectedData,
    selectedState,
    newyorkCd,
    arkansasCd,
    highlightFeatures,
    resetHighlight,
  ]);

  return (
    <VStack spacing={4} align="stretch" height="100%" width="100%">
      <Center id="map" ref={mapRef} height="100%" width="100%" zIndex="1" />
    </VStack>
  );
};

export default USMap;
