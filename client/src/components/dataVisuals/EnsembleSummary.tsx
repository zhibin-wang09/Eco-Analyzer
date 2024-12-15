import { Box, Text } from "@chakra-ui/react";
import StateOverviewChart from "./StateOverviewChart";
import { useEffect, useState } from "react";
import { EnsembleSummaryData } from "../../types/CongressionalDistrictData";

interface EnsembleSummaryProp {
  ensembleSummary: EnsembleSummaryData;
}

const EnsembleSummary = ({ensembleSummary}: EnsembleSummaryProp) => {
  
  return (
    <Box>
       <Text fontSize="lg" fontWeight="semibold" mb={3}>
        Total District Plan: {ensembleSummary.total_plans}
      </Text>

      <Box height="250px">
        <StateOverviewChart
          data={Object.entries(ensembleSummary?.split_frequencies!).map(([name, value]) => ({
            name,
            value,
          })).sort((a, b) => a.value - b.value)}
          title="Republican/Democrat Split"
          xAxisLabel="Race"
          height="350px"
        />
      </Box>
    </Box>
  );
};

export default EnsembleSummary;
