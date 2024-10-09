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
		meanIncome: number;
	};
	income: IncomeGroups[];
	race: RaceGroups[];
	age: AgeGroups[];
}

interface IncomeGroups {
	range: string,
	percentage: number
}

interface RaceGroups {
	race: string,
	population: number
}

interface AgeGroups {
	range: string,
	population: number
}