import React, { useEffect, useRef, useCallback, useState } from "react";
import L from "leaflet";
import { GeoJsonObject, Feature } from "geojson";
import statesData from "./state";
import {
  Box,
  Text,
  VStack,
  Heading,
  HStack,
  Center,
  Button,
  Select,
  position,
} from "@chakra-ui/react";
import "../style/legend.css";
import "leaflet/dist/leaflet.css";

interface USMapProps {
  onStateSelect: (state: string) => void;
  selectedState: string | null;
  selectedData: string | null;
}

const USMap: React.FC<USMapProps> = ({ onStateSelect, selectedState, selectedData}) => {
  const [arkansasPrecincts, setArkansasPrecincts] =
    useState<GeoJsonObject | null>(null);
  const [newyorkPrecincts, setNewYorkPrecincts] =
    useState<GeoJsonObject | null>(null);
  const [arakansasCd, setArkansasCd] = useState<GeoJsonObject | null>(null);
  const [newyorkCd, setNewYorkCd] = useState<GeoJsonObject | null>(null);
  const [map, setMap] = useState<L.Map | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const precinctLayerRef = useRef<L.GeoJSON | null>(null);
  const cdLayerRef = useRef<L.GeoJSON | null>(null);

  const highlightFeatures = useCallback((e: L.LeafletMouseEvent) => {
    const layer = e.target;
    layer.setStyle({
      weight: 5,
      color: "#666",
      dashArray: "",
      fillOpacity: 0.7,
    });
    layer.bringToFront();
  }, []);

  const resetHighlight = useCallback(
    (e: L.LeafletMouseEvent, geojson: L.GeoJSON) => {
      geojson.resetStyle(e.target);
    },
    []
  );

  const zoomToFeature = useCallback((e: L.LeafletMouseEvent, map: L.Map) => {
    map.fitBounds(e.target.getBounds());
    console.log(e.target.getBounds().getCenter())
  }, []);

  const onClick = useCallback(
    (e: L.LeafletMouseEvent, map: L.Map, feature: Feature) => {
      const stateName = feature.properties?.name || null;
      if (stateName === "New York" || stateName === "Arkansas") {
        onStateSelect(stateName);
        zoomToFeature(e,map)
      } else {
        onStateSelect("Default");
      }
    },
    [onStateSelect]
  );

  useEffect(() => {
    if (mapRef.current) {
      const map = L.map(mapRef.current).setView([37.8, -96], 4); // Center on US

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

      fetch("/arkansas_congressional_district.json")
        .then((response) => response.json())
        .then((geojson) => {
          setArkansasCd(geojson);
        });

      fetch("/newyork_congressional_district.json")
        .then((response) => response.json())
        .then((geojson) => {
          setNewYorkCd(geojson);
        });

      fetch("/newyork_precincts.json")
        .then((response) => response.json())
        .then((geojson) => {
          setNewYorkPrecincts(geojson);
        });

      fetch("/arkansas_precincts.json")
        .then((response) => response.json())
        .then((geojson) => {
          setArkansasPrecincts(geojson);
        });

      setMap(map);
      return () => {
        map.remove();
      };
    }
  }, [highlightFeatures, resetHighlight, onClick]);

  useEffect(() => {
    if (!map) return;

    if (selectedData === "Show Precincts" && selectedState) {
      // Remove existing precinct layer if any
      if (precinctLayerRef.current) {
        map.removeLayer(precinctLayerRef.current);
        precinctLayerRef.current = null;
      }

      if (cdLayerRef.current) {
        map.removeLayer(cdLayerRef.current);
        cdLayerRef.current = null;
      }

      let precincts: GeoJsonObject | null = null;
      if (selectedState === "New York" && newyorkPrecincts) {
        precincts = newyorkPrecincts;
      } else if (selectedState === "Arkansas" && arkansasPrecincts) {
        precincts = arkansasPrecincts;
      }

      if (precincts) {
        precinctLayerRef.current = L.geoJSON(precincts, {
          style: { color: "#000000", weight: 0.5 },
        }).addTo(map);
      }
    } else if (selectedData === "Show Congressional Districts" && selectedState) {
      if (precinctLayerRef.current) {
        map.removeLayer(precinctLayerRef.current);
        precinctLayerRef.current = null;
      }

      if (cdLayerRef.current) {
        map.removeLayer(cdLayerRef.current);
        cdLayerRef.current = null;
      }

      let congressionalDistrict: GeoJsonObject | null = null;
      if (selectedState === "New York" && newyorkCd) {
        congressionalDistrict = newyorkCd;
      } else if (selectedState === "Arkansas" && arakansasCd) {
        congressionalDistrict = arakansasCd;
      }

      if (congressionalDistrict) {
        cdLayerRef.current = L.geoJSON(congressionalDistrict, {
          style: { color: "#000000", weight: 0.5 },
        }).addTo(map);
      }
    } else {
      // Remove precinct layer when hiding or when no state is selected
      if (precinctLayerRef.current) {
        map.removeLayer(precinctLayerRef.current);
        precinctLayerRef.current = null;
      }

      if (cdLayerRef.current) {
        map.removeLayer(cdLayerRef.current);
        cdLayerRef.current = null;
      }
    }
  }, [
    map,
    selectedData,
    selectedState,
    arkansasPrecincts,
    newyorkPrecincts,
    newyorkCd,
    arakansasCd,
  ]);

  return (
    <VStack spacing={4} align="stretch" height="100%" width="100%">
      <Center id="map" ref={mapRef} height="100%" width="100%" zIndex="1"/>
    </VStack>
  );
};

export default USMap;
