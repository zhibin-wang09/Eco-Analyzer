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
  setDistrictData: (state: string) => void;
}

const USMap: React.FC<USMapProps> = ({
  onStateSelect,
  selectedState,
  selectedData,
  setDistrictData,
}) => {
  const [arkansasCd, setArkansasCd] = useState<FeatureCollection | null>(null);
  const [newyorkCd, setNewYorkCd] = useState<FeatureCollection | null>(null);
  const [map, setMap] = useState<L.Map | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
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
  }, []);

  const onClick = useCallback(
    (e: L.LeafletMouseEvent, map: L.Map, feature: Feature) => {
      const stateName = feature.properties?.name || null;
      if (stateName === "New York" || stateName === "Arkansas") {
        onStateSelect(stateName);
        zoomToFeature(e, map);
      }
    },
    [onStateSelect, zoomToFeature]
  );

  const districtOnClick = useCallback(
    (e: L.LeafletMouseEvent) => {
      setDistrictData(e.target.feature.properties.number);
    },
    [setDistrictData]
  );

  // Initialize the base map
  useEffect(() => {
    if (mapRef.current && !map) {
      const initialMap = L.map(mapRef.current, {
        zoomAnimation: true,
        fadeAnimation: true,
        markerZoomAnimation: true,
      }).setView([37.8, -96], 4);

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        minZoom: 3,
        maxZoom: 24,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(initialMap);

      const onEachFeature = (feature: Feature, layer: L.Layer) => {
        layer.on({
          mouseover: highlightFeatures,
          mouseout: (e) => resetHighlight(e, geojson),
          click: (e) => onClick(e, initialMap, feature),
        });
      };

      const geojson = L.geoJSON(statesData as GeoJsonObject, {
        style: (feature) => ({
          fillColor:
            feature?.properties?.name === "New York"
              ? "#0000FF"
              : feature?.properties?.name === "Arkansas"
              ? "#FF5733"
              : "#FFFFFF",
          color: "#000",
          weight: 0.7,
          fillOpacity: 0.7,
        }),
        onEachFeature: onEachFeature,
      }).addTo(initialMap);

      const legend = new L.Control({ position: "bottomleft" });
      legend.onAdd = function () {
        const div = L.DomUtil.create("div", "info legend");
        div.innerHTML = `
          <i style="background:#0000FF"></i>
          <span>New York (Democratic)</span>
          <br/>
          <i style="background:#FF5733"></i>
          <span>Arkansas (Republican)</span>
        `;
        return div;
      };
      legend.addTo(initialMap);

      setMap(initialMap);
    }
  }, [map, highlightFeatures, onClick, resetHighlight]);

  // Handle state selection and district display
  useEffect(() => {
    if (!map) return;

    const fitToBound = (selectedState: string | null) => {
      setTimeout(() => {
        map.invalidateSize();
      }, 0);
      
      if (selectedState === "Arkansas") {
        map.flyToBounds(
          new L.LatLngBounds(
            new L.LatLng(36.501861, -89.730812),
            new L.LatLng(33.002096, -94.616242)
          ),
          {
            duration: 1.5,
            easeLinearity: 0.25
          }
        );
      } else if (selectedState === "New York") {
        map.flyToBounds(
          new L.LatLngBounds(
            new L.LatLng(45.018503, -72.100541),
            new L.LatLng(40.543843, -79.76278)
          ),
          {
            duration: 1.5,
            easeLinearity: 0.25
          }
        );
      } else {
        map.flyTo([37.8, -96], 4, {
          duration: 1.5,
          easeLinearity: 0.25
        });
      }
    };

    const fetchMapData = async () => {
      try {
        const response = await axios.get("http://localhost:8080/getcoordinates");
        const responseData = response.data;

        if (
          responseData?.data &&
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
            setArkansasCd(arkansasData.district);
          }
          if (newYorkData) {
            setNewYorkCd(newYorkData.district);
          }
        }
      } catch (error) {
        console.error("Error fetching map data:", error);
      }
    };

    if (selectedState !== "State") {
      if (cdLayerRef.current) {
        map.removeLayer(cdLayerRef.current);
        cdLayerRef.current = null;
      }

      let congressionalDistrict: FeatureCollection | null = null;

      if (selectedState === "New York") {
        if (!newyorkCd) fetchMapData();
        congressionalDistrict = newyorkCd;
      } else if (selectedState === "Arkansas") {
        if (!arkansasCd) fetchMapData();
        congressionalDistrict = arkansasCd;
      }

      if (congressionalDistrict) {
        const onEachFeature = (feature: Feature, layer: L.Layer) => {
          layer.on({
            mouseover: highlightFeatures,
            mouseout: (e) => resetHighlight(e, cdLayerRef.current!),
            click: districtOnClick,
          });
        };

        cdLayerRef.current = L.geoJSON(congressionalDistrict, {
          style: { color: "#000000", weight: 0.5 },
          onEachFeature: onEachFeature,
        }).addTo(map);
      }
    } else {
      if (cdLayerRef.current) {
        map.removeLayer(cdLayerRef.current);
        cdLayerRef.current = null;
      }
      map.setView([37.8, -96], 4);
    }
    
    fitToBound(selectedState);
  }, [
    map,
    selectedState,
    selectedData,
    newyorkCd,
    arkansasCd,
    highlightFeatures,
    resetHighlight,
    districtOnClick,
  ]);

  return (
    <VStack spacing={4} align="stretch" height="100%" width="100%">
      <Center id="map" ref={mapRef} height="600px" width="100%" zIndex="1" />
    </VStack>
  );
};

export default USMap;