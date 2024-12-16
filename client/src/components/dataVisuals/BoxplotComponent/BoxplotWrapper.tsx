import { useMemo } from "react";
import * as d3 from "d3";
import { AxisLeft } from "./AxisLeft";
import { AxisBottom } from "./AxisBottomCategoric";
import { VerticalBox } from "./VerticalBox";
import { Tooltip } from "@chakra-ui/react"; // Optional: For tooltips

const MARGIN = { top: 50, right: 30, bottom: 100, left: 100 }; // Increased top margin for potential legend space
const DOT_RADIUS = 3;
const DOT_COLOR = "#FF6B6B"; // Customize as needed
const LEGEND_SPACING = 0; // Space between legend items
const LEGEND_PADDING = 10; // Padding inside the legend box

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
    dot: {
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
    const boxMax = d3.max(data.map((d) => d.boxPlot.max))!;
    const dotMax = d3.max(
      data.flatMap((d) => d.dot ? Object.values(d.dot).map(dot => dot.percentage) : [])
    ) || 0;
    const overallMax = Math.max(boxMax, dotMax);
    const groups = data.map((d) => d.geoId);
    return { chartMax: overallMax, groups };
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

  // Define Legend Items (Only Dots)
  const legendItems = useMemo(() => {
    return [
      {
        type: "dot",
        color: DOT_COLOR,
        label: "Enacted",
      },
      // Future legend items can be added here
    ];
  }, []);

  // Render the box plot shapes and dots for each group
  const allShapes = useMemo(() => {
    return groups.map((geoId, i) => {
      const groupData = data.find((d) => d.geoId === geoId);
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
            <Tooltip
              key={`${geoId}-dot-${index}`} // Unique key combining geoId and index
              label={`Region: ${dot.regionType}\nPercentage: ${dot.percentage.toFixed(1)}`}
              aria-label={`Tooltip for dot ${index}`}
              placement="top"
            >
              <circle
                cx={xScale.bandwidth() / 2} // Center within the box
                cy={yScale(dot.percentage)} // Slight vertical jitter
                r={DOT_RADIUS}
                fill={DOT_COLOR}
                stroke="black"
              />
            </Tooltip>
          ))}
        </g>
      );
    });
  }, [groups, data, xScale, yScale]);

  // Calculate Legend Position (Lower Right)
  const legendX = boundsWidth-60; // Adjust based on legend width
  const legendY = boundsHeight - (legendItems.length * LEGEND_SPACING) - LEGEND_PADDING; // Positioned above the bottom

  // Determine legend box dimensions
  const legendWidth = 90; // Fixed width for the legend box
  const legendHeight = legendItems.length * LEGEND_SPACING + LEGEND_PADDING * 2; // Dynamic height based on number of items

  return (
    <svg width={width} height={height}>
      <g
        width={boundsWidth}
        height={boundsHeight}
        transform={`translate(${MARGIN.left},${MARGIN.top})`}
      >
        {/* Box Plots and Dots */}
        {allShapes}

        {/* Axes */}
        <AxisLeft yScale={yScale} pixelsPerTick={30} />
        <g transform={`translate(0, ${boundsHeight})`}>
          <AxisBottom xScale={xScale} />
        </g>

        {/* Legend */}
        <g transform={`translate(${legendX}, ${legendY})`}>
          {/* Legend Box */}
          <rect
            x={-LEGEND_PADDING}
            y={-LEGEND_PADDING}
            width={legendWidth}
            height={legendHeight}
            fill="rgba(255, 255, 255, 0.8)" // Semi-transparent white background
            stroke="#000000" // Black border
            rx={5} // Rounded corners
            ry={5}
          />
          {/* Legend Items */}
          {legendItems.map((item, index) => {
            const yPosition = index * LEGEND_SPACING;
            return (
              <g key={index} transform={`translate(0, ${yPosition})`}>
                {item.type === "dot" && (
                  <>
                    <circle
                      cx={0}
                      cy={0}
                      r={DOT_RADIUS}
                      fill={item.color}
                      stroke="black"
                    />
                    <text
                      x={20}
                      y={0}
                      alignmentBaseline="middle"
                      fontSize="12"
                      fill="black"
                    >
                      {item.label}
                    </text>
                  </>
                )}
                {/* Future legend item types can be handled here */}
              </g>
            );
          })}
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