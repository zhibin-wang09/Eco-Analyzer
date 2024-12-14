import React from "react";
import {
  Box,
  HStack,
  Heading,
  Button,
  ButtonGroup,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { ChevronDownIcon, RepeatIcon } from "@chakra-ui/icons";
import { VisualizationType } from "../types/ChartDataItemInterface";
import HeatmapControls, { HeatmapType } from "./controls/HeatMapControls";

interface NavbarProps {
  onSelectChange: (val: string) => void;
  select: string;
  onStateChange: (val: string) => void;
  state: string;
  setSelectedVisualization: (type: VisualizationType) => void;
  geoLevel: "district" | "precinct";
  onGeoLevelChange: (level: "district" | "precinct") => void;
  heatmapType: HeatmapType;
  onHeatmapChange: (type: HeatmapType) => void;
  onDemographicChange: (group: string) => void;
  setTabIndex: (tabIndex: number) => void;
  selectedDemographic: string;
}

const Navbar: React.FC<NavbarProps> = ({
  onSelectChange,
  select,
  onStateChange,
  state,
  setSelectedVisualization,
  geoLevel,
  onGeoLevelChange,
  heatmapType,
  onHeatmapChange,
  onDemographicChange,
  setTabIndex,
  selectedDemographic,
}) => {
  const handleReset = () => {
    onStateChange("State");
    setSelectedVisualization("standard");
    onHeatmapChange("none");
    setTabIndex(0);
  };

  // New handler for geo level changes
  const handleGeoLevelChange = (level: "district" | "precinct") => {
    // If switching to district view, automatically disable heatmap
    if (level === "district") {
      onHeatmapChange("none");
    }
    onGeoLevelChange(level);
  };

  return (
    <HStack justify="space-between" width="100%" align="center">
      <Heading as="h1" size="l" textAlign="center">
        US Political Map
      </Heading>
      <HStack spacing={4}>
        <HStack spacing={2}>
          {/* State Selection Menu */}
          <Menu>
            <MenuButton
              as={Button}
              rightIcon={<ChevronDownIcon />}
              bg="#DEF2F1"
              _hover={{ bg: "#45A29E" }}
            >
              {state === "State" ? "Select State" : state}
            </MenuButton>
            <MenuList zIndex={"dropdown"}>
              <MenuItem onClick={() => onStateChange("State")}>State</MenuItem>
              <MenuItem  onClick={() => onStateChange("New York")}>
                New York
              </MenuItem>
              <MenuItem zIndex={2} onClick={() => onStateChange("Arkansas")}>
                Arkansas
              </MenuItem>
            </MenuList>
          </Menu>

          {state !== "State" && (
            <>
              <ButtonGroup isAttached variant="solid" size="md">
                <Button
                  onClick={() => handleGeoLevelChange("district")}
                  bg={geoLevel === "district" ? "#DEF2F1" : "white"}
                  _hover={{ bg: "#45A29E" }}
                  borderRadius="md"
                  borderRight="1px solid"
                  borderColor="gray.200"
                >
                  Districts
                </Button>
                <Button
                  onClick={() => handleGeoLevelChange("precinct")}
                  bg={geoLevel === "precinct" ? "#DEF2F1" : "white"}
                  _hover={{ bg: "#45A29E" }}
                  borderRadius="md"
                >
                  Precincts
                </Button>
              </ButtonGroup>
              {geoLevel === "precinct" && (
                <HeatmapControls
                  isEnabled={true}
                  onHeatmapChange={onHeatmapChange}
                  currentType={heatmapType}
                  onDemographicChange={onDemographicChange}
                  selectedDemographic={selectedDemographic}
                />
              )}
            </>
          )}
          <Button
            onClick={handleReset}
            bg="white"
            _hover={{ bg: "#45A29E" }}
            aria-label="Reset selection"
            title="Reset selection"
          >
            <RepeatIcon />
          </Button>
        </HStack>
      </HStack>
    </HStack>
  );
};

export default Navbar;