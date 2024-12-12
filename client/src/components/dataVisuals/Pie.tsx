import React from 'react';
import { Box, Text } from '@chakra-ui/react';
import { PieChart as Chart , Pie, Cell, Legend, ResponsiveContainer, Tooltip } from 'recharts';

const data = [
  { name: 'White', value: 65 },
  { name: 'Black', value: 15 },
  { name: 'Hispanic', value: 12 },
  { name: 'Asian', value: 6 },
  { name: 'Other', value: 2 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

interface PieChartProp{
  data: {name: string, value: number}[],
  title: string
}

const PieChart = ({data, title}: PieChartProp) => {
  return (
    <Box bg="white" p={2} borderRadius="lg" boxShadow="sm" mt={2}>
      <Text fontSize="sm" fontWeight="bold" mb={1} textAlign="center">
        {title}
      </Text>
      <Box height="180px">
        <ResponsiveContainer width="100%" height="100%">
          <Chart margin={{ top: 30, right: 10, bottom: 20, left: 10 }}>
            <Pie
              data={data}
              cx="50%"
              cy="45%"
              labelLine={false}
              label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
              outerRadius={45}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => `${value}%`}
              contentStyle={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #ccc', zIndex: '1'}}
            />
            <Legend 
              layout="horizontal" 
              align="center"
              verticalAlign="bottom"
              height={24}
              iconSize={8}
              fontSize={12}
            />
          </Chart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

export default PieChart;