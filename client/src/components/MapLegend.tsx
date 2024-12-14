import React from 'react';
import { Box, VStack, HStack, Text, Square } from '@chakra-ui/react';
import { HeatmapType } from './controls/HeatMapControls';

interface MapLegendProps {
  heatmapType: HeatmapType;
  selectedDemographic?: string;
}

const MapLegend: React.FC<MapLegendProps> = ({ heatmapType, selectedDemographic }) => {
  const getLegendItems = () => {
    switch (heatmapType) {
      case 'demographic':
        return {
          title: `${selectedDemographic?.charAt(0).toUpperCase()}${selectedDemographic?.slice(1)} %`,
          items: [
            { color: '#FFE5E5', label: '0-20%' },
            { color: '#FF9999', label: '20-40%' },
            { color: '#FF4D4D', label: '40-60%' },
            { color: '#CC0000', label: '60-80%' },
            { color: '#660000', label: '80-100%' },
          ],
        };

      case 'poverty':
        return {
          title: 'Poverty Level',
          items: [
            { color: '#E5F2FF', label: 'Low' },
            { color: '#99CCF3', label: 'Medium-Low' },
            { color: '#4D9BE6', label: 'Medium' },
            { color: '#0066CC', label: 'Medium-High' },
            { color: '#003366', label: 'High' },
          ],
        };

      case 'economic':
        return {
          title: 'Income Level',
          items: [
            { color: '#E5FFE5', label: 'Low' },
            { color: '#99FF99', label: 'Medium-Low' },
            { color: '#4DFF4D', label: 'Medium' },
            { color: '#00CC00', label: 'Medium-High' },
            { color: '#006600', label: 'High' },
          ],
        };

      case 'politicalincome':
        return {
          title: 'Income by Party',
          items: [
            { color: '#FF9999', label: 'Low Rep.' },
            { color: '#FF0000', label: 'High Rep.' },
            { color: '#9999FF', label: 'Low Dem.' },
            { color: '#0000FF', label: 'High Dem.' },
          ],
        };

      case 'none':
      default:
        return {
          title: '',
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
