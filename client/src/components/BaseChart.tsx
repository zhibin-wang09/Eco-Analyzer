import React, { useState } from 'react';
import BarChart from './BarChart';
import { AR_IncomeVotingData, NY_IncomeVotingData } from '../chartData';

export default function BaseChart(){

    const [AR_IncomeData, setAR_IncomeData] = useState(
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
    
    const [NY_IncomeData, setNY_IncomeData] = useState(
        {
          labels: NY_IncomeVotingData.map((data) => data.income),
          datasets: [
            {
              label: "Voting Percentage",
              data: NY_IncomeVotingData.map((data) => data.percentage),
              backgroundColor: ["blue", "red"]
            }
          ]
        }
    );

    return(
        <div style={{width: 600}}>
            <BarChart chartData={NY_IncomeData}/>
        </div>
    )
}