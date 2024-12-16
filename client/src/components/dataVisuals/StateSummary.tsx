import React from "react";
import { Box, Flex, Grid, HStack, Text, VStack } from "@chakra-ui/react";
import PieChartComponent from "./Pie";
import StateOverviewChart from "./StateOverviewChart";
import { Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";

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
      <Text fontSize="lg" fontWeight="semibold" mb={3}>
        Total Population: {totalPopulation.toLocaleString()}
      </Text>
      <Grid templateColumns="repeat(2, 1fr)" gap={4} alignItems="center">
        <Box bg="white" p={4} borderRadius="xl" boxShadow="sm">
          <Table variant="simple" size="sm">
            <Thead>
              <Tr>
                <Th textTransform="none" fontSize="xs">
                  Senator
                </Th>
                <Th textTransform="none" fontSize="xs">
                  Party
                </Th>
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
        {/* Region Data Table */}
        <Box
          bg="white"
          p={4}
          borderRadius="xl"
          boxShadow="sm"
          height="200px"
          overflow="scroll"
        >
          <Text fontSize="md" fontWeight="semibold" mb={2} textAlign="left">
            Income Population Distribution
          </Text>
          <Table variant="simple" size="sm">
            <Thead>
              <Tr>
                <Th textTransform="none" fontSize="xs">
                  Income Ranges
                </Th>
                <Th textTransform="none" fontSize="xs" isNumeric>
                  Percentage
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {incomeData
                .sort((a, b) => {
                  const parseRange = (range: string): number => {
                    if (range.includes("+")) {
                      // Handle "100k+" as a very high number
                      return parseInt(range.replace("k+", "000"), 10);
                    }
                    // Extract the lower bound of the range
                    const [low] = range.replace("k", "").split("-").map(Number);
                    return low;
                  };

                  const aLow = parseRange(a.name);
                  const bLow = parseRange(b.name);

                  return aLow - bLow; // Sort by the lower bound of the range
                })
                .map((incomeRanges, index) => (
                  <Tr key={index} _hover={{ bg: "gray.50" }}>
                    <Td fontSize="xs">
                      {incomeRanges.name.slice(0, 1).toUpperCase() +
                        incomeRanges.name.slice(1)}
                    </Td>
                    <Td fontSize="xs" isNumeric>
                      {incomeRanges.value.toLocaleString()}%
                    </Td>
                  </Tr>
                ))}
            </Tbody>
          </Table>
        </Box>
        {/* <Box bg="white" borderRadius="xl" boxShadow="sm" height="160px">
          <PieChartComponent data={incomeData} title="Income Distribution" />
        </Box> */}
      </Grid>

      <Grid templateColumns="repeat(2, 1fr)" gap={4} alignItems="center">
        {/* Region Data Table */}
        <Box bg="white" p={4} borderRadius="xl" boxShadow="sm">
          <Text fontSize="md" fontWeight="semibold" mb={2} textAlign="left">
            Population by Region
          </Text>
          <Table variant="simple" size="sm">
            <Thead>
              <Tr>
                <Th textTransform="none" fontSize="xs">
                  Region
                </Th>
                <Th textTransform="none" fontSize="xs" isNumeric>
                  Percentage
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {regionData.map((region, index) => (
                <Tr key={index} _hover={{ bg: "gray.50" }}>
                  <Td fontSize="xs">
                    {region.name.slice(0, 1).toUpperCase() +
                      region.name.slice(1)}
                  </Td>
                  <Td fontSize="xs" isNumeric>
                    {region.value.toLocaleString()}%
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
        <Box bg="white" p={4} borderRadius="xl" boxShadow="sm">
          <Text fontSize="md" fontWeight="semibold" mb={2} textAlign="left">
            Voter Distribution
          </Text>
          <Table variant="simple" size="sm">
            <Thead>
              <Tr>
                <Th textTransform="none" fontSize="xs">
                  Party
                </Th>
                <Th textTransform="none" fontSize="xs" isNumeric>
                  Population
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {voteData.map((party, index) => (
                <Tr key={index} _hover={{ bg: "gray.50" }}>
                  <Td fontSize="xs">
                    {party.name.slice(0, 1).toUpperCase() + party.name.slice(1)}
                  </Td>
                  <Td fontSize="xs" isNumeric>
                    {party.value.toLocaleString()}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
        {/* <Box bg="white" borderRadius="xl" boxShadow="sm" height="160px">
          <PieChartComponent data={regionData} title="Region Distribution" />
        </Box> */}
      </Grid>
      {/* <Grid templateColumns="repeat(2, 1fr)" gap={4} mb={4} alignItems="center">
        <Box bg="white" p={4} borderRadius="xl" boxShadow="sm">
          <Text fontSize="md" fontWeight="semibold" mb={2} textAlign="left">
            Voter Distribution
          </Text>
          <Table variant="simple" size="sm">
            <Thead>
              <Tr>
                <Th textTransform="none" fontSize="xs">
                  Party
                </Th>
                <Th textTransform="none" fontSize="xs" isNumeric>
                  Population
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {voteData.map((party, index) => (
                <Tr key={index} _hover={{ bg: "gray.50" }}>
                  <Td fontSize="xs">
                    {party.name.slice(0, 1).toUpperCase() + party.name.slice(1)}
                  </Td>
                  <Td fontSize="xs" isNumeric>
                    {party.value.toLocaleString()}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
        <Box bg="white" borderRadius="xl" boxShadow="sm" height="160px">
          <PieChartComponent data={voteData} title="Voter Distribution" />
        </Box>
      </Grid> */}

      {/* Pie Charts Grid
      <Grid templateColumns="repeat(2, 1fr)" gap={4} mb={4}>
        <Box bg="white" borderRadius="xl" boxShadow="sm" height="160px">
          <PieChartComponent data={incomeData} title="Income Distribution" />
        </Box>
      </Grid> */}

      {/* Bar Chart for Racial Data */}
      <Box height="250px">
        <StateOverviewChart
          yaxis="Population"
          data={racialData
            .map(({ name, value }) => ({
              name: name.slice(0, 1).toUpperCase() + name.slice(1),
              value,
            }))
            .filter(
              ({ name }) =>
                name !== "American indian" && name !== "Native hawaiian"
            )}
          title="Population Distribution by Race"
          xAxisLabel="Race"
          height="350px"
        />
      </Box>
    </Box>
  );
};

export default StateSummary;
