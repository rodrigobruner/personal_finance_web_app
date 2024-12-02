import { PieChart } from '@mui/x-charts/PieChart';
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { Box, Typography } from '@mui/material';
import moment from "moment";
import React, { useEffect } from "react";
import axios from "axios";
import WidgetCard from '../widgetCard';
import { MdChevronRight } from 'react-icons/md';
import { valueFormatter } from '@/helpers/valueFormatter';

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
    start: { value: moment(), error: false, helperText: '' },
    end: { value: moment(), error: false, helperText: '' },
};

type IncomesByCategoryProps = {
    locale: string;
    currency: string;
    title: string;
    start: string;
    end: string;
}

export default function IncomesByCategory(props: IncomesByCategoryProps) {

    const [formState, setFormState] = React.useState<FormDates>(initialDates);
    const [data, setData] = React.useState<any[]>([]);
    const {locale, currency, title, start, end} = props;



    // Handle date changes
    const handleDateChange = (field: 'start' | 'end', date: moment.Moment | null): void => {
        if (date) {
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
            const response = await axios.get(`http://localhost:8080/Transactions/category-summary/Income/${formState.start.value.format('YYYY-MM-DD')}/${formState.end.value.format('YYYY-MM-DD')}`);
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

    useEffect(() => {
        fetchAll();
    }, [formState.start.value, formState.end.value]);

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