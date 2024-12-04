//react
import * as React from 'react';
//Material UI
import { LineChart } from '@mui/x-charts/LineChart';
import { Typography } from '@mui/material';
//others
import axios from 'axios';
//custom
import WidgetCard from '@/components/Layout/Dashboard/widgetCard';
import { getSession } from '@/helpers/userSession';
import Loading from '../../loading';
import { UserSession } from '@/types/UserSession';
import { valueFormatter } from '@/helpers/valueFormatter';
import appConfig from '@/config';

//Props
type IncomeAndExpensesChartProps = {
    locale: string;
    currency: string;
    title: string;
    labels: string[];
};

//Income and expenses chart component
export default function IncomeAndExpensesChart(props:IncomeAndExpensesChartProps){
    //App Config
    const config = React.useMemo(() => appConfig, []);

    //Loading
    const [loading, setLoading] = React.useState(false);

    //Get props
    const {labels, title, currency, locale } = props;
    //Data
    const [rows, setRows] = React.useState<{ incomes: [], expenses: [], months: [] }>({ incomes: [], expenses: [], months: [] });

    //Get user session
    const [session, setSession] = React.useState<UserSession | null>(null);

    React.useEffect(() => {
        setSession(getSession());
    }, []);

    //Fetch monthly summary
    const fetchMonthlySummary = async (): Promise<void> => {
        try {
            if (!session) return;//If there is no session, return
            //get data
            const response = await axios.get(`${config.api.url}/Transactions/monthly-summary/${session?.uid}`);
            //set data
            setRows(response.data);
        } catch (error) {
            //Error
            console.error('Error insert:', error);
            if (axios.isAxiosError(error) && error.response) {
                console.error('Response data:', error.response.data);
                console.error('Response status:', error.response.status);
                console.error('Response headers:', error.response.headers);
            }
        } finally {
            //set loading
            setLoading(false);
        }
    };

    //Fetch data
    React.useEffect(() => {
        fetchMonthlySummary();
    }, [session]);

    //Loading
    if (loading) {
        return (<Loading />);
    }

    //Formatter function for the chart
    function formatter(value: number | null): string {
        return valueFormatter({ value: value, locale: locale, currency: currency });
    }
    
    //Return
    return (
        <WidgetCard>
            <Typography align='center' variant='h5'>
                {title}
            </Typography>
            <LineChart
            width={570}
            height={350}
            series={[
                { data: rows.incomes, label: labels[0], color: 'green', valueFormatter: formatter },
                { data: rows.expenses, label: labels[1], color: 'red', valueFormatter: formatter},
            ]}
            xAxis={[{ 
                scaleType: 'point', 
                data: rows.months,
                
            }]}
            
            />
        </WidgetCard>
    );
}