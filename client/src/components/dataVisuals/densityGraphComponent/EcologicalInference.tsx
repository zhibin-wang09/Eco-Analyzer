import {
  Box,
  HStack,
  VStack,
  Text,
  Checkbox,
  CheckboxGroup,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { ChangeEvent, useEffect, useState } from "react";
import { EIInfo } from "../../../types/EIInfo";
import { stateConversion } from "../../../utils/util";
import KDEGraph, { DataPoint } from "./KDEGraph";

interface EcologicalInference {
  selectedState: string;
}

const EcologicalInference = ({ selectedState }: EcologicalInference) => {
  const [eiInfo, setEiInfo] = useState<EIInfo[]>([]);
  const [category, setCategory] = useState<string>("Demographic");
  const [candidate, setCandidate] = useState<string>("Trump");
  const [selectedRaces, setSelectedRaces] = useState<string[]>([]);
  const [selectedIncomeRanges, setSelectedIncomeRanges] = useState<string[]>(
    []
  );
  const [selectedRegionTypes, setSelectedRegionTypes] = useState<string[]>([]);

  const race = ["White", "Black", "Asian", "Hispanic", "Other"];
  const incomeRanges = [
    "0-9999",
    "10k-15k",
    "15k-25k",
    "25k-35k",
    "35k-50k",
    "50k-75k",
    "75k-100k",
    "100k+",
  ];
  const incomeMap: Record<string, string> = {
    "0-9999": "0_to_9999",
    "10k-15k": "10000_to_14999",
    "15k-25k": "15000_to_24999",
    "25k-35k": "25000_to_34999",
    "35k-50k": "35000_to_49999",
    "50k-75k": "50000_to_74999",
    "75k-100k": "75000_to_99999",
    "100k+": "100000_and_more",
  };
  const regionType = ["urban", "suburban", "rural"];

  const handleCheckboxChange = (selectedItems: any) => {
    if (category === "Demographic") {
      setSelectedRaces(selectedItems);
    } else if (category === "Economic") {
      setSelectedIncomeRanges(selectedItems);
    } else if (category === "Urbanicity") {
      setSelectedRegionTypes(selectedItems);
    }
  };

  useEffect(() => {
    const fetchStateSummary = async (
      selectedState: string,
      category: string,
      races: string[],
      incomes: string[],
      regions: string[],
      candidate: string
    ) => {
      const query = new URLSearchParams({
        state: stateConversion(selectedState),
        category: category,
        candidate: candidate,
      });
      query.set("range", "");
      if (category === "Economic" && incomes.length > 0) {
        const incomeRangesParam = incomes
          .map((income) => incomeMap[income])
          .join(",");
        query.set("range", incomeRangesParam);
      }
      if (category === "Demographic" && races.length)
        query.set("range", races.join(","));
      if (category === "Urbanicity" && regions.length)
        query.set("range", regions.join(","));

      const response = await fetch(
        "http://localhost:8080/api/graph/ecologicalinference?" +
          query.toString()
      );
      const json = await response.json();
      setEiInfo(json);
    };

    fetchStateSummary(
      selectedState,
      category,
      selectedRaces,
      selectedIncomeRanges,
      selectedRegionTypes,
      candidate
    );
  }, [
    selectedState,
    category,
    selectedRaces,
    selectedIncomeRanges,
    selectedRegionTypes,
    candidate,
  ]);

  return (
    <VStack align="start">
      <HStack spacing={6}>
        <VStack>
          <Text fontSize="lg" fontWeight="semibold">
            Comparison Groups
          </Text>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              {category}
            </MenuButton>
            <MenuList>
              <MenuItem
                onClick={() => {
                  setCategory("Demographic");
                  setSelectedRaces([]);
                }}
              >
                Demographic
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setCategory("Economic");
                  setSelectedIncomeRanges([]);
                }}
              >
                Economic
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setCategory("Urbanicity");
                  setSelectedRegionTypes([]);
                }}
              >
                Region Type
              </MenuItem>
            </MenuList>
          </Menu>
        </VStack>
        <VStack>
          <Text fontSize="lg" fontWeight="semibold">
            Candidate
          </Text>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              {candidate}
            </MenuButton>
            <MenuList>
              <MenuItem onClick={() => setCandidate("Trump")}>Trump</MenuItem>
              <MenuItem onClick={() => setCandidate("Biden")}>Biden</MenuItem>
              <MenuItem onClick={() => setCandidate("Other")}>Other</MenuItem>
            </MenuList>
          </Menu>
        </VStack>
      </HStack>

      {category === "Demographic" && (
        <VStack align="start">
          <Text fontWeight="bold">Races</Text>
          <CheckboxGroup
            value={selectedRaces}
            onChange={(e: any) => handleCheckboxChange(e)}
          >
            <HStack wrap="wrap" spacing="20px">
              {race.map((r) => (
                <Checkbox key={r} value={r}>
                  {r}
                </Checkbox>
              ))}
            </HStack>
          </CheckboxGroup>
        </VStack>
      )}

      {category === "Economic" && (
        <VStack align="start">
          <Text fontWeight="bold">Income Ranges</Text>
          <CheckboxGroup
            value={selectedIncomeRanges}
            onChange={(e: any) => handleCheckboxChange(e)}
          >
            <HStack wrap="wrap" spacing="20px">
              {incomeRanges.map((i) => (
                <Checkbox key={i} value={i}>
                  {i}
                </Checkbox>
              ))}
            </HStack>
          </CheckboxGroup>
        </VStack>
      )}

      {category === "Urbanicity" && (
        <VStack align="start">
          <Text fontWeight="bold">Region Types</Text>
          <CheckboxGroup
            value={selectedRegionTypes}
            onChange={(e: any) => handleCheckboxChange(e)}
          >
            <HStack wrap="wrap" spacing="20px">
              {regionType.map((t) => (
                <Checkbox key={t} value={t}>
                  {t}
                </Checkbox>
              ))}
            </HStack>
          </CheckboxGroup>
        </VStack>
      )}

      <KDEGraph
      width={800}
      height={400}
        data={eiInfo}
      />
    </VStack>
  );
};

export default EcologicalInference;