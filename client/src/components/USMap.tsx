import React, { useEffect, useRef, useCallback } from "react";
import L from "leaflet";
import { GeoJsonObject, Geometry, Feature } from "geojson";
import statesData from "./state";
import { Box, Text, VStack, Heading, HStack, Center } from "@chakra-ui/react";

// Import Leaflet CSS
import "leaflet/dist/leaflet.css";

interface USMapProps {
  onStateSelect: (state: string | null) => void;
}

const USMap: React.FC<USMapProps> = ({ onStateSelect }) => {
  const mapRef = useRef<HTMLDivElement>(null);

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

  const resetHighlight = useCallback((e: L.LeafletMouseEvent, geojson: L.GeoJSON) => {
    geojson.resetStyle(e.target);
  }, []);

  const onClick = useCallback((e: L.LeafletMouseEvent, map: L.Map, feature: Feature) => {
    const stateName = feature.properties?.name || null;
    onStateSelect(stateName);
  }, [onStateSelect]);

  useEffect(() => {
    if (mapRef.current) {
      const map = L.map(mapRef.current).setView([37.8, -96], 4); // Center on US

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        minZoom: 3,
        maxZoom: 8,
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

      return () => {
        map.remove();
      };
    }
  }, [highlightFeatures, resetHighlight, onClick]);

  return (
    <VStack spacing={4} align="stretch" width="100%">
      <Heading as="h1" size="xl" textAlign="center">
        US Political Map
      </Heading>
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