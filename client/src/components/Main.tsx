import { useEffect, useState } from "react";
import axios from 'axios';
import { 
  Box, 
  Flex, 
  useBreakpointValue, 
  ResponsiveValue, 
  VStack, 
  Text,
  SlideFade,
  ScaleFade,
} from "@chakra-ui/react";
import USMap from "./USMap";
import BaseChart from "./BaseChart";
import Navbar from "./Navbar";
import { ChartDataItem, VisualizationType } from "./ChartDataItemInterface";
import Frame from "./ui";
import InferenceMenu from "./InferenceMenu";

axios.defaults.withCredentials = true;

const MainLayout = () => {
  const [selectedState, setSelectedState] = useState<string>("State");
  const [select, onSelectChange] = useState<string>("Default");
  const [metadata, setMetadata] = useState();
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  const [districtData, setDistrictData] = useState("");
  const [isDataVisible, setIsDataVisible] = useState(false);
  const [shouldFadeOut, setShouldFadeOut] = useState(false);
  const [selectedVisualization, setSelectedVisualization] = useState<VisualizationType>('standard');

  useEffect(() => {
    axios.get("http://localhost:8080/getchartdata")
      .then(res => {
        setMetadata(res.data.metadata);
        setChartData(res.data.chartData);
      });
  }, []);

  useEffect(() => {
    if (selectedState !== "State") {
      if (isDataVisible) {
        setShouldFadeOut(true);
        setTimeout(() => {
          setShouldFadeOut(false);
          setIsDataVisible(true);
        }, 300);
      } else {
        setShouldFadeOut(false);
        setTimeout(() => {
          setIsDataVisible(true);
        }, 300);
      }
    } else {
      setShouldFadeOut(true);
      setTimeout(() => {
        setIsDataVisible(false);
        setShouldFadeOut(false);
      }, 300);
    }
  }, [selectedState]);

  const direction = useBreakpointValue({
    base: "column",
    md: "row",
  }) as ResponsiveValue<"column" | "row">;

  return (
    <Frame>
      <Box width="100%">
        <VStack spacing={8} align="stretch">
          <Navbar
            onSelectChange={onSelectChange}
            select={select}
            onStateChange={setSelectedState}
            state={selectedState}
            setSelectedVisualization={setSelectedVisualization}
          />
          <Flex direction={direction} width="100%" gap={8}>
            {/* Map container with fixed width */}
            <Box
              width={selectedState !== "State" ? "400px" : "100%"}
              flexShrink={0}
              transition="width 0.5s ease-in-out"
            >
              <USMap
                onStateSelect={setSelectedState}
                selectedState={selectedState}
                selectedData={select}
                setDistrictData={setDistrictData}
              />
            </Box>
            
            {/* Chart container that takes remaining space */}
            <SlideFade
              in={isDataVisible && !shouldFadeOut}
              offsetX="20px"
              transition={{ 
                enter: { duration: 0.5, delay: 0.2 },
                exit: { duration: 0.3 }
              }}
              style={{ flex: 1 }}
            >
              <ScaleFade
                initialScale={0.9}
                in={isDataVisible && !shouldFadeOut}
                transition={{ 
                  enter: { duration: 0.5, delay: 0.2 },
                  exit: { duration: 0.3 }
                }}
              >
                {selectedState !== "State" && (
                  <Box 
                    width="100%"
                    bg="white" 
                    p={6} 
                    borderRadius="xl" 
                    boxShadow="md"
                  >
                    <VStack spacing={4} align="stretch">
                      {districtData && (
                        <Text fontSize="lg" fontWeight="bold" color="#494946">
                          District: {districtData}
                        </Text>
                      )}
                      <BaseChart
                        selectedState={selectedState}
                        dataArray={chartData}
                        selectedVisualization={selectedVisualization}
                      />
                    </VStack>
                  </Box>
                )}
              </ScaleFade>
            </SlideFade>
          </Flex>
        </VStack>
      </Box>
    </Frame>
  );
};

export default MainLayout;