type VerticalBoxProps = {
  min: number;
  q1: number;
  median: number;
  q3: number;
  max: number;
  width: number;
  stroke: string;
  fill: string;
};

export const VerticalBox = ({
  min,
  q1,
  median,
  q3,
  max,
  width,
  stroke,
  fill,
}: VerticalBoxProps) => {
  const centerX = width / 2; // Center point for vertical lines

  return (
    <>
      {/* Whisker (bottom to top line) */}
      <line
        x1={centerX}
        x2={centerX}
        y1={min}
        y2={max}
        stroke={stroke}
        strokeWidth={1} // Thin stroke for whiskers
      />

      {/* Horizontal line for min */}
      <line
        x1={centerX - width / 4}
        x2={centerX + width / 4}
        y1={min}
        y2={min}
        stroke={stroke}
        strokeWidth={1}
      />

      {/* Horizontal line for max */}
      <line
        x1={centerX - width / 4}
        x2={centerX + width / 4}
        y1={max}
        y2={max}
        stroke={stroke}
        strokeWidth={1}
      />

      {/* Box (IQR) */}
      <rect
        x={0}
        y={q3}
        width={width}
        height={q1 - q3} // Height spans from Q1 to Q3
        stroke={stroke}
        fill={fill}
        strokeWidth={1}
      />

      {/* Median line */}
      <line
        x1={0}
        x2={width}
        y1={median}
        y2={median}
        stroke={stroke}
        strokeWidth={1}
      />
    </>
  );
};