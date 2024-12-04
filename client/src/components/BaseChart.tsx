import { Box } from '@chakra-ui/react';
import { VisualizationType } from './ChartDataItemInterface';
import Gingles from './Gingles';
import { 
  GoodmanRegression,
  RxCInference,
  HierarchicalEI,
} from './Visualizations';
import IncomeGingles from './IncomeGingles';
import NormalizedGingles from './NormalizedGingles';

// Define the props interface for BaseChart component
interface BaseChartProps {
  selectedState: string;
  selectedVisualization?: VisualizationType;
}

const BaseChart: React.FC<BaseChartProps> = ({ 
  selectedState, 
  selectedVisualization = 'gingles'
}) => {
  const renderVisualization = () => {
    if (selectedVisualization === 'gingles') {
      return <Gingles selectedState={selectedState} />;
    }

    // Then handle other visualization types
    switch(selectedVisualization) {
      case 'goodman':
        return <GoodmanRegression />;
      case 'income':
        return <IncomeGingles selectedState={selectedState} />;
      case 'normalizedgingles':
        return <NormalizedGingles selectedState={selectedState} />;
      case 'hierarchical':
        return <HierarchicalEI />;
      default:
        return <Gingles selectedState={selectedState} />; // Fallback to Gingles if no valid selection
    }
  };

  return (
    <Box>
      {renderVisualization()}
    </Box>
  );
};

export default BaseChart;