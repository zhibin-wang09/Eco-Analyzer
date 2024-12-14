import React from "react";
import { Box, VStack, HStack, Text, Square } from "@chakra-ui/react";
import { HeatmapType } from "./controls/HeatMapControls";

interface MapLegendProps {
  heatmapType: HeatmapType;
  selectedDemographic?: string;
}

const MapLegend: React.FC<MapLegendProps> = ({
  heatmapType,
  selectedDemographic,
}) => {
  const getLegendItems = () => {
    switch (heatmapType) {
      case "demographic":
        return {
          title: `${selectedDemographic
            ?.charAt(0)
            .toUpperCase()}${selectedDemographic?.slice(1)} %`,
          items: [
            { color: "#fff2f2", label: "0-5%" },
            { color: "#ffbfbf", label: "5-15%" },
            { color: "#ff8c8c", label: "15-25%" },
            { color: "#ff5959", label: "25-35%" },
            { color: "#ff4040", label: "35-45%" },
            { color: "#f20000", label: "45-55%" },
            { color: "#bf0000", label: "55-65%" },
            { color: "#8c0000", label: "65-75%" },
            { color: "#590000", label: "75-85%" },
            { color: "#2e0000", label: "85-95%" },
          ],
        };

      case "poverty":
        return {
          title: "Poverty Level",
          items: [
            { color: "#f2f9ff", label: "0-10%" },
            { color: "#bfdeff", label: "10-20%" },
            { color: "#8cc4ff", label: "20-30%" },
            { color: "#59aaff", label: "30-40%" },
            { color: "#2690ff", label: "40-50%" },
            { color: "#0077f2", label: "50-60%" },
            { color: "#005ebf", label: "60-70%" },
            { color: "#00458c", label: "70-80%" },
            { color: "#002c59", label: "80-90%" },
            { color: "#001124", label: "90-100%" },
          ],
        };

      case "economic":
        return {
          title: "Income Level",
          items: [
            { color: "#f7fcf5", label: "0-20,000" },
            { color: "#d8f0ce", label: "20,000-40,000" },
            { color: "#b9e4a7", label: "40,000-60,000" },
            { color: "#9ad880", label: "60,000-80,000" },
            { color: "#7bcc59", label: "80,000-100,000" },
            { color: "#5eb939", label: "100,000-120,000" },
            { color: "#4a922d", label: "120,000-140,000" },
            { color: "#376b21", label: "140,000-160,000" },
            { color: "#234415", label: "160,000-180,000" },
            { color: "#060d04", label: "180,000-200,000" },
          ],
        };

      case "politicalincome":
        return {
          title: "Income by Party",
          items: [
            { color: "#fff2f2", label: "0-20,000" },
            { color: "#ffa6a6", label: "20,000-40,000" },
            { color: "#ff7373", label: "40,000-60,000" },
            { color: "#ff4040", label: "60,000-80,000" },
            { color: "#ff0d0d", label: "80,000-100,000" },
            { color: "#f2f9ff", label: "0-20,000" },
            { color: "#a6d1ff", label: "20,000-40,000" },
            { color: "#73b7ff", label: "40,000-60,000" },
            { color: "#409dff", label: "60,000-80,000" },
            { color: "#0d83ff", label: "80,000-100,000" },
          ],
        };

      case "urbanicity":
        return {
          title: "Region Type",
          items: [
            { color: "#41A043", label: "Rural" },
            { color: "#2953a0", label: "Suburban" },
            { color: "#FF6060", label: "Urban" },
          ],
        };

      case "none":
      default:
        return {
          title: "",
          items: [],
        };
    }
  };

  const legend = getLegendItems();

  // If there are no items, render nothing
  if (legend.items.length === 0) {
    return null;
  }

  return (
    <Box
      position="absolute"
      bottom="20px"
      right="10px"
      bg="rgba(255, 255, 255, 0.8)"
      borderRadius="sm"
      boxShadow="0 0 15px rgba(0,0,0,0.2)"
      p={2}
      zIndex={1000}
      maxW="150px"
      w="auto"
    >
      <VStack align="start" spacing={0.5}>
        <Text fontWeight="bold" fontSize="xs" w="100%" mb={1}>
          {legend.title}
        </Text>
        {legend.items.map((item, index) => (
          <HStack key={index} spacing={1} w="100%">
            <Square
              size="12px"
              bg={item.color}
              border="1px solid"
              borderColor="gray.300"
              opacity={0.7}
            />
            <Text fontSize="10px" flex="1">
              {item.label}
            </Text>
          </HStack>
        ))}
      </VStack>
    </Box>
  );
};

export default MapLegend;
