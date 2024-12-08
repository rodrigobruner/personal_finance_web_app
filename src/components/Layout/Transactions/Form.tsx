import React, {useState } from "react";
import { FormField, FormTransactionMessage, FormTransactionType } from "@/types/From";
import { Alert, Box, Button, FormControl, FormHelperText, Input, InputLabel, MenuItem, Select, SelectChangeEvent, Snackbar, Stack } from "@mui/material";
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { NumericFormat } from "react-number-format";
import Loading from "../loading";
import { SnackbarInitialState, SnackbarState } from "@/types/SnackbarState";
import axios from "axios";
import { valueFormatter } from "@/helpers/valueFormatter";
import appConfig from "@/config";

//Type definitions for the account row
interface AccountRow {
    id: number;
    name: string;
    accountType: string;
    status: string;
    initialAmount: string;
}

//Type definitions for the category row
type FormTransactionState = {
    uid: FormField;
    from: FormField;
    to: FormField;
    amount: FormField;
    description: FormField;
    [key: string]: FormField;
};

//Initial form state
const initialFormTransactionState = {
    uid: { value: '', error: false, helperText: '' },
    from: { value: '', error: false, helperText: '' },
    to: { value: '', error: false, helperText: '' },
    amount: { value: '', error: false, helperText: '' },
    description: { value: '', error: false, helperText: '' },
};

