//react
import React, { useEffect, useMemo } from "react";
//Mui
import { PieChart } from '@mui/x-charts/PieChart';
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { Box, Typography } from '@mui/material';
import moment from "moment";
//others
import axios from "axios";
import { MdChevronRight } from 'react-icons/md';
//Custom
import WidgetCard from '../widgetCard';
import { valueFormatter } from '@/helpers/valueFormatter';
import { getSession } from '@/helpers/userSession';
import { UserSession } from '@/types/UserSession';
import appConfig from "@/config";

// Form field type
type FormField = {
    value: moment.Moment;
    error: boolean;
    helperText: string;
};

type FormDates = {
    start: FormField;
    end: FormField;
};

const initialDates = {
    start: { value: moment().startOf('month'), error: false, helperText: '' },
    end: { value: moment(), error: false, helperText: '' },
};

type ExpensesByCategoryProps = {
    locale: string;
    currency: string;
    title: string;
    start: string;
    end: string;
}
// Expenses by category component
export default function ExpensesByCategory(props: ExpensesByCategoryProps) {
    //App Config
    const config = useMemo(() => appConfig, []);

    // Form state
    const [formState, setFormState] = React.useState<FormDates>(initialDates);
    const [data, setData] = React.useState<any[]>([]);
    // get props
    const {locale, currency, title, start, end} = props;
    // Get user session
    const [session, setSession] = React.useState<UserSession | null>(null);

    React.useEffect(() => {
        setSession(getSession());
    }, []);

    // Handle date changes
    const handleDateChange = (field: 'start' | 'end', date: moment.Moment | null): void => {
        if (date) {
            // Update the form state
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
            if (!session) return; // Check if the user is logged in
            // Get the expenses from the API
            const response = await axios.get(`${config.api.url}/Transactions/category-summary/${session?.uid}/Expense/${formState.start.value.format('YYYY-MM-DD')}/${formState.end.value.format('YYYY-MM-DD')}`);
            // Set the data state
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

    // Fetch all expenses
    useEffect(() => {
        fetchAll();
    }, [formState.start.value, formState.end.value, session]);

    // Formatter, to use in the PieChart
    function formatter(obj: Object| null): string {
        var value = obj ? (obj as any).value : null;
        return valueFormatter({ value: value ?? null, locale: locale, currency: currency });
    }

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
                    series={[
                        {
                            highlightScope: { fade: 'global', highlight: 'item' },
                            data: data,
                            faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                            valueFormatter: formatter
                        },
                    ]}
                    height={350}
                    width={500}
                />
            </WidgetCard>
        </LocalizationProvider>
    );
}