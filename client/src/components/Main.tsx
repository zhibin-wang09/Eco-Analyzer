import { useEffect, useState } from "react";
import { 
  Box, 
  Flex, 
  useBreakpointValue, 
  ResponsiveValue, 
  VStack,
  SlideFade,
  ScaleFade,
} from "@chakra-ui/react";
import USMap from "./USMap";
import BaseChart from "./BaseChart";
import Navbar from "./Navbar";
import { VisualizationType } from "./ChartDataItemInterface";
import Frame from "./ui";
import InferenceMenu from "./InferenceMenu";

const MainLayout = () => {
  const [selectedState, setSelectedState] = useState<string>("State");
  const [select, onSelectChange] = useState<string>("Default");
  const [districtData, setDistrictData] = useState("");
  const [isDataVisible, setIsDataVisible] = useState(false);
  const [shouldFadeOut, setShouldFadeOut] = useState(false);
  const [selectedVisualization, setSelectedVisualization] = useState<VisualizationType>('gingles');
  const [geoLevel, setGeoLevel] = useState<'district' | 'precinct'>('district');
  const [showHeatmap, setShowHeatmap] = useState(false);

  // Reset heatmap when changing geo level or state
  useEffect(() => {
    setShowHeatmap(false);
  }, [geoLevel, selectedState]);

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
            geoLevel={geoLevel}
            onGeoLevelChange={setGeoLevel}
            showHeatmap={showHeatmap}
            onHeatmapChange={setShowHeatmap}
          />
          <Flex direction={direction} width="100%" gap={8}>
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
                geoLevel={geoLevel}
                showHeatmap={showHeatmap}
              />
            </Box>
            
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
                    <BaseChart
                      selectedState={selectedState}
                      selectedVisualization={selectedVisualization} />
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