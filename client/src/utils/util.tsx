import StateSummary from "../types/StateSummary";

export const stateConversion = (state: string | undefined) => {
    switch(state){
        case 'New York':
            return "newyork";
        case 'Arkansas':
            return "arkansas"
        default:
            return '';
    }
}


export const objectToArray = (stateData: { [key: string]: number } | undefined) => {
    const data: { [key: string]: number } | undefined = stateData
    if (!data) return [];
    // Convert to an array of objects

    const transformedData = Object.entries(data).map(
      ([name, value]) => ({
        name,
        value,
      })
    );

    const sortedIncomeData = transformedData.sort((a, b) => {
      const parseRange = (range: string) => {
        const parts = range
          .split("-")
          .map((part) => part.replace("k", "").replace("+", ""));
        return parseInt(parts[0]); // Return the lower bound
      };

      return parseRange(a.name) - parseRange(b.name);
    });

    return sortedIncomeData;
  }