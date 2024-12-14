import { useState } from "react";
import { GingleMode } from "../../types/ChartDataItemInterface";
import { Box, Menu, MenuButton, MenuList, MenuItem, Button } from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import Gingles from "../dataVisuals/gingles/Gingles";
import IncomeGingles from "../dataVisuals/gingles/IncomeGingles";
import NormalizedGingles from "../dataVisuals/gingles/NormalizedGingles";

interface GinglesControlProps {
  selectedState: string;
}

const GinglesControl = ({ selectedState }: GinglesControlProps) => {
  const [mode, setMode] = useState<GingleMode>("Demographic");

  return (
    <Box>
      <Menu>
        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
          {mode}
        </MenuButton>
        <MenuList>
          {["Demographic", "Income", "Income/Race"].map((key) => {
            return (
              <MenuItem key={key} onClick={() => setMode(key as GingleMode)}>
                {key}
              </MenuItem>
            );
          })}
        </MenuList>
      </Menu>
      {
        mode === "Demographic" ? (
          <Gingles selectedState={selectedState} />
        ) : mode === "Income" ? (
          <IncomeGingles selectedState={selectedState} />
        ) : (
          <NormalizedGingles selectedState={selectedState} />
        )
      }
    </Box>
  );
};

export default GinglesControl;