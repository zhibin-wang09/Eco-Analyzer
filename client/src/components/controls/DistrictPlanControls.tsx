// DistrictPlanControls.tsx
import React, { useState } from 'react';
import {
  Box,
  HStack,
  Select,
  Button,
  Text
} from '@chakra-ui/react';

interface DistrictPlanControlsProps {
  onCompare: (planNumber: string) => void;
  state: string | null;
  isVisible: boolean;
}

const DistrictPlanControls: React.FC<DistrictPlanControlsProps> = ({
  onCompare,
  state,
  isVisible
}) => {
  const [selectedPlan, setSelectedPlan] = useState<string>('');

  if (!isVisible) return null;

  const handleCompareClick = () => {
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
          isDisabled={!selectedPlan}
        >
          Compare
        </Button>
      </HStack>
    </Box>
  );
};

export default DistrictPlanControls;