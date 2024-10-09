import { useState } from 'react';
import BarChart from './BarChart';
import { 
    AR_IncomeVotingData,
    NY_IncomeVotingData,
    AR_RaceVotingData,
    NY_RaceVotingData,
    AR_AgeVotingData,
    NY_AgeVotingData 
} from '../chartData';

import '../Chart.css';
import { Box, Text, Button, ButtonGroup } from '@chakra-ui/react';

interface BaseChartProps{
    selectedState: string | null;
}

export default function BaseChart({selectedState} : BaseChartProps){

    const [AR_IncomeData, setAR_IncomeData] = useState(
        {
          labels: AR_IncomeVotingData.map((data) => data.income),
          datasets: [
            {
              label: "Household Percentage",
              data: AR_IncomeVotingData.map((data) => data.percentage),
              backgroundColor: ["green"]
            }
          ]
        }
    );
    
    const [NY_IncomeData, setNY_IncomeData] = useState(
        {
          labels: NY_IncomeVotingData.map((data) => data.income),
          datasets: [
            {
              label: "Household Percentage",
              data: NY_IncomeVotingData.map((data) => data.percentage),
              backgroundColor: ["green"]
            }
          ]
        }
    );

    const [AR_RaceData, setAR_RaceData] = useState(
        {
          labels: AR_RaceVotingData.map((data) => data.race),
          datasets: [
            {
              label: "Voting Percentage",
              data: AR_RaceVotingData.map((data) => data.population),
              backgroundColor: ["grey"]
            }
          ]
        }
    );

    const [NY_RaceData, setNY_RaceData] = useState(
        {
          labels: NY_RaceVotingData.map((data) => data.race),
          datasets: [
            {
              label: "Voting Percentage",
              data: NY_RaceVotingData.map((data) => data.population),
              backgroundColor: ["grey"]
            }
          ]
        }
    );

    const [AR_AgeData, setAR_AgeData] = useState(
        {
          labels: AR_AgeVotingData.map((data) => data.age),
          datasets: [
            {
              label: "Voting Percentage",
              data: AR_AgeVotingData.map((data) => data.population),
              backgroundColor: ["orange"]
            }
          ]
        }
    );

    const [NY_AgeData, setNY_AgeData] = useState(
        {
          labels: NY_AgeVotingData.map((data) => data.age),
          datasets: [
            {
              label: "Voting Percentage",
              data: NY_AgeVotingData.map((data) => data.population),
              backgroundColor: ["orange"]
            }
          ]
        }
    );

    const [dataType, setDataType] = useState('Income');

    const setToIncome = () => {
        setDataType('Income');
    }

    const setToRace = () => {
        setDataType('Race');
    }

    const setToAge = () => {
        setDataType('Age');
    }

    return(
        (selectedState !== "State" ? <Box  marginLeft="5">
            <Box style={{width: 600}}>

                <Text className='chart_title_font' fontSize="3xl">
                    {selectedState} {dataType}
                </Text>

                {(selectedState === 'Arkansas' && dataType === 'Income') && (
                    <BarChart chartData={AR_IncomeData}/>
                )}

                {(selectedState === 'Arkansas' && dataType === 'Race') && (
                    <BarChart chartData={AR_RaceData}/>
                )}

                {(selectedState === 'Arkansas' && dataType === 'Age') && (
                    <BarChart chartData={AR_AgeData}/>
                )}

                {(selectedState === 'New York' && dataType === 'Income') && (
                    <BarChart chartData={NY_IncomeData}/>
                )}

                {(selectedState === 'New York' && dataType === 'Race') && (
                    <BarChart chartData={NY_RaceData}/>
                )}

                {(selectedState === 'New York' && dataType === 'Age') && (
                    <BarChart chartData={NY_AgeData}/>
                )}
            </Box>

            <ButtonGroup pt='5'>
                <Button onClick={setToIncome}>Income</Button>
                <Button onClick={setToAge}>Age</Button>
                <Button onClick={setToRace}>Race</Button>
            </ButtonGroup>
        </Box> : <></>)
        
    )
}