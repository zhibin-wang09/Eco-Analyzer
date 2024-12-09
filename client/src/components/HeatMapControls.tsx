import React from 'react';
import { Menu, MenuButton, MenuList, MenuItem, Button, Tooltip } from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';

export type HeatmapType = 'none' | 'demographic' | 'poverty' | 'economic' | 'politicalincome';

interface HeatmapControlsProps {
  isEnabled: boolean;
  onHeatmapChange: (type: HeatmapType) => void;
  currentType: HeatmapType;
}

const HeatmapControls: React.FC<HeatmapControlsProps> = ({
  isEnabled,
  onHeatmapChange,
  currentType
}) => {
  if (!isEnabled) return null;

  const getButtonText = () => {
    switch (currentType) {
      case 'none': return 'Show Heatmap';
      case 'demographic': return 'Demographic Heatmap';
      case 'poverty': return 'Poverty Heatmap';
      case 'economic': return 'Economic Heatmap';
      case 'politicalincome': return 'Political Income Heatmap';
      default: return 'Show Heatmap';
    }
  };

  return (
    <Tooltip
      label="Select different heatmap visualizations"
      hasArrow
      placement="top"
    >
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
          <MenuItem onClick={() => onHeatmapChange('none')}>
            Hide Heatmap
          </MenuItem>
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
        </MenuList>
      </Menu>
    </Tooltip>
  );
};

export default HeatmapControls;