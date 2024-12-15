// StateOverviewChart.tsx
import React from 'react';
import { Box, Text, useColorModeValue } from '@chakra-ui/react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Label,
  ResponsiveContainer,
  Cell
} from 'recharts';

const COLORS = [
  '#2E5EAA', '#FF6B6B', '#4CAF50', '#FFA726',
  '#9575CD', '#4DB6AC', '#FFD54F', '#7986CB'
];

interface ChartDataItem {
  name: string;
  value: number;
}

const StateOverviewChart = ({
  data,
  title,
  xAxisLabel,
  height,
  yaxis
}: {
  data: ChartDataItem[];
  title: string;
  xAxisLabel: string;
  height: string;
  yaxis: string;
}) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.100', 'gray.700');

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;

    return (
      <Box
        bg={bgColor}
        p={3}
        borderRadius="md"
        boxShadow="lg"
        border="1px"
        borderColor={borderColor}
      >
        <Text fontWeight="semibold">{label}</Text>
        <Text fontSize="sm">
          {yaxis}: {payload[0].value.toLocaleString()}
        </Text>
      </Box>
    );
  };

  return (
    <Box
      bg={bgColor}
      p={4}
      borderRadius="xl"
      boxShadow="sm"
      border="1px"
      borderColor={borderColor}
      height="350px "  // Fixed height that works well with the layout
      transition="transform 0.2s"
      _hover={{ transform: 'translateY(-2px)', boxShadow: 'md' }}
    >
      <Text
        fontSize="lg"
        fontWeight="semibold"
        mb={3}
        textAlign="center"
        color="gray.700"
      >
        {title}
      </Text>
      <Box height="calc(100% - 35px)">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 45, bottom: 45, left: 45 }}  // Adjusted margins
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" opacity={0.5} />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12, fill: '#4A5568' }}
              tickLine={{ stroke: '#4A5568' }}
              height={60}  // Increased height for better label visibility
            >
              <Label
                value={xAxisLabel}
                position="bottom"
                offset={-39}
                style={{ fontSize: '13px', fill: '#4A5568' }}
              />
            </XAxis>
            <YAxis
              tick={{ fontSize: 12, fill: '#4A5568' }}
              tickLine={{ stroke: '#4A5568' }}
              width={70}  // Increased width for better number visibility
              tickFormatter={(value) => value.toLocaleString()}  // Format large numbers
            >
              <Label
                value={yaxis}
                angle={-90}
                position="insideLeft"
                offset={-15}
                style={{ fontSize: '13px', fill: '#4A5568' }}
              />
            </YAxis>
            <Tooltip content={CustomTooltip} />
            <Bar
              dataKey="value"
              fill={COLORS[0]}
              radius={[4, 4, 0, 0]}
              maxBarSize={65}  // Slightly wider bars
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

export default StateOverviewChart;