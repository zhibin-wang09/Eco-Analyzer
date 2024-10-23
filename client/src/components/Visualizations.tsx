import React from 'react';
import { 
  Box, 
  VStack, 
  HStack, 
  Text, 
  Select,
  useColorModeValue,
} from '@chakra-ui/react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ScatterChart,
  Scatter,
  BarChart,
  Bar,
  ResponsiveContainer
} from 'recharts';

// Placeholder data generators
const generateScatterData = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    z: Math.random() * 20 + 10,
    name: `Point ${i + 1}`,
  }));
};

const generateTimeSeriesData = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    name: `Group ${i + 1}`,
    value1: Math.random() * 100,
    value2: Math.random() * 100,
  }));
};

export const GoodmanRegression: React.FC = () => {
  const scatterData = generateScatterData(20);
  
  return (
    <VStack spacing={4} w="100%" p={4} bg="white" borderRadius="lg">
      <HStack justify="space-between" w="100%">
        <Text fontSize="xl" fontWeight="bold">Goodman's Regression Analysis</Text>
        <Select placeholder="Select Demographic" w="200px" bg="#FFF0E6">
          <option>Age Groups</option>
          <option>Race Groups</option>
          <option>Income Levels</option>
        </Select>
      </HStack>
      <Box w="100%" h="400px">
        <ResponsiveContainer>
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E4EDC4" />
            <XAxis 
              type="number" 
              dataKey="x" 
              name="demographic" 
              label={{ value: 'Demographic %', position: 'bottom' }}
            />
            <YAxis 
              type="number" 
              dataKey="y" 
              name="voting" 
              label={{ value: 'Voting %', angle: -90, position: 'left' }}
            />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
            <Scatter name="Data Points" data={scatterData} fill="#F7CFF2" />
          </ScatterChart>
        </ResponsiveContainer>
      </Box>
      <Text fontSize="sm" color="gray.600">
        Scatter plot showing relationship between demographic composition and voting patterns
      </Text>
    </VStack>
  );
};

export const KingsEI: React.FC = () => {
  const timeSeriesData = generateTimeSeriesData(10);

  return (
    <VStack spacing={4} w="100%" p={4} bg="white" borderRadius="lg">
      <HStack justify="space-between" w="100%">
        <Text fontSize="xl" fontWeight="bold">King's Ecological Inference</Text>
        <Select placeholder="Select Analysis" w="200px" bg="#FFF0E6">
          <option>Racial Bloc Analysis</option>
          <option>Age Group Analysis</option>
          <option>Income Level Analysis</option>
        </Select>
      </HStack>
      <Box w="100%" h="400px">
        <ResponsiveContainer>
          <LineChart data={timeSeriesData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E4EDC4" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="value1" 
              stroke="#F7CFF2" 
              name="Group A" 
              strokeWidth={2}
            />
            <Line 
              type="monotone" 
              dataKey="value2" 
              stroke="#E4EDC4" 
              name="Group B" 
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
      <Text fontSize="sm" color="gray.600">
        Time series showing voting patterns across different demographic groups
      </Text>
    </VStack>
  );
};

export const RxCInference: React.FC = () => {
  const barData = generateTimeSeriesData(5);

  return (
    <VStack spacing={4} w="100%" p={4} bg="white" borderRadius="lg">
      <HStack justify="space-between" w="100%">
        <Text fontSize="xl" fontWeight="bold">RxC Ecological Inference</Text>
        <HStack spacing={2}>
          <Select placeholder="Row Variable" w="150px" bg="#FFF0E6">
            <option>Age</option>
            <option>Race</option>
            <option>Income</option>
          </Select>
          <Select placeholder="Column Variable" w="150px" bg="#FFF0E6">
            <option>Party Choice</option>
            <option>Turnout</option>
          </Select>
        </HStack>
      </HStack>
      <Box w="100%" h="400px">
        <ResponsiveContainer>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E4EDC4" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value1" fill="#F7CFF2" name="Category A" />
            <Bar dataKey="value2" fill="#E4EDC4" name="Category B" />
          </BarChart>
        </ResponsiveContainer>
      </Box>
      <Text fontSize="sm" color="gray.600">
        Bar chart showing voting patterns across demographic intersections
      </Text>
    </VStack>
  );
};

export const HierarchicalEI: React.FC = () => {
  const hierarchicalData = generateTimeSeriesData(8);

  return (
    <VStack spacing={4} w="100%" p={4} bg="white" borderRadius="lg">
      <HStack justify="space-between" w="100%">
        <Text fontSize="xl" fontWeight="bold">Hierarchical Ecological Inference</Text>
        <Select placeholder="Select Level" w="200px" bg="#FFF0E6">
          <option>Precinct Level</option>
          <option>District Level</option>
          <option>State Level</option>
        </Select>
      </HStack>
      <Box w="100%" h="400px">
        <ResponsiveContainer>
          <LineChart data={hierarchicalData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E4EDC4" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="value1" 
              stroke="#F7CFF2" 
              name="Level 1" 
              strokeWidth={2}
            />
            <Line 
              type="monotone" 
              dataKey="value2" 
              stroke="#E4EDC4" 
              name="Level 2" 
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
      <Text fontSize="sm" color="gray.600">
        Multi-level analysis of voting patterns with geographic hierarchies
      </Text>
    </VStack>
  );
};