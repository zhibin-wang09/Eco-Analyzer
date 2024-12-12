import React, { useEffect, useState } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Box,
  Text,
  HStack,
} from "@chakra-ui/react";
import StateOverviewChart from "./StateOverviewChart";
import RacePie from "./Pie";
import Summary from "../../types/StateSummary";
import { objectToArray, stateConversion } from "../../utils/util";
import { title } from "process";
import PieChart from "./Pie";

interface StateSummaryProp {
  selectedState: string;
}

const StateSummary = ({ selectedState }: StateSummaryProp) => {
  const [stateSummary, setStateSummary] = useState<Summary | null>(null);

  useEffect(() => {
    const fetchStateSummary = async (selectedState: string) => {
      const query = new URLSearchParams({
        state: selectedState,
      }).toString();
      const response = await fetch(
        "http://localhost:8080/api/summary?" + query
      );
      const json = await response.json();
      return json;
    };

    const loadStateSummary = async () => {
      try {
        const rawStateSummary = await fetchStateSummary(
          stateConversion(selectedState)
        );
        console.log(rawStateSummary);
        // Transform congressional representatives into an array of objects with name and party
        const representatives = rawStateSummary[
          "congressional representatives"
        ].map((rep: Record<string, string>) => {
          const name = Object.keys(rep)[0];
          const party = rep[name];
          return { name, party };
        });

        const transformedStateSummary: Summary = {
          racialPopulation: rawStateSummary["racial population"],
          populationByIncome: rawStateSummary["population by income"],
          voteDistribution: rawStateSummary["vote distribution"],
          congressionalRepresentatives: representatives,
          populationPercentageByRegion:
            rawStateSummary["population percentage by region"],
          population: rawStateSummary["population"],
        };

        setStateSummary(transformedStateSummary);
      } catch (error) {
        console.error("Error fetching state summary:", error);
      }
    };

    loadStateSummary();
  }, [selectedState]);

  return (
    <>
      <Box
        overflowX="auto"
        overflowY="auto"
        p={1}
        borderWidth="1px"
        borderRadius="md"
        bg="white"
        boxShadow="sm"
      >
        <Text fontSize="sm" fontWeight="bold" mb={1} ml={2}>
          Congressional Representatives
        </Text>
        <Table variant="simple" size="sm">
          <Thead>
            <Tr>
              <Th py={1} fontSize="xs">
                Representative
              </Th>
              <Th py={1} fontSize="xs">
                Party
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {stateSummary?.congressionalRepresentatives.map((rep) => (
              <Tr key={rep.name} _hover={{ cursor: "pointer", bg: "blue.100" }}>
                <Td py={0.5} fontSize="xs">
                  {rep.name}
                </Td>
                <Td py={0.5} fontSize="xs">
                  {rep.party}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
        <Text>Total Population: {stateSummary?.population}</Text>
      <HStack
        spacing={4}
        align="stretch"
        p={4}
        bg="white"
        borderRadius="lg"
        boxShadow="sm"
      >
        <PieChart data={objectToArray(stateSummary?.populationPercentageByRegion)} title={"distribution of population by urbanicity"}/>
        <PieChart data={objectToArray(stateSummary?.populationByIncome)} title={"distribution of population by income"}/>
        <PieChart data={objectToArray(stateSummary?.voteDistribution)} title={"State Voter Distribution"}/>
      </HStack>
      <StateOverviewChart
        data={objectToArray(stateSummary?.racialPopulation)}
        title={"Distribution of population of race"}
        xAxisLabel={"race"}
      />
    </>
  );
};

export default StateSummary;
