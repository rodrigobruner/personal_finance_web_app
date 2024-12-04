import { FormField } from "@/types/From";

// Create initial form state
export const createInitialFormState = (fields: string[]): { [key: string]: FormField } => {
    // Create an object to hold the initial state
    const initialState: { [key: string]: FormField } = {};
    // Loop through the fields and create an object for each field
    fields.forEach(field => {
        // Add the field to the initial state
        initialState[field] = {
            value: '',
            error: false,
            helperText: ''
        };
    });
    // Return the initial state
    return initialState;
};