import React, { useState } from 'react';
import { 
  Menu, 
  MenuButton, 
  MenuList, 
  MenuItem, 
  Button, 
  Tooltip,
  HStack,
  Select,
  Box 
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';

export type HeatmapType = 'none' | 'demographic' | 'poverty' | 'economic' | 'politicalincome' | 'urbanicity';
export type DemographicGroup = 'white' | 'black' | 'hispanic' | 'asian';

interface HeatmapControlsProps {
  isEnabled: boolean;
  onHeatmapChange: (type: HeatmapType) => void;
  currentType: HeatmapType;
  onDemographicChange?: (group: DemographicGroup) => void;
}

const HeatmapControls: React.FC<HeatmapControlsProps> = ({
  isEnabled,
  onHeatmapChange,
  currentType,
  onDemographicChange
}) => {
  if (!isEnabled) return null;

  const getButtonText = () => {
    switch (currentType) {
      case 'none': return 'Show Heatmap';
      case 'demographic': return 'Demographic Heatmap';
      case 'poverty': return 'Poverty Heatmap';
      case 'economic': return 'Economic Heatmap';
      case 'politicalincome': return 'Political Income Heatmap';
      case 'urbanicity': return 'Urbanicity HeatMap';
      default: return 'Show Heatmap';
    }
  };

  return (
    <HStack spacing={2}>
      <Menu>
        <MenuButton
          as={Button}
          rightIcon={<ChevronDownIcon />}
          bg={currentType !== 'none' ? "#F7CFF2" : "white"}
          _hover={{ bg: "#F7CFF2" }}
        >
          {getButtonText()}
        </MenuButton>
        <MenuList>
        {currentType !== 'none' && (
            <MenuItem onClick={() => onHeatmapChange('none')}>
              Hide Heatmap
            </MenuItem>
          )}
          <MenuItem onClick={() => onHeatmapChange('demographic')}>
            Demographic Distribution
          </MenuItem>
          <MenuItem onClick={() => onHeatmapChange('poverty')}>
            Poverty Levels
          </MenuItem>
          <MenuItem onClick={() => onHeatmapChange('economic')}>
            Economic Indicators
          </MenuItem>
          <MenuItem onClick={() => onHeatmapChange('politicalincome')}>
            Political Income Distribution
          </MenuItem>
          <MenuItem onClick={() => onHeatmapChange('urbanicity')}>
            Region Type
          </MenuItem>
        </MenuList>
      </Menu>

      {currentType === 'demographic' && onDemographicChange && (
        <Select
          size="md"
          width="150px"
          bg="white"
          onChange={(e) => onDemographicChange(e.target.value as DemographicGroup)}
        >
          <option value="white">White</option>
          <option value="black">Black</option>
          <option value="hispanic">Hispanic</option>
          <option value="asian">Asian</option>
        </Select>
      )}
    </HStack>
  );
};

export default HeatmapControls;