import { Currency } from "@/types/Currency";
import React from "react";
import { FormTransactionMessage, FormTransactionState, initialFormTransactionState } from "@/types/From";
import { Button, FormControl, FormHelperText, Input, InputLabel, MenuItem, Select, Stack } from "@mui/material";
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { NumericFormat } from "react-number-format";


export function NewTransactionForm(messages: FormTransactionMessage) {
    const [formState, setFormState] = React.useState<FormTransactionState>(initialFormTransactionState);

    return (
    <div>
        <Stack alignItems="center" direction="row" gap={2}>
            <FormControl variant="standard" sx={{ m: 1, width: "40%" }}>
                <InputLabel id="incomel">{messages.to}</InputLabel>
                <Select
                    labelId="income"
                    id="income"
                    value=""
                    onChange=""
                    label="Income"
                >
                    <MenuItem value=""></MenuItem>
                </Select>
            </FormControl>
            <ChevronRightIcon sx={{m:1, width:"5%"}}/>
            <FormControl variant="standard" sx={{ m: 1, width: "40%" }}>
                <InputLabel id="incomel">{messages.from}</InputLabel>
                <Select
                    labelId="income"
                    id="income"
                    value=""
                    onChange=""
                    label="Income"
                >
                    <MenuItem value=""></MenuItem>

                </Select>
            </FormControl>
        </Stack>
        <FormControl sx={{ width: '100%', mb: 2 }}>
            <InputLabel htmlFor="initialAmount">{messages.amount}</InputLabel>
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
                thousandSeparator={messages.currencyThousand}
                decimalSeparator={messages.currencyDecimal}
                prefix={messages.currencySymbol}
                customInput={Input}
                error={formState.initialAmount.error}
                aria-describedby="initialAmount-helper-text"
            />
            <FormHelperText id="initialAmount-helper-text" error={formState.initialAmount.error}>
                {formState.initialAmount.helperText}
            </FormHelperText>
        </FormControl>
        <FormControl sx={{ width: '100%', mb: 2 }}>
            <InputLabel htmlFor="description">{messages.description}</InputLabel>
            <NumericFormat
                id="description"
                name="description"
                value={formState.description.value}
                onValueChange={(values) => {
                    const { value } = values;
                    setFormState({
                        ...formState,
                        description: { ...formState.description, value },
                    });
                }}
                decimalScale={2} 
                fixedDecimalScale={true}
                thousandSeparator={messages.currencyThousand}
                decimalSeparator={messages.currencyDecimal}
                prefix={messages.currencySymbol}
                customInput={Input}
                error={formState.description.error}
                aria-describedby="description-helper-text"
            />
            <FormHelperText id="description-helper-text" error={formState.description.error}>
                {formState.description.helperText}
            </FormHelperText>
        </FormControl>
        <Button variant="contained">{messages.button}</Button>
    </div>
    );
}