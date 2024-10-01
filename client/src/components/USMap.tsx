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
} from "@chakra-ui/react";

import "leaflet/dist/leaflet.css";

interface USMapProps {
  onStateSelect: (state: string | null) => void;
  selectedState: string | null;
}

const USMap: React.FC<USMapProps> = ({ onStateSelect, selectedState }) => {
  const [arkansasPrecincts, setArkansasPrecincts] = useState<GeoJsonObject | null>(null);
  const [newyorkPrecincts, setNewYorkPrecincts] = useState<GeoJsonObject | null>(null);
  const [showPrecinct, setShowPrecinct] = useState(false);
  const [map, setMap] = useState<L.Map | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const precinctLayerRef = useRef<L.GeoJSON | null>(null);

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

  const onClick = useCallback(
    (e: L.LeafletMouseEvent, map: L.Map, feature: Feature) => {
      const stateName = feature.properties?.name || null;
      if (stateName === "New York" || stateName === "Arkansas") {
        onStateSelect(stateName);
      }
    },
    [onStateSelect]
  );

  const togglePrecincts = useCallback(() => {
    setShowPrecinct((prev) => !prev);
  }, []);


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
            weight: 1,
            fillOpacity: 0.7,
          };
        },
        onEachFeature: onEachFeature,
      }).addTo(map);

      fetch("/arkansas_precincts.json")
      .then((response) => response.json())
      .then((geojson) => {
        setArkansasPrecincts(geojson);
      });

    fetch("/newyork_precincts.json")
      .then((response) => response.json())
      .then((geojson) => {
        setNewYorkPrecincts(geojson);
      });

    setMap(map);
    return () => {
      map.remove();
    };
  }}, [highlightFeatures, resetHighlight, onClick]);

  useEffect(() => {
    if (!map) return;

    if (showPrecinct && selectedState) {
      // Remove existing precinct layer if any
      if (precinctLayerRef.current) {
        map.removeLayer(precinctLayerRef.current);
        precinctLayerRef.current = null;
      }

      let precincts: GeoJsonObject | null = null;
      if (selectedState === "New York" && newyorkPrecincts) {
        precincts = newyorkPrecincts;
      } else if (selectedState === "Arkansas" && arkansasPrecincts) {
        precincts = arkansasPrecincts;
      }

      if (precincts) {
        precinctLayerRef.current = L.geoJSON(precincts).addTo(map);
      }
    } else {
      // Remove precinct layer when hiding or when no state is selected
      if (precinctLayerRef.current) {
        map.removeLayer(precinctLayerRef.current);
        precinctLayerRef.current = null;
      }
    }
  }, [map, showPrecinct, selectedState, arkansasPrecincts, newyorkPrecincts]);

  return (
    <VStack spacing={4} align="stretch" width="100%">
      <Heading as="h1" size="xl" textAlign="center">
        US Political Map
      </Heading>
      <Center>
        <Button onClick={togglePrecincts}>{showPrecinct ? "Hide" : "Show"} Precinct</Button>
      </Center>
      <Center id="map" ref={mapRef} height="400px" width="100%" />
      <HStack justifyContent="center" spacing={4}>
        <HStack>
          <Box w="20px" h="20px" bg="#0000FF" />
          <Text>New York (Democratic)</Text>
        </HStack>
        <HStack>
          <Box w="20px" h="20px" bg="#FF5733" />
          <Text>Arkansas (Republican)</Text>
        </HStack>
      </HStack>
    </VStack>
  );
};

export default USMap;
