import React from "react";
import { Box } from "@chakra-ui/react";
import Gingles from "./Gingles";
import StateOverviewChart from "./StateOverviewChart"; // Import the new component
import { VisualizationType } from "../../types/ChartDataItemInterface";
import { GoodmanRegression, HierarchicalEI } from "./Visualizations";
import IncomeGingles from "./IncomeGingles";
import NormalizedGingles from "./NormalizedGingles";
import StateSummary from "./StateSummary";
import DistrictDetail from "./DistrictDetail";

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
        return <Gingles selectedState={selectedState} />;
      case "goodman":
        return <GoodmanRegression />;
      case "income":
        return <IncomeGingles selectedState={selectedState} />;
      case "normalizedgingles":
        return <NormalizedGingles selectedState={selectedState} />;
      case "hierarchical":
        return <HierarchicalEI />;
    }
  };

  return <Box>{renderVisualization()}</Box>;
};

export default BaseChart;
