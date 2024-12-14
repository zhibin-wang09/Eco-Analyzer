import { useEffect, useState } from "react";
import {
  Box,
  Flex,
  useBreakpointValue,
  ResponsiveValue,
  VStack,
  SlideFade,
  ScaleFade,
  Container,
} from "@chakra-ui/react";
import USMap from "./USMap";
import Navbar from "./Navbar";
import Frame from "./ui";
import { HeatmapType } from "./controls/HeatMapControls";
import InformationControl from "./controls/InformationControl";
import { VisualizationType } from "../types/ChartDataItemInterface";
import PieChartComponent from "./dataVisuals/Pie";
import { stateConversion } from "../utils/util";

const MainLayout = () => {
  const [selectedState, setSelectedState] = useState<string>("State");
  const [select, onSelectChange] = useState<string>("Default");
  const [districtData, setDistrictData] = useState("");
  const [isDataVisible, setIsDataVisible] = useState(false);
  const [shouldFadeOut, setShouldFadeOut] = useState(false);
  const [selectedVisualization, setSelectedVisualization] = useState<VisualizationType>("summary");
  const [geoLevel, setGeoLevel] = useState<"district" | "precinct">("district");
  const [heatmapType, setHeatmapType] = useState<HeatmapType>("none");
  const [selectedDistrict, setSelectedDistrict] = useState<number | null>(null);
  const [tabIndex, setTabIndex] = useState(0);
  const [selectedDemographic, setSelectedDemographic] = useState<string>("White");
  const [stateSummaryData, setStateSummaryData] = useState<any>(null);

  const direction = useBreakpointValue({
    base: "column",
    md: "row",
  }) as ResponsiveValue<"column" | "row">;

  useEffect(() => {
    const fetchSummaryData = async () => {
      if (selectedState === "State") return;
      try {
        const response = await fetch(
          `http://localhost:8080/api/summary?state=${stateConversion(selectedState)}`
        );
        const data = await response.json();
        setStateSummaryData(data);
      } catch (error) {
        console.error("Error fetching summary data:", error);
      }
    };

    fetchSummaryData();
  }, [selectedState]);

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
      "boxplot",
      "ecologicalInference",
    ];
    setSelectedVisualization(visualizations[index]);
    if (index !== 1) {
      setSelectedDistrict(null);
    }
  };

  const transformRegionData = (data: any) => {
    if (!data) return [];
    const regionData = data["population percentage by region"];
    return Object.entries(regionData).map(([name, value]) => ({
      name: name,
      value: typeof value === 'string' ? parseFloat(value) : (value as number)
    }));
  };

  const showRegionPieChart = selectedState !== "State" && 
                            stateSummaryData && 
                            selectedVisualization === "summary";

  const mapHeight = showRegionPieChart 
    ? "calc(55vh - 20px)"
    : "calc(85vh - 20px)"; // Extended height when pie chart is hidden

    return (
      <Frame>
        <Container maxW="100%" px={4} minH="calc(100vh - 60px)"> {/* Increased minimum height */}
          <VStack spacing={4} align="stretch" w="100%" minH="calc(100vh - 80px)">
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
                setTabIndex={handleTabChange}
                selectedDemographic={selectedDemographic}
              />
            </Box>
  
            <Flex 
              direction={direction} 
              w="100%" 
              gap={6}  // Increased gap
              justify="space-between"
              flex={1}
              minH={0}
              pb={6}  // Added bottom padding
            >
              <Flex
                direction="column"
                width={selectedState !== "State" ? { base: "100%", lg: "40%" } : "100%"}
                gap={6}  // Increased gap
              >
                <Box flex={1} minH={0}>
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
  
                {showRegionPieChart && (
                  <SlideFade in={true} offsetY="20px">
                    <Box
                      bg="white"
                      p={4}
                      borderRadius="xl"
                      boxShadow="sm"
                      height="300px"
                      width="100%"
                    >
                      <PieChartComponent
                        data={transformRegionData(stateSummaryData)}
                        title="Population by Region Type"
                      />
                    </Box>
                  </SlideFade>
                )}
              </Flex>
  
              {selectedState !== "State" && (
                <Box flex={1} minH={0}>
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
                      <Box maxH="calc(100vh - 120px)" overflowY="auto">
                        <InformationControl
                          tabIndex={tabIndex}
                          handleSelectDistrict={setSelectedDistrict}
                          handleTabChange={handleTabChange}
                          selectedVisualization={selectedVisualization}
                          selectedState={selectedState}
                        />
                      </Box>
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