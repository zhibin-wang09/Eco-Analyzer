import React, { useState } from 'react';
import { Table, Thead, Tbody, Tr, Th, Td, Box, Text } from '@chakra-ui/react';

interface CongressionalData {
  district: string;
  representative: string;
  party: string;
  ethnicity: string;
  income: number;
  poverty: number;
  regionType: {
    rural: number;
    urban: number;
    suburban: number;
  };
  voteMargin: number;
}

interface CongressionalTableProps {
  data: CongressionalData[];
  onSelectDistrict: (district: string) => void;
}

const CongressionalTable: React.FC<CongressionalTableProps> = ({ data, onSelectDistrict }) => {
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);

  const handleRowClick = (district: string) => {
    setSelectedDistrict(district);
    onSelectDistrict(district);
  };

  return (
    <Box overflowX="auto" p={1} borderWidth="1px" borderRadius="md" bg="white" boxShadow="sm">
      <Text fontSize="sm" fontWeight="bold" mb={1} ml={2}>
        Congressional District Data
      </Text>
      <Table variant="simple" size="sm">
        <Thead>
          <Tr>
            <Th py={1} fontSize="xs">District</Th>
            <Th py={1} fontSize="xs">Rep.</Th>
            <Th py={1} fontSize="xs">Party</Th>
            <Th py={1} fontSize="xs">Ethnicity</Th>
            <Th py={1} fontSize="xs" isNumeric>Income</Th>
            <Th py={1} fontSize="xs" isNumeric>Pov%</Th>
            <Th py={1} fontSize="xs">Region</Th>
            <Th py={1} fontSize="xs" isNumeric>Margin</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.map((item) => (
            <Tr
              key={item.district}
              onClick={() => handleRowClick(item.district)}
              bg={selectedDistrict === item.district ? 'blue.50' : 'white'}
              _hover={{ cursor: 'pointer', bg: 'blue.100' }}
            >
              <Td py={0.5} fontSize="xs">{item.district}</Td>
              <Td py={0.5} fontSize="xs">{item.representative}</Td>
              <Td py={0.5} fontSize="xs">{item.party}</Td>
              <Td py={0.5} fontSize="xs">{item.ethnicity}</Td>
              <Td py={0.5} fontSize="xs" isNumeric>${item.income.toLocaleString()}</Td>
              <Td py={0.5} fontSize="xs" isNumeric>{item.poverty.toFixed(1)}</Td>
              <Td py={0.5} fontSize="xs">
                {`${item.regionType.rural}/${item.regionType.urban}/${item.regionType.suburban}`}
              </Td>
              <Td py={0.5} fontSize="xs" isNumeric>{item.voteMargin.toFixed(1)}%</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default CongressionalTable;
