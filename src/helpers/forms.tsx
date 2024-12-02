import { FormField } from "@/types/From";

export const createInitialFormState = (fields: string[]): { [key: string]: FormField } => {
    const initialState: { [key: string]: FormField } = {};
    fields.forEach(field => {
        initialState[field] = {
            value: '',
            error: false,
            helperText: ''
        };
    });
    return initialState;
};