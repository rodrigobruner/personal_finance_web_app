//React
import React, { useEffect } from "react";
//Material UI
import { PieChart } from '@mui/x-charts/PieChart';
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { Box, Typography } from '@mui/material';
//Others
import moment from "moment";
import axios from "axios";
import { MdChevronRight } from 'react-icons/md';
//Custom
import WidgetCard from '../widgetCard';
import { valueFormatter } from '@/helpers/valueFormatter';
import { UserSession } from '@/types/UserSession';
import { getSession } from '@/helpers/userSession';
import appConfig from "@/config";

//Types
type FormField = {
    value: moment.Moment;
    error: boolean;
    helperText: string;
};

type FormDates = {
    start: FormField;
    end: FormField;
};

//Initial dates
const initialDates = {
    start: { value: moment().startOf('month'), error: false, helperText: '' },
    end: { value: moment(), error: false, helperText: '' },
};

// Props
type IncomesByCategoryProps = {
    locale: string;
    currency: string;
    title: string;
    start: string;
    end: string;
}
//Incomes by category component
export default function IncomesByCategory(props: IncomesByCategoryProps) {
    //App Config
    const config = React.useMemo(() => appConfig, []);
    //Form state
    const [formState, setFormState] = React.useState<FormDates>(initialDates);
    //Data
    const [data, setData] = React.useState<any[]>([]);
    //Get props
    const {locale, currency, title, start, end} = props;
    //Get user session
    const [session, setSession] = React.useState<UserSession | null>(null);

    React.useEffect(() => {
        setSession(getSession());
    }, []);

    // Handle date changes
    const handleDateChange = (field: 'start' | 'end', date: moment.Moment | null): void => {
        if (date) {
            // Set the date
            setFormState({
                ...formState,
                [field]: {
                    value: date,
                    error: false,
                    helperText: '',
                },
            });
        }
    }

    // Fetch all expenses
    const fetchAll = async (): Promise<void> => {
        try {
            if (!session) return; // If there is no session, return
            // Get data
            const response = await axios.get(`${config.api.url}/Transactions/category-summary/${session?.uid}/Income/${formState.start.value.format('YYYY-MM-DD')}/${formState.end.value.format('YYYY-MM-DD')}`);
            // Set data
            setData(response.data);
        } catch (error) {
            // Log the error
            console.error('Error fetching data:', error);
            if (axios.isAxiosError(error) && error.response) {
                console.error('Response data:', error.response.data);
                console.error('Response status:', error.response.status);
            }
        }
    };
    // Fetch data
    useEffect(() => {
        fetchAll();
    }, [formState.start.value, formState.end.value, session]);

    // formatter function for the chart
    function formatter(obj: Object| null): string {
        var value = obj ? (obj as any).value : null;
        return valueFormatter({ value: value ?? null, locale: locale, currency: currency });
    }

    // Render
    return (
        <LocalizationProvider dateAdapter={AdapterMoment}>
            <WidgetCard>
                <Typography align='center' variant='h5'>{title}</Typography>
                <Box display="flex" alignItems="center" my={3}>
                    <DatePicker
                        label={start}
                        value={formState.start.value}
                        onChange={(date) => handleDateChange('start', date)}
                    />
                    <MdChevronRight />
                    <DatePicker
                        label={end}
                        value={formState.end.value}
                        onChange={(date) => handleDateChange('end', date)}
                    />
                </Box>
                <PieChart
                    margin={{ right: 150 }}
                    series={[
                        {
                            highlightScope: { fade: 'global', highlight: 'item' },
                            data: data,
                            faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                            valueFormatter: formatter
                        },
                    ]}
                />
            </WidgetCard>
        </LocalizationProvider>
    );
}