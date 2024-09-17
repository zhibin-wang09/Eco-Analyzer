import React, { useState } from 'react';
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

    const [AR_RaceData, setAR_RaceData] = useState(
        {
          labels: AR_RaceVotingData.map((data) => data.race),
          datasets: [
            {
              label: "Voting Percentage",
              data: AR_RaceVotingData.map((data) => data.percentage),
              backgroundColor: ["blue", "red"]
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
              data: NY_RaceVotingData.map((data) => data.percentage),
              backgroundColor: ["blue", "red"]
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
              data: AR_AgeVotingData.map((data) => data.percentage),
              backgroundColor: ["blue", "red"]
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
              data: NY_AgeVotingData.map((data) => data.percentage),
              backgroundColor: ["blue", "red"]
            }
          ]
        }
    );

    const [AR_or_NY, setAR_or_NY] = useState('AR');
    const [dataType, setDataType] = useState('income');

    // const handleStateChange = (event) => {
    //     setWhichState(event.target.value);
    // }

    const setAR = () => {
        setAR_or_NY('AR');
    }

    const setNY = () => {
        setAR_or_NY('NY');
    }

    const setToIncome = () => {
        setDataType('income');
    }

    const setToRace = () => {
        setDataType('race');
    }

    const setToAge = () => {
        setDataType('age');
    }


    return(
        <div>
            <div style={{width: 800}}>

                <p className='chart_title_font'>
                    {AR_or_NY} {dataType}
                </p>

                {(AR_or_NY == 'AR' && dataType == 'income') && (
                    <BarChart chartData={AR_IncomeData}/>
                )}

                {(AR_or_NY == 'AR' && dataType == 'race') && (
                    <BarChart chartData={AR_RaceData}/>
                )}

                {(AR_or_NY == 'AR' && dataType == 'age') && (
                    <BarChart chartData={AR_AgeData}/>
                )}

                {(AR_or_NY == 'NY' && dataType == 'income') && (
                    <BarChart chartData={NY_IncomeData}/>
                )}

                {(AR_or_NY == 'NY' && dataType == 'race') && (
                    <BarChart chartData={NY_RaceData}/>
                )}

                {(AR_or_NY == 'NY' && dataType == 'age') && (
                    <BarChart chartData={NY_AgeData}/>
                )}
            </div>

            <div>
                <div>
                    <button 
                        className='chart_button'
                        onClick={setAR}
                    >
                        AR
                    </button>
                </div>

                <div>
                    <button
                        className='chart_button'
                        onClick={setNY}
                    >
                        NY
                    </button>
                </div>

                <p>
                    ------
                </p>

                <div>
                    <button
                        className='chart_button'
                        onClick={setToIncome}
                    >
                        Income
                    </button>
                </div>

                <div>
                    <button
                        className='chart_button'
                        onClick={setToRace}
                    >
                        Race
                    </button>
                </div>

                <div>
                    <button
                        className='chart_button'
                        onClick={setToAge}
                    >
                        Age
                    </button>
                </div>
            </div>
        </div>
        
    )
}