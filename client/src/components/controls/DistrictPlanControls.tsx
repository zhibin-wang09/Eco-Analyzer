// DistrictPlanControls.tsx
import React, { useState } from 'react';
import {
  Box,
  HStack,
  Select,
  Button,
  useToast,
  Text
} from '@chakra-ui/react';

interface DistrictPlanControlsProps {
  selectedDistrict: string | null;
  onCompare: (planNumber: string) => void;
  state: string | null;
  isVisible: boolean;
}

const DistrictPlanControls: React.FC<DistrictPlanControlsProps> = ({
  selectedDistrict,
  onCompare,
  state,
  isVisible
}) => {
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const toast = useToast();

  if (!isVisible) return null;

  const handleCompareClick = () => {
    if (!selectedDistrict) {
      toast({
        title: 'No district selected',
        description: 'Please select a district on the map first',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    onCompare(selectedPlan);
  };

  return (
    <Box 
      position="absolute" 
      top="10px" 
      right="10px" 
      zIndex={1000}
      bg="white" 
      p={2} 
      borderRadius="md" 
      boxShadow="sm"
    >
      <HStack spacing={2}>
        <Text fontSize="sm" fontWeight="medium">
          {selectedDistrict ? `District ${selectedDistrict} selected` : 'No district selected'}
        </Text>
        <Select 
          size="sm"
          placeholder="Select plan"
          value={selectedPlan}
          onChange={(e) => setSelectedPlan(e.target.value)}
          width="150px"
        >
          <option value="1">Plan 1</option>
          <option value="2">Plan 2</option>
          <option value="3">Plan 3</option>
        </Select>
        <Button
          size="sm"
          colorScheme="blue"
          onClick={handleCompareClick}
          isDisabled={!selectedDistrict || !selectedPlan}
        >
          Compare
        </Button>
      </HStack>
    </Box>
  );
};

export default DistrictPlanControls;