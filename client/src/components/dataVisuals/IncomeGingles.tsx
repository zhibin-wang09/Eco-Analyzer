import React, { useState, useEffect, useMemo } from 'react';
import { Box, VStack, HStack, Text, ButtonGroup, Button, useToast } from '@chakra-ui/react';
import {
  ComposedChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Label,
  Legend,
  Line,
  ResponsiveContainer
} from 'recharts';

type PrecinctData = {
  geoId: string;
  demographicGroupPercentage: number;
  totalPopulation: number;
  averageHouseholdIncome: number;
  normalizedValue: number;
  urbanicity: string;
  electionData: {
    biden_votes: number;
    trump_votes: number;
    other_votes: number;
    total_votes: number;
    biden_ratio: number;
    trump_ratio: number;
  };
};

type UrbanityFilter = 'all' | 'urban' | 'rural' | 'suburban';

interface IncomeGinglesProps {
  selectedState: string;
}
const polynomialRegression = (points: Array<{x: number; y: number}>, degree: number = 3) => {
    // Matrix operations for polynomial regression
    const generateMatrix = (points: Array<{x: number; y: number}>, degree: number) => {
      const matrix = Array(degree + 1).fill(0).map(() => Array(degree + 1).fill(0));
      const vector = Array(degree + 1).fill(0);
  
      points.forEach(point => {
        for (let i = 0; i <= degree; i++) {
          for (let j = 0; j <= degree; j++) {
            matrix[i][j] += Math.pow(point.x, i + j);
          }
          vector[i] += point.y * Math.pow(point.x, i);
        }
      });
  
      return { matrix, vector };
    };
  
    // Gaussian elimination
    const solve = (matrix: number[][], vector: number[]) => {
      const n = vector.length;
      const coefficients = Array(n).fill(0);
      
      for (let i = 0; i < n; i++) {
        // Find pivot
        let maxRow = i;
        for (let j = i + 1; j < n; j++) {
          if (Math.abs(matrix[j][i]) > Math.abs(matrix[maxRow][i])) {
            maxRow = j;
          }
        }
  
        // Swap maximum row with current row
        [matrix[i], matrix[maxRow]] = [matrix[maxRow], matrix[i]];
        [vector[i], vector[maxRow]] = [vector[maxRow], vector[i]];
  
        // Eliminate column
        for (let j = i + 1; j < n; j++) {
          const factor = matrix[j][i] / matrix[i][i];
          vector[j] -= factor * vector[i];
          for (let k = i; k < n; k++) {
            matrix[j][k] -= factor * matrix[i][k];
          }
        }
      }
  
      // Back substitution
      for (let i = n - 1; i >= 0; i--) {
        let sum = 0;
        for (let j = i + 1; j < n; j++) {
          sum += matrix[i][j] * coefficients[j];
        }
        coefficients[i] = (vector[i] - sum) / matrix[i][i];
      }
  
      return coefficients;
    };
  
    const { matrix, vector } = generateMatrix(points, degree);
    const coefficients = solve(matrix, vector);
  
    return (x: number) => {
      return coefficients.reduce((sum, coeff, power) => 
        sum + coeff * Math.pow(x, power), 0);
    };
  };


