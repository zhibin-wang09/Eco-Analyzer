import React, { useMemo } from "react";
import * as d3 from "d3";

// Enhanced DataPoint interface to support multiple groups
export interface DataPoint {
  id?: string;
  range: string;
  candidate?: string;
  category?: string;
  posteriorMean: number;
  interval: [number, number]; // 95% credible interval
  color?: string; // Optional color for each group
}

// Kernel Density Estimator with more flexible implementation
function kernelDensityEstimator(
  kernel: (v: number) => number, 
  X: number[], 
  bandwidth: number = 0.05
) {
  return function (V: number[]): [number, number][] {
    return X.map(function (x) {
      const densityValue = d3.mean(V, function (v) {
        return kernel((x - v) / bandwidth);
      });

      return [x, densityValue || 0];
    });
  };
}

// Epanechnikov kernel with adjustable bandwidth
function kernelEpanechnikov(bandwidth: number) {
  return function (v: number) {
    return Math.abs(v) <= 1 ? 0.75 * (1 - v * v) : 0;
  };
}

interface KDEGraphProps {
  width: number;
  height: number;
  data: DataPoint[];
  bandwidth?: number; // Optional custom bandwidth
}

const KDEGraph: React.FC<KDEGraphProps> = ({ 
  width, 
  height, 
  data, 
  bandwidth = 0.05 
}) => {
  // Prepare color scale for multiple groups
  const colorScale = useMemo(() => {
    // Explicitly filter out undefined categories and convert to string
    const uniqueCategories = Array.from(
      new Set(
        data
          .map(d => d.category)
          .filter((category): category is string => category !== undefined)
      )
    );
    
    return d3.scaleOrdinal()
      .domain(uniqueCategories)
      .range(d3.schemeCategory10);
  }, [data]);

  // Extract posteriorMeans
  const posteriorMeans = data.map((d) => d.posteriorMean);

  // Compute overall domain for X scale (proportion)
  const xDomain = useMemo(() => {
    const allIntervals = data.flatMap(d => d.interval);
    return [
      Math.min(...allIntervals) * 0.95, 
      Math.max(...allIntervals) * 1.05
    ];
  }, [data]);

  // X scale (Proportion scale)
  const xScale = useMemo(() => {
    return d3
      .scaleLinear()
      .domain(xDomain)
      .range([40, width - 40]);
  }, [width, xDomain]);

  // Compute kernel density estimation for each group
  const densityData = useMemo(() => {
    const kde = kernelDensityEstimator(
      kernelEpanechnikov(bandwidth),
      xScale.ticks(100)
    );

    return data.map(group => ({
      group,
      density: kde(
        // Sample points around the posterior mean and interval
        [
          ...group.interval, 
          group.posteriorMean,
          ...(Array(10).fill(0).map((_, i) => 
            group.posteriorMean + (Math.random() - 0.5) * (group.interval[1] - group.interval[0])
          ))
        ]
      )
    }));
  }, [data, xScale, bandwidth]);

  // Y scale (Density scale)
  const yScale = useMemo(() => {
    const maxDensity = Math.max(...densityData.flatMap(
      d => d.density.map(point => point[1])
    ));
    return d3
      .scaleLinear()
      .range([height - 40, 40])
      .domain([0, maxDensity * 1.1]);
  }, [densityData, height]);

  // Line generator for KDE
  const lineGenerator = d3
    .line()
    .x((d: any) => xScale(d[0]))
    .y((d: any) => yScale(d[1]))
    .curve(d3.curveBasis);

  return (
    <svg width={width} height={height}>
      {/* KDE Lines and Shaded Areas */}
      {densityData.map((data, index) => {
        const color = data.group.color || 
          (data.group.category 
            ? colorScale(data.group.category) as string 
            : d3.schemeCategory10[index % 10]);
        
        return (
          <React.Fragment key={index}>
            {/* Shaded Area */}
            <path
              d={`
                ${lineGenerator(data.density)!} 
                L ${xScale(data.group.interval[1])} ${yScale(0)}
                L ${xScale(data.group.interval[0])} ${yScale(0)}
                Z
              `}
              fill={color}
              opacity={0.2}
            />

            {/* Density Line */}
            <path
              d={lineGenerator(data.density)!}
              fill="none"
              stroke={color}
              strokeWidth={2}
            />

            {/* Posterior Mean Point */}
            <circle
              cx={xScale(data.group.posteriorMean)}
              cy={yScale(0)}
              r={5}
              fill={color}
            />
          </React.Fragment>
        );
      })}

      {/* X-axis */}
      <g transform={`translate(0,${height - 40})`}>
        <path d={`M40 0 H${width - 40}`} stroke="black" />
        {xScale.ticks(5).map((tick, i) => (
          <g key={i} transform={`translate(${xScale(tick)}, 0)`}>
            <line y2="6" stroke="black" />
            <text dy=".71em" textAnchor="middle" y="15">
              {tick.toFixed(2)}
            </text>
          </g>
        ))}
        <text 
          x={width / 2} 
          y={40} 
          textAnchor="middle"
          fontWeight="bold"
        >
          Proportion
        </text>
      </g>

      {/* Y-axis */}
      <g transform={`translate(40, 0)`}>
        <path d={`M0 ${height - 40} V40`} stroke="black" />
        {yScale.ticks(5).map((tick, i) => (
          <g key={i} transform={`translate(0, ${yScale(tick)})`}>
            <line x2="6" stroke="black" />
            <text dx="-30" dy="4" textAnchor="middle">
              {tick.toFixed(2)}
            </text>
          </g>
        ))}
        <text
          transform="rotate(-90)"
          x={-height / 2}
          y={-10}
          textAnchor="middle"
          fontWeight="bold"
        >
          Density
        </text>
      </g>
    </svg>
  );
};

export default KDEGraph;