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

// interface ChartDataItem {
// 	state: string;
// 	stateCode: string;
// 	overview: {
// 		party: string;
// 		population: number;
// 		voterTurnout: number;
// 		republicanPopularVote: number;
// 		democratPopularVote: number;
// 		medianIncome: number;
// 		meanIncome: number;
// 	  };
// 	  income: {
// 		'0-24999': number;
// 		'25000-49999': number;
// 		'50000-74999': number;
// 		'75000-99999': number;
// 		'100000': number;
// 	  };
// 	  age: {
// 		'Under 18': number;
// 		'18-24': number;
// 		'25-34': number;
// 		'55-64': number;
// 		'65 and over': number;
// 	  };
// 	  race: {
// 		white: number;
// 		black: number;
// 		asian: number;
// 		hispanic: number;
// 		other: number;
// 		mixed: number;
// 	  };
// }

interface IncomeData {
	id: number;
	income: string;
	percentage: number;
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

	const [AR_Income_Data_Labels, set_AR_Income_Data_Labels] = useState<string[]>([]);
	const [AR_Income_Data_Values, set_AR_Income_Data_Values] = useState<number[]>([]);

	const [AR_Race_Data_Labels, set_AR_Race_Data_Labels] = useState<string[]>([]);
	const [AR_Race_Data_Values, set_AR_Race_Data_Values] = useState<number[]>([]);

	const [AR_Age_Data_Labels, set_AR_Age_Data_Labels] = useState<string[]>([]);
	const [AR_Age_Data_Values, set_AR_Age_Data_Values] = useState<number[]>([]);
	

	const [NY_Income_Data_Labels, set_NY_Income_Data_Labels] = useState<string[]>([]);
	const [NY_Income_Data_Values, set_NY_Income_Data_Values] = useState<number[]>([]);

	const [NY_Race_Data_Labels, set_NY_Race_Data_Labels] = useState<string[]>([]);
	const [NY_Race_Data_Values, set_NY_Race_Data_Values] = useState<number[]>([]);
	
	const [NY_Age_Data_Labels, set_NY_Age_Data_Labels] = useState<string[]>([]);
	const [NY_Age_Data_Values, set_NY_Age_Data_Values] = useState<number[]>([]);
	
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



	
	// const [ARIncomeData, setARIncomeData] = useState<number[]>([]);

	// useEffect(() => {
	// 	if(chartData && chartData.length > 0){
	// 		const x: number[] = Object.values(chartData[0].income);
	// 		setARIncomeData(x);
	// 	}
	// }, [ARIncomeData])

	

	useEffect(() => {
		if (chartData && chartData.length) {
			// console.log(chartData[0]);
				const labels: string[] = Object.keys(chartData[0].income);
				set_AR_Income_Data_Labels(labels);

			// console.log(labels);
			// console.log(chartData);


			
		}

		console.log(AR_Income_Data_Labels)
	}, [chartData]);
	

    const [AR_IncomeData, setAR_IncomeData] = useState(
		{
			labels: AR_Income_Data_Labels,
			datasets: [
			  {
				label: "Household Percentage",
				data: AR_Income_Data_Values,
				backgroundColor: ["green"]
			  }
			]
		}
    );

	// const [loading, setLoading] = useState<boolean>(false);

	// const [isReady, setReady] = useState<boolean>(false);

	// useEffect(() => { 
	// 	console.log("start loading")
	// 	const timer = setTimeout(() => {
	// 		setAR_IncomeData( 
	// 			{
	// 				labels: AR_Income_Data_Labels,
	// 				datasets: [
	// 				  {
	// 					label: "Household Percentage",
	// 					data: NY_IncomeVotingData.map((data) => data.percentage),
	// 					backgroundColor: ["green"]
	// 				  }
	// 				]
	// 			  }
	// 		)
	// 		console.log("done loading")

	// 		setTimeout(()=>{
	// 			setReady(true);

	// 			console.log(isReady);

	// 			setLoading(true); 

	// 		},2000)
			
	// 	}, 4000)

	// 	return () => clearTimeout(timer);


		
	// }, [])
    
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