import { useEffect, useState } from 'react';
import BarChart from './BarChart';
import axios from 'axios';
import { 
    // AR_IncomeVotingData,
    // NY_IncomeVotingData,
    // AR_RaceVotingData,
    // NY_RaceVotingData,
    // AR_AgeVotingData,
    // NY_AgeVotingData 
} from '../chartData';

import '../Chart.css';
import { Box, Text, Button, ButtonGroup } from '@chakra-ui/react';
import { ChartDataItem } from './ChartDataItemInterface';

interface BaseChartProps{
    selectedState: string;
	dataArray: ChartDataItem[];
}

export default function BaseChart({selectedState, dataArray} : BaseChartProps){

	const [metadata, setMetadata] = useState();
	const [chartData, setChartData] = useState<ChartDataItem[]>([]);

	useEffect(() => {
		axios.post("http://localhost:8080/getchartdata")
		.then(res => {
			setMetadata(res.data.metadata);
			setChartData(res.data.chartData);
		})
	}, []);
	
	const [stringArrayPlaceholder, setStringArrayPlaceholder] = useState<string[]>([]);
	const [numberArrayPlaceholder, setNumberArrayPlaceholder] = useState<number[]>([]);

	useEffect(() => {
		// const labels: string[] = Object.keys(dataArray[0].income);

		let temp_AR_income_labels: string[] = [];
		let temp_AR_income_values: number[] = [];

		(dataArray[0].income).forEach(e => {
			// set_AR_Income_Data_Labels((prev) => [...prev, Object.keys(e)[0]]);
			// set_AR_Income_Data_Values((prev) => [...prev, Object.values(e)[0]]);
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

		// set_AR_Income_Data_Labels(temp_AR_income_labels);
		// set_AR_Income_Data_Values(temp_AR_income_values);

		// console.log(NY_IncomeVotingData.map((data) => data.income));
		// console.log(AR_Income_Data_Labels);


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

	// if(!isReady){
	// 	return <p>loading</p>;
	// }

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
        </Box> : <></>)
        
    )
}