import React, {useState } from "react";
import { FormField, FormTransactionMessage, FormTransactionType } from "@/types/From";
import { Alert, Box, Button, FormControl, FormHelperText, Input, InputLabel, MenuItem, Select, SelectChangeEvent, Snackbar, Stack } from "@mui/material";
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { NumericFormat } from "react-number-format";
import Loading from "../loading";
import { set } from "lodash";
import { SnackbarInitialState, SnackbarState } from "@/types/SnackbarState";
import axios from "axios";

//Type definitions for the account row
interface AccountRow {
    id: number;
    name: string;
    accountType: string;
    status: string;
    initialAmount: string;
}

type FormTransactionState = {
    uid: FormField;
    from: FormField;
    to: FormField;
    amount: FormField;
    description: FormField;
    [key: string]: FormField;
};

const initialFormTransactionState = {
    uid: { value: '', error: false, helperText: '' },
    from: { value: '', error: false, helperText: '' },
    to: { value: '', error: false, helperText: '' },
    amount: { value: '', error: false, helperText: '' },
    description: { value: '', error: false, helperText: '' },
};


export function NewTransactionForm(params: FormTransactionMessage) {

    //Loading
    const [loading, setLoading] = React.useState(false);

    //Snackbar state
    const [snackbar, setSnackbar] = useState<SnackbarState>(SnackbarInitialState);

    const [fromOptions, setFromOptions] = useState<JSX.Element[]>(
        params.fromOptions.map((option) => (
            <MenuItem key={option.id} value={option.id}>
                {option.name}
            </MenuItem>
        ))  
    );
    const [toOptions, setToOptions] = useState<JSX.Element[]>(
        params.toOptions.map((option) => (
            <MenuItem key={option.id} value={option.id}>
                {option.name}
            </MenuItem>
        ))  
    );

    //Form state
    const [formState, setFormState] = React.useState<FormTransactionState>(initialFormTransactionState);

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

        if (!formState.from.value) {
            newForm.from.error = true;
            newForm.from.helperText = params.msg.requiredFrom;
            isValid = false;
        } else {
            newForm.from.error = false;
            newForm.from.helperText = '';
        }

        if (!formState.to.value) {
            newForm.to.error = true;
            newForm.to.helperText = params.msg.requiredTo;
            isValid = false;
        } else {
            newForm.to.error = false;
            newForm.to.helperText = '';
        }

        if (!formState.amount.value) {
            newForm.amount.error = true;
            newForm.amount.helperText = params.msg.requiredAmount;
            isValid = false;
        } else {
            newForm.amount.error = false;
            newForm.amount.helperText = '';
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
                if(formState.from.value === formState.to.value){
                    setSnackbar({ open: true, message: params.msg.differentAccounts, severity: 'error' });
                    return;
                }
                if (params.type === FormTransactionType.TRANSFER) {
                    const data = {
                        "fromAccount": {
                            "id": formState.from.value
                        },
                        "toAccount": {
                            "id": formState.to.value
                        },
                        "value": formState.amount.value,
                        "notes": formState.description.value,
                        "date": new Date().toISOString()
                    };

                    await axios.post(`http://localhost:8080/Transfers`, data);
                    setSnackbar({ open: true, message: params.msg.successfullyCreated, severity: 'success' });
                } else {
                    alert('Not implemented yet');
                }
            } catch (error) {
                console.error('Error saving account:', error);
                if (axios.isAxiosError(error) && error.response) {
                    console.error('Response data:', error.response.data);
                    console.error('Response status:', error.response.status);
                    console.error('Response headers:', error.response.headers);
                }
                setSnackbar({ open: true, message: params.msg.createError, severity: 'error' });
            } finally {
                setLoading(false);
            }
        }
        setLoading(false);
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
    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
        <Stack alignItems="center" direction="row" gap={2}>
            <FormControl variant="standard" sx={{ m: 1, width: "40%" }}>
                <InputLabel id="from">{params.from}</InputLabel>
                <Select
                    labelId="from"
                    id="from"
                    name="from"
                    value={formState.from.value}
                    onChange={handleChange}
                    label={params.from}
                >
                    {fromOptions}
                </Select>
            </FormControl>
            <ChevronRightIcon sx={{m:1, width:"5%"}}/>
            <FormControl variant="standard" sx={{ m: 1, width: "40%" }}>
                <InputLabel id="to">{params.to}</InputLabel>
                <Select
                    labelId="to"
                    name="to"
                    value={formState.to.value}
                    onChange={handleChange}
                    label={params.to}
                >
                    {toOptions}
                </Select>
            </FormControl>
        </Stack>
        <FormControl sx={{ width: '100%', mb: 2 }}>
            <InputLabel htmlFor="amount">{params.amount}</InputLabel>
            <NumericFormat
                id="amount"
                name="amount"
                value={formState.amount.value}
                onChange={(e) => handleChange(e as React.ChangeEvent<HTMLInputElement>)}
                decimalScale={2} 
                fixedDecimalScale={true}
                thousandSeparator={params.currencyThousand}
                decimalSeparator={params.currencyDecimal}
                prefix={params.currencySymbol}
                customInput={Input}
                error={formState.amount.error}
                aria-describedby="amount-helper-text"
            />
            <FormHelperText id="amount-helper-text" error={formState.amount.error}>
                {formState.amount.helperText}
            </FormHelperText>
        </FormControl>
        <FormControl sx={{ width: '100%', mb: 2 }}>
            <InputLabel htmlFor="description">{params.description}</InputLabel>
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
        <Button variant="contained" color="primary" type="submit">
            {params.button}
        </Button>
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