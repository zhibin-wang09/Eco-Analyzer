import React, { useState, useCallback, useEffect } from 'react';
import { Box, Text, VStack, Heading, HStack, useBreakpointValue, Button } from '@chakra-ui/react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3.0.1/states-10m.json";
const countyUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3.0.1/counties-10m.json";

interface CountyGeometry {
  id: string;
  [key: string]: any;
}

interface CountyData {
  objects: {
    counties: {
      geometries: CountyGeometry[];
    };
  };
  [key: string]: any;
}

const USMap = ({ onStateSelect }: { onStateSelect: (state: string | null) => void }) => {
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [position, setPosition] = useState({ coordinates: [-97, 38], zoom: 1 });
  const [showCounties, setShowCounties] = useState(false);
  const [countyData, setCountyData] = useState<CountyData | null>(null);

  const mapWidth = useBreakpointValue({ base: "100%", md: "600px", lg: "800px", xl: "1000px" });
  const mapHeight = useBreakpointValue({ base: "300px", md: "400px", lg: "500px", xl: "600px" });

  useEffect(() => {
    fetch(countyUrl)
      .then(response => response.json())
      .then((data: CountyData) => {
        const filteredCounties: CountyData = {
          ...data,
          objects: {
            ...data.objects,
            counties: {
              ...data.objects.counties,
              geometries: data.objects.counties.geometries.filter(
                (county: CountyGeometry) => county.id.startsWith('05') || county.id.startsWith('36')
              )
            }
          }
        };
        setCountyData(filteredCounties);
        console.log("Filtered county data loaded:", filteredCounties);
      })
      .catch(error => console.error("Error loading county data:", error));
  }, []);

  const handleStateClick = (geo: any) => {
    const stateName = geo.properties.name;
    if (stateName === "New York" || stateName === "Arkansas") {
      setSelectedState(stateName);
      onStateSelect(stateName);
    }
  };

  const getStateColor = (stateName: string) => {
    if (stateName === "New York") return "#0000FF"; // Blue for Democratic
    if (stateName === "Arkansas") return "#FF0000"; // Red for Republican
    return "#D3D3D3"; // Light gray for other states
  };

  const handleZoomIn = () => {
    if (position.zoom >= 4) return;
    setPosition((pos) => ({ ...pos, zoom: pos.zoom * 2 }));
  };

  const handleZoomOut = () => {
    if (position.zoom <= 1) return;
    setPosition((pos) => ({ ...pos, zoom: pos.zoom / 2 }));
  };

  const handleMoveEnd = useCallback((position: any) => {
    setPosition(position);
  }, []);

  const toggleCounties = () => {
    setShowCounties(!showCounties);
    console.log("Show counties:", !showCounties);
  };

  return (
    <VStack spacing={4} align="stretch" width="100%" maxWidth={mapWidth}>
      <Heading as="h1" size="xl" textAlign="center">US Political Map</Heading>
      <HStack justifyContent="center" spacing={4}>
        <Button onClick={handleZoomIn}>Zoom In</Button>
        <Button onClick={handleZoomOut}>Zoom Out</Button>
        <Button onClick={toggleCounties}>
          {showCounties ? "Hide Counties" : "Show Counties"}
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
        <ComposableMap 
          projection="geoAlbersUsa"
          width={1000}
          height={600}
          style={{
            width: "100%",
            height: "100%",
          }}
        >
          <ZoomableGroup
            zoom={position.zoom}
            center={position.coordinates as [number, number]}
            onMoveEnd={handleMoveEnd}
          >
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const stateName = geo.properties.name;
                  const isHighlighted = ["New York", "Arkansas"].includes(stateName);
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={getStateColor(stateName)}
                      stroke={isHighlighted ? "#000000" : "#FFFFFF"}
                      strokeWidth={isHighlighted ? 1.5 : 0.5}
                      onClick={() => isHighlighted && handleStateClick(geo)}
                      style={{
                        default: { outline: "none" },
                        hover: { fill: isHighlighted ? getStateColor(stateName) : "#A9A9A9", outline: "none" },
                        pressed: { outline: "none" },
                      }}
                    />
                  );
                })
              }
            </Geographies>
            {showCounties && countyData && (
              <Geographies geography={countyData}>
                {({ geographies }) =>
                  geographies.map((geo) => (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill="none"
                      stroke="#000000"
                      strokeWidth={0.2}
                      style={{
                        default: { outline: "none" },
                        hover: { outline: "none", strokeWidth: 0.4 },
                        pressed: { outline: "none" },
                      }}
                    />
                  ))
                }
              </Geographies>
            )}
          </ZoomableGroup>
        </ComposableMap>
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
      {selectedState && (
        <Box p={4} bg="gray.100" borderRadius="md">
          <Text fontWeight="bold">Selected State: {selectedState}</Text>
        </Box>
      )}
    </VStack>
  );
};

export default USMap;