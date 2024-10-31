export type SnackbarState = {
    open: boolean;
    message: string;
    severity: 'success' | 'error';
};

export const SnackbarInitialState: SnackbarState = {
    open: false,
    message: '',
    severity: 'success',
};