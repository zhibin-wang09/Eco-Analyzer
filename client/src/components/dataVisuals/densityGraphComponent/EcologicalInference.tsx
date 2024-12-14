import {
  Box,
  HStack,
  Select,
  VStack,
  Text,
  Checkbox,
  CheckboxGroup,
} from "@chakra-ui/react";
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

  const onCategoryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
  };

  const onCandidateChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setCandidate(e.target.value);
  };

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
      // Start building the query params
      const query = new URLSearchParams({
        state: stateConversion(selectedState),
        category: category,
        candidate: candidate,
      });
      query.set("range", "");
      // Handle "income" category if selected
      if (category === "Economic" && incomes.length > 0) {
        // Map income ranges to backend values
        const incomeRangesParam = incomes
          .map((income) => incomeMap[income])
          .join(",");
        query.set("range", incomeRangesParam);
      }

      // Add selected races, incomes, and region types to query if available
      if (category === "Demographic" && races.length)
        query.set("range", races.join(","));
      if (category === "Urbanicity" && regions.length)
        query.set("range", regions.join(","));

      // Make the fetch call with the dynamic query params
      const response = await fetch(
        "http://localhost:8080/api/graph/ecologicalinference?" +
          query.toString()
      );
      const json = await response.json();
      setEiInfo(json);
    };

    // Call the function with selected parameters
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
    candidate
  ]);

  return (
    <VStack align="start">
      <HStack spacing={6}>
        <VStack>
          <Text fontSize="lg" fontWeight="semibold">
            Comparison Groups
          </Text>
          <Select onChange={onCategoryChange}>
            <option value="Demographic">Demographic</option>
            <option value="Economic">Economic</option>
            <option value="Urbanicity">Region Type</option>
          </Select>
        </VStack>
        <VStack>
          <Text fontSize="lg" fontWeight="semibold">
            Candidate
          </Text>
          <Select onChange={onCandidateChange}>
            <option value="Trump">Trump</option>
            <option value="Biden">Biden</option>
            <option value="Other">Other</option>
          </Select>
        </VStack>
      </HStack>

      {category === "Demographic" && (
        <VStack align="start">
          <Text fontWeight="bold">Races</Text>
          <CheckboxGroup
            value={selectedRaces}
            onChange={(e: any) =>
              handleCheckboxChange( e)
            }
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
            onChange={(e: any) =>
              handleCheckboxChange( e)
            }
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
            onChange={(e: any) =>
              handleCheckboxChange( e)
            }
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
      width={400}
      height={400}
      data={eiInfo.map(e => {
        const dataPoint : DataPoint = {
          range: e.range,
          posteriorMean: e.posteriorMean,
          interval: e.interval
        }

        return dataPoint;
      })}
      />
    </VStack>
  );
};

export default EcologicalInference;
