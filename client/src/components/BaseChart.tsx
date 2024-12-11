import React from 'react';
import { Box } from '@chakra-ui/react';
import Gingles from './Gingles';
import StateOverviewChart from './StateOverviewChart'; // Import the new component
import { VisualizationType } from './ChartDataItemInterface';
import { 
  GoodmanRegression,
  RxCInference,
  HierarchicalEI,
} from './Visualizations';
import IncomeGingles from './IncomeGingles';
import NormalizedGingles from './NormalizedGingles';

interface BaseChartProps {
  selectedState: string;
  selectedVisualization?: VisualizationType;
}

const BaseChart: React.FC<BaseChartProps> = ({
  selectedState,
  selectedVisualization = 'overview', // Default to 'overview'
}) => {

  const renderVisualization = () => {
    switch (selectedVisualization) {
      case 'gingles':
        return <Gingles selectedState={selectedState} />;
      case 'overview': 
        return <StateOverviewChart />;
      case 'goodman':
        return <GoodmanRegression />;
      case 'income':
        return <IncomeGingles selectedState={selectedState} />;
      case 'normalizedgingles':
        return <NormalizedGingles selectedState={selectedState} />;
      case 'hierarchical':
        return <HierarchicalEI />;
      
      default:
        return <StateOverviewChart/>; // Fallback to overview
    }
  };


  return <Box>{renderVisualization()}</Box>;
};

export default BaseChart;
