import { Box, Tab, TabList, Tabs } from "@chakra-ui/react";
import { VisualizationType } from "../../types/ChartDataItemInterface";
import CongressionalTable from "../dataVisuals/StateSummary";
import BaseChart from "../dataVisuals/BaseChart";

interface InformationControlProps {
  tabIndex: number;
  handleTabChange: (tabIndex: number) => void;
  selectedVisualization: VisualizationType;
  handleSelectDistrict: (district: number | null) => void;
  selectedState: string;
}

const InformationControl = ({
  tabIndex,
  handleTabChange,
  selectedVisualization,
  handleSelectDistrict,
  selectedState,
}: InformationControlProps) => {
  return (
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
            scrollbarWidth: "thin",
            "&::-webkit-scrollbar": {
              height: "6px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "rgba(0, 0, 0, 0.1)",
              borderRadius: "3px",
            },
          }}
        >
          <Tab>Summary</Tab>
          <Tab>Districts Detail</Tab>
          <Tab>Gingles</Tab>
          <Tab>Box & Whisker</Tab>
          <Tab>Income</Tab>
          <Tab>Normalized</Tab>
          <Tab>Hierarchical</Tab>
        </TabList>
      </Tabs>

      {/* {selectedVisualization === "overview" && (
        <Box overflow="auto">
          <CongressionalTable
            data={mockData}
            onSelectDistrict={handleSelectDistrict}
          />
        </Box>
      )} */}

      <Box overflow="hidden">
        <BaseChart
          selectedState={selectedState}
          selectedVisualization={selectedVisualization}
          onSelectDistrict={handleSelectDistrict}
        />
      </Box>
    </Box>
  );
};

export default InformationControl;
