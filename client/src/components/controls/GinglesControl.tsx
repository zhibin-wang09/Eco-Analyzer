import { Box } from "@chakra-ui/react";
import Gingles from "../dataVisuals/gingles/Gingles";

interface GinglesControlProps {
  selectedState: string;
}

const GinglesControl = ({ selectedState }: GinglesControlProps) => {
  return (
    <Box>
      <Gingles selectedState={selectedState} />
    </Box>
  );
};

export default GinglesControl;