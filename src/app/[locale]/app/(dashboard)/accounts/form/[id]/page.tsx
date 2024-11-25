"use client";
import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Box, Button, Divider, FormControl, FormHelperText, Input, InputLabel, MenuItem, Paper, Select, SelectChangeEvent, Snackbar } from '@mui/material';
import ViewListIcon from '@mui/icons-material/ViewList';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { useRouter } from 'next/navigation';
import { useMessages } from 'next-intl';
import { NumericFormat } from 'react-number-format';
import axios from 'axios';
import { checkUserSession, getSession } from '@/helpers/userSession';
import { UserSession } from '@/types/UserSession';
import { FormField } from '@/types/From';
import { SnackbarInitialState, SnackbarState } from '@/types/SnackbarState';
import Loading from '@/components/Layout/loading';

type AccountType = {
    id: number;
    type: string;
};

type FormAccountState = {
    uid: FormField;
    name: FormField;
    type: FormField;
    initialAmount: FormField;
    status: FormField;
    [key: string]: FormField;
};

const initialFormAccountState = {
    uid: { value: '', error: false, helperText: '' },
    name: { value: '', error: false, helperText: '' },
    type: { value: '', error: false, helperText: '' },
    initialAmount: { value: '', error: false, helperText: '' },
    status: { value: '', error: false, helperText: '' },
};

