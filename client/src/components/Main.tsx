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
    <Box className="bottom-0 right-0 left-0 top-8">
      <Flex
        direction={direction}
        width="100%"
        height={{ base: "auto", md: "100vh" }}
        p={4}
        gap={4}
      >
        <Center flex={1}>
          <USMap onStateSelect={setSelectedState} selectedState = {selectedState}/>
        </Center>
        {selectedState == null ? (
          <>
          </>
        ) : (
          <Center flex = {1} >
            <BaseChart selectedState={selectedState} />
          </Center>
        )}
      </Flex>
    </Box>
  );
};

export default MainLayout;
