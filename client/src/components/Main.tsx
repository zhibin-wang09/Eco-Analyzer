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

import BaseChart from "./BaseChart";
import Navbar from "./Navbar";
import { ChartDataItem } from "./ChartDataItemInterface";

axios.defaults.withCredentials = true;

const MainLayout = () => {
  const [selectedState, setSelectedState] = useState<string>("Default");
  const [select, onSelectChange] = useState<string>("Default");

  const [metadata, setMetadata] = useState();
	const [chartData, setChartData] = useState<ChartDataItem[]>([]);

  useEffect(() => {
		axios.post("http://localhost:8080/getchartdata")
		.then(res => {
			setMetadata(res.data.metadata);
			setChartData(res.data.chartData);
		})
	}, []);

  useEffect(() => {
    if (chartData && chartData.length > 0) {
        console.log(chartData);
    }
  }, [chartData]);

  const direction = useBreakpointValue({
    base: "row", // Set the base direction as "row"
    md: "row", // Set the direction for the "md" breakpoint as "row"
  }) as ResponsiveValue<"column" | "row">;
  return (
    <Box>
      <Flex direction="column" width="100%" p={4} gap={4} height="100vh">
        <Navbar
          onSelectChange={onSelectChange}
          select={select}
          onStateChange={setSelectedState}
          state={selectedState}
        ></Navbar>
        <Flex direction="row" width="100%" height="100vh">
          <Center flex={1}>
            <USMap
              onStateSelect={setSelectedState}
              selectedState={selectedState}
              selectedData={select}
            />
          </Center>
          {selectedState === "Default" ? (
            <></>
          ) : (
            <Center>
              <BaseChart 
                selectedState={selectedState}
                dataArray={chartData}
              />
            </Center>

          )}
        </Flex>
      </Flex>
    </Box>
  );
};

export default MainLayout;