export default function CreateAccountPage(
    { params: { locale, id: initialId } }: Readonly<{ params: { locale: string, id?: string } }>
) {
    //Loading
    const [loading, setLoading] = React.useState(true);

    //Account ID
    const [id, setId] = useState<string | null>(initialId || null);

    //Get translations
    const messages = useMessages();

    //Translate the page components
    const t = useMemo(() => (messages as any).Pages.AccountForm, [messages]);
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
    }, []);


    //Account types
    const [types, setTypes] = useState<AccountType[]>([]);

    //Fetch account types
    useEffect(() => {
        const fetchAccountTypes = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/AccountTypes/?locale=${locale}`);
                setTypes(response.data);
            } catch (error) {
                console.error('Error fetching account types:', error);
            } finally {
                setLoading(false);
            }
        };
        
        fetchAccountTypes();
    }, []);


    //Form state
    const [formState, setFormState] = useState<FormAccountState>(initialFormAccountState);

    //Fetch account data if id is provided
    useEffect(() => {
        if (id) {
            const fetchAccountData = async () => {
                try {
                    const response = await axios.get(`http://localhost:8080/Accounts/${id}`);
                    const accountData = response.data;
                    setFormState({
                        uid: { value: accountData.user.uid, error: false, helperText: '' },
                        name: { value: accountData.name, error: false, helperText: '' },
                        type: { value: accountData.accountType.id, error: false, helperText: '' },
                        initialAmount: { value: accountData.initialAmount, error: false, helperText: '' },
                        status: { value: accountData.status, error: false, helperText: '' },
                    });
                } catch (error) {
                    console.error('Error fetching account data:', error);
                }
            };

            fetchAccountData();
        }
    }, [id]);

    // Handle form changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement> | SelectChangeEvent<string>): void => {
        const { name, value } = e.target;
        setFormState({
            ...formState,
            [name]: { ...formState[name], value },
        });
    };

    // Validate form fields
    const validateForm = () => {
        let isValid = true;
        const newForm = { ...formState };

        // Validate name field and set error state
        if (!formState.name.value) {
            newForm.name.error = true;
            newForm.name.helperText = t.msg.requiredName;
            isValid = false;
        } else {
            newForm.name.error = false;
            newForm.name.helperText = '';
        }

        // Validate initial amount field and set error state
        if (!formState.initialAmount.value) {
            newForm.initialAmount.error = true;
            newForm.initialAmount.helperText = t.msg.requiredInitialAmount;
            isValid = false;
        } else {
            newForm.initialAmount.error = false;
            newForm.initialAmount.helperText = '';
        }

        // Validate type field and set error state
        if (!formState.type.value) {
            newForm.type.error = true;
            newForm.type.helperText = t.msg.requiredType;
            isValid = false;
        } else {
            newForm.type.error = false;
            newForm.type.helperText = '';
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
                const data = {
                    "user": {
                        "uid": session?.uid
                    },
                    "name": formState.name.value,
                    "accountType": {
                        "id": formState.type.value
                    },
                    "status": "Active",
                    "initialAmount": formState.initialAmount.value,
                    "updatedAmount": formState.initialAmount.value,
                };

                if (id && parseInt(id) > 0) {
                    // Update existing account
                    await axios.put(`http://localhost:8080/Accounts/${id}`, data);
                    setSnackbar({ open: true, message: t.msg.successfullyUpdated, severity: 'success' });
                } else {
                    // Create new account
                    await axios.post('http://localhost:8080/Accounts/', data);
                    setSnackbar({ open: true, message: t.msg.successfullyCreated, severity: 'success' });
                }

                // Redirect to account list after a short delay
                setTimeout(() => {
                    router.push(`/${locale}/app/accounts`);
                }, 2000);
            } catch (error) {
                console.error('Error saving account:', error);
                if (axios.isAxiosError(error) && error.response) {
                    console.error('Response data:', error.response.data);
                    console.error('Response status:', error.response.status);
                    console.error('Response headers:', error.response.headers);
                }
                if(id){
                    setSnackbar({ open: true, message: t.msg.updateError, severity: 'error' });
                    return;
                }
                setSnackbar({ open: true, message: t.msg.createError, severity: 'error' });
            } finally {
                setLoading(false);
            }
        }
        setLoading(false);
    };

    const handleBackToAccountList = () => {
        router.push(`/${locale}/app/accounts`);
    };

    const handleCloseSnackbar = (event: React.SyntheticEvent<any, Event> | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbar({ ...snackbar, open: false });
    };

    if (loading) {
        return (<Loading />);
    }

    return (
        <Box sx={{ p: 2 }}>
            <h1><AccountBalanceIcon /> { (id && parseInt(id) > 0) ? t.titleUpdate : t.titleCreate}</h1>
            <Divider sx={{marginBottom:3}}/>
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
                    <FormControl sx={{ width: '100%', mb: 2 }}>
                        <InputLabel htmlFor="name">{t.name}</InputLabel>
                        <Input
                            id="name"
                            name="name"
                            value={formState.name.value}
                            onChange={(e) => handleChange(e as React.ChangeEvent<HTMLInputElement>)}
                            error={formState.name.error}
                            aria-describedby="name-helper-text"
                        />
                        <FormHelperText id="name-helper-text" error={formState.name.error}>
                            {formState.name.helperText}
                        </FormHelperText>
                    </FormControl>
                    <FormControl sx={{ width: '100%', mb: 2 }}>
                        <InputLabel htmlFor="initialAmount">{t.initialAmount}</InputLabel>
                        <NumericFormat
                            id="initialAmount"
                            name="initialAmount"
                            value={formState.initialAmount.value}
                            onValueChange={(values) => {
                                const { value } = values;
                                setFormState({
                                    ...formState,
                                    initialAmount: { ...formState.initialAmount, value },
                                });
                            }}
                            decimalScale={2} 
                            fixedDecimalScale={true}
                            thousandSeparator={currency.thousand}
                            decimalSeparator={currency.decimal}
                            prefix={currency.symbol}
                            customInput={Input}
                            error={formState.initialAmount.error}
                            aria-describedby="initialAmount-helper-text"
                        />
                        <FormHelperText id="initialAmount-helper-text" error={formState.initialAmount.error}>
                            {formState.initialAmount.helperText}
                        </FormHelperText>
                    </FormControl>
                    <FormControl sx={{ width: '100%', mb: 2 }}>
                        <InputLabel htmlFor="type">{t.type}</InputLabel>
                        <Select
                            id="type"
                            name='type'
                            value={formState.type.value}
                            label={t.type}
                            onChange={(e) => handleChange(e as SelectChangeEvent<string>)}
                            error={formState.type.error}
                            aria-describedby="name-helper-text"
                        >
                            {
                                types.map((type) => (
                                    <MenuItem key={type.id} value={type.id}>{type.type}</MenuItem>
                                ))
                            }
                        </Select>
                        <FormHelperText id="type-helper-text" error={formState.type.error}>
                            {formState.type.helperText}
                        </FormHelperText>
                    </FormControl>

                    <Button variant="contained" color="primary" type="submit">
                        {t.saveButton}
                    </Button>
                </Box>
            </Paper>
            <Snackbar   open={snackbar.open} 
                        autoHideDuration={10000} 
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        onClose={handleCloseSnackbar}>

                <Alert  onClose={handleCloseSnackbar} 
                        severity={snackbar.severity} 
                        sx={{ width: '100%' }}>
                {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}