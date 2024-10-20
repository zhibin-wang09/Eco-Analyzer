import { useEffect, useState } from 'react';
import BarChart from './BarChart';

import '../Chart.css';
import { Box, Text, Button, ButtonGroup } from '@chakra-ui/react';
import { ChartDataItem } from './ChartDataItemInterface';

interface BaseChartProps{
    selectedState: string;
	dataArray: ChartDataItem[];
}

export default function BaseChart({selectedState, dataArray} : BaseChartProps){
	
	const [stringArrayPlaceholder, setStringArrayPlaceholder] = useState<string[]>([]);
	const [numberArrayPlaceholder, setNumberArrayPlaceholder] = useState<number[]>([]);

	const [AR_IncomeData, setAR_IncomeData] = useState(
		{
			labels: stringArrayPlaceholder,
			datasets: [
			  {
				label: "Household Percentage",
				data: numberArrayPlaceholder,
				backgroundColor: ["green"]
			  }
			]
		}
    );
    
    const [NY_IncomeData, setNY_IncomeData] = useState(
        {
          labels: stringArrayPlaceholder,
          datasets: [
            {
              label: "Household Percentage",
              data: numberArrayPlaceholder,
              backgroundColor: ["green"]
            }
          ]
        }
    );

    const [AR_RaceData, setAR_RaceData] = useState(
        {
			labels: stringArrayPlaceholder,
			datasets: [
				{
					label: "Voting Percentage",
					data: numberArrayPlaceholder,
					backgroundColor: ["grey"]
				}
			]
        }
    );

    const [NY_RaceData, setNY_RaceData] = useState(
        {
          labels: stringArrayPlaceholder,
          datasets: [
            {
              label: "Voting Percentage",
              data: numberArrayPlaceholder,
              backgroundColor: ["grey"]
            }
          ]
        }
    );

    const [AR_AgeData, setAR_AgeData] = useState(
        {
          labels: stringArrayPlaceholder,
          datasets: [
            {
              label: "Voting Percentage",
              data: numberArrayPlaceholder,
              backgroundColor: ["orange"]
            }
          ]
        }
    );

    const [NY_AgeData, setNY_AgeData] = useState(
        {
          labels: stringArrayPlaceholder,
          datasets: [
            {
              label: "Voting Percentage",
              data: numberArrayPlaceholder,
              backgroundColor: ["orange"]
            }
          ]
        }
    );

	useEffect(() => {

		let temp_AR_income_labels: string[] = [];
		let temp_AR_income_values: number[] = [];

		(dataArray[0].income).forEach(e => {
			temp_AR_income_labels.push(Object.keys(e)[0]);
			temp_AR_income_values.push(Object.values(e)[0]);
		})

		setAR_IncomeData(
			{
				labels: temp_AR_income_labels,
				datasets: [
					{
						label: "Household Percentage",
						data: temp_AR_income_values,
						backgroundColor: ["green"]
					}
				]
			}
		)

		let temp_AR_race_labels: string[] = [];
		let temp_AR_race_values: number[] = [];

		(dataArray[0].race).forEach(e => {
			temp_AR_race_labels.push(Object.keys(e)[0]);
			temp_AR_race_values.push(Object.values(e)[0]);
		});

		setAR_RaceData(
			{
				labels: temp_AR_race_labels,
				datasets: [
					{
						label: "Voting Percentage",
						data: temp_AR_race_values,
						backgroundColor: ["grey"]
					}
				]
			}
		);

		let temp_AR_age_labels: string[] = [];
		let temp_AR_age_values: number[] = [];

		(dataArray[0].age).forEach(e => {
			temp_AR_age_labels.push(Object.keys(e)[0]);
			temp_AR_age_values.push(Object.values(e)[0]);
		});

		setAR_AgeData(
			{
				labels: temp_AR_age_labels,
				datasets: [
					{
						label: "Voting Percentage",
						data: temp_AR_age_values,
						backgroundColor: ["orange"]
					}
				]
			}
		);
		

		let temp_NY_income_labels: string[] = [];
		let temp_NY_income_values: number[] = [];

		(dataArray[1].income).forEach(e => {
			temp_NY_income_labels.push(Object.keys(e)[0]);
			temp_NY_income_values.push(Object.values(e)[0]);
		});

		setNY_IncomeData(
			{
				labels: temp_NY_income_labels,
				datasets: [
					{
						label: "Voting Percentage",
						data: temp_NY_income_values,
						backgroundColor: ["green"]
					}
				]
			}
		);

		let temp_NY_race_labels: string[] = [];
		let temp_NY_race_values: number[] = [];

		(dataArray[1].race).forEach(e => {
			temp_NY_race_labels.push(Object.keys(e)[0]);
			temp_NY_race_values.push(Object.values(e)[0]);
		});

		setNY_RaceData(
			{
				labels: temp_NY_race_labels,
				datasets: [
					{
						label: "Voting Percentage",
						data: temp_NY_race_values,
						backgroundColor: ["grey"]
					}
				]
			}
		);

		let temp_NY_age_labels: string[] = [];
		let temp_NY_age_values: number[] = [];

		(dataArray[1].age).forEach(e => {
			temp_NY_age_labels.push(Object.keys(e)[0]);
			temp_NY_age_values.push(Object.values(e)[0]);
		});

		setNY_AgeData(
			{
				labels: temp_NY_age_labels,
				datasets: [
					{
						label: "Voting Percentage",
						data: temp_NY_age_values,
						backgroundColor: ["orange"]
					}
				]
			}
		);


	}, [dataArray]);

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
        (selectedState !== null && selectedState !== "Default" ? <Box>
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

			{(selectedState === 'Arkansas') && (
				<div className='clean_this'>
					<p>
						Party: {dataArray[0].overview.party}
					</p>
					<p>
						Total Population: {dataArray[0].overview.population}
					</p>
					<p>
						Voter Turnout: {dataArray[0].overview.voterTurnout}%
					</p>
					<p>
						Republican Votes: {dataArray[0].overview.republicanPopularVote} Votes
					</p>
					<p>
						Democrat Votes: {dataArray[0].overview.democratPopularVote} Votes
					</p>
					<p>
						Median Household Income: ${dataArray[0].overview.medianIncome} 
					</p>
				</div>
			)}
			{(selectedState === 'New York') && (
				<div className='clean_this'>
					<p>
						Party: {dataArray[1].overview.party}
					</p>
					<p>
						Total Population: {dataArray[1].overview.population}
					</p>
					<p>
						Voter Turnout: {dataArray[1].overview.voterTurnout}%
					</p>
					<p>
						Republican Votes: {dataArray[1].overview.republicanPopularVote} Votes
					</p>
					<p>
						Democrat Votes: {dataArray[1].overview.democratPopularVote} Votes
					</p>
					<p>
						Median Household Income: ${dataArray[1].overview.medianIncome} 
					</p>
				</div>
			)}
        </Box> : <></>)
    )
}