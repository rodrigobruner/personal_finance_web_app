"use client";
import React, { useMemo, useState } from 'react';
import { Box, Button, Divider, FormControl, FormHelperText, Input, InputAdornment, InputLabel, MenuItem, Paper, Select, SelectChangeEvent, Typography } from '@mui/material';
import ViewListIcon from '@mui/icons-material/ViewList';
import { useRouter } from 'next/navigation';
import { useMessages } from 'next-intl';
import { NumericFormat } from 'react-number-format';


type FormField = {
    value: string;
    error: boolean;
    helperText: string;
};

type FormState = {
    uid: FormField;
    name: FormField;
    type: FormField;
    initialAmount: FormField;
    status: FormField;
    [key: string]: FormField;
};

const initialFormState = {
    uid: { value: '', error: false, helperText: '' },
    name: { value: '', error: false, helperText: '' },
    type: { value: '', error: false, helperText: '' },
    initialAmount: { value: '', error: false, helperText: '' },
    status: { value: '', error: false, helperText: '' },
};

export default function CreateAccountPage(
    { params: { locale } }: Readonly<{ params: { locale: string } }>
) {

        //Get translations
        const messages = useMessages();

        //Translate the page components
        const t = useMemo(() => (messages as any).Pages.AccountForm, [messages]);
        const currency = useMemo(() => (messages as any).Configs.Currency, [messages]);


    const [formState, setFormState] = useState<FormState>(initialFormState);
    const [types, setTypes] = useState([{id: 1, name: 'Conta Corrente'}, {id: 2, name: 'Conta Poupança'}]);
    const router = useRouter();

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

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>):void => {
        e.preventDefault(); //prevent default form submission

        if (validateForm()) {
            // Submit form data
            console.log('Form submitted:', formState);

            //TODO: use axios to submit form data

            
            // Redirect to account list
            router.push(`/${locale}/app/accounts`);
        }
    };

    const handleBackToAccountList = () => {
        router.push(`/${locale}/app/accounts`);
    };

    return (
        <Box sx={{ p: 2 }}>
            <h1>{t.title}</h1>
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
                            onChange={handleChange}
                            error={formState.type.error}
                            aria-describedby="name-helper-text"
                        >
                            {
                                types.map((type) => (
                                    <MenuItem key={type.id} value={type.id}>{type.name}</MenuItem>
                                ))
                            }
                        </Select>
                        <FormHelperText id="type-helper-text" error={formState.type.error}>
                            {formState.type.helperText}
                        </FormHelperText>
                    </FormControl>

                    <Button variant="contained" color="primary" type="submit">
                        {t.createButton}
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
}