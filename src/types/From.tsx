// Type definitions for fields in the form
export type FormField = {
    value: string;
    error: boolean;
    helperText: string;
};


// Type definitions for the transactions(income, expenses and transfer) form state
export type FormTransactionState = {
    from: FormField;
    amount: FormField;
    to: FormField;
    initialAmount: FormField;
    description: FormField;
    [key: string]: FormField;
};

// Initial state for the transactions form
export const initialFormTransactionState = {
    from: { value: '', error: false, helperText: '' },
    amount: { value: '', error: false, helperText: '' },
    to: { value: '', error: false, helperText: '' },
    initialAmount: { value: '', error: false, helperText: '' },
    description: { value: '', error: false, helperText: '' }
};

// Type definitions for the transactions(income, expenses and transfer) form messages
export enum FormTransactionType {
    INCOME = 'INCOME',
    EXPENSE = 'EXPENSE',
    TRANSFER = 'TRANSFER'
}

// Type definitions for the transactions(income, expenses and transfer) form messages
export type FormTransactionMessage = {
    type: FormTransactionType;
    title: string;
    from: string;
    amount: string;
    to: string;
    description: string;
    button: string;
    msg: {
        requiredFrom: string;
        requiredAmount: string;
        requiredTo: string;
        createError: string;
        successfullyCreated: string;
    };
    currencyName: string;
    currencySymbol: string;
    currencyDecimal: string;
    currencyThousand: string;
};