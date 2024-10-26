import { locales } from '../config';

export type Locale = typeof locales[number];

// Used to store value and control form submission errors
export type FieldValidationHelper = {
    [key: string]: { value: string; error: boolean; helperText: string }
};