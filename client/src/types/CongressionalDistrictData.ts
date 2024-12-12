
interface CongressionalDistrictData {
    district: string;
    representative: string;
    party: string;
    ethnicity: string;
    income: number;
    poverty: number;
    regionType: {
      rural: number;
      urban: number;
      suburban: number;
    };
    voteMargin: number;
}

export default CongressionalDistrictData;