export interface BoxPlot {
  min: number;
  q1: number;
  median: number;
  q3: number;
  max: number;
}

export interface Dot {
  regionType: string;
  percentage: number;
}

export interface DataItem {
  id: string;
  geoId: string;
  stateId: number;
  regionType: string;
  category: string;
  range: string;
  boxPlot: BoxPlot;
  dot: Record<string, Dot>; // Mapping geoId to Dot objects
}