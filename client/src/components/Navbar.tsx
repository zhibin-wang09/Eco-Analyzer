import React from "react";
import {
  Box,
  HStack,
  Heading,
  Select,
  Button,
  ButtonGroup,
} from "@chakra-ui/react";
import { RepeatIcon } from "@chakra-ui/icons";
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
}) => {
  const handleReset = () => {
    onStateChange("State");
    setSelectedVisualization("standard");
    onHeatmapChange("none");
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
                  onClick={() => handleGeoLevelChange("district")}
                  bg={geoLevel === "district" ? "#F7CFF2" : "white"}
                  _hover={{ bg: "#F7CFF2" }}
                  borderRadius="md"
                  borderRight="1px solid"
                  borderColor="gray.200"
                >
                  Districts
                </Button>
                <Button
                  onClick={() => handleGeoLevelChange("precinct")}
                  bg={geoLevel === "precinct" ? "#F7CFF2" : "white"}
                  _hover={{ bg: "#F7CFF2" }}
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
                />
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
      </HStack>
    </HStack>
  );
};

export default Navbar;
