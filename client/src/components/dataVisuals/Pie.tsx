import React from 'react';
import { Box, Text, useColorModeValue } from '@chakra-ui/react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

const COLORS = [
  '#2E5EAA', // Primary blue
  '#FF6B6B', // Coral
  '#4CAF50', // Green
  '#FFA726', // Orange
  '#9575CD', // Purple
  '#4DB6AC', // Teal
  '#FFD54F', // Amber
  '#7986CB'  // Indigo
];

interface ChartDataItem {
  name: string;
  value: number;
}

const PieChartComponent = ({ data, title }: { data: ChartDataItem[], title: string }) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.100', 'gray.700');
  
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const processedData = data.map(item => ({
    ...item,
    percent: total > 0 ? item.value / total : 0
  }));

  const formatLabel = (name: string) => {
    return name.split(' ').map(word => {
      if (word.toLowerCase() === 'suburban' || word.toLowerCase() === 'urban' || word.toLowerCase() === 'rural') {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      }
      return word;
    }).join(' ');
  };

  const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }: any) => {
    if (!percent || percent < 0.02) return null;
    
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 1.1;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
    const formattedName = formatLabel(name);
    const formattedPercent = (percent * 100).toFixed(1);
    const textAnchor = x > cx ? 'start' : 'end';
    
    return (
      <text
        x={x}
        y={y}
        fill="#4A5568"
        textAnchor={textAnchor}
        fontSize="11px"
        dominantBaseline="central"
      >
        {`${formattedName}: ${formattedPercent}%`}
      </text>
    );
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    
    const formattedName = formatLabel(payload[0].name);
    return (
      <Box
        bg={bgColor}
        p={2}
        borderRadius="md"
        boxShadow="lg"
        border="1px"
        borderColor={borderColor}
      >
        <Text fontWeight="semibold">{formattedName}</Text>
        <Text fontSize="sm">
          Count: {payload[0].value.toLocaleString()}
        </Text>
        <Text fontSize="sm" color="gray.600">
          Percentage: {(payload[0].payload.percent * 100).toFixed(1)}%
        </Text>
      </Box>
    );
  };

  if (!data.length) {
    return (
      <Box
        bg={bgColor}
        p={4}
        borderRadius="xl"
        boxShadow="sm"
        border="1px"
        borderColor={borderColor}
        height="300px"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Text color="gray.500">No data available</Text>
      </Box>
    );
  }

  return (
    <Box height="100%" width="100%">
      <Text
        fontSize="sm"
        fontWeight="semibold"
        textAlign="center"
        color="gray.700"
        mb={2}
      >
        {title}
      </Text>
      <Box height="calc(100% - 30px)">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={CustomLabel}
              outerRadius="85%"
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  stroke={bgColor}
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip content={CustomTooltip} />
            <Legend 
              verticalAlign="bottom" 
              align="center"
              layout="horizontal"
              height={30}  // Reduced from 36
              iconSize={8}  // Added smaller icon size
              formatter={(value) => <span style={{ fontSize: '13px' }}>{value}</span>}  // Added smaller text
              wrapperStyle={{ fontSize: '10px' }}  // Added for consistent sizing
            />
          </PieChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

export default PieChartComponent;