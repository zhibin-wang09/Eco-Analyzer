import React, { useState } from "react";
import {
  Box,
  Flex,
  useBreakpointValue,
  ResponsiveValue,
} from "@chakra-ui/react";
import USMap from "./USMap";
import Sidebar from "./SideBar";

const MainLayout = () => {
  const [selectedState, setSelectedState] = useState<string | null>(null);

  const direction = useBreakpointValue({
    base: "column",
    md: "row",
  }) as ResponsiveValue<"column" | "row">;

  return (
    <Flex
      direction={direction}
      width="100%"
      height={{ base: "auto", md: "100vh" }}
      p={4}
      gap={4}
    >
      <Box flex={1}>
        <USMap onStateSelect={setSelectedState} />
      </Box>
      <Sidebar selectedState={selectedState} />
    </Flex>
  );
};

export default MainLayout;
