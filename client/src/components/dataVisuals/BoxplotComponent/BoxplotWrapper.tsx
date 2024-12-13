import { useMemo } from "react";
import * as d3 from "d3";
import { AxisLeft } from "./AxisLeft";
import { AxisBottom } from "./AxisBottomCategoric";
import { VerticalBox } from "./VerticalBox";

const MARGIN = { top: 30, right: 30, bottom: 100, left: 100 }; // Increased bottom and left margins for labels
const JITTER_WIDTH = 40;

type BoxplotWrapperProps = {
  width: number;
  height: number;
  data: { geoId: string; boxPlot: { min: number; q1: number; median: number; q3: number; max: number } }[];
  yAxis: string;
};

export const BoxplotWrapper = ({ width, height, data, yAxis }: BoxplotWrapperProps) => {
  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;

  // Compute derived data
  const { chartMax, groups } = useMemo(() => {
    const chartMax = d3.max(data.map((d) => d.boxPlot.max))!;
    const groups = data.map((d) => d.geoId);
    return { chartMax, groups };
  }, [data]);

  // Y Scale: Start from 0 and go to the maximum value
  const yScale = d3.scaleLinear().domain([0, chartMax]).range([boundsHeight, 0]);

  // X Scale
  const xScale = d3.scaleBand().range([0, boundsWidth]).domain(groups).padding(0.25);

  // Color Scale
  const colorScale = d3
    .scaleOrdinal<string>()
    .domain(groups)
    .range(["#e0ac2b", "#e85252", "#6689c6", "#9a6fb0", "#a53253"]);

  // Render the shapes for each group
  const allShapes = groups.map((geoId, i) => {
    const boxData = data.find((d) => d.geoId === geoId)?.boxPlot;
    if (!boxData) return null;

    const { min, q1, median, q3, max } = boxData;

    return (
      <g key={i} transform={`translate(${xScale(geoId)},0)`}>
        <VerticalBox
          width={xScale.bandwidth()}
          q1={yScale(q1)}
          median={yScale(median)}
          q3={yScale(q3)}
          min={yScale(min)}
          max={yScale(max)}
          stroke="black"
          fill={colorScale(geoId)}
        />
      </g>
    );
  });

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