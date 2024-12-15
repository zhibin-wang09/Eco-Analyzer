import { useMemo } from "react";
import * as d3 from "d3";
import { AxisLeft } from "./AxisLeft";
import { AxisBottom } from "./AxisBottomCategoric";
import { VerticalBox } from "./VerticalBox";
import { useToast } from "@chakra-ui/react";

const MARGIN = { top: 30, right: 30, bottom: 100, left: 100 };
const DOT_RADIUS = 3;
const DOT_COLOR = "#FF6B6B"; // Customize as needed

type BoxplotWrapperProps = {
  width: number;
  height: number;
  data: {
    geoId: string;
    boxPlot: {
      min: number;
      q1: number;
      median: number;
      q3: number;
      max: number;
    };
    dot?: {
      [key: string]: {
        regionType: string;
        percentage: number;
      };
    };
  }[];
  yAxis: string;
};

export const BoxplotWrapper = ({
  width,
  height,
  data,
  yAxis,
}: BoxplotWrapperProps) => {
  const boundsWidth = width - MARGIN.left - MARGIN.right;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;

  // Compute derived data
  const { chartMax, groups } = useMemo(() => {
    const chartMax = d3.max(data.map((d) => d.boxPlot.max))!;
    const groups = data.map((d) => d.geoId);
    return { chartMax, groups };
  }, [data]);

  // Y Scale: Start from 0 and go to the maximum value
  const yScale = useMemo(() => {
    return d3
      .scaleLinear()
      .domain([0, chartMax])
      .range([boundsHeight, 0]);
  }, [chartMax, boundsHeight]);

  // X Scale
  const xScale = useMemo(() => {
    return d3
      .scaleBand()
      .range([0, boundsWidth])
      .domain(groups)
      .padding(0.25);
  }, [groups, boundsWidth]);

  // Render the box plot shapes and dots for each group
  const allShapes = useMemo(() => {
    return groups.map((geoId, i) => {
      const groupData = data.find((d) => d.geoId === geoId);
      console.log(groupData);
      if (!groupData) return null;

      const boxData = groupData.boxPlot;
      const dotsData = groupData.dot ? Object.values(groupData.dot) : [];
      if (!boxData) return null;

      const { min, q1, median, q3, max } = boxData;

      return (
        <g key={i} transform={`translate(${xScale(geoId)},0)`}>
          {/* Draw the vertical box */}
          <VerticalBox
            width={xScale.bandwidth()}
            q1={yScale(q1)}
            median={yScale(median)}
            q3={yScale(q3)}
            min={yScale(min)}
            max={yScale(max)}
            stroke="black"
            fill="#FFFFFF"
          />

          {/* Draw the dots */}
          {dotsData.map((dot, index) => (
            <circle
              key={index}
              cx={xScale.bandwidth() / 2} // Center within the box
              cy={yScale(dot.percentage)} // Y position based on percentage
              r={DOT_RADIUS}
              fill={DOT_COLOR}
              stroke="black"
            />
          ))}
        </g>
      );
    });
  }, [groups, data, xScale, yScale]);

  return (
    <svg width={width} height={height}>
      <g
        width={boundsWidth}
        height={boundsHeight}
        transform={`translate(${MARGIN.left},${MARGIN.top})`}
      >
        {allShapes}
        <AxisLeft yScale={yScale} pixelsPerTick={30} />
        <g transform={`translate(0, ${boundsHeight})`}>
          <AxisBottom xScale={xScale} />
        </g>
      </g>
      {/* Y-axis Label */}
      <text
        transform={`translate(${MARGIN.left / 2}, ${height / 2}) rotate(-90)`}
        textAnchor="middle"
        fontSize="12"
        fill="black"
      >
        {yAxis}
      </text>
      {/* X-axis Label */}
      <text
        transform={`translate(${width / 2}, ${height - MARGIN.bottom / 2})`}
        textAnchor="middle"
        fontSize="12"
        fill="black"
      >
        District
      </text>
    </svg>
  );
};