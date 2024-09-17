import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON, ZoomControl } from 'react-leaflet';
import { LatLngTuple, LatLngBoundsExpression } from 'leaflet';
import { feature } from 'topojson-client';
import {
  Box,
  Text,
  VStack,
  Heading,
  HStack,
  useBreakpointValue,
  Button,
} from "@chakra-ui/react";

// Don't forget to import Leaflet CSS in your main CSS file or index.tsx
// import 'leaflet/dist/leaflet.css';

interface USMapProps {
  onStateSelect: (state: string | null) => void;
}

const USMap: React.FC<USMapProps> = ({ onStateSelect }) => {
  const [statesData, setStatesData] = useState<any>(null);
  const [nyPrecincts, setNyPrecincts] = useState<any>(null);
  const [arPrecincts, setArPrecincts] = useState<any>(null);
  const [showPrecincts, setShowPrecincts] = useState(false);

  const mapWidth = useBreakpointValue({
    base: "100%",
    md: "600px",
    lg: "800px",
    xl: "1000px",
  });

  const mapHeight = useBreakpointValue({
    base: "300px",
    md: "400px",
    lg: "500px",
    xl: "600px",
  });

  const processGeoData = (data: any, stateName: string) => {
    console.log(`Received ${stateName} data:`, data);
    if (data.type === "Topology") {
      // Handle TopoJSON
      const objectName = Object.keys(data.objects)[0];
      return feature(data, data.objects[objectName]);
    } else if (data.type === "FeatureCollection") {
      // Handle GeoJSON
      return data;
    } else {
      console.error(`Unrecognized data format for ${stateName}`);
      return null;
    }
  };

  useEffect(() => {
    // Fetch US states data
    fetch("https://cdn.jsdelivr.net/npm/us-atlas@3.0.1/states-10m.json")
      .then((response) => response.json())
      .then((topoJsonData) => {
        const geoJson = feature(topoJsonData, topoJsonData.objects.states);
        setStatesData(geoJson);
      })
      .catch((error) => console.error("Error fetching states data:", error));

    // Fetch New York precincts data
    fetch("/newyork_precincts.json")
      .then((response) => response.json())
      .then((data) => {
        const processedData = processGeoData(data, "New York");
        if (processedData) setNyPrecincts(processedData);
      })
      .catch((error) => console.error("Error fetching NY precincts:", error));

    // Fetch Arkansas precincts data
    fetch("/arkansas_precincts.json")
      .then((response) => response.json())
      .then((data) => {
        const processedData = processGeoData(data, "Arkansas");
        if (processedData) setArPrecincts(processedData);
      })
      .catch((error) => console.error("Error fetching AR precincts:", error));
  }, []);

  const getStateColor = (stateName: string) => {
    if (stateName === "New York") return "#0000FF";
    if (stateName === "Arkansas") return "#FF0000";
    return "#D3D3D3";
  };

  const getPrecinctColor = (stateName: string) => {
    if (stateName === "New York") return "#8080FF";
    if (stateName === "Arkansas") return "#FF8080";
    return "#D3D3D3";
  };

  const onEachState = (feature: any, layer: L.Layer) => {
    const stateName = feature.properties.name;
    layer.on({
      click: () => {
        if (stateName === "New York" || stateName === "Arkansas") {
          onStateSelect(stateName);
        }
      },
    });
  };

  const stateStyle = (feature: any) => {
    const stateName = feature.properties.name;
    return {
      fillColor: getStateColor(stateName),
      weight: 1,
      opacity: 1,
      color: 'white',
      fillOpacity: 0.7,
    };
  };

  const precinctStyle = (feature: any) => {
    return {
      fillColor: getPrecinctColor(feature.properties.state),
      weight: 1,
      opacity: 1,
      color: 'white',
      fillOpacity: 0.7,
    };
  };

  const togglePrecincts = () => {
    setShowPrecincts(!showPrecincts);
  };

  const center: LatLngTuple = [39.8283, -98.5795];
  const bounds: LatLngBoundsExpression = [
    [24.396308, -125.000000], // Southwest coordinates
    [49.384358, -66.934570]   // Northeast coordinates
  ];

  return (
    <VStack spacing={4} align="stretch" width="100%" maxWidth={mapWidth}>
      <Heading as="h1" size="xl" textAlign="center">
        US Political Map
      </Heading>
      <HStack justifyContent="center" spacing={4}>
        <Button onClick={togglePrecincts}>
          {showPrecincts ? "Hide Precincts" : "Show Precincts"}
        </Button>
      </HStack>
      <Box
        border="1px"
        borderColor="gray.200"
        borderRadius="md"
        overflow="hidden"
        width="100%"
        height={mapHeight}
      >
        {statesData && (
          <MapContainer
            center={center}
            zoom={4}
            style={{ height: '100%', width: '100%' }}
            zoomControl={false}
            bounds={bounds}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <GeoJSON data={statesData} style={stateStyle} onEachFeature={onEachState} />
            {showPrecincts && (
              <GeoJSON key="ny-precincts" data={nyPrecincts} style={precinctStyle} />
            )}
            {showPrecincts && (
              <GeoJSON key="ar-precincts" data={arPrecincts} style={precinctStyle} />
            )}
            <ZoomControl position="bottomright" />
          </MapContainer>
        )}
      </Box>
      <HStack justifyContent="center" spacing={4}>
        <HStack>
          <Box w="20px" h="20px" bg="#0000FF" />
          <Text>New York (Democratic)</Text>
        </HStack>
        <HStack>
          <Box w="20px" h="20px" bg="#FF0000" />
          <Text>Arkansas (Republican)</Text>
        </HStack>
      </HStack>
    </VStack>
  );
};

export default USMap;