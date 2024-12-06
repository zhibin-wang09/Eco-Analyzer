import { Box, HStack, Heading, Select, Button, ButtonGroup, Tooltip } from "@chakra-ui/react";
import { RepeatIcon, InfoIcon } from '@chakra-ui/icons';
import InferenceMenu from "./InferenceMenu";
import { VisualizationType } from './ChartDataItemInterface';

interface NavbarProps {
  onSelectChange: (val: string) => void;
  select: string;
  onStateChange: (val: string) => void;
  state: string;
  setSelectedVisualization: (type: VisualizationType) => void;
  geoLevel: 'district' | 'precinct';
  onGeoLevelChange: (level: 'district' | 'precinct') => void;
  showHeatmap: boolean;
  onHeatmapChange: (show: boolean) => void;
}

const Navbar: React.FC<NavbarProps> = ({
  onSelectChange,
  select,
  onStateChange,
  state,
  setSelectedVisualization,
  geoLevel,
  onGeoLevelChange,
  showHeatmap,
  onHeatmapChange,
}) => {
  const handleReset = () => {
    onStateChange("State");
    setSelectedVisualization('standard');
  };

  return (
    <HStack justify="space-between" width="100%" align="center">
      <Heading as="h1" size="l" textAlign="center">
        US Political Map
      </Heading>
      <HStack spacing={4}>
        <HStack spacing={2}>
          <Select
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
              onStateChange(e.target.value);
            }}
            value={state}
            bg="white"
            width="200px"
          >
            <option>State</option>
            <option>New York</option>
            <option>Arkansas</option>
          </Select>
          {state !== "State" && (
            <>
              <ButtonGroup isAttached variant="solid" size="md">
                <Button
                  onClick={() => onGeoLevelChange('district')}
                  bg={geoLevel === 'district' ? "#F7CFF2" : "white"}
                  _hover={{ bg: "#F7CFF2" }}
                  borderRadius="md"
                  borderRight="1px solid"
                  borderColor="gray.200"
                >
                  Districts
                </Button>
                <Button
                  onClick={() => onGeoLevelChange('precinct')}
                  bg={geoLevel === 'precinct' ? "#F7CFF2" : "white"}
                  _hover={{ bg: "#F7CFF2" }}
                  borderRadius="md"
                >
                  Precincts
                </Button>
              </ButtonGroup>
              {geoLevel === 'precinct' && (
                <Tooltip
                  label="Toggle between regular map and heatmap visualization"
                  hasArrow
                  placement="top"
                >
                  <Button
                    onClick={() => onHeatmapChange(!showHeatmap)}
                    bg={showHeatmap ? "#F7CFF2" : "white"}
                    _hover={{ bg: "#F7CFF2" }}
                    leftIcon={<InfoIcon />}
                  >
                    {showHeatmap ? 'Hide Heatmap' : 'Show Heatmap'}
                  </Button>
                </Tooltip>
              )}
            </>
          )}
          <Button
            onClick={handleReset}
            bg="white"
            _hover={{ bg: "#F7CFF2" }}
            aria-label="Reset selection"
            title="Reset selection"
          >
            <RepeatIcon />
          </Button>
        </HStack>
        <InferenceMenu setSelectedVisualization={setSelectedVisualization} />
      </HStack>
    </HStack>
  );
};

export default Navbar;