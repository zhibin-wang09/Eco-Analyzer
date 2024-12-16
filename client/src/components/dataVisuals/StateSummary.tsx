import React from "react";
import { Box, Grid, Text, VStack } from "@chakra-ui/react";
import PieChartComponent from "./Pie";
import StateOverviewChart from "./StateOverviewChart";
import { Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";
import EcologicalInference from "./densityGraphComponent/EcologicalInference";
import { EnsembleSummaryData } from "../../types/CongressionalDistrictData";
import EnsembleSummary from "./EnsembleSummary";

interface ChartDataItem {
  name: string;
  value: number;
}

interface StateSummaryProps {
  racialData: ChartDataItem[];
  incomeData: ChartDataItem[];
  voteData: ChartDataItem[];
  regionData: ChartDataItem[];
  totalPopulation: number;
  representatives?: Array<{ name: string; party: string }>;
}

const StateSummary = ({
  racialData,
  incomeData,
  voteData,
  regionData,
  totalPopulation,
  representatives = [],
}: StateSummaryProps) => {
  return (
    <Box p={5}>
      <Text fontSize="lg" fontWeight="semibold" mb={-3}>
        Total Population: {totalPopulation.toLocaleString()}
      </Text>

      {/* Congressional Representatives Table */}
      <Box bg="white" p={4} borderRadius="xl" boxShadow="sm" mb={-3}>
        <Table variant="simple" size="sm">
          <Thead>
            <Tr>
              <Th textTransform="none" fontSize="xs">Senator</Th>
              <Th  textTransform="none" fontSize="xs">Party</Th>
            </Tr>
          </Thead>
          <Tbody>
            {representatives.map((rep, index) => (
              <Tr key={index} _hover={{ bg: "gray.50" }}>
                <Td fontSize="xs">{rep.name}</Td>
                <Td
                  fontSize="xs"
                  color={rep.party === "Democratic" ? "blue.600" : "red.600"}
                >
                  {rep.party}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      {/* Pie Charts Grid */}
      <Grid templateColumns="repeat(2, 1fr)" gap={0}>
        <Box bg="white" borderRadius="xl" boxShadow="sm" height="160px">
          <PieChartComponent data={voteData} title="Voter Distribution" />
        </Box>
        <Box bg="white"borderRadius="xl" boxShadow="sm" height="160px">
          <PieChartComponent data={incomeData} title="Income Distribution" />
        </Box>
      </Grid>

      {/* Bar Chart */}
      <Box height="250px">
        <StateOverviewChart
          yaxis="Population"
          data={racialData.map(({ name, value }) => {
            return {
              name: name.slice(0, 1).toUpperCase() + name.slice(1),
              value,
            };
          }).filter(({name, value}) => name !== 'American indian' && name !== 'Native hawaiian')}
          title="Population Distribution by Race"
          xAxisLabel="Race"
          height="350px"
        />
      </Box>

    </Box>
  );
};

export default StateSummary;
