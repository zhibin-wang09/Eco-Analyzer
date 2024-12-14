import React, { useMemo } from "react";
import * as d3 from "d3";

// Define the DataPoint interface
export interface DataPoint {
  range: string;
  posteriorMean: number;
  interval: [number, number]; // 95% credible interval
}

// Function to compute density
function kernelDensityEstimator(kernel: (v: number) => number, X: number[]) {
  return function (V: number[]): [number, number][] {
    return X.map(function (x) {
      // Compute the kernel density estimate
      const densityValue = d3.mean(V, function (v) {
        return kernel(x - v);
      });

      // If the density value is undefined, return 0 to ensure valid [number, number]
      return [x, densityValue || 0];  // Default to 0 if undefined
    });
  };
}

// Epanechnikov kernel for KDE
function kernelEpanechnikov(k: number) {
  return function (v: number) {
    return Math.abs((v /= k)) <= 1 ? (0.75 * (1 - v * v)) / k : 0;
  };
}

interface KDEGraphProps {
  width: number;
  height: number;
  data: DataPoint[];
}

const KDEGraph: React.FC<KDEGraphProps> = ({ width, height, data }) => {
  // Extract posteriorMeans and intervals from data
  const posteriorMeans = data.map((d) => d.posteriorMean);
  const intervals = data.map((d) => d.interval);

  // X scale (Proportion scale)
  const xScale = useMemo(() => {
    return d3
      .scaleLinear()
      .domain([0, 1]) // Proportion range (posterior mean between 0 and 1)
      .range([10, width - 10]);
  }, [width]);

  // Compute kernel density estimation
  const density = useMemo(() => {
    const kde = kernelDensityEstimator(kernelEpanechnikov(0.05), xScale.ticks(40)); // Bandwidth of 0.05
    return kde(posteriorMeans); // Use posteriorMeans for the density computation
  }, [posteriorMeans, xScale]);

  // Y scale (Density scale)
  const yScale = useMemo(() => {
    const max = Math.max(...density.map((d) => d[1]));
    return d3.scaleLinear().range([height, 10]).domain([0, max]);
  }, [density, height]);

  // Line generator for KDE
  const lineGenerator = d3
    .line()
    .x((d: any) => xScale(d[0]))
    .y((d: any) => yScale(d[1]))
    .curve(d3.curveBasis);

  // Path data for the KDE line
  const path = useMemo(() => {
    return lineGenerator(density);
  }, [density, lineGenerator]);

  // Create shaded areas for the credible intervals
  const shadedAreas = useMemo(() => {
    return data.map((d, index) => {
      const [lower, upper] = d.interval;

      // Create a shaded area from the lower bound to the upper bound
      return (
        <path
          key={index}
          d={`M ${xScale(lower)} ${yScale(0)} L ${xScale(lower)} ${yScale(1)} L ${xScale(upper)} ${yScale(1)} L ${xScale(upper)} ${yScale(0)} Z`}
          fill="rgba(100, 100, 255, 0.3)" // Light blue color for shading
          stroke="none"
        />
      );
    });
  }, [xScale, yScale, data]);

  return (
    <svg width={width} height={height}>
      {/* Render the kernel density estimation line */}
      <path d={path!} fill="none" stroke="black" strokeWidth={2} />

      {/* Render shaded regions for the intervals */}
      {shadedAreas}

      {/* Render the X-axis (proportion) */}
      <g transform={`translate(0,${height - 10})`}>
        {xScale.ticks(5).map((tick, i) => (
          <g key={i} transform={`translate(${xScale(tick)}, 0)`}>
            <line y2="6" stroke="black" />
            <text dy=".71em" textAnchor="middle" y="9">
              {tick.toFixed(2)} {/* Proportion labels */}
            </text>
          </g>
        ))}
      </g>

      {/* Render the Y-axis (density) */}
      <g transform="translate(10, 0)">
        {yScale.ticks(5).map((tick, i) => (
          <g key={i} transform={`translate(0,${yScale(tick)})`}>
            <line x2={width - 20} stroke="black" />
            <text dx="-10" dy="4" textAnchor="middle">
              {tick.toFixed(2)} {/* Density labels */}
            </text>
          </g>
        ))}
      </g>
    </svg>
  );
};

export default KDEGraph;