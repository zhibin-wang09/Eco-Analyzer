export default interface StateSummary {
  racialPopulation: {
    other: number;
    americanIndian: number;
    white: number;
    nativeHawaiian: number;
    black: number;
    asian: number;
    hispanicOrLatino: number;
  };
  populationByIncome: {
    "0-25k": number;
    "25k-50k": number;
    "50k-75k": number;
    "75k-100k": number;
    "100k+": number;
  };
  voteDistribution: {
    republicanVotes: number;
    democraticVotes: number;
    otherVotes: number;
  };
  congressionalRepresentatives: {
    name: string;
    party: string;
  }[];
  populationPercentageByRegion: {
    rural: number;
    urban: number;
    suburban: number;
  };
  population: number;
}

