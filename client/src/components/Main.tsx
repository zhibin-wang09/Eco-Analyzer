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
import BaseChart from "./BaseChart";
import Navbar from "./Navbar";
import { VisualizationType } from "./ChartDataItemInterface";
import Frame from "./ui";
import CongressionalTable from "./CongressionalTable";
import RacePie from "./RacePie";
import { HeatmapType } from "./HeatMapControls";

const mockData = [
  {
    district: '1',
    representative: 'John Doe',
    party: 'Democrat',
    ethnicity: 'White',
    income: 55000,
    poverty: 12.5,
    regionType: { rural: 30, urban: 40, suburban: 30 },
    voteMargin: 10.2,
  },
  {
    district: '2',
    representative: 'Jane Smith',
    party: 'Republican',
    ethnicity: 'Hispanic',
    income: 42000,
    poverty: 18.4,
    regionType: { rural: 50, urban: 25, suburban: 25 },
    voteMargin: 5.1,
  },
];

const MainLayout = () => {
  const [selectedState, setSelectedState] = useState<string>("State");
  const [select, onSelectChange] = useState<string>("Default");
  const [districtData, setDistrictData] = useState("");
  const [isDataVisible, setIsDataVisible] = useState(false);
  const [shouldFadeOut, setShouldFadeOut] = useState(false);
  const [selectedVisualization, setSelectedVisualization] = useState<VisualizationType>('overview');
  const [geoLevel, setGeoLevel] = useState<'district' | 'precinct'>('district');
  const [heatmapType, setHeatmapType] = useState<HeatmapType>('none');
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [tabIndex, setTabIndex] = useState(0);
  const [selectedDemographic, setSelectedDemographic] = useState<string>('white');

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

  const handleSelectDistrict = (district: string) => {
    setSelectedDistrict(district);
  };

  const handleTabChange = (index: number) => {
    setTabIndex(index);
    const visualizations: VisualizationType[] = ['overview', 'gingles', 'goodman', 'income', 'normalizedgingles', 'hierarchical'];
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
          
          <Flex 
            direction={direction} 
            w="100%" 
            gap={4}
            justify="space-between"
          >
            <Box
              width={selectedState !== "State" ? { base: "100%", lg: "40%" } : "100%"}
              flexShrink={0}
              transition="width 0.5s ease-in-out"
            >
              <VStack spacing={4} align="stretch">
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
                {selectedState !== "State" && <RacePie />}
              </VStack>
            </Box>
            {selectedState !== "State" && (
              <Box
                flex={1}
                minW={0}
              >
                <SlideFade
                  in={isDataVisible && !shouldFadeOut}
                  offsetX="20px"
                  transition={{ enter: { duration: 0.5 }, exit: { duration: 0.3 } }}
                >
                  <ScaleFade
                    initialScale={0.9}
                    in={isDataVisible && !shouldFadeOut}
                    transition={{ enter: { duration: 0.5 }, exit: { duration: 0.3 } }}
                  >
                    <Box 
                      w="100%"
                      bg="white" 
                      p={3} 
                      borderRadius="xl" 
                      boxShadow="md"
                      overflow="hidden"
                    >
                      <Tabs 
                        variant="soft-rounded" 
                        colorScheme="blue" 
                        index={tabIndex} 
                        onChange={handleTabChange}
                        mb={2}
                        size="sm"
                      >
                        <TabList 
                          overflowX="auto" 
                          pb={2}
                          sx={{
                            scrollbarWidth: 'thin',
                            '&::-webkit-scrollbar': {
                              height: '6px',
                            },
                            '&::-webkit-scrollbar-thumb': {
                              backgroundColor: 'rgba(0, 0, 0, 0.1)',
                              borderRadius: '3px',
                            }
                          }}
                        >
                          <Tab>Overview</Tab>
                          <Tab>Gingles</Tab>
                          <Tab>Box & Whisker</Tab>
                          <Tab>Income</Tab>
                          <Tab>Normalized</Tab>
                          <Tab>Hierarchical</Tab>
                        </TabList>
                      </Tabs>
                      
                      {selectedVisualization === 'overview' && (
                        <Box overflow="auto">
                          <CongressionalTable 
                            data={mockData} 
                            onSelectDistrict={handleSelectDistrict} 
                          />
                        </Box>
                      )}
                      
                      <Box overflow="hidden">
                        <BaseChart
                          selectedState={selectedState}
                          selectedVisualization={selectedVisualization} 
                        />
                      </Box>
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