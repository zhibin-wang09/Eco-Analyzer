import React, { useState, useEffect, useMemo } from 'react';
import { Box, VStack, HStack, Text, Select, ButtonGroup, Button, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';
import { ChevronDownIcon } from "@chakra-ui/icons";
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
import { stateConversion } from '../../../utils/util';
import { JSX } from 'react/jsx-runtime';

// Define available categories and types
type DemographicKey = 'hispanic' | 'white' | 'black' | 'asian' | 'other';
type UrbanityFilter = 'all' | 'urban' | 'rural' | 'suburban';
type DataMode = 'Demographic' | 'Income' | 'Income/Race';

// Define the structure of precinct data
type PrecinctData = {
  geoId: string;
  demographicGroupPercentage?: number;
  totalPopulation: number;
  averageHouseholdIncome?: number;
  normalizedValue?: number;
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

type CustomPointProps = {
  cx?: number;
  cy?: number;
  fill?: string;
  fillOpacity?: number;
  payload?: any;
  key?: string | number;
};

interface GinglesProps {
  selectedState: string;
}

const CustomPoint = ({
  cx,
  cy,
  fill,
  fillOpacity,
}: CustomPointProps) => {
  if (typeof cx !== 'number' || typeof cy !== 'number') return null;
  
  return (
    <circle 
      cx={cx} 
      cy={cy} 
      r={2} 
      fill={fill}
      fillOpacity={fillOpacity}
      style={{ pointerEvents: 'all' }}
    />
  );
};

const Gingles: React.FC<GinglesProps> = ({ selectedState }) => {
  const [selectedDemographic, setSelectedDemographic] = useState<DemographicKey>('white');
  const [urbanityFilter, setUrbanityFilter] = useState<UrbanityFilter>('all');
  const [dataMode, setDataMode] = useState<DataMode>('Demographic');
  const [rawData, setRawData] = useState<PrecinctData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    },
    other: {
      name: 'Other',
      description: 'Any other race'
    }
  };

  useEffect(() => {
    const fetchPrecinctData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const url = new URL('http://localhost:8080/api/graph/gingles');
        url.searchParams.append('state', stateConversion(selectedState));
        url.searchParams.append('demographicGroup', selectedDemographic);
        url.searchParams.append('includeIncome', String(dataMode !== 'Demographic'));

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
      } finally {
        setIsLoading(false);
      }
    };

    if (selectedState !== 'State') {
      fetchPrecinctData();
    }
  }, [selectedState, selectedDemographic, dataMode]);

  const processedData = useMemo(() => {
    if (!Array.isArray(rawData) || rawData.length === 0) return null;
  
    // Filter by urbanicity first
    const filteredData = urbanityFilter === 'all' 
      ? rawData 
      : rawData.filter(precinct => 
          precinct.urbanicity?.toLowerCase() === urbanityFilter.toLowerCase()
        );
  
    // Helper function to detect outlier points
    const isOutlierPoint = (points: any[], point: any) => {
      const THRESHOLD = 0.1;
      const similarPoints = points.filter(p => 
        Math.abs(p.electionData.biden_ratio - point.electionData.biden_ratio) < THRESHOLD/100 ||
        Math.abs(p.electionData.trump_ratio - point.electionData.trump_ratio) < THRESHOLD/100
      );
      return similarPoints.length > 50;
    };

    // Get x-axis value based on data mode
    const getXValue = (precinct: PrecinctData) => {
      switch (dataMode) {
        case 'Income':
          return precinct.averageHouseholdIncome || 0;
        case 'Income/Race':
          return precinct.normalizedValue || 0;
        default:
          return (precinct.demographicGroupPercentage || 0) * 100;
      }
    };

    // Transform data for Democratic vote share
    const democraticPoints = filteredData
      .filter(precinct => {
        const xValue = getXValue(precinct);
        return typeof xValue === 'number' && 
          precinct.electionData?.biden_ratio != null &&
          precinct.electionData.total_votes > 0 &&
          !isOutlierPoint(filteredData, precinct);
      })
      .map(precinct => ({
        x: getXValue(precinct),
        y: precinct.electionData.biden_ratio * 100,
        party: 'Democratic',
        precinctId: precinct.geoId,
        population: precinct.totalPopulation,
        votes: precinct.electionData.biden_votes,
        totalVotes: precinct.electionData.total_votes,
        urbanicity: precinct.urbanicity,
        demographicName: dataMode === 'Demographic' ? demographicOptions[selectedDemographic].name : undefined,
        income: precinct.averageHouseholdIncome,
        isDataPoint: true
      }));
  
    // Transform data for Republican vote share
    const republicanPoints = filteredData
      .filter(precinct => {
        const xValue = getXValue(precinct);
        return typeof xValue === 'number' && 
          precinct.electionData?.trump_ratio != null &&
          precinct.electionData.total_votes > 0 &&
          !isOutlierPoint(filteredData, precinct);
      })
      .map(precinct => ({
        x: getXValue(precinct),
        y: precinct.electionData.trump_ratio * 100,
        party: 'Republican',
        precinctId: precinct.geoId,
        population: precinct.totalPopulation,
        votes: precinct.electionData.trump_votes,
        totalVotes: precinct.electionData.total_votes,
        urbanicity: precinct.urbanicity,
        demographicName: dataMode === 'Demographic' ? demographicOptions[selectedDemographic].name : undefined,
        income: precinct.averageHouseholdIncome,
        isDataPoint: true
      }));

    // Calculate trend lines
    const calculateTrendLine = (points: any[]) => {
      if (points.length < 4) return [];
      
      const coefficients = regression(points, 3);
      if (!coefficients) return [];
  
      const xValues = points.map(p => p.x);
      const minX = Math.min(...xValues);
      const maxX = Math.max(...xValues);
      const step = (maxX - minX) / (100 - 1);
      
      return Array.from({ length: 100 }, (_, i) => {
        const x = minX + i * step;
        const trendValue = coefficients.reduce((sum, coeff, power) => 
          sum + coeff * Math.pow(x, power), 0);
        return { 
          x, 
          trendValue: Math.min(Math.max(trendValue, 0), 100),
          isDataPoint: false
        };
      });
    };
  
    return {
      democratic: democraticPoints,
      republican: republicanPoints,
      demTrend: calculateTrendLine(democraticPoints),
      repTrend: calculateTrendLine(republicanPoints)
    };
  }, [rawData, urbanityFilter, dataMode, selectedDemographic, demographicOptions]);
  
  const CustomTooltip: React.FC<{ active?: boolean; payload?: any[] }> = ({ active, payload }) => {
    if (!active || !payload || !payload[0]) return null;

    const data = payload[0].payload;
    return (
      <Box bg="white" p={3} border="1px solid" borderColor="gray.200" borderRadius="md" boxShadow="md">
        <Text fontWeight="bold">{`Precinct: ${data.precinctId}`}</Text>
        {dataMode === 'Demographic' && (
          <Text>{`${data.demographicName} Population: ${data.x.toFixed(1)}%`}</Text>
        )}
        {(dataMode === 'Income' || dataMode === 'Income/Race') && (
          <Text>{`${dataMode === 'Income' ? 'Income' : 'Normalized Income'}: ${
            dataMode === 'Income' ? `$${data.x.toLocaleString()}` : data.x.toFixed(2)
          }`}</Text>
        )}
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

  const getXAxisLabel = () => {
    switch (dataMode) {
      case 'Income':
        return 'Average Household Income';
      case 'Income/Race':
        return 'Normalized Income';
      default:
        return `${demographicOptions[selectedDemographic].name} Population Percentage`;
    }
  };

  return (
    <VStack spacing={4} w="100%" p={4} bg="white" borderRadius="lg" boxShadow="sm">
      <HStack justify="space-between" w="100%" align="center">
        <Text fontSize="xl" fontWeight="bold">
          {selectedState} Precinct Analysis: {
            dataMode === 'Demographic' 
              ? demographicOptions[selectedDemographic].name 
              : dataMode === 'Income' 
                ? 'Income Distribution'
                : `${demographicOptions[selectedDemographic].name} Income Distribution`
          }
        </Text>
        <HStack spacing={4}>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              {dataMode}
            </MenuButton>
            <MenuList>
              <MenuItem onClick={() => setDataMode('Demographic')}>Demographic</MenuItem>
              <MenuItem onClick={() => setDataMode('Income')}>Income</MenuItem>
              <MenuItem onClick={() => setDataMode('Income/Race')}>Income/Race</MenuItem>
            </MenuList>
          </Menu>

          {/* Show demographic selector for both Demographic and Income/Race modes */}
          {(dataMode === 'Demographic' || dataMode === 'Income/Race') && (
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
          )}
        </HStack>
      </HStack>

      <Box w="100%" h="450px" position="relative">
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
                tickFormatter={dataMode === 'Income' ? (value) => `$${(value/1000).toFixed(0)}k` : undefined}
              >
                <Label
                  value={getXAxisLabel()}
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
                  dy={-50}
                />
              </YAxis>
              <Tooltip content={CustomTooltip} />
              <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '11px' }} />

              <Scatter
                name="Dem. Vote Share"
                data={processedData.democratic}
                fill="#2E5EAA"
                fillOpacity={0.3}
                shape={(props: JSX.IntrinsicAttributes & CustomPointProps) => (
                  <CustomPoint {...props} />
                )}
                dataKey="y"
              />
              <Line
                name="Dem. Trend"
                data={processedData.demTrend}
                type="monotone"
                dataKey="trendValue"
                stroke="#2E5EAA"
                strokeWidth={2}
                dot={false}
                connectNulls
              />

<Scatter
                name="Rep. Vote Share"
                data={processedData.republican}
                fill="#AA2E2E"
                fillOpacity={0.3}
                shape={(props: JSX.IntrinsicAttributes & CustomPointProps) => (
                  <CustomPoint {...props} />
                )}
                dataKey="y"
              />
              <Line
                name="Rep. Trend"
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

      <ButtonGroup variant="outline" spacing={4} mt={-50}>
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

// Polynomial regression helper function
const regression = (points: Array<{x: number; y: number}>, degree: number = 3) => {
  if (points.length < degree + 1) return null;

  const matrix: number[][] = [];
  const vector: number[] = [];
  
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

  for (let i = 0; i < degree + 1; i++) {
    let maxRow = i;
    for (let j = i + 1; j < degree + 1; j++) {
      if (Math.abs(matrix[j][i]) > Math.abs(matrix[maxRow][i])) {
        maxRow = j;
      }
    }

    [matrix[i], matrix[maxRow]] = [matrix[maxRow], matrix[i]];
    [vector[i], vector[maxRow]] = [vector[maxRow], vector[i]];

    for (let j = i + 1; j < degree + 1; j++) {
      const factor = matrix[j][i] / matrix[i][i];
      for (let k = i; k < degree + 1; k++) {
        matrix[j][k] -= factor * matrix[i][k];
      }
      vector[j] -= factor * vector[i];
    }
  }

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

export default Gingles;