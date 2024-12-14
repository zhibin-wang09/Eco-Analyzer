import React from "react";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  HStack,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";

export type HeatmapType =
  | "none"
  | "demographic"
  | "poverty"
  | "economic"
  | "politicalincome"
  | "urbanicity";
export type DemographicGroup =
  | "White"
  | "Black"
  | "Hispanic"
  | "Asian"
  | "Other";

interface HeatmapControlsProps {
  isEnabled: boolean;
  onHeatmapChange: (type: HeatmapType) => void;
  currentType: HeatmapType;
  onDemographicChange?: (group: DemographicGroup) => void;
  selectedDemographic: string;
}

const HeatmapControls: React.FC<HeatmapControlsProps> = ({
  isEnabled,
  onHeatmapChange,
  currentType,
  onDemographicChange,
  selectedDemographic,
}) => {
  if (!isEnabled) return null;

  const getButtonText = () => {
    switch (currentType) {
      case "none":
        return "Show Heatmap";
      case "demographic":
        return "Demographic Heatmap";
      case "poverty":
        return "Poverty Heatmap";
      case "economic":
        return "Economic Heatmap";
      case "politicalincome":
        return "Political Income Heatmap";
      case "urbanicity":
        return "Region Type Heatmap";
      default:
        return "Show Heatmap";
    }
  };

  return (
    <HStack spacing={2}>
      {/* Main Heatmap Menu */}
      <Menu>
        <MenuButton
          as={Button}
          rightIcon={<ChevronDownIcon />}
          bg={currentType !== "none" ? "#DEF2F1" : "white"}
          _hover={{ bg: "#45A29E" }}
        >
          {getButtonText()}
        </MenuButton>
        <MenuList>
          {currentType !== "none" && (
            <MenuItem onClick={() => onHeatmapChange("none")}>
              Hide Heatmap
            </MenuItem>
          )}
          <MenuItem onClick={() => onHeatmapChange("demographic")}>
            Demographic Heatmap
          </MenuItem>
          <MenuItem onClick={() => onHeatmapChange("poverty")}>
            Poverty Heatmap
          </MenuItem>
          <MenuItem onClick={() => onHeatmapChange("economic")}>
            Economic Heatmap
          </MenuItem>
          <MenuItem onClick={() => onHeatmapChange("politicalincome")}>
            Political Income Heatmap
          </MenuItem>
          <MenuItem onClick={() => onHeatmapChange("urbanicity")}>
            Region Type Heatmap
          </MenuItem>
        </MenuList>
      </Menu>

      {/* Demographic Group Menu */}
      {currentType === "demographic" && onDemographicChange && (
        <Menu>
          <MenuButton
            as={Button}
            rightIcon={<ChevronDownIcon />}
            bg={"#DEF2F1"}
            _hover={{ bg: "#45A29E" }}
          >
            {selectedDemographic}
          </MenuButton>
          <MenuList>
            <MenuItem onClick={() => onDemographicChange("White")}>
              White
            </MenuItem>
            <MenuItem onClick={() => onDemographicChange("Black")}>
              Black
            </MenuItem>
            <MenuItem onClick={() => onDemographicChange("Asian")}>
              Asian
            </MenuItem>
            <MenuItem onClick={() => onDemographicChange("Hispanic")}>
              Hispanic
            </MenuItem>
            <MenuItem onClick={() => onDemographicChange("Other")}>
              Other
            </MenuItem>
          </MenuList>
        </Menu>
      )}
    </HStack>
  );
};

export default HeatmapControls;
