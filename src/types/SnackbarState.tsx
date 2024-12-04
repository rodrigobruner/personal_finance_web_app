// Type definition for SnackbarState
export type SnackbarState = {
    open: boolean;
    message: string;
    severity: 'success' | 'error';
};

// Initial state for the snackbar
export const SnackbarInitialState: SnackbarState = {
    open: false,
    message: '',
    severity: 'success',
};