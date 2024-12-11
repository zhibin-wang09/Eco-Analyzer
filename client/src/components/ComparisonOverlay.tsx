import React, { useEffect, useRef, useState } from 'react';
import { Box, Flex, IconButton, Text } from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';
import L from 'leaflet';
import axios from 'axios';
import { GeoJsonObject } from 'geojson';

interface ComparisonOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  currentState: string;
  currentGeoJson: any;
  districtPlanNumber: string;
}

const ComparisonOverlay: React.FC<ComparisonOverlayProps> = ({
  isOpen,
  onClose,
  currentState,
  currentGeoJson,
  districtPlanNumber
}) => {
  const originalMapRef = useRef<HTMLDivElement>(null);
  const planMapRef = useRef<HTMLDivElement>(null);
  const [originalMap, setOriginalMap] = useState<L.Map | null>(null);
  const [planMap, setPlanMap] = useState<L.Map | null>(null);
  const [districtPlanData, setDistrictPlanData] = useState<any>(null);
  
  // Refs to track GeoJSON layers
  const originalLayerRef = useRef<L.GeoJSON | null>(null);
  const planLayerRef = useRef<L.GeoJSON | null>(null);

  // Cleanup function for when component unmounts or overlay closes
  const cleanup = () => {
    if (originalLayerRef.current && originalMap) {
      originalMap.removeLayer(originalLayerRef.current);
      originalLayerRef.current = null;
    }
    if (planLayerRef.current && planMap) {
      planMap.removeLayer(planLayerRef.current);
      planLayerRef.current = null;
    }
    if (originalMap) {
      originalMap.remove();
      setOriginalMap(null);
    }
    if (planMap) {
      planMap.remove();
      setPlanMap(null);
    }
  };

  useEffect(() => {
    const fetchDistrictPlan = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/map/districtplan?state=${currentState.toLowerCase()}&districtPlan=${districtPlanNumber}`
        );

        // log the response
        console.log(response.data);
        setDistrictPlanData(response.data);
      } catch (error) {
        console.error('Error fetching district plan:', error);
      }
    };

    if (isOpen && districtPlanNumber) {
      fetchDistrictPlan();
    }

    // Cleanup when component unmounts or overlay closes
    return () => {
      if (!isOpen) {
        cleanup();
      }
    };
  }, [isOpen, currentState, districtPlanNumber]);

  useEffect(() => {
    if (!isOpen || !originalMapRef.current || !planMapRef.current) return;

    // Initialize maps
    const initMap = (element: HTMLElement) => {
      const map = L.map(element, {
        zoomControl: true,
        dragging: true,
        scrollWheelZoom: true,
      });

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        minZoom: 3,
        maxZoom: 24,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      return map;
    };

    const map1 = initMap(originalMapRef.current);
    const map2 = initMap(planMapRef.current);

    setOriginalMap(map1);
    setPlanMap(map2);

    // Return cleanup function
    return () => cleanup();
  }, [isOpen]);

  useEffect(() => {
    if (!originalMap || !planMap) return;

    // Clear existing layers before adding new ones
    if (originalLayerRef.current) {
      originalMap.removeLayer(originalLayerRef.current);
    }
    if (planLayerRef.current) {
      planMap.removeLayer(planLayerRef.current);
    }

    // Add current districts to original map
    const addGeoJsonToMap = (map: L.Map, data: any, isOriginal: boolean) => {
      const layer = L.geoJSON(data as GeoJsonObject, {
        style: (feature) => ({
          fillColor: '#FFFFFF',
          color: '#000',
          weight: 0.5,
          fillOpacity: 0.8,
        }),
      });

      // Store the layer reference
      if (isOriginal) {
        originalLayerRef.current = layer;
      } else {
        planLayerRef.current = layer;
      }

      layer.addTo(map);
      
      // Fit bounds to the layer
      map.fitBounds(layer.getBounds());
    };

    // Add GeoJSON layers to both maps
    if (currentGeoJson) {
      addGeoJsonToMap(originalMap, currentGeoJson, true);
    }
    if (districtPlanData) {
      addGeoJsonToMap(planMap, districtPlanData, false);
    }
  }, [originalMap, planMap, currentGeoJson, districtPlanData]);

  const handleClose = () => {
    cleanup();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Box
      position="fixed"
      top="0"
      left="0"
      right="0"
      bottom="0"
      bg="rgba(0, 0, 0, 0.7)"
      zIndex={1000}
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Box
        bg="white"
        w="90%"
        h="80%"
        borderRadius="lg"
        overflow="hidden"
        position="relative"
        p={4}
      >
        <IconButton
          aria-label="Close comparison"
          icon={<CloseIcon />}
          position="absolute"
          right={2}
          top={2}
          zIndex={2}
          onClick={handleClose}
        />
        
        <Flex h="100%" gap={4}>
          <Box flex={1} position="relative">
            <Text fontSize="lg" fontWeight="bold" mb={2}>Current Districts</Text>
            <Box 
              ref={originalMapRef} 
              h="calc(100% - 40px)"
              borderRadius="md"
              overflow="hidden"
              border="1px solid"
              borderColor="gray.200"
            />
          </Box>
          
          <Box flex={1} position="relative">
            <Text fontSize="lg" fontWeight="bold" mb={2}>
              Proposed District Plan {districtPlanNumber}
            </Text>
            <Box 
              ref={planMapRef} 
              h="calc(100% - 40px)"
              borderRadius="md"
              overflow="hidden"
              border="1px solid"
              borderColor="gray.200"
            />
          </Box>
        </Flex>
      </Box>
    </Box>
  );
};

export default ComparisonOverlay;