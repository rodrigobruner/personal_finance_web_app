import * as React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import WidgetCard from '@/components/Layout/Dashboard/widgetCard';
import { Typography } from '@mui/material';


type IncomeAndExpensesChartData = {
    incomes: number[];
    expenses: number[];
    months: string[];
    labels: string[];
};

export default function IncomeAndExpensesChart(incomeAndExpensesChartData:IncomeAndExpensesChartData){

    const { incomes, expenses, months, labels } = incomeAndExpensesChartData;

    return (
        <WidgetCard>
            <Typography align='center' variant='h5'>Income and Expenses Chart</Typography>
            <LineChart
            width={500}
            height={350}
            series={[
                { data: incomes, label: labels[0], color: 'green' },
                { data: expenses, label: labels[1], color: 'red' },
            ]}
            xAxis={[{ scaleType: 'point', data: months }]}
            />
        </WidgetCard>
    );
}