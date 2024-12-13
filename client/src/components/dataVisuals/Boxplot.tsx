import React, { useEffect, useState, useRef } from "react";
import * as d3 from "d3";
import { DataItem } from "../../types/BoxPlot";
import { Box, HStack, Select, VStack } from "@chakra-ui/react";
import { stateConversion } from "../../utils/util";
import { BoxplotWrapper } from "./boxplotComponent/BoxplotWrapper";

const BoxPlot = ({ selectedState }: { selectedState: string }) => {
  const [boxPlotData, setBoxPlotData] = useState<DataItem[]>([]);
  const [category, setCategory] = useState("demographic");
  const [range, setRange] = useState("white");
  const [regionType, setRegionTye] = useState("all");

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
      setBoxPlotData(result);
    };

    loadBoxPlot();
  }, [category, range, regionType, selectedState]);

  return (
    <VStack>
      <Box>
        <HStack>
          <Select
            onChange={(e) => {
              setCategory(e.target.value);
              switch (e.target.value) {
                case "demographic":
                  setRange("white");
                  break;
                case "economic":
                  setRange("0-9999");
                  break;
                case "urbanicity":
                  setRange("rural");
                  break;
              }
            }}
          >
            <option>demographic</option>
            <option>economic</option>
            <option>urbanicity</option>
          </Select>
          {category === "demographic" && (
            <Select onChange={(e) => setRange(e.target.value)}>
              {race.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </Select>
          )}

          {category === "urbanicity" && (
            <Select onChange={(e) => setRange(e.target.value)}>
              <option>rural</option>
              <option>suburban</option>
              <option>urban</option>
            </Select>
          )}

          {category === "economic" && (
            <Select onChange={(e) => setRange(e.target.value)}>
              {incomeRanges.map((i) => (
                <option key={i}>{i}</option>
              ))}
            </Select>
          )}

          {category !== "urbanicity" && (
            <Select onChange={(e) => setRegionTye(e.target.value)}>
              <option>all</option>
              <option>rural</option>
              <option>suburban</option>
              <option>urban</option>
            </Select>
          )}
        </HStack>
      </Box>
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
