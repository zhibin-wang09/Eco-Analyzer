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
  const [category, setCategory] = useState("demographic");
  const [range, setRange] = useState("white");
  const [regionType, setRegionTye] = useState("all");
  const toast = useToast();

  const race = ["white", "black", "asian", "hispanic", "other"];
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
        category: category,
        regionType: regionType,
      });
      if (category === "economic") {
        range = incomeMap[range];
      }
      if (range) {
        query.set("range", range);
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
        category !== "urbanicity" ? regionType : "all",
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
    <VStack>
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
                  setCategory("demographic");
                  setRange("white");
                }}
              >
                Demographic
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setCategory("economic");
                  setRange("0-9999");
                }}
              >
                Economic
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setCategory("urbanicity");
                  setRange("rural");
                }}
              >
                Urbanicity
              </MenuItem>
            </MenuList>
          </Menu>

          {/* Range Menu */}
          {category === "demographic" && (
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

          {category === "urbanicity" && (
            <Menu>
              <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>{range}</MenuButton>
              <MenuList>
                <MenuItem onClick={() => setRange("rural")}>Rural</MenuItem>
                <MenuItem onClick={() => setRange("suburban")}>Suburban</MenuItem>
                <MenuItem onClick={() => setRange("urban")}>Urban</MenuItem>
              </MenuList>
            </Menu>
          )}

          {category === "economic" && (
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
          {category !== "urbanicity" && (
            <Menu>
              <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>{regionType}</MenuButton>
              <MenuList>
                <MenuItem onClick={() => setRegionTye("all")}>All</MenuItem>
                <MenuItem onClick={() => setRegionTye("rural")}>Rural</MenuItem>
                <MenuItem onClick={() => setRegionTye("suburban")}>
                  Suburban
                </MenuItem>
                <MenuItem onClick={() => setRegionTye("urban")}>Urban</MenuItem>
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
            }))}
          />
        </div>
      </Box>
    </VStack>
  );
};

export default BoxPlot;