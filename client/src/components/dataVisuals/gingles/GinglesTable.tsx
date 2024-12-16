import React, { useState, useMemo } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { ChevronDownIcon, TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";

interface GinglesTableProps {
  data: Array<{
    geoId: string;
    totalPopulation: number;
    urbanicity: string;
    demographicGroupPercentage: number;
    averageHouseholdIncome: number;
    electionData: {
      biden_votes: number;
      trump_votes: number;
      total_votes: number;
    };
  }>;
  selectedDemographic: string;
  rowsPerPage: number;
  urbanityFilter: string;
  onUrbanityFilterChange: (filter: string) => void;
}

interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

const GinglesTable: React.FC<GinglesTableProps> = ({
  data,
  selectedDemographic,
  rowsPerPage = 7,
  urbanityFilter,
  onUrbanityFilterChange
}) => {
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'geoId', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);

  const handleSort = (key: string) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    });
  };

  const filteredAndSortedData = useMemo(() => {
    let processedData = [...data];

    // Apply urbanity filter
    if (urbanityFilter !== 'all') {
      processedData = processedData.filter(item => 
        item.urbanicity.toLowerCase() === urbanityFilter.toLowerCase()
      );
    }

    // Apply sorting
    processedData.sort((a, b) => {
      let comparison = 0;
      switch (sortConfig.key) {
        case 'geoId':
          comparison = a.geoId.localeCompare(b.geoId);
          break;
        case 'totalPopulation':
          comparison = a.totalPopulation - b.totalPopulation;
          break;
        case 'demographic':
          comparison = a.demographicGroupPercentage - b.demographicGroupPercentage;
          break;
        case 'income':
          comparison = a.averageHouseholdIncome - b.averageHouseholdIncome;
          break;
        case 'democraticVotes':
          comparison = a.electionData.biden_votes - b.electionData.biden_votes;
          break;
        case 'republicanVotes':
          comparison = a.electionData.trump_votes - b.electionData.trump_votes;
          break;
        default:
          comparison = 0;
      }
      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });

    return processedData;
  }, [data, sortConfig, urbanityFilter]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredAndSortedData.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredAndSortedData, currentPage, rowsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedData.length / rowsPerPage);

  const SortIcon = ({ columnKey }: { columnKey: string }) => {
    if (sortConfig.key !== columnKey) return null;
    return sortConfig.direction === 'asc' ? 
      <TriangleUpIcon ml={1} w={3} h={3} /> : 
      <TriangleDownIcon ml={1} w={3} h={3} />;
  };

  return (
    <VStack spacing={4} width="100%">
      <HStack spacing={4} justify="space-between" width="100%">
        <Menu>
          <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
            {urbanityFilter.charAt(0).toUpperCase() + urbanityFilter.slice(1)} Areas
          </MenuButton>
          <MenuList>
            <MenuItem onClick={() => onUrbanityFilterChange("all")}>
              All Areas
            </MenuItem>
            <MenuItem onClick={() => onUrbanityFilterChange("urban")}>
              Urban Areas
            </MenuItem>
            <MenuItem onClick={() => onUrbanityFilterChange("suburban")}>
              Suburban Areas
            </MenuItem>
            <MenuItem onClick={() => onUrbanityFilterChange("rural")}>
              Rural Areas
            </MenuItem>
          </MenuList>
        </Menu>
        
        <Text fontSize="sm">
          Showing {filteredAndSortedData.length} precincts
        </Text>
      </HStack>

      <Box width="100%" overflowX="auto">
        <Table variant="simple" size="sm">
          <Thead>
            <Tr>
              <Th cursor="pointer" onClick={() => handleSort('geoId')}>
                Precinct ID <SortIcon columnKey="geoId" />
              </Th>
              <Th cursor="pointer" onClick={() => handleSort('totalPopulation')} isNumeric>
                Total Population <SortIcon columnKey="totalPopulation" />
              </Th>
              <Th>Region Type</Th>
              <Th cursor="pointer" onClick={() => handleSort('demographic')} isNumeric>
                {selectedDemographic} % <SortIcon columnKey="demographic" />
              </Th>
              <Th cursor="pointer" onClick={() => handleSort('income')} isNumeric>
                Income <SortIcon columnKey="income" />
              </Th>
              <Th cursor="pointer" onClick={() => handleSort('democraticVotes')} isNumeric>
                Dem. Votes <SortIcon columnKey="democraticVotes" />
              </Th>
              <Th cursor="pointer" onClick={() => handleSort('republicanVotes')} isNumeric>
                Rep. Votes <SortIcon columnKey="republicanVotes" />
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {paginatedData.map((item) => (
              <Tr key={item.geoId}>
                <Td>{item.geoId}</Td>
                <Td isNumeric>{item.totalPopulation.toLocaleString()}</Td>
                <Td>{item.urbanicity}</Td>
                <Td isNumeric>{(item.demographicGroupPercentage * 100).toFixed(1)}%</Td>
                <Td isNumeric>
                  {item.averageHouseholdIncome > 0 
                    ? `$${item.averageHouseholdIncome.toLocaleString()}`
                    : 'N/A'}
                </Td>
                <Td isNumeric>{item.electionData.biden_votes.toLocaleString()}</Td>
                <Td isNumeric>{item.electionData.trump_votes.toLocaleString()}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      <HStack spacing={4} justify="center" width="100%" pt={2}>
        <Button
          size="sm"
          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          isDisabled={currentPage === 1}
          colorScheme="blue"
          variant="outline"
        >
          Previous
        </Button>
        <Text fontSize="sm">
          Page {currentPage} of {totalPages}
        </Text>
        <Button
          size="sm"
          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
          isDisabled={currentPage === totalPages}
          colorScheme="blue"
          variant="outline"
        >
          Next
        </Button>
      </HStack>
    </VStack>
  );
};

export default GinglesTable;