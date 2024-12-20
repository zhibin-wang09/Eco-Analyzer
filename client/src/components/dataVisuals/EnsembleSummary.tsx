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
       <Text fontSize="lg" fontWeight="semibold" >
        Total District Plan: {ensembleSummary.total_plans}
      </Text>
      <Text fontSize="md" fontWeight="semibold" >
        Population Threshold : {ensembleSummary.offset}
      </Text>

      <Box height="220px" overflow="hidden">
        <StateOverviewChart
        yaxis="Number of District Plans"
          data={Object.entries(ensembleSummary?.split_frequencies!).map(([name, value]) => ({
            name,
            value,
          })).sort((a, b) => Number(a.name.split('/')[0]) - Number(b.name.split('/')[0]))}
          title="Democrat/Republican Split"
          xAxisLabel="Race"
          height="350px"
        />
      </Box>
    </Box>
  );
};

export default EnsembleSummary;
