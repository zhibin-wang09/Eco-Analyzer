import React, { useState } from 'react';
import { Box, Text, VStack, Heading, HStack, useBreakpointValue } from '@chakra-ui/react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

const USMap = ({ onStateSelect }: { onStateSelect: (state: string | null) => void }) => {
  const [selectedState, setSelectedState] = useState<string | null>(null);

  const mapWidth = useBreakpointValue({ base: "100%", md: "600px", lg: "800px", xl: "1000px" });
  const mapHeight = useBreakpointValue({ base: "300px", md: "400px", lg: "500px", xl: "600px" });

  const handleStateClick = (geo: any) => {
    const stateName = geo.properties.name;
    if (stateName === "New York" || stateName === "Arkansas") {
      onStateSelect(stateName);
    }
  };

  const getStateColor = (stateName: string) => {
    if (stateName === "New York") return "#0000FF"; // Blue for Democratic
    if (stateName === "Arkansas") return "#FF0000"; // Red for Republican
    return "#D3D3D3"; // Light gray for other states
  };

  return (
    <VStack spacing={4} align="stretch" width="100%" maxWidth={mapWidth}>
      <Heading as="h1" size="xl" textAlign="center">US Political Map</Heading>
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
          projectionConfig={{ scale: 1000 }}
          width={1000}
          height={600}
          style={{
            width: "100%",
            height: "100%",
          }}
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