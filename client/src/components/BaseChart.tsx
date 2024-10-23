import { useEffect, useState } from 'react';
import { 
  Box, 
  Text, 
  VStack, 
  HStack,
  Button, 
  ButtonGroup,
  Select,
} from '@chakra-ui/react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ScatterChart,
  Scatter,
  Line,
  LineChart,
  ZAxis
} from 'recharts';

import { ChartDataItem, VisualizationType } from './ChartDataItemInterface';
import {
	GoodmanRegression,
	KingsEI,
	RxCInference,
	HierarchicalEI
  } from './Visualizations';


interface BaseChartProps {
	selectedState: string;
	dataArray: ChartDataItem[];
	selectedVisualization?: VisualizationType;
  }
  
const BaseChart: React.FC<BaseChartProps> = ({ 
  selectedState, 
  dataArray, 
  selectedVisualization = 'standard' 
}) => {
  const [dataType, setDataType] = useState('Income');
  const [stringArrayPlaceholder, setStringArrayPlaceholder] = useState<string[]>([]);
  const [numberArrayPlaceholder, setNumberArrayPlaceholder] = useState<number[]>([]);
  
  // State for different chart data types
  const [incomeData, setIncomeData] = useState<any>({
    labels: stringArrayPlaceholder,
    datasets: [{
      label: "Household Percentage",
      data: numberArrayPlaceholder,
      backgroundColor: ["#E4EDC4"]
    }]
  });
  
  const [raceData, setRaceData] = useState<any>({
    labels: stringArrayPlaceholder,
    datasets: [{
      label: "Voting Percentage",
      data: numberArrayPlaceholder,
      backgroundColor: ["#F7CFF2"]
    }]
  });
  
  const [ageData, setAgeData] = useState<any>({
    labels: stringArrayPlaceholder,
    datasets: [{
      label: "Voting Percentage",
      data: numberArrayPlaceholder,
      backgroundColor: ["#F8F882"]
    }]
  });

  // Generate placeholder data for ecological inference
  const generatePlaceholderData = (length: number) => 
    Array.from({ length }, (_, i) => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      z: Math.random() * 100,
      name: `Group ${i + 1}`
    }));

  useEffect(() => {
    if (!dataArray.length) return;

    const stateData = dataArray.find(item => 
      item.state === selectedState
    );

    if (!stateData) return;

    // Process Income Data
    let temp_income_labels: string[] = [];
    let temp_income_values: number[] = [];
    stateData.income.forEach(e => {
      temp_income_labels.push(Object.keys(e)[0]);
      temp_income_values.push(Object.values(e)[0]);
    });

    setIncomeData({
      labels: temp_income_labels,
      datasets: [{
        label: "Household Percentage",
        data: temp_income_values,
        backgroundColor: ["#E4EDC4"]
      }]
    });

    // Process Race Data
    let temp_race_labels: string[] = [];
    let temp_race_values: number[] = [];
    stateData.race.forEach(e => {
      temp_race_labels.push(Object.keys(e)[0]);
      temp_race_values.push(Object.values(e)[0]);
    });

    setRaceData({
      labels: temp_race_labels,
      datasets: [{
        label: "Voting Percentage",
        data: temp_race_values,
        backgroundColor: ["#F7CFF2"]
      }]
    });

    // Process Age Data
    let temp_age_labels: string[] = [];
    let temp_age_values: number[] = [];
    stateData.age.forEach(e => {
      temp_age_labels.push(Object.keys(e)[0]);
      temp_age_values.push(Object.values(e)[0]);
    });

    setAgeData({
      labels: temp_age_labels,
      datasets: [{
        label: "Voting Percentage",
        data: temp_age_values,
        backgroundColor: ["#F8F882"]
      }]
    });
  }, [dataArray, selectedState]);

  const renderStandardChart = () => {
    const currentData = (() => {
      switch (dataType) {
        case 'Income':
          return incomeData;
        case 'Race':
          return raceData;
        case 'Age':
          return ageData;
        default:
          return incomeData;
      }
    })();

    return (
      <VStack spacing={4} align="stretch">
        <ButtonGroup pt='5' spacing={4}>
          <Button 
            onClick={() => setDataType('Income')}
            bg={dataType === 'Income' ? "#E4EDC4" : "white"}
            _hover={{ bg: "#F7CFF2" }}
          >
            Income
          </Button>
          <Button 
            onClick={() => setDataType('Race')}
            bg={dataType === 'Race' ? "#F7CFF2" : "white"}
            _hover={{ bg: "#F7CFF2" }}
          >
            Race
          </Button>
          <Button 
            onClick={() => setDataType('Age')}
            bg={dataType === 'Age' ? "#F8F882" : "white"}
            _hover={{ bg: "#F7CFF2" }}
          >
            Age
          </Button>
        </ButtonGroup>
        <Box height="400px">
          <BarChart 
            width={500} 
            height={400} 
            data={currentData.datasets[0].data.map((value: number, index: number) => ({
              name: currentData.labels[index],
              value
            }))}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar 
              dataKey="value" 
              fill={currentData.datasets[0].backgroundColor[0]} 
              name={currentData.datasets[0].label}
            />
          </BarChart>
        </Box>
      </VStack>
    );
  };

  // Ecological Inference Visualizations
  const renderGoodmanRegression = () => (
    <VStack spacing={4} align="stretch" p={4}>
      <HStack justify="space-between">
        <Text fontSize="lg" fontWeight="bold">Goodman's Ecological Regression</Text>
        <Select placeholder="Select Variable" size="sm" width="200px">
          <option>Age vs. Voting</option>
          <option>Race vs. Voting</option>
          <option>Income vs. Voting</option>
        </Select>
      </HStack>
      <ScatterChart width={500} height={400}>
        <CartesianGrid />
        <XAxis type="number" dataKey="x" name="demographic" unit="%" />
        <YAxis type="number" dataKey="y" name="voting" unit="%" />
        <ZAxis type="number" dataKey="z" range={[50, 400]} />
        <Tooltip cursor={{ strokeDasharray: '3 3' }} />
        <Scatter name="Demographics" data={generatePlaceholderData(20)} fill="#F7CFF2" />
      </ScatterChart>
    </VStack>
  );

  const renderKingsEI = () => (
    <VStack spacing={4} align="stretch" p={4}>
      <HStack justify="space-between">
        <Text fontSize="lg" fontWeight="bold">King's Ecological Inference</Text>
        <Select placeholder="Select Analysis" size="sm" width="200px">
          <option>Racial Bloc Voting</option>
          <option>Age Group Analysis</option>
          <option>Income Group Analysis</option>
        </Select>
      </HStack>
      <Box height="400px">
        <LineChart width={500} height={400} data={generatePlaceholderData(10)}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="y" stroke="#E4EDC4" name="Group A" />
          <Line type="monotone" dataKey="z" stroke="#F7CFF2" name="Group B" />
        </LineChart>
      </Box>
    </VStack>
  );

  const renderRxC = () => (
    <VStack spacing={4} align="stretch" p={4}>
      <HStack justify="space-between">
        <Text fontSize="lg" fontWeight="bold">RxC Ecological Inference</Text>
        <HStack spacing={2}>
          <Select placeholder="Rows (R)" size="sm" width="150px">
            <option>Age Groups</option>
            <option>Race Groups</option>
            <option>Income Levels</option>
          </Select>
          <Select placeholder="Columns (C)" size="sm" width="150px">
            <option>Voting Choice</option>
            <option>Party Preference</option>
            <option>Turnout</option>
          </Select>
        </HStack>
      </HStack>
      <Box height="400px">
        <BarChart width={500} height={400} data={generatePlaceholderData(5)}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="y" fill="#E4EDC4" name="Category 1" />
          <Bar dataKey="z" fill="#F7CFF2" name="Category 2" />
        </BarChart>
      </Box>
    </VStack>
  );

  const renderHierarchical = () => (
    <VStack spacing={4} align="stretch" p={4}>
      <HStack justify="space-between">
        <Text fontSize="lg" fontWeight="bold">Hierarchical Ecological Inference</Text>
        <Select placeholder="Select Level" size="sm" width="200px">
          <option>Precinct Level</option>
          <option>District Level</option>
          <option>State Level</option>
        </Select>
      </HStack>
      <Box height="400px">
        <LineChart width={500} height={400} data={generatePlaceholderData(10)}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="x" stroke="#E4EDC4" name="Level 1" />
          <Line type="monotone" dataKey="y" stroke="#F7CFF2" name="Level 2" />
          <Line type="monotone" dataKey="z" stroke="#F8F882" name="Level 3" />
        </LineChart>
      </Box>
    </VStack>
  );

  const renderVisualization = () => {
    switch(selectedVisualization) {
      case 'goodman':
        return <GoodmanRegression />;
      case 'kings':
        return <KingsEI />;
      case 'rxc':
        return <RxCInference />;
      case 'hierarchical':
        return <HierarchicalEI />;
      default:
        return renderStandardChart();
    }
  };

  return (
    <Box>
      {renderVisualization()}
      {selectedState === 'Arkansas' && (
        <Box mt={4} p={4} bg="#FFF0E6" borderRadius="md">
          <Text>Party: {dataArray[0]?.overview.party}</Text>
          <Text>Population: {dataArray[0]?.overview.population}</Text>
          <Text>Voter Turnout: {dataArray[0]?.overview.voterTurnout}%</Text>
          <Text>Republican Votes: {dataArray[0]?.overview.republicanPopularVote}</Text>
          <Text>Democrat Votes: {dataArray[0]?.overview.democratPopularVote}</Text>
          <Text>Median Income: ${dataArray[0]?.overview.medianIncome}</Text>
        </Box>
      )}
      {selectedState === 'New York' && (
        <Box mt={4} p={4} bg="#FFF0E6" borderRadius="md">
          <Text>Party: {dataArray[1]?.overview.party}</Text>
          <Text>Population: {dataArray[1]?.overview.population}</Text>
          <Text>Voter Turnout: {dataArray[1]?.overview.voterTurnout}%</Text>
          <Text>Republican Votes: {dataArray[1]?.overview.republicanPopularVote}</Text>
          <Text>Democrat Votes: {dataArray[1]?.overview.democratPopularVote}</Text>
          <Text>Median Income: ${dataArray[1]?.overview.medianIncome}</Text>
        </Box>
      )}
    </Box>
  );
};

export default BaseChart;