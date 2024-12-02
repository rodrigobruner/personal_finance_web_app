import * as React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import WidgetCard from '@/components/Layout/Dashboard/widgetCard';
import { Typography } from '@mui/material';
import axios from 'axios';
import { getSession } from '@/helpers/userSession';
import Loading from '../../loading';
import { UserSession } from '@/types/UserSession';


type IncomeAndExpensesChartData = {
    locale: string;
    labels: string[];
};

export default function IncomeAndExpensesChart(incomeAndExpensesChartData:IncomeAndExpensesChartData){
    //Loading
    const [loading, setLoading] = React.useState(false);
    const [session, setSession] = React.useState<UserSession | null>(null);

    const { locale, labels } = incomeAndExpensesChartData;
    const [rows, setRows] = React.useState<{ incomes: [], expenses: [], months: [] }>({ incomes: [], expenses: [], months: [] });


    React.useEffect(() => {
        setSession(getSession());
    }, []);

    const fetchMonthlySummary = async (): Promise<void> => {
        try {
            if (!session) return;
            const response = await axios.get(`http://localhost:8080/Transactions/monthly-summary/1`);
            console.log('Response:', response.data);    
            setRows(response.data);
        } catch (error) {
            console.error('Error insert:', error);
            if (axios.isAxiosError(error) && error.response) {
                console.error('Response data:', error.response.data);
                console.error('Response status:', error.response.status);
                console.error('Response headers:', error.response.headers);
            }
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        fetchMonthlySummary();
    }, [session]);

    if (loading) {
        return (<Loading />);
    }

    return (
        <WidgetCard>
            <Typography align='center' variant='h5'>Income and Expenses Chart</Typography>
            <LineChart
            width={570}
            height={350}
            series={[
                { data: rows.incomes, label: labels[0], color: 'green' },
                { data: rows.expenses, label: labels[1], color: 'red' },
            ]}
            xAxis={[{ scaleType: 'point', data: rows.months }]}
            />
        </WidgetCard>
    );
}