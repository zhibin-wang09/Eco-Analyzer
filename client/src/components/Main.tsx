import { useEffect, useState } from "react";
import axios from 'axios';

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

axios.defaults.withCredentials = true;

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
