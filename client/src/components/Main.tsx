import { useEffect, useState } from "react";
import {
  Box,
  Flex,
  useBreakpointValue,
  ResponsiveValue,
  VStack,
  SlideFade,
  ScaleFade,
  Tabs,
  TabList,
  Tab,
  Container,
} from "@chakra-ui/react";
import USMap from "./USMap";
import Navbar from "./Navbar";
import { VisualizationType } from "../types/ChartDataItemInterface";
import Frame from "./ui";
import RacePie from "./dataVisuals/Pie";
import { HeatmapType } from "./controls/HeatMapControls";
import { stateConversion } from "../utils/util";
import InformationControl from "./controls/InformationControl";

const MainLayout = () => {
  const [selectedState, setSelectedState] = useState<string>("State");
  const [select, onSelectChange] = useState<string>("Default");
  const [districtData, setDistrictData] = useState("");
  const [isDataVisible, setIsDataVisible] = useState(false);
  const [shouldFadeOut, setShouldFadeOut] = useState(false);
  const [selectedVisualization, setSelectedVisualization] =
    useState<VisualizationType>("summary");
  const [geoLevel, setGeoLevel] = useState<"district" | "precinct">("district");
  const [heatmapType, setHeatmapType] = useState<HeatmapType>("none");
  const [selectedDistrict, setSelectedDistrict] = useState<number | null>(null);
  const [tabIndex, setTabIndex] = useState(-1);
  const [selectedDemographic, setSelectedDemographic] =
    useState<string>("white");

  const direction = useBreakpointValue({
    base: "column",
    md: "row",
  }) as ResponsiveValue<"column" | "row">;

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

  const handleTabChange = (index: number) => {
    setTabIndex(index);
    const visualizations: VisualizationType[] = [
      "summary",
      "districtDetail",
      "gingles",
      "goodman",
      "income",
      "normalizedgingles",
      "hierarchical",
    ];
    setSelectedVisualization(visualizations[index]);
  };

  return (
    <Frame>
      <Container maxW="100%" px={4}>
        <VStack spacing={2} align="stretch" w="100%">
          <Box>
            <Navbar
              onSelectChange={onSelectChange}
              select={select}
              onStateChange={setSelectedState}
              state={selectedState}
              setSelectedVisualization={setSelectedVisualization}
              geoLevel={geoLevel}
              onGeoLevelChange={setGeoLevel}
              heatmapType={heatmapType}
              onHeatmapChange={setHeatmapType}
              onDemographicChange={setSelectedDemographic}
            />
          </Box>

          <Flex direction={direction} w="100%" gap={4} justify="space-between">
            <Box
              width={
                selectedState !== "State" ? { base: "100%", lg: "40%" } : "100%"
              }
              flexShrink={0}
              transition="width 0.5s ease-in-out"
            >
                <USMap
                  onStateSelect={setSelectedState}
                  selectedState={selectedState}
                  selectedData={select}
                  setDistrictData={setDistrictData}
                  geoLevel={geoLevel}
                  heatmapType={heatmapType}
                  selectedDistrict={selectedDistrict}
                  selectedDemographic={selectedDemographic}
                />
            </Box>
            {selectedState !== "State" && (
              <Box flex={1} minW={0}>
                <SlideFade
                  in={isDataVisible && !shouldFadeOut}
                  offsetX="20px"
                  transition={{
                    enter: { duration: 0.5 },
                    exit: { duration: 0.3 },
                  }}
                >
                  <ScaleFade
                    initialScale={0.9}
                    in={isDataVisible && !shouldFadeOut}
                    transition={{
                      enter: { duration: 0.5 },
                      exit: { duration: 0.3 },
                    }}
                  >
                    <InformationControl
                      tabIndex={tabIndex}
                      handleSelectDistrict={(district: number ) => setSelectedDistrict(district)}
                      handleTabChange={handleTabChange}
                      selectedVisualization={selectedVisualization}
                      selectedState={selectedState}
                    />
                  </ScaleFade>
                </SlideFade>
              </Box>
            )}
          </Flex>
        </VStack>
      </Container>
    </Frame>
  );
};

export default MainLayout;
