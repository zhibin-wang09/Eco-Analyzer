
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

export default CongressionalDistrictData;
