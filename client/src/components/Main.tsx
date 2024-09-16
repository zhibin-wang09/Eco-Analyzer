import React, { useState } from 'react';
import { Box, Flex, useBreakpointValue, ResponsiveValue } from '@chakra-ui/react';
import USMap from './USMap';
import Sidebar from './SideBar';

import BarChart from './BarChart';
import {AR_IncomeVotingData} from '../chartData';

const MainLayout = () => {
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [userData, setUserData] = useState(
    {
      labels: AR_IncomeVotingData.map((data) => data.income),
      datasets: [
        {
          label: "Voting Percentage",
          data: AR_IncomeVotingData.map((data) => data.percentage),
          backgroundColor: ["blue", "red"]
        }
      ]
    }
  );
  
  const direction = useBreakpointValue({ 
    base: "column", 
    md: "row" 
  }) as ResponsiveValue<"column" | "row">;

  return (
    <Flex 
      direction={direction}
      width="100%" 
      height={{ base: "auto", md: "100vh" }}
      p={4}
      gap={4}
    >
      <Box flex={1}>
        <USMap onStateSelect={setSelectedState} />
      </Box>
      <Sidebar selectedState={selectedState} />

      <div style={{width: 600}}>
        <BarChart chartData={userData}/>
      </div>
      
    </Flex>

  );
};

export default MainLayout;