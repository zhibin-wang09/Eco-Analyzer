import { useEffect, useState } from "react";
import {
  Box,
  Flex,
  useBreakpointValue,
  ResponsiveValue,
  Center,
} from "@chakra-ui/react";
import USMap from "./USMap";
import Sidebar from "./SideBar";

import BaseChart from "./BaseChart";

const MainLayout = () => {

  const [selectedState, setSelectedState] = useState<string | null>(null);

  const direction = useBreakpointValue({
    base: "column",
    md: "row",
  }) as ResponsiveValue<"column" | "row">;
  return (
    <Box>
      <Flex
        direction={direction}
        width="100%"
        height={{ base: "auto", md: "100vh" }}
        p={4}
        gap={4}
        pos="relative"
      >
        <Center flex={1} pos="static" zIndex="1">
          <USMap onStateSelect={setSelectedState} selectedState = {selectedState}/>
        </Center>
        {selectedState == null ? (
          <>
          </>
        ) : (
          <Center flex = {1} pos="absolute" bottom="0" right="0" zIndex="2" bg="white">
            <BaseChart selectedState={selectedState} />
          </Center>
        )}
      </Flex>
    </Box>
  );
};

export default MainLayout;
