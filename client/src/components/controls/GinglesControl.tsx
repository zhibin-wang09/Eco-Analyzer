import { useState } from "react";
import { GingleMode } from "../../types/ChartDataItemInterface";
import { Box, Select } from "@chakra-ui/react";
import Gingles from "../dataVisuals/gingles/Gingles";
import IncomeGingles from "../dataVisuals/gingles/IncomeGingles";
import NormalizedGingles from "../dataVisuals/gingles/NormalizedGingles";

interface GinglesControlProps{
    selectedState: string
}

const GinglesControl = ({selectedState}: GinglesControlProps) => {
  const [mode, setMode] = useState<GingleMode>("Demographic");

  return (
    <Box>
      <Select onChange={(e) => setMode(e.target.value as GingleMode)}>
        {["Demographic", "Income", "Income/Race"].map((key) => {
          return (
            <option key={key} value={key}>
              {key}
            </option>
          );
        })}
      </Select>
      {
        mode == 'Demographic' ? <Gingles selectedState={selectedState}/> : mode == 'Income' ? <IncomeGingles selectedState={selectedState}/> : <NormalizedGingles selectedState={selectedState} />
      }
    </Box>
  );
};

export default GinglesControl;
