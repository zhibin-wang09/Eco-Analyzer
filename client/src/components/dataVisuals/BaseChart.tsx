import React from "react";
import { Box } from "@chakra-ui/react";
import Gingles from "./gingles/Gingles";
import StateOverviewChart from "./StateOverviewChart"; // Import the new component
import { VisualizationType } from "../../types/ChartDataItemInterface";
import IncomeGingles from "./gingles/IncomeGingles";
import NormalizedGingles from "./gingles/NormalizedGingles";
import StateSummary from "./StateSummary";
import DistrictDetail from "./DistrictDetail";
import GinglesControl from "../controls/GinglesControl";
import BoxPlot from "./Boxplot";

interface BaseChartProps {
  selectedState: string;
  selectedVisualization?: VisualizationType;
  onSelectDistrict: (district: number | null) => void;
}

const BaseChart: React.FC<BaseChartProps> = ({
  selectedState,
  selectedVisualization = "summary", // Default to 'overview'
  onSelectDistrict
}) => {
  const renderVisualization = () => {
    switch (selectedVisualization) {
      case "summary":
        return <StateSummary selectedState={selectedState} />;
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
        return <></>;
    }
  };

  return <Box>{renderVisualization()}</Box>;
};

export default BaseChart;
