import React from "react";
import { Box, Spinner, Center } from "@chakra-ui/react";
import Gingles from "./gingles/Gingles";
import { VisualizationType } from "../../types/ChartDataItemInterface";
import StateSummary from "./StateSummary";
import DistrictDetail from "./DistrictDetail";
import GinglesControl from "../controls/GinglesControl";
import BoxPlot from "./Boxplot";
import { stateConversion } from "../../utils/util";
import EcologicalInference from "./densityGraphComponent/EcologicalInference";

interface ChartDataItem {
  name: string;
  value: number;
}

interface SummaryData {
  "racial population": Record<string, number>;
  "population by income": Record<string, number>;
  "vote distribution": Record<string, number>;
  "population percentage by region": {
    Rural: string;
    Urban: string;
    Suburban: string;
  };
  "congressional representatives": Array<Record<string, string>>;
  population: number;
}

interface BaseChartProps {
  selectedState: string;
  selectedVisualization?: VisualizationType;
  onSelectDistrict: (district: number | null) => void;
}

const BaseChart: React.FC<BaseChartProps> = ({
  selectedState,
  selectedVisualization = "summary",
  onSelectDistrict,
}) => {
  const [stateSummaryData, setStateSummaryData] =
    React.useState<SummaryData | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchStateSummary = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `http://localhost:8080/api/summary?state=${stateConversion(
            selectedState
          )}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Fetched data:", data); // Debug log
        setStateSummaryData(data);
      } catch (error) {
        console.error("Error fetching state summary:", error);
        setError(
          error instanceof Error ? error.message : "Failed to fetch data"
        );
        setStateSummaryData(null);
      } finally {
        setIsLoading(false);
      }
    };

    if (selectedState && selectedVisualization === "summary") {
      fetchStateSummary();
    }
  }, [selectedState, selectedVisualization]);

  const transformDataToArray = (
    data: Record<string, number>
  ): ChartDataItem[] => {
    if (!data) return [];
    return Object.entries(data).map(([name, value]) => ({
      name,
      value: typeof value === "string" ? parseFloat(value) : value,
    }));
  };

  const transformRegionData = (
    data: Record<string, string>
  ): ChartDataItem[] => {
    if (!data) return [];
    return Object.entries(data).map(([name, value]) => ({
      name: name.toLowerCase(),
      value: parseFloat(value),
    }));
  };

  const transformRepresentativesData = (
    data: Array<Record<string, string>>
  ) => {
    if (!data) return [];
    return data.map((rep) => {
      const name = Object.keys(rep)[0];
      const party = rep[name];
      return { name, party };
    });
  };

  const renderVisualization = () => {
    if (isLoading) {
      return (
        <Center h="400px">
          <Spinner size="xl" color="blue.500" />
        </Center>
      );
    }

    if (error) {
      return (
        <Center h="400px">
          <Box color="red.500">Error loading data: {error}</Box>
        </Center>
      );
    }

    switch (selectedVisualization) {
      case "summary":
        if (!stateSummaryData) return null;

        return (
          <StateSummary
            racialData={transformDataToArray(
              stateSummaryData["racial population"]
            )}
            incomeData={transformDataToArray(
              stateSummaryData["population by income"]
            )}
            voteData={transformDataToArray(
              stateSummaryData["vote distribution"]
            )}
            regionData={transformRegionData(
              stateSummaryData["population percentage by region"]
            )}
            totalPopulation={stateSummaryData.population}
            representatives={transformRepresentativesData(
              stateSummaryData["congressional representatives"]
            )}
          />
        );
      case "districtDetail":
        return (
          <DistrictDetail
            onSelectDistrict={onSelectDistrict}
            selectedState={selectedState}
          />
        );
      case "gingles":
        return <GinglesControl selectedState={selectedState} />;
      case "boxplot":
        return <BoxPlot selectedState={selectedState} />;
      case "ecologicalInference":
        return <EcologicalInference selectedState={selectedState} />;
      default:
        return null;
    }
  };

  return <Box>{renderVisualization()}</Box>;
};

export default BaseChart;
