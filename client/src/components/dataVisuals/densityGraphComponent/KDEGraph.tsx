import React, { useMemo } from "react";
import * as d3 from "d3";
import { Box, HStack, Text, useToken } from "@chakra-ui/react";

export interface DataPoint {
  id?: string;
  range: string;
  candidate?: string;
  category?: string;
  posteriorMean: number;
  interval: [number, number];
  color?: string;
}

const KDEGraph = ({ width = 800, height = 400, data }: { width: number; height: number; data: DataPoint[] }) => {
  // Get Chakra UI colors
  const [blue600, red600, gray200, gray700] = useToken("colors", ["blue.600", "red.600", "gray.200", "gray.700"]);

  // Generate unique colors for each data point
  const assignedColors = useMemo(() => {
    // Color schemes for different types of data
    const demographicColors = [
      "#2E5EAA", // Blue
      "#AA2E2E", // Red
      "#2EAA5E", // Green
      "#AA2E8C", // Purple
      "#AA8C2E"  // Gold
    ];

    const incomeColors = [
      "#264653", // Dark Blue
      "#2A9D8F", // Teal
      "#E9C46A", // Yellow
      "#F4A261", // Orange
      "#E76F51", // Salmon
      "#843B62", // Purple
      "#621B00", // Brown
      "#6B0F1A"  // Dark Red
    ];

    const regionColors = {
      rural: "#68D391",     // Green
      suburban: "#4299E1",  // Blue
      urban: "#F56565"      // Red
    };

    return data.map((d, index) => {
      // Check if it's a region type
      if (d.range.toLowerCase().includes("rural")) return regionColors.rural;
      if (d.range.toLowerCase().includes("suburban")) return regionColors.suburban;
      if (d.range.toLowerCase().includes("urban")) return regionColors.urban;

      // Check if it's an income range
      if (d.range.includes("k") || d.range.includes("-")) {
        return incomeColors[index % incomeColors.length];
      }

      // Default to demographic colors
      return demographicColors[index % demographicColors.length];
    });
  }, [data]);

  // Compute margins and dimensions
  const margin = { top: 20, right: 100, bottom: 50, left: 60 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // Compute overall domain for X scale
  const xDomain = useMemo(() => {
    const allIntervals = data.flatMap((d) => d.interval);
    return [Math.min(...allIntervals) * 0.95, Math.max(...allIntervals) * 1.05];
  }, [data]);

  // X scale
  const xScale = useMemo(() => {
    return d3.scaleLinear().domain(xDomain).range([0, innerWidth]);
  }, [xDomain, innerWidth]);

  // Kernel Density Estimation function
  const kde = (kernel: (v: number) => number, X: number[], bandwidth = 0.05) => {
    return (V: number[]): [number, number][] => {
      return X.map((x) => [x, d3.mean(V, (v) => kernel((x - v) / bandwidth)) || 0]);
    };
  };

  // Epanechnikov kernel
  const kernelEpanechnikov = (bandwidth: number) => {
    return (v: number) => Math.abs(v) <= 1 ? 0.75 * (1 - v * v) : 0;
  };

  // Compute density data
  const densityData = useMemo(() => {
    const kdeFunc = kde(kernelEpanechnikov(0.05), xScale.ticks(100));

    return data.map((group, i) => ({
      group,
      color: assignedColors[i],
      density: kdeFunc([
        ...group.interval,
        group.posteriorMean,
        ...Array(10).fill(0).map(() => 
          group.posteriorMean + (Math.random() - 0.5) * (group.interval[1] - group.interval[0])
        ),
      ]),
    }));
  }, [data, xScale, assignedColors]);

  // Y scale
  const yScale = useMemo(() => {
    const maxDensity = Math.max(...densityData.flatMap((d) => d.density.map((point) => point[1])));
    return d3.scaleLinear().range([innerHeight, 0]).domain([0, maxDensity * 1.1]);
  }, [densityData, innerHeight]);

  // Line generator
  const lineGenerator = d3.line()
    .x((d: any) => xScale(d[0]))
    .y((d: any) => yScale(d[1]))
    .curve(d3.curveBasis);

  return (
    <Box p={4}>
      <svg width={width} height={height}>
        <g transform={`translate(${margin.left},${margin.top})`}>
          {/* Grid lines */}
          {xScale.ticks(5).map((tick) => (
            <line
              key={`grid-x-${tick}`}
              x1={xScale(tick)}
              x2={xScale(tick)}
              y1={0}
              y2={innerHeight}
              stroke={gray200}
              strokeDasharray="2,2"
            />
          ))}
          {yScale.ticks(5).map((tick) => (
            <line
              key={`grid-y-${tick}`}
              x1={0}
              x2={innerWidth}
              y1={yScale(tick)}
              y2={yScale(tick)}
              stroke={gray200}
              strokeDasharray="2,2"
            />
          ))}

          {/* Density plots */}
          {densityData.map((data, index) => (
            <React.Fragment key={index}>
              <path
                d={`${lineGenerator(data.density)}L${xScale(data.group.interval[1])},${yScale(0)}L${xScale(data.group.interval[0])},${yScale(0)}Z`}
                fill={data.color}
                opacity={0.2}
              />
              <path
                d={lineGenerator(data.density)!}
                fill="none"
                stroke={data.color}
                strokeWidth={2}
              />
              <circle
                cx={xScale(data.group.posteriorMean)}
                cy={yScale(0)}
                r={4}
                fill={data.color}
              />
            </React.Fragment>
          ))}

          {/* Axes */}
          <g transform={`translate(0,${innerHeight})`}>
            <path d={`M0,0H${innerWidth}`} stroke={gray700} />
            {xScale.ticks(5).map((tick, i) => (
              <g key={i} transform={`translate(${xScale(tick)},0)`}>
                <line y2="6" stroke={gray700} />
                <text
                  y="20"
                  textAnchor="middle"
                  fill={gray700}
                  fontSize="12px"
                >
                  {(tick * 100).toFixed(0)}%
                </text>
              </g>
            ))}
            <text
              x={innerWidth / 2}
              y="40"
              textAnchor="middle"
              fill={gray700}
              fontSize="14px"
            >
              Vote Share
            </text>
          </g>

          <g>
            <path d={`M0,0V${innerHeight}`} stroke={gray700} />
            {yScale.ticks(5).map((tick, i) => (
              <g key={i} transform={`translate(0,${yScale(tick)})`}>
                <line x2="-6" stroke={gray700} />
                <text
                  x="-10"
                  dy="0.32em"
                  textAnchor="end"
                  fill={gray700}
                  fontSize="12px"
                >
                  {tick.toFixed(2)}
                </text>
              </g>
            ))}
            <text
              transform={`translate(-40,${innerHeight / 2})rotate(-90)`}
              textAnchor="middle"
              fill={gray700}
              fontSize="14px"
            >
              Density
            </text>
          </g>
        </g>
      </svg>

      {/* Legend */}
      <HStack spacing={6} mt={4} px={4} justify="center" wrap="wrap">
        {densityData.map((data, index) => (
          <HStack key={index} spacing={2} align="center">
            <Box w="16px" h="16px" bg={data.color} borderRadius="sm" />
            <Text fontSize="sm" fontWeight="medium" color={gray700}>
              {data.group.range}
            </Text>
          </HStack>
        ))}
      </HStack>
    </Box>
  );
};

export default KDEGraph;