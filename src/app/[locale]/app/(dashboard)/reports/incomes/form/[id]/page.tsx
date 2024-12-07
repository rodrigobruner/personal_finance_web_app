"use client";
//React & Next
import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMessages } from 'next-intl';
import { JSX } from 'react/jsx-runtime';
//Material UI
import { Alert, Box, Button, Divider, FormControl, FormHelperText, Input, InputLabel, MenuItem, Paper, Select, SelectChangeEvent, Snackbar, Stack } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ViewListIcon from '@mui/icons-material/ViewList';
//Other libraries
import moment from 'moment';
import { NumericFormat } from 'react-number-format';
import axios from 'axios';
//Types, components and helpers
import { checkUserSession, getSession } from '@/helpers/userSession';
import { UserSession } from '@/types/UserSession';
import { FormField } from '@/types/From';
import { SnackbarInitialState, SnackbarState } from '@/types/SnackbarState';
import Loading from '@/components/Layout/loading';
import { createInitialFormState } from '@/helpers/forms';
import { valueFormatter } from '@/helpers/valueFormatter';
import appConfig from '@/config';
import { MdLocalAtm } from 'react-icons/md';


//Type definitions for the account row
interface AccountRow {
    id: number;
    name: string;
    accountType: string;
    status: string;
    initialAmount: string;
}

// Define the form state
type FormTransactionState = {
    from: FormField;
    to: FormField;
    amount: FormField;
    description: FormField;
    date: FormField;
    [key: string]: FormField;
};

// Initial form state
const initialFormTransactionState: FormTransactionState = createInitialFormState(['from', 'to', 'amount', 'description', 'date']) as FormTransactionState;

