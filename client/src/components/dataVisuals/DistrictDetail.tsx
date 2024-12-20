import { Box, Table, Thead, Tr, Th, Tbody, Td, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import CongressionalDistrictData, {
  CongressionalDistrictDataJson,
} from "../../types/CongressionalDistrictData";
import { stateConversion } from "../../utils/util";

interface DistrictDetailProps {
  onSelectDistrict: (district: number | null) => void;
  selectedState: string;
  chosenDistrict?: string;
  district: number | null;
}

const DistrictDetail = ({
  onSelectDistrict,
  selectedState,
  chosenDistrict,
  district
}: DistrictDetailProps) => {
  const [selectedDistrict, setSelectedDistrict] = useState<number | null>(null);
  const [districtTable, setDistrictTable] = useState<
    CongressionalDistrictData[]
  >([]);

  const handleRowClick = (district: number) => {
    if (selectedDistrict === district) {
      setSelectedDistrict(null);
      onSelectDistrict(null);
    } else {
      setSelectedDistrict(district);
      onSelectDistrict(district);
    }
  };

  useEffect(() => {
    const fetchDistribtTable = async (selectedState: string) => {
      const query = new URLSearchParams({
        state: selectedState,
      }).toString();
      const response = await fetch("http://localhost:8080/api/table?" + query);
      const json = await response.json();
      return json;
    };

    const loadDistrictTable = async () => {
      try {
        const rawDistrictTable = await fetchDistribtTable(
          stateConversion(selectedState)
        );

        setDistrictTable(
          rawDistrictTable
            .map((rawDistrictDetail: CongressionalDistrictDataJson) => {
              const totalVotes = rawDistrictDetail.data.trumpVotes + rawDistrictDetail.data.bidenVotes;
              const districtDetail: CongressionalDistrictData = {
                district: Number(rawDistrictDetail.geoId),
                representative: rawDistrictDetail.data.rep,
                party: rawDistrictDetail.data.party,
                averageHouseholdIncome: rawDistrictDetail.data.averageIncome,
                povertyPercentage: rawDistrictDetail.data.povertyPercentage,
                regionType: {
                  rural: parseInt(rawDistrictDetail.data.ruralPercentage),
                  suburban: parseInt(rawDistrictDetail.data.subUrbanPercentage),
                  urban: parseInt(rawDistrictDetail.data.urbanPercentage),
                },
                voteMargin: `${(rawDistrictDetail.data.trumpVotes/totalVotes*100).toFixed(1)}%-${(rawDistrictDetail.data.bidenVotes/totalVotes*100).toFixed(1)}%`,
              };
              return districtDetail;
            })
            .sort(
              (a: CongressionalDistrictData, b: CongressionalDistrictData) =>
                a.district - b.district
            )
        );
      } catch (error) {
        console.error("Error fetching state summary:", error);
      }
    };

    loadDistrictTable();
  }, [selectedState]);

  return (
    <Box
      overflowX="hidden"
      overflowY="scroll"
      minH="70vh"
      maxH="75vh"
      p={1}
      borderWidth="1px"
      borderRadius="md"
      bg="white"
      boxShadow="sm"
    >
      <Text fontSize="sm" fontWeight="bold" mb={1} ml={2}>
        District Details
      </Text>
      <Table variant="simple" size="sm">
        <Thead>
          <Tr>
            <Th textTransform="none"
              py={1}
              fontSize="xs"
              position="sticky"
              top="-1"
              bg="white"
              zIndex="1"
            >
              District
            </Th>
            <Th textTransform="none"
              py={1}
              fontSize="xs"
              position="sticky"
              top="-1"
              bg="white"
              zIndex="1"
            >
              Rep.
            </Th>
            <Th textTransform="none"
              py={1}
              fontSize="xs"
              position="sticky"
              top="-1"
              bg="white"
              zIndex="1"
            >
              Party
            </Th>
            <Th textTransform="none"
              py={1}
              fontSize="xs"
              isNumeric
              position="sticky"
              top="-1"
              bg="white"
              zIndex="1"
            >
              Average Household Income
            </Th>
            <Th textTransform="none"
              py={1}
              fontSize="xs"
              isNumeric
              position="sticky"
              top="-1"
              bg="white"
              zIndex="1"
            >
              Poverty
            </Th>
            <Th textTransform="none"
              py={1}
              fontSize="xs"
              position="sticky"
              top="-1"
              bg="white"
              zIndex="1"
            >
              Rural Region
            </Th>
            <Th textTransform="none"
              py={1}
              fontSize="xs"
              position="sticky"
              top="-1"
              bg="white"
              zIndex="1"
            >
              Suburban Region
            </Th>
            <Th textTransform="none"
              py={1}
              fontSize="xs"
              position="sticky"
              top="-1"
              bg="white"
              zIndex="1"
            >
              Urban Region
            </Th>
            <Th textTransform="none"
              py={1}
              fontSize="xs"
              isNumeric
              position="sticky"
              top="-1"
              bg="white"
              zIndex="1"
            >
              Margin
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {districtTable.map((item) => (
            <Tr
              key={item.district}
              onClick={() => handleRowClick(item.district)}
              bg={(selectedDistrict === item.district) ? "blue.50" : "white"}
              _hover={{ cursor: "pointer", bg: "blue.100" }}
            >
              <Td py={0.5} fontSize="xs" isNumeric>
                {item.district}
              </Td>
              <Td py={0.5} fontSize="xs">
                {item.representative}
              </Td>
              <Td py={0.5} fontSize="xs">
                {item.party.slice(0,3)}.
              </Td>
              <Td py={0.5} fontSize="xs" isNumeric>
                ${item.averageHouseholdIncome.toLocaleString()}
              </Td>
              <Td py={0.5} fontSize="xs" isNumeric>
                {item.povertyPercentage.toFixed(1)}%
              </Td>
              <Td py={0.5} fontSize="xs" isNumeric>
                {item.regionType.rural}%
              </Td>
              <Td py={0.5} fontSize="xs" isNumeric>
                {item.regionType.suburban}%
              </Td>
              <Td py={0.5} fontSize="xs" isNumeric>
                {item.regionType.urban}%
              </Td>
              <Td py={0.5} fontSize="xs">
                {item.voteMargin}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default DistrictDetail;