const IncomeGingles: React.FC<IncomeGinglesProps> = ({ selectedState }) => {
  const [rawData, setRawData] = useState<PrecinctData[]>([]);
  const [urbanityFilter, setUrbanityFilter] = useState<UrbanityFilter>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  useEffect(() => {
    const fetchPrecinctData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const url = new URL('http://localhost:8080/api/graph/gingles');
        url.searchParams.append('state', selectedState.toLowerCase().replace(" ", ""));
        url.searchParams.append('includeIncome', 'true');

        const response = await fetch(url.toString());
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setRawData(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        setError(`Failed to load precinct data: ${errorMessage}`);
        console.error('Error fetching data:', err);
        
        toast({
          title: 'Error fetching data',
          description: errorMessage,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrecinctData();
  }, [selectedState, toast]);

    const processedData = useMemo(() => {
    if (!Array.isArray(rawData) || rawData.length === 0) return null;

    // Filter data based on urbanicity selection
    const filteredData = urbanityFilter === 'all' 
      ? rawData 
      : rawData.filter(precinct => 
          precinct.urbanicity?.toLowerCase() === urbanityFilter
        );

    // Transform data for Democratic vote share
    const democraticPoints = filteredData
      .filter(precinct => 
        precinct?.averageHouseholdIncome != null && 
        precinct?.electionData?.biden_votes != null &&
        precinct.electionData.total_votes > 0
      )
      .map(precinct => ({
        x: precinct.averageHouseholdIncome,
        y: precinct.electionData.biden_ratio * 100,
        party: 'Democratic',
        geoId: precinct.geoId,
        population: precinct.totalPopulation,
        votes: precinct.electionData.biden_votes,
        totalVotes: precinct.electionData.total_votes,
        urbanicity: precinct.urbanicity
      }));

    const republicanPoints = filteredData
      .filter(precinct => 
        precinct?.averageHouseholdIncome != null && 
        precinct?.electionData?.trump_votes != null &&
        precinct.electionData.total_votes > 0
      )
      .map(precinct => ({
        x: precinct.averageHouseholdIncome,
        y: precinct.electionData.trump_ratio * 100,
        party: 'Republican',
        geoId: precinct.geoId,
        population: precinct.totalPopulation,
        votes: precinct.electionData.trump_votes,
        totalVotes: precinct.electionData.total_votes,
        urbanicity: precinct.urbanicity
      }));

    // Calculate trend lines using polynomial regression
    const calculateTrendLine = (points: any[]) => {
      if (points.length === 0) return [];
      
      const xValues = points.map(p => p.x);
      const minX = Math.min(...xValues);
      const maxX = Math.max(...xValues);
      
      // Get regression function
      const regression = polynomialRegression(
        points.map(p => ({ x: p.x, y: p.y })),
        3  // cubic polynomial
      );
      
      // Generate smooth curve points
      const numPoints = 100;
      const step = (maxX - minX) / (numPoints - 1);
      
      return Array.from({ length: numPoints }, (_, i) => {
        const x = minX + i * step;
        const trendValue = regression(x);
        // Clamp values to valid percentage range
        return {
          x,
          trendValue: Math.min(Math.max(trendValue, 0), 100)
        };
      });
    };

    return {
      democratic: democraticPoints,
      republican: republicanPoints,
      demTrend: calculateTrendLine(democraticPoints),
      repTrend: calculateTrendLine(republicanPoints)
    };
  }, [rawData, urbanityFilter]);


  // Custom tooltip component
  const CustomTooltip: React.FC<{ active?: boolean; payload?: any[] }> = ({ active, payload }) => {
    if (!active || !payload || !payload[0]) return null;

    const data = payload[0].payload;
    return (
      <Box bg="white" p={3} border="1px solid" borderColor="gray.200" borderRadius="md" boxShadow="md">
        <Text fontWeight="bold">{`Precinct: ${data.geoId}`}</Text>
        <Text>{`Income: $${data.x.toLocaleString()}`}</Text>
        <Text>{`Vote Share: ${(data.y ?? data.trendValue ?? 0).toFixed(1)}%`}</Text>
        {data.party && (
          <Text color={data.party === 'Democratic' ? '#2E5EAA' : '#AA2E2E'}>
            {`${data.party} Party`}
          </Text>
        )}
        <Text>{`Area Type: ${data.urbanicity || 'Unknown'}`}</Text>
        {data.votes && (
          <Text>{`Votes: ${data.votes.toLocaleString()} / ${data.totalVotes.toLocaleString()}`}</Text>
        )}
      </Box>
    );
  };

  return (
    <VStack spacing={4} w="100%" p={4} bg="white" borderRadius="lg" boxShadow="sm">
      {/* ... (previous JSX remains the same) */}
      <Box w="100%" h="500px" position="relative">
        {isLoading ? (
          <Box position="absolute" top="50%" left="50%" transform="translate(-50%, -50%)">
            <Text fontSize="lg">Loading precinct data...</Text>
          </Box>
        ) : processedData ? (
          <ResponsiveContainer>
            <ComposedChart margin={{ top: 20, right: 30, bottom: 60, left: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis 
                type="number" 
                dataKey="x" 
                domain={['auto', 'auto']}
                tickFormatter={(value) => `$${(value/1000).toFixed(0)}k`}
              >
                <Label 
                  value="Average Household Income" 
                  position="bottom" 
                  offset={20} 
                />
              </XAxis>
              <YAxis 
                type="number" 
                dataKey="y" 
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
              >
                <Label 
                  value="Vote Share (%)" 
                  angle={-90} 
                  position="left" 
                  offset={30} 
                />
              </YAxis>
              <Tooltip content={CustomTooltip} />
              <Legend verticalAlign="bottom" height={36} />

              <Scatter 
                name="Democratic Vote Share"
                data={processedData.democratic} 
                fill="#2E5EAA"
                fillOpacity={0.6}
              />
              <Line
                name="Democratic Trend"
                data={processedData.demTrend}
                type="monotone"
                dataKey="trendValue"
                stroke="#2E5EAA"
                strokeWidth={2}
                dot={false}
                connectNulls
              />

              <Scatter 
                name="Republican Vote Share"
                data={processedData.republican} 
                fill="#AA2E2E"
                fillOpacity={0.6}
              />
              <Line
                name="Republican Trend"
                data={processedData.repTrend}
                type="monotone"
                dataKey="trendValue"
                stroke="#AA2E2E"
                strokeWidth={2}
                dot={false}
                connectNulls
              />
            </ComposedChart>
          </ResponsiveContainer>
        ) : null}
      </Box>

      <ButtonGroup variant="outline" spacing={4}>
        <Button
          onClick={() => setUrbanityFilter('all')}
          colorScheme={urbanityFilter === 'all' ? 'blue' : 'gray'}
        >
          All Areas
        </Button>
        <Button
          onClick={() => setUrbanityFilter('urban')}
          colorScheme={urbanityFilter === 'urban' ? 'blue' : 'gray'}
        >
          Urban
        </Button>
        <Button
          onClick={() => setUrbanityFilter('suburban')}
          colorScheme={urbanityFilter === 'suburban' ? 'blue' : 'gray'}
        >
          Suburban
        </Button>
        <Button
          onClick={() => setUrbanityFilter('rural')}
          colorScheme={urbanityFilter === 'rural' ? 'blue' : 'gray'}
        >
          Rural
        </Button>
      </ButtonGroup>
    </VStack>
  );
};

export default IncomeGingles;