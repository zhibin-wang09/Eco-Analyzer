import { Box, Table, Thead, Tr, Th, Tbody, Td, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";

const mockData = [
  {
    district: "1",
    representative: "John Doe",
    party: "Democrat",
    ethnicity: "White",
    income: 55000,
    poverty: 12.5,
    regionType: { rural: 30, urban: 40, suburban: 30 },
    voteMargin: 10.2,
  },
  {
    district: "2",
    representative: "Jane Smith",
    party: "Republican",
    ethnicity: "Hispanic",
    income: 42000,
    poverty: 18.4,
    regionType: { rural: 50, urban: 25, suburban: 25 },
    voteMargin: 5.1,
  },
  {
    district: "2",
    representative: "Jane Smith",
    party: "Republican",
    ethnicity: "Hispanic",
    income: 42000,
    poverty: 18.4,
    regionType: { rural: 50, urban: 25, suburban: 25 },
    voteMargin: 5.1,
  },
];

interface DistrictDetailProps {
  onSelectDistrict: (district: string) => void;
}

const DistrictDetail = ({ onSelectDistrict }: DistrictDetailProps) => {
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);

  const handleRowClick = (district: string) => {
    setSelectedDistrict(district);
    onSelectDistrict(district);
  };

  useEffect(() => {
    
  })

  return (
    <Box
      overflowX="auto"
      overflowY="auto"
      p={1}
      borderWidth="1px"
      borderRadius="md"
      bg="white"
      boxShadow="sm"
    >
      <Text fontSize="sm" fontWeight="bold" mb={1} ml={2}>
        Congressional District Data
      </Text>
      <Table variant="simple" size="sm">
        <Thead>
          <Tr>
            <Th py={1} fontSize="xs">
              District
            </Th>
            <Th py={1} fontSize="xs">
              Rep.
            </Th>
            <Th py={1} fontSize="xs">
              Party
            </Th>
            <Th py={1} fontSize="xs">
              Ethnicity
            </Th>
            <Th py={1} fontSize="xs" isNumeric>
              Income
            </Th>
            <Th py={1} fontSize="xs" isNumeric>
              Pov%
            </Th>
            <Th py={1} fontSize="xs">
              Region
            </Th>
            <Th py={1} fontSize="xs" isNumeric>
              Margin
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {mockData.map((item) => (
            <Tr
              key={item.district}
              onClick={() => handleRowClick(item.district)}
              bg={selectedDistrict === item.district ? "blue.50" : "white"}
              _hover={{ cursor: "pointer", bg: "blue.100" }}
            >
              <Td py={0.5} fontSize="xs">
                {item.district}
              </Td>
              <Td py={0.5} fontSize="xs">
                {item.representative}
              </Td>
              <Td py={0.5} fontSize="xs">
                {item.party}
              </Td>
              <Td py={0.5} fontSize="xs">
                {item.ethnicity}
              </Td>
              <Td py={0.5} fontSize="xs" isNumeric>
                ${item.income.toLocaleString()}
              </Td>
              <Td py={0.5} fontSize="xs" isNumeric>
                {item.poverty.toFixed(1)}
              </Td>
              <Td py={0.5} fontSize="xs">
                {`${item.regionType.rural}/${item.regionType.urban}/${item.regionType.suburban}`}
              </Td>
              <Td py={0.5} fontSize="xs" isNumeric>
                {item.voteMargin.toFixed(1)}%
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default DistrictDetail;
