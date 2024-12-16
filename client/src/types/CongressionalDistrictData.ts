
export interface CongressionalDistrictDataJson {
  geoId: string;
  data: {
    rep: any;
    party: any;
    averageIncome: any;
    povertyPercentage: any;
    ruralPercentage: any;
    subUrbanPercentage: any;
    urbanPercentage: any;
    trumpVotes: number;
    bidenVotes: number;
  };
}
interface CongressionalDistrictData {
    district: number;
    representative: string;
    party: string;
    averageHouseholdIncome: number;
    povertyPercentage: number;
    regionType: {
      rural: number;
      urban: number;
      suburban: number;
    };
    voteMargin: number;
}

export interface SplitFrequencies {
  [key: string]: number;
}

export interface EnsembleSummaryData {
  total_districts: number;
  republican_democratic_split: string;
  total_democratic_votes: number;
  total_plans: number;
  total_republican_votes: number;
  split_frequencies: SplitFrequencies;
  population_threshold: string;
  offset: string;
}

export default CongressionalDistrictData;