export default function CreateIncomePage(
    { params: { locale, id: initialId } }: Readonly<{ params: { locale: string, id?: string } }>
) {
    //App Config
    const config = useMemo(() => appConfig, []);

    //Account ID
    const [id, setId] = useState<string | null>(initialId || null);

    //Loading
    const [loading, setLoading] = React.useState(id !== null && parseInt(id) > 0 ? true : false);

    //Get translations
    const messages = useMessages();

    //Translate the page components
    const t = useMemo(() => (messages as any).Pages.IncomesForm, [messages]);
    const currency = useMemo(() => (messages as any).Configs.Currency, [messages]);

    //Get the router instance
    const router = useRouter();

    //Snackbar state
    const [snackbar, setSnackbar] = useState<SnackbarState>(SnackbarInitialState);

    //Get the user session
    const [session, setSession] = useState<UserSession | null>(null);

    //Check if the user is logged in
    useEffect(() => {
        if(!checkUserSession()){
            router.push(`/${locale}/`);
        }
        setSession(getSession());

        //Set the date to today if it is empty
        if(formState.date.value === ''){
            const newForm = { ...formState };
            newForm.date.value = moment().toISOString();
            setFormState(newForm);
        }
    }, []);

    //From options
    const [fromOptions, setFromOptions] = useState<JSX.Element[]>([]);

    //Fetch from options
    useEffect(() => {
        const fetchFromOptions = async () => {
            try {
                // Fetch categories
                const response = await axios.get(`${config.api.url}/Categories/user/${session?.uid}`);
                // Filter income categories
                const incomes = response.data.filter((category: any) => category.categoryType === 'Income');
                // Create options
                const options = incomes.map((category: any) => (
                    <MenuItem key={category.id} value={category.id}>
                        {category.name}
                    </MenuItem>
                ));
                // Set from options
                setFromOptions(options);
            } catch (error) {
                // Log error
                console.error('Error fetching from options:', error);
            }
        };
        // Fetch from options if session is available
        if (session) {
            fetchFromOptions();
        }
    }, [session]);

    //To options
    const [toOptions, setToOptions] = useState<JSX.Element[]>([]);
    //Fetch to options
    useEffect(() => {
        // Create a function to fetch to options
        const fetchToOptions = async () => {
            try {
                // Fetch accounts
                const response = await axios.get(`${config.api.url}/Accounts/user/${session?.uid}/active`);
                // Create options
                const accounts = response.data;
                const options = accounts.map((account: any) => (
                    <MenuItem key={account.id} value={account.id}>
                        <Box sx={{display: 'block'}}>
                            {account.name} 
                            {account?.updatedAmount !== null && account?.updatedAmount !== undefined && (
                                <span style={{ color: account.updatedAmount <= 0 ? 'red' : 'green', display: 'block' }}>
                                    {valueFormatter({ value: account.updatedAmount, locale: locale, currency: currency.name })}
                                </span>
                            )}
                        </Box>
                    </MenuItem>
                ));
                // Set to options
                setToOptions(options);
            } catch (error) {
                // Log error
                console.error('Error fetching to options:', error);
            }
        };
        // Fetch to options if session is available
        if (session) {
            fetchToOptions();
        }
    }, [session]);

    //Form state
    const [formState, setFormState] = React.useState<FormTransactionState>(initialFormTransactionState);

    //Fetch account data if id is provided
    useEffect(() => {
        if (id) {
            //create a function to fetch account data
            const fetchAccountData = async () => {
                try {
                    // Fetch account data
                    const response = await axios.get(`${config.api.url}/Transactions/${id}`);
                    // Set form state with account data
                    const accountData = response.data;
                    setFormState({
                        from: { value: accountData.category.id, error: false, helperText: '' },
                        to: { value: accountData.account.id, error: false, helperText: '' },
                        amount: { value: accountData.value, error: false, helperText: '' },
                        description: { value: accountData.notes, error: false, helperText: '' },
                        date: { value: accountData.date, error: false, helperText: '' },
                    });
                } catch (error) {
                    // Log error
                    console.error('Error fetching account data:', error);
                }
            };

            // Fetch account data if from and to options are available
            if (toOptions.length > 0 && fromOptions.length > 0) {
                fetchAccountData();
                setLoading(false);
            }
        }
    }, [id, toOptions, fromOptions]);

    // Handle form changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement> | SelectChangeEvent<string>): void => {
        const { name, value } = e.target;
        setFormState({
            ...formState,
            [name]: { ...formState[name], value },
        });
    };

    // Handle date changes
    const handleDateChange = (date: moment.Moment | null) => {
        setFormState({
            ...formState,
            date: { ...formState.date, value: date ? date.toISOString() : moment().toISOString() }, // Garanta que seja um objeto moment
        });
    };

    // Validate form fields
    const validateForm = () => {
        let isValid = true;
        const newForm = { ...formState };

        // Reset all error states and helper texts
        Object.keys(newForm).forEach((key) => {
            newForm[key].error = false;
            newForm[key].helperText = '';
        });

        // Validate form field
        if (!formState.from.value) {
            newForm.from.error = true; // Set error state to true
            newForm.from.helperText = t.msg.requiredFrom; // Set helper text
            isValid = false; // Set isValid to false
        }

        // Validate amount field
        if (!formState.amount.value) {
            newForm.amount.error = true;
            newForm.amount.helperText = t.msg.requiredAmount;
            isValid = false;
        }

        // Validate to field
        if (!formState.to.value) {
            newForm.to.error = true;
            newForm.to.helperText = t.msg.requiredTo;
            isValid = false;
        }

        // Validate date field
        if (!formState.date.value) {
            newForm.date.error = true;
            newForm.date.helperText = t.msg.requiredDate;
            isValid = false;
        }

        // Update form state
        setFormState(newForm);
        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>):Promise<void> => {
        e.preventDefault(); //prevent default form submission

        setLoading(true);
        if (validateForm()) {
            // Submit form data
            try {
                // Get the amount value and remove currency symbols
                var value = parseFloat(formState.amount.value.replace(currency.symbol, '').replace(currency.thousand, '').replace(currency.decimal, '.'));
                // Create data object to send to the API
                const data = {
                    value: value,
                    notes: formState.description.value,
                    date: formState.date.value,
                    category: { id: formState.from.value },
                    account: { id: formState.to.value },
                };

                // if id is provided, update the account, otherwise create a new account
                if (id && parseInt(id) > 0) {
                    // Update existing account
                    await axios.put(`${config.api.url}/Transactions/${id}/category/Income`, data);
                    setSnackbar({ open: true, message: t.msg.successfullyUpdated, severity: 'success' }); //show success message
                } else {
                    // Create new account
                    await axios.post(`${config.api.url}/Transactions/category/Income`, data);
                    setSnackbar({ open: true, message: t.msg.successfullyCreated, severity: 'success' });
                }

                // Redirect to account list after a short delay
                setTimeout(() => {
                    router.push(`/${locale}/app/reports/incomes`);
                }, 2000);
            } catch (error) {
                // Log error
                console.error('Error saving account:', error);
                if (axios.isAxiosError(error) && error.response) {
                    console.error('Response data:', error.response.data);
                    console.error('Response status:', error.response.status);
                    console.error('Response headers:', error.response.headers);
                }

                if(id){ // Check if id is provided to determine if it is an update or create error
                    setSnackbar({ open: true, message: t.msg.updateError, severity: 'error' });
                    return;
                }
                setSnackbar({ open: true, message: t.msg.createError, severity: 'error' });
            } finally {
                setLoading(false); // Set loading to false
            }
        }
        setLoading(false); // Set loading to false
    };


    const handleBackToAccountList = () => {
        router.push(`/${locale}/app/reports/incomes`);
    };

    // Handle close snackbar
    const handleCloseSnackbar = (event: React.SyntheticEvent<any, Event> | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbar({ ...snackbar, open: false });
    };

    // Show loading spinner
    if (loading) {
        return (<Loading />);
    }

    // Render the form
    return (
        <LocalizationProvider dateAdapter={AdapterMoment}>
        <Box sx={{ p: 2 }}>
            <h1><MdLocalAtm /> { (id && parseInt(id) > 0) ? t.titleUpdate : t.titleCreate}</h1>
            <Divider sx={{ marginBottom: 3 }} />
            <Button
                variant="contained"
                color="primary"
                onClick={handleBackToAccountList}
                startIcon={<ViewListIcon />}
            >
                {t.backButton}
            </Button>
            <Paper sx={{ mt: 2, p: 2 }}>
                <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
                <Stack alignItems="center" direction="row" gap={2}>
                    <FormControl variant="standard" sx={{ m: 1, width: "40%" }}>
                        <InputLabel id="from">{t.from}</InputLabel>
                        <Select
                            labelId="from"
                            id="from"
                            name="from"
                            value={formState.from.value}
                            onChange={handleChange}
                            label={t.from}
                        >
                            {fromOptions}
                        </Select>
                        <FormHelperText id="amount-helper-text" error={formState.from.error}>
                            {formState.from.helperText}
                        </FormHelperText>
                    </FormControl>
                    <ChevronRightIcon sx={{m:1, width:"5%"}}/>
                    <FormControl variant="standard" sx={{ m: 1, width: "40%" }}>
                        <InputLabel id="to">{t.to}</InputLabel>
                        <Select
                            labelId="to"
                            name="to"
                            value={formState.to.value}
                            onChange={handleChange}
                            label={t.to}
                        >
                            {toOptions}
                        </Select>
                        <FormHelperText id="amount-helper-text" error={formState.to.error}>
                            {formState.to.helperText}
                        </FormHelperText>
                    </FormControl>
                </Stack>
                <FormControl sx={{ width: '100%', mb: 2 }}>
                    <InputLabel htmlFor="amount">{t.amount}</InputLabel>
                    <NumericFormat
                        id="amount"
                        name="amount"
                        value={formState.amount.value}
                        onChange={(e) => handleChange(e as React.ChangeEvent<HTMLInputElement>)}
                        decimalScale={2} 
                        fixedDecimalScale={true}
                        thousandSeparator={currency.thousand}
                        decimalSeparator={currency.decimal}
                        prefix={currency.symbol}
                        customInput={Input}
                        error={formState.amount.error}
                        aria-describedby="amount-helper-text"
                    />
                    <FormHelperText id="amount-helper-text" error={formState.amount.error}>
                        {formState.amount.helperText}
                    </FormHelperText>
                </FormControl>
                <FormControl sx={{ width: '100%', mb: 2 }}>
                    <InputLabel htmlFor="description">{t.description}</InputLabel>
                    <Input
                        id="description"
                        name="description"
                        value={formState.description.value}
                        onChange={(e) => handleChange(e as React.ChangeEvent<HTMLInputElement>)}
                        error={formState.description.error}
                        aria-describedby="description-helper-text"/>
                    <FormHelperText id="description-helper-text" error={formState.description.error}>
                        {formState.description.helperText}
                    </FormHelperText>
                </FormControl>
                <FormControl sx={{ width: '100%', mb: 2 }}>
                    <DatePicker
                        label={t.date}
                        value={formState.date.value ? moment(formState.date.value) : null}
                        onChange={handleDateChange}
                    />
                    <FormHelperText id="date-helper-text" error={formState.date.error}>
                        {formState.date.helperText}
                    </FormHelperText>
                </FormControl>
                <Button variant="contained" color="primary" type="submit">
                    {t.saveButton}
                </Button>
            </Box>
            <Snackbar
                open={snackbar.open}
                autoHideDuration={10000}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
            </Paper>
        </Box>
        </LocalizationProvider>
    );
}