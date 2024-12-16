import React, { useEffect, useState } from "react";
import * as d3 from "d3";
import { DataItem } from "../../types/BoxPlot";
import { 
  Box, 
  HStack, 
  VStack, 
  Menu, 
  MenuButton, 
  MenuList, 
  MenuItem, 
  Button, 
  useToast 
} from "@chakra-ui/react";
import { stateConversion } from "../../utils/util";
import { BoxplotWrapper } from "./BoxplotComponent/BoxplotWrapper";
import { ChevronDownIcon } from "@chakra-ui/icons";


const BoxPlot = ({ selectedState }: { selectedState: string }) => {
  const [boxPlotData, setBoxPlotData] = useState<DataItem[]>([]);
  const [category, setCategory] = useState("Demographic");
  const [range, setRange] = useState("White");
  const [regionType, setRegionTye] = useState(selectedState === 'New York' ? 'Urban' : 'Rural');
  const toast = useToast();

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
    "0-9999": "from_0_to_9999",
    "10k-15k": "from_10000_to_14999",
    "15k-25k": "from_15000_to_24999",
    "25k-35k": "from_25000_to_34999",
    "35k-50k": "from_35000_to_49999",
    "50k-75k": "from_50000_to_74999",
    "75k-100k": "from_75000_to_99999",
    "100k+": "from_100000_and_more",
  };

  useEffect(() => {
    const fetchStateSummary = async (
      selectedState: string,
      category: string,
      regionType: string,
      range: string
    ) => {
      const query = new URLSearchParams({
        state: stateConversion(selectedState),
        category: category.toLowerCase(),
        regionType: category === "Urbanicity" ? 'all': regionType,
      });
      range = range.toLowerCase();
      if (category === "Economic") {
        range = incomeMap[range];
      }
      if (range) {
        query.set("range", range.toLowerCase());
      }
      const response = await fetch(
        "http://localhost:8080/api/graph/boxplot?" + query
      );
      const json = await response.json();
      return json;
    };

    const loadBoxPlot = async () => {
      const result = await fetchStateSummary(
        selectedState,
        category,
        regionType,
        range
      );
      result.sort((a: DataItem, b: DataItem) => Number(a.geoId) - Number(b.geoId));
      setBoxPlotData(result);
      if (result.length === 0) {
        toast({
          title: `Error fetching data`,
          description: `No data for ${regionType + " " + category + " data"}`,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    };

    loadBoxPlot();
  }, [category, range, regionType, selectedState]);

  return (
    <VStack minH="70vh">
      <Box>
        <HStack>
          {/* Category Menu */}
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </MenuButton>
            <MenuList>
              <MenuItem
                onClick={() => {
                  setCategory("Demographic");
                  setRange("White");
                }}
              >
                Demographic
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setCategory("Economic");
                  setRange("0-9999");
                }}
              >
                Economic
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setCategory("Urbanicity");
                  setRange("Rural");
                }}
              >
                Urbanicity
              </MenuItem>
            </MenuList>
          </Menu>

          {/* Range Menu */}
          {category === "Demographic" && (
            <Menu>
              <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>{range}</MenuButton>
              <MenuList>
                {race.map((r) => (
                  <MenuItem key={r} onClick={() => setRange(r)}>
                    {r}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
          )}

          {category === "Urbanicity" && (
            <Menu>
              <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>{range}</MenuButton>
              <MenuList>
                <MenuItem onClick={() => setRange("Rural")}>Rural</MenuItem>
                <MenuItem onClick={() => setRange("Suburban")}>Suburban</MenuItem>
                <MenuItem onClick={() => setRange("Urban")}>Urban</MenuItem>
              </MenuList>
            </Menu>
          )}

          {category === "Economic" && (
            <Menu>
              <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>{range}</MenuButton>
              <MenuList>
                {incomeRanges.map((i) => (
                  <MenuItem key={i} onClick={() => setRange(i)}>
                    {i}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
          )}

          {/* Region Type Menu */}
          {category !== "Urbanicity" && (
            <Menu>
              <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>{regionType}</MenuButton>
              <MenuList>
                <MenuItem onClick={() => setRegionTye("Rural")}>Rural</MenuItem>
                <MenuItem onClick={() => setRegionTye("Suburban")}>
                  Suburban
                </MenuItem>
                <MenuItem onClick={() => setRegionTye("Urban")}>Urban</MenuItem>
              </MenuList>
            </Menu>
          )}
        </HStack>
      </Box>

      {/* Boxplot Visualization */}
      <Box>
        <div>
          <h2>Boxplot Visualization</h2>
          <BoxplotWrapper
            yAxis={category + " percentage"}
            width={750}
            height={400}
            data={boxPlotData.map((item) => ({
              geoId: item.geoId,
              boxPlot: item.boxPlot,
              dot: item.dot
            }))}
          />
        </div>
      </Box>
    </VStack>
  );
};

export default BoxPlot;