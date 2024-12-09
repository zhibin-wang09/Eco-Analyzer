import React from 'react';
import { Box, Text, HStack, Divider } from '@chakra-ui/react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps,
} from 'recharts';

// Sample data - replace with actual data from your backend
const incomeData = [
  { income: '0-25k', democratic: 2500, republican: 1800 },
  { income: '25k-50k', democratic: 3500, republican: 3200 },
  { income: '50k-75k', democratic: 4200, republican: 4800 },
  { income: '75k-100k', democratic: 3800, republican: 4500 },
  { income: '100k+', democratic: 3200, republican: 4200 },
];

const raceData = [
  { race: 'White', democratic: 5500, republican: 7200 },
  { race: 'Black', democratic: 4200, republican: 1800 },
  { race: 'Hispanic', democratic: 3800, republican: 2500 },
  { race: 'Asian', democratic: 2200, republican: 1500 },
  { race: 'Other', democratic: 1200, republican: 800 },
];

type TooltipContentProps = {
  active?: boolean;
  payload?: any[];
  label?: string;
};

const StateOverviewChart = () => {
  const CustomTooltip: React.FC<TooltipContentProps> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Box bg="white" p={2} border="1px solid" borderColor="gray.200" borderRadius="md">
          <Text fontWeight="bold">{label}</Text>
          {payload.map((entry) => (
            <Text key={entry.name} color={entry.name === 'democratic' ? 'blue.500' : 'red.500'}>
              {entry.name === 'democratic' ? 'Democratic' : 'Republican'}: {entry.value.toLocaleString()}
            </Text>
          ))}
        </Box>
      );
    }
    return null;
  };

  const chartConfig = {
    yAxisLabel: {
      value: 'Population',
      angle: -90,
      position: 'insideLeft',
      offset: -30,
      dy: 30
    }
  };

  return (
    <HStack spacing={4} align="stretch" p={4} bg="white" borderRadius="lg" boxShadow="sm">
      {/* Income Distribution Chart */}
      <Box flex={1} display="flex" flexDirection="column">
        <Text fontSize="lg" fontWeight="bold" mb={4} textAlign="center" pl={8}>
          Voter Distribution by Income
        </Text>
        <Box flex={1} minH="400px">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={incomeData} margin={{ top: 20, right: 30, bottom: 40, left: 40 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="income" 
                angle={0}
                tick={{ fontSize: 12 }}
                label={{ value: 'Income Range', position: 'bottom', offset: 20 }}
              />
              <YAxis label={chartConfig.yAxisLabel} />
              <Tooltip content={CustomTooltip} />
              <Legend 
                verticalAlign="top" 
                align="right"
                height={36}
                wrapperStyle={{ paddingRight: 5 }}
              />
              <Bar dataKey="democratic" name="Democratic" fill="#2E5EAA" />
              <Bar dataKey="republican" name="Republican" fill="#AA2E2E" />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Box>

      <Divider orientation="vertical" />

      {/* Race Distribution Chart */}
      <Box flex={1} display="flex" flexDirection="column">
        <Text fontSize="lg" fontWeight="bold" mb={4} textAlign="center" pl={8}>
          Voter Distribution by Race
        </Text>
        <Box flex={1} minH="400px">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={raceData} margin={{ top: 20, right: 30, bottom: 40, left: 40 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="race" 
                angle={0}
                tick={{ fontSize: 12 }}
                label={{ value: 'Race', position: 'bottom', offset: 20 }}
              />
              <YAxis label={chartConfig.yAxisLabel} />
              <Tooltip content={CustomTooltip} />
              <Legend 
                verticalAlign="top" 
                align="right"
                height={36}
                wrapperStyle={{ paddingRight: 5 }}
              />
              <Bar dataKey="democratic" name="Democratic" fill="#2E5EAA" />
              <Bar dataKey="republican" name="Republican" fill="#AA2E2E" />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Box>
    </HStack>
  );
};

export default StateOverviewChart;