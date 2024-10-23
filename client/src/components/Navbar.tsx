// Navbar.tsx
import { Box, HStack, Heading, Select } from "@chakra-ui/react";
import InferenceMenu from "./InferenceMenu";
import { VisualizationType } from './ChartDataItemInterface';

interface NavbarProps {
  onSelectChange: (val: string) => void;
  select: string;
  onStateChange: (val: string) => void;
  state: string;
  setSelectedVisualization: (type: VisualizationType) => void;
}

const Navbar: React.FC<NavbarProps> = ({
  onSelectChange,
  select,
  onStateChange,
  state,
  setSelectedVisualization,
}) => {
  return (
    <HStack justify="space-between" width="100%" align="center">
      <Heading as="h1" size="l" textAlign="center">
        US Political Map
      </Heading>
      <HStack spacing={4}>
        <Select
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
            onStateChange(e.target.value);
          }}
          value={state}
          bg="white"
          width="200px"
        >
          <option disabled>State</option>
          <option>New York</option>
          <option>Arkansas</option>
        </Select>
        <InferenceMenu setSelectedVisualization={setSelectedVisualization} />
      </HStack>
    </HStack>
  );
};

export default Navbar;