// ChartDataItemInterface.ts

interface IncomeGroup {
	[key: string]: number;
  }
  
  interface RaceGroup {
	[key: string]: number;
  }
  
  interface AgeGroup {
	[key: string]: number;
  }
  
  export interface ChartDataItem {
	state: string;
	stateCode: string;
	overview: {
	  party: string;
	  population: number;
	  voterTurnout: number;
	  republicanPopularVote: number;
	  democratPopularVote: number;
	  medianIncome: number;
	};
	income: IncomeGroup[];
	race: RaceGroup[];
	age: AgeGroup[];
  }
  
export type VisualizationType = 'standard' | 'goodman' | 'hierarchical' | 'gingles' | 'summary' | 'districtDetail';

export type GingleMode = 'Income' | 'Demographic' | 'Income/Race'