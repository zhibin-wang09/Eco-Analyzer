import React, { useState, useEffect, useMemo } from 'react';
import { Box, VStack, HStack, Text, Select, ButtonGroup, Button } from '@chakra-ui/react';
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

// Define available demographic categories
type DemographicKey = 'hispanic' | 'white' | 'black' | 'asian';
type UrbanityFilter = 'all' | 'urban' | 'rural' | 'suburban';

// Define the structure of precinct data
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
    party: string;
  };
};

interface GinglesProps {
  selectedState: string;
}

const Gingles: React.FC<GinglesProps> = ({ selectedState }) => {
  const [selectedDemographic, setSelectedDemographic] = useState<DemographicKey>('white');
  const [urbanityFilter, setUrbanityFilter] = useState<UrbanityFilter>('all');
  const [rawData, setRawData] = useState<PrecinctData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Define demographic options with official Census terminology and descriptions
  const demographicOptions: Record<DemographicKey, { name: string; description: string }> = {
    hispanic: { 
      name: 'Hispanic or Latino',
      description: 'Persons of Hispanic or Latino origin (of any race)'
    },
    white: { 
      name: 'White',
      description: 'Persons identifying as White alone'
    },
    black: { 
      name: 'Black',
      description: 'Persons identifying as Black or African American alone'
    },
    asian: { 
      name: 'Asian',
      description: 'Persons identifying as Asian alone'
    }
  };

  useEffect(() => {
    const fetchPrecinctData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const url = new URL('http://localhost:8080/api/graph/gingles');
        url.searchParams.append('state', selectedState.toLowerCase().replace(" ", ""));
        url.searchParams.append('demographicGroup', selectedDemographic);
        url.searchParams.append('includeIncome', 'false');

        const response = await fetch(url.toString());
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Received data:', data[0]); // Debug log
        setRawData(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        setError(`Failed to load precinct data: ${errorMessage}`);
        console.error('Error fetching data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (selectedState !== 'State') {
      fetchPrecinctData();
    }
  }, [selectedState, selectedDemographic]);

  const regression = (points: Array<{x: number; y: number}>, degree: number = 3) => {
    // Skip if not enough points
    if (points.length < degree + 1) return null;

    // Create matrices for the linear system
    const matrix: number[][] = [];
    const vector: number[] = [];
    
    // Fill the matrices based on the polynomial degree
    for (let i = 0; i <= degree; i++) {
      matrix[i] = [];
      for (let j = 0; j <= degree; j++) {
        let sum = 0;
        for (const point of points) {
          sum += Math.pow(point.x, i + j);
        }
        matrix[i][j] = sum;
      }
      
      let sum = 0;
      for (const point of points) {
        sum += point.y * Math.pow(point.x, i);
      }
      vector[i] = sum;
    }

    // Solve using Gaussian elimination
    for (let i = 0; i < degree + 1; i++) {
      // Find pivot
      let maxRow = i;
      for (let j = i + 1; j < degree + 1; j++) {
        if (Math.abs(matrix[j][i]) > Math.abs(matrix[maxRow][i])) {
          maxRow = j;
        }
      }

      // Swap rows if needed
      [matrix[i], matrix[maxRow]] = [matrix[maxRow], matrix[i]];
      [vector[i], vector[maxRow]] = [vector[maxRow], vector[i]];

      // Eliminate column
      for (let j = i + 1; j < degree + 1; j++) {
        const factor = matrix[j][i] / matrix[i][i];
        for (let k = i; k < degree + 1; k++) {
          matrix[j][k] -= factor * matrix[i][k];
        }
        vector[j] -= factor * vector[i];
      }
    }

    // Back substitution
    const coefficients = new Array(degree + 1).fill(0);
    for (let i = degree; i >= 0; i--) {
      let sum = vector[i];
      for (let j = i + 1; j < degree + 1; j++) {
        sum -= matrix[i][j] * coefficients[j];
      }
      coefficients[i] = sum / matrix[i][i];
    }

    return coefficients;
  };

  const processedData = useMemo(() => {
    if (!Array.isArray(rawData) || rawData.length === 0) return null;

    // Filter by urbanicity first
    const filteredData = urbanityFilter === 'all' 
      ? rawData 
      : rawData.filter(precinct => 
          precinct.urbanicity?.toLowerCase() === urbanityFilter.toLowerCase()
        );

    // Transform data for Democratic vote share
    const democraticPoints = filteredData
      .filter(precinct => 
        typeof precinct.demographicGroupPercentage === 'number' && 
        precinct.electionData?.biden_ratio != null &&
        precinct.electionData.total_votes > 0
      )
      .map(precinct => ({
        x: precinct.demographicGroupPercentage * 100,
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
        typeof precinct.demographicGroupPercentage === 'number' && 
        precinct.electionData?.trump_ratio != null &&
        precinct.electionData.total_votes > 0
      )
      .map(precinct => ({
        x: precinct.demographicGroupPercentage * 100,
        y: precinct.electionData.trump_ratio * 100,
        party: 'Republican',
        geoId: precinct.geoId,
        population: precinct.totalPopulation,
        votes: precinct.electionData.trump_votes,
        totalVotes: precinct.electionData.total_votes,
        urbanicity: precinct.urbanicity
      }));

    // Calculate trend lines using  regression
    const calculateTrendLine = (points: any[]) => {
      if (points.length < 4) return []; // Need at least 4 points for  regression
      
      const coefficients = regression(points, 3);
      if (!coefficients) return [];

      // Generate points for the trend line
      const xValues = points.map(p => p.x);
      const minX = Math.min(...xValues);
      const maxX = Math.max(...xValues);
      const numPoints = 100;
      const step = (maxX - minX) / (numPoints - 1);
      
      return Array.from({ length: numPoints }, (_, i) => {
        const x = minX + i * step;
        // Calculate y using polynomial equation
        const y = coefficients.reduce((sum, coeff, power) => 
          sum + coeff * Math.pow(x, power), 0);
        // Clamp y values to valid percentage range [0, 100]
        const trendValue = Math.min(Math.max(y, 0), 100);
        return { x, trendValue };
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
        <Text>{`${demographicOptions[selectedDemographic].name} Population: ${data.x.toFixed(1)}%`}</Text>
        <Text>{`Vote Share: ${(data.y ?? data.trendValue ?? 0).toFixed(1)}%`}</Text>
        {data.party && (
          <Text color={data.party === 'Democratic' ? '#2E5EAA' : '#AA2E2E'}>
            {`${data.party} Party`}
          </Text>
        )}
        <Text>{`Area Type: ${data.urbanicity || 'Unknown'}`}</Text>
        <Text>{`Total Population: ${data.population?.toLocaleString() ?? 'N/A'}`}</Text>
        {data.votes && (
          <Text>{`Votes: ${data.votes.toLocaleString()} / ${data.totalVotes.toLocaleString()}`}</Text>
        )}
      </Box>
    );
  };

  return (
    <VStack spacing={4} w="100%" p={4} bg="white" borderRadius="lg" boxShadow="sm">
      <HStack justify="space-between" w="100%" align="center">
        <Text fontSize="xl" fontWeight="bold">
          {selectedState.toUpperCase()} Precinct-Level Election Results
        </Text>
        <Select 
          value={selectedDemographic} 
          onChange={(e) => setSelectedDemographic(e.target.value as DemographicKey)}
          bg="blue.50"
          w="250px"
          isDisabled={isLoading}
        >
          {Object.entries(demographicOptions).map(([key, value]) => (
            <option key={key} value={key} title={value.description}>
              {value.name}
            </option>
          ))}
        </Select>
      </HStack>

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
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
              >
                <Label 
                  value={`${demographicOptions[selectedDemographic].name} Population Percentage`} 
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

      <Box p={4} bg="blue.50" borderRadius="md" w="100%">
        <Text fontWeight="bold" mb={2}>Visualization Analysis:</Text>
        <Text>
          This chart shows the relationship between {demographicOptions[selectedDemographic].name.toLowerCase()} 
          population percentage and voting patterns across precincts in {selectedState.toUpperCase()}. 
          {selectedDemographic === 'hispanic' && 
            " Note that Hispanic/Latino identification is considered an ethnicity and can overlap with any racial category."} 
          The trend lines use weighted regression that considers both precinct population and voter turnout, 
          providing a more accurate representation of voting patterns. 
          Data can be filtered by area type (urban, suburban, or rural) to explore geographic patterns.
        </Text>
      </Box>
    </VStack>
  );
};

export default Gingles;