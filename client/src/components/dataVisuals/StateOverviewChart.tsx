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


type TooltipContentProps = {
  active?: boolean;
  payload?: any[];
  label?: string;
};

interface StateOverviewChartProp{
  data: {name: string, value: number}[],
  title: string,
  xAxisLabel: string
}

const StateOverviewChart = ({data, title, xAxisLabel}: StateOverviewChartProp) => {
  const CustomTooltip: React.FC<TooltipContentProps> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Box bg="white" p={2} border="1px solid" borderColor="gray.200" borderRadius="md">
          <Text fontWeight="bold">{label}</Text>
          {payload.map((entry) => (
            <Text key={entry.name} color={entry.name === 'democratic' ? 'blue.500' : 'red.500'}>
              {'Population'}: {entry.value.toLocaleString()}
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
          {title}
        </Text>
        <Box flex={1} minH="400px">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, bottom: 40, left: 40 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={0}
                tick={{ fontSize: 12 }}
                label={{ value: xAxisLabel, position: 'bottom', offset: 20 }}
              />
              <YAxis label={chartConfig.yAxisLabel} />
              <Tooltip content={CustomTooltip} />
              <Legend 
                verticalAlign="top" 
                align="right"
                height={36}
                wrapperStyle={{ paddingRight: 5 }}
              />
              <Bar dataKey="value" name="population" fill="#2E5EAA" />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Box>
    </HStack>
  );
};

export default StateOverviewChart;