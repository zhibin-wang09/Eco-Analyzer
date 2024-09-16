import * as React from 'react';
import { Bar } from 'react-chartjs-2';
// import { ChartData, ChartOptions } from 'chart.js';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ChartData,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

interface BarChartProps {
    chartData: ChartData<'bar', number[], string>; // ChartData type for a bar chart
}

export default function BarChart({chartData}: BarChartProps){
    return(
        <Bar data={chartData}/>
    );
}