//New transaction form component
export function NewTransactionForm(params: FormTransactionMessage) {
    //App Config
    const config = React.useMemo(() => appConfig, []);
    
    //Loading
    const [loading, setLoading] = React.useState(false);

    //Snackbar state
    const [snackbar, setSnackbar] = useState<SnackbarState>(SnackbarInitialState);

    //Options
    const [fromOptions, setFromOptions] = useState<JSX.Element[]>(
        params.fromOptions.map((option) => {
            var value = valueFormatter({ value: option.updatedAmount, locale: params.locale, currency: params.currencyName });
            return (
                <MenuItem key={option.id} value={option.id}>
                    <Box sx={{display: 'block'}}>
                        {option.name}
                        {option?.updatedAmount !== null && option?.updatedAmount !== undefined && (
                            <span style={{ color: option.updatedAmount <= 0 ? 'red' : 'green', display: 'block' }}>
                                {value}
                            </span>
                        )}
                    </Box>
                </MenuItem>
            );
        })  
    );

    //Options
    const [toOptions, setToOptions] = useState<JSX.Element[]>(
        params.toOptions.map((option) => {
            var value = new Intl.NumberFormat(params.locale, { style: 'currency', currency: params.currencyName }).format(option.updatedAmount);
            return (
                <MenuItem key={option.id} value={option.id}>
                    <Box sx={{display: 'block'}}>
                        {option.name} 
                        {option?.updatedAmount && <span style={{color: option.updatedAmount < 0 ? 'red':'green',display: 'block'}}>{value}</span>}
                    </Box>
                </MenuItem>
            );
        })  
    );

    //Form state
    const [formState, setFormState] = React.useState<FormTransactionState>(initialFormTransactionState);

    //Handle change
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

        // Reset all error states and helper texts
        Object.keys(newForm).forEach((key) => {
            newForm[key].error = false;
            newForm[key].helperText = '';
        });
        // Validate from field
        if (!formState.from.value) {
            newForm.from.error = true;
            newForm.from.helperText = params.msg.requiredFrom;
            isValid = false;
        }
        // Validate to field
        if (!formState.to.value) {
            newForm.to.error = true;
            newForm.to.helperText = params.msg.requiredTo;
            isValid = false;
        }
        // Validate amount field
        if (!formState.amount.value) {
            newForm.amount.error = true;
            newForm.amount.helperText = params.msg.requiredAmount;
            isValid = false;
        }
        // Update form state
        setFormState(newForm);
        return isValid;
    };

    //Handle submit
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>):Promise<void> => {
        e.preventDefault(); //prevent default form submission
        setLoading(true);//set loading
        if (validateForm()) {

            try {
                // Get the value from the amount field and remove currency symbols
                var value = parseFloat(formState.amount.value.replace(params.currencySymbol, '').replace(params.currencyThousand, '').replace(params.currencyDecimal, '.'));
                // Check if the from and to fields are the same
                if(formState.from.value === formState.to.value){
                    // Show error message
                    setSnackbar({ open: true, message: params.msg.differentAccounts, severity: 'error' });
                    return;
                }
                // Is a transfer
                if (params.type === FormTransactionType.TRANSFER) {
                    // Create transfer data
                    const data = {
                        "fromAccount": {
                            "id": formState.from.value
                        },
                        "toAccount": {
                            "id": formState.to.value
                        },
                        "value": value,
                        "notes": formState.description.value,
                        "date": new Date().toISOString()
                    };
                    // Save transfer
                    await axios.post(`${config.api.url}/Transfers`, data);
                    // Show success message
                    setSnackbar({ open: true, message: params.msg.successfullyCreated, severity: 'success' });
                } else {
                    // Is an expense
                    let account = formState.from.value;
                    let category = formState.to.value

                    //Or is an income
                    if (params.type == FormTransactionType.INCOME) {   
                        account = formState.to.value;
                        category = formState.from.value
                    }

                    // Create transaction data
                    const data = {
                        "account": {
                            "id": account
                        },
                        "category": {
                            "id": category
                        },
                        "value": value,
                        "notes": formState.description.value,
                        "date": new Date().toISOString()
                    }

                    const type = params.type === FormTransactionType.INCOME ? 'Income' : 'Expense'; // get type
                    // Save transaction
                    await axios.post(`${config.api.url}/Transactions/category/${type}`, data); 
                    // Show success message
                    setSnackbar({ open: true, message: params.msg.successfullyCreated, severity: 'success' });
                }
            } catch (error) {
                // Error
                console.error('Error saving account:', error);
                if (axios.isAxiosError(error) && error.response) {
                    console.error('Response data:', error.response.data);
                    console.error('Response status:', error.response.status);
                    console.error('Response headers:', error.response.headers);
                }
                // Show error message
                setSnackbar({ open: true, message: params.msg.createError, severity: 'error' });
            } finally {
                // Set loading
                setLoading(false);
            }
        }
        // Set loading
        setLoading(false);
    };

    //Handle close snackbar
    const handleCloseSnackbar = (event: React.SyntheticEvent<any, Event> | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbar({ ...snackbar, open: false });
    };

    //Loading
    if (loading) {
        return (<Loading />);
    }
    //Return new transaction form
    return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
        <Stack alignItems="center" direction="row" gap={2} sx={{ width: '100%' }}>
            <FormControl variant="standard" sx={{ m: 1, flex: 1 }}>
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
                <FormHelperText id="amount-helper-text" error={formState.from.error}>
                    {formState.from.helperText}
                </FormHelperText>
            </FormControl>
            <ChevronRightIcon sx={{ m: 1 }} />
            <FormControl variant="standard" sx={{ m: 1, flex: 1 }}>
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
                <FormHelperText id="amount-helper-text" error={formState.to.error}>
                    {formState.to.helperText}
                </FormHelperText>
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
                aria-describedby="description-helper-text" />
            <FormHelperText id="description-helper-text" error={formState.description.error}>
                {formState.description.helperText}
            </FormHelperText>
        </FormControl>
        <Button variant="contained" color="primary" type="submit" sx={{ width: '100%' }}>
            {params.button}
        </Button>
        <Snackbar open={snackbar.open}
            autoHideDuration={10000}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            onClose={handleCloseSnackbar}>
            <Alert onClose={handleCloseSnackbar}
                severity={snackbar.severity}
                sx={{ width: '100%' }}>
                {snackbar.message}
            </Alert>
        </Snackbar>
    </Box>
    );
}