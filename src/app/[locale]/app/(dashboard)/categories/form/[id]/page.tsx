"use client";

//React & Next
import { useEffect, useMemo, useState } from "react";
import { useRouter } from 'next/navigation';
import { useMessages } from "next-intl";
//Material UI
import { Alert, Box, Button, Divider, FormControl, FormControlLabel, FormHelperText, Grid, Input, InputLabel, Paper, Radio, RadioGroup, SelectChangeEvent, Snackbar } from "@mui/material";
import CategoryIcon from '@mui/icons-material/Category';
import ViewListIcon from '@mui/icons-material/ViewList';
import { green, red } from "@mui/material/colors";
//others
import axios from "axios";
//Types, components and helpers
import { UserSession } from "@/types/UserSession";
import { checkUserSession, getSession } from "@/helpers/userSession";
import Loading from "@/components/Layout/loading";
import { FormField } from "@/types/From";
import { SnackbarInitialState, SnackbarState } from "@/types/SnackbarState";
import { createInitialFormState } from "@/helpers/forms";
import appConfig from "@/config";


//Form state
type FormCategoriesState = {
    uid: FormField;
    name: FormField;
    categoryType: FormField;
    [key: string]: FormField;
};

const initialFormCategories: FormCategoriesState = createInitialFormState(['uid', 'name', 'categoryType']) as FormCategoriesState;

export default function FormCategoriesPage(
    { params: { locale, id: initialId } }: Readonly<{ params: { locale: string, id?: string } }>
) {
    //App Config
    const config = useMemo(() => appConfig, []);

    //Loading
    const [loading, setLoading] = useState(false);

    //Get the id from the URL
    const [id, setId] = useState<string | null>(initialId || null);

    //Get translations
    const messages = useMessages();

    //Translate the page components
    const t = useMemo(() => (messages as any).Pages.CategoriesForm, [messages]);

    //Get the router instance
    const router = useRouter();

    // Snackbar state
    const [snackbar, setSnackbar] = useState<SnackbarState>(SnackbarInitialState);

    //Get the user session
    const [session, setSession] = useState<UserSession | null>(null);

    //Check if the user is logged in
    useEffect(() => {
        if(!checkUserSession()){
            router.push(`/${locale}/`);
        }
        setSession(getSession());
    }, []);

    // Form state
    const [formState, setFormState] = useState<FormCategoriesState>(initialFormCategories);

    //Fetch account data if id is provided
    useEffect(() => {
        if (id) {
            const fetchAccountData = async () => {
                try {
                    // Fetch account data
                    const response = await axios.get(`${config.api.url}/Categories/${id}`);
                    // Set form state with fetched data
                    const data = response.data;
                    setFormState({
                        uid: { value: data.user.uid, error: false, helperText: '' },
                        name: { value: data.name, error: false, helperText: '' },
                        categoryType: { value: data.categoryType, error: false, helperText: '' }
                    });
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            };
            fetchAccountData();
        }
    }, [id]);


    // Handle form changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement> | SelectChangeEvent<string> | React.ChangeEvent<HTMLInputElement>): void => {
        // Update form state with new value
        const { name, value } = e.target;
        setFormState({
            ...formState,
            [name]: { ...formState[name], value },
        });
    };

    // Handle radio button changes
    const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = event.target;
        // Update form state with new value
        setFormState({
            ...formState,
            [name]: { ...formState[name], value },
        });
    }
    

    // Validate form fields
    const validateForm = () => {
        let isValid = true;
        const newForm = { ...formState };

        // Reset all error states and helper texts
        Object.keys(newForm).forEach((key) => {
            newForm[key].error = false;
            newForm[key].helperText = '';
        });

        // Validate name field and set error state
        if (!formState.name.value) {
            newForm.name.error = true;
            newForm.name.helperText = t.msg.requiredName;
            isValid = false;
        }

        //Set default category type
        if(!formState.categoryType.value){
            newForm.categoryType.value = 'Expense';
        }

        // Update form state
        setFormState(newForm);
        return isValid;
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>):Promise<void> => {
        e.preventDefault(); //prevent default form submission

        setLoading(true);
        if (validateForm()) {
            // Submit form data
            try{
                const data = {
                    "user": {
                        "uid": session?.uid
                    },
                    "name": formState.name.value,
                    "categoryType": formState.categoryType.value
                }
                // Create or update account
                if (id && parseInt(id) > 0) {
                    // Update account
                    await axios.put(`http://localhost:8080/Categories/${id}`, data);
                    setSnackbar({ open: true, message: t.msg.successfullyUpdated, severity: 'success' });
                } else {
                    // Create account
                    await axios.post(`http://localhost:8080/Categories`, data);
                    setSnackbar({ open: true, message: t.msg.successfullyCreated, severity: 'success' });
                }
                // Redirect to account list after a short delay
                setTimeout(() => {
                    router.push(`/${locale}/app/categories`);
                }, 2000);
            } catch (error) {
                // Handle error
                console.error('Error creating account:', error);
                if (axios.isAxiosError(error) && error.response) {
                    console.error('Response data:', error.response.data);
                    console.error('Response status:', error.response.status);
                    console.error('Response headers:', error.response.headers);
                }
                // Show update error message 
                if (id && parseInt(id) > 0) {
                    setSnackbar({ open: true, message: t.msg.updateError, severity: 'error' });
                    return;
                }
                // Show create error message
                setSnackbar({ open: true, message: t.msg.createError, severity: 'error' });
            } finally {
                // Reset loading state
                setLoading(false);
            }
        }
        setLoading(false);
    };

    // Handle back button
    const handleBackButton = () => {
        router.push(`/${locale}/app/categories`);
    };

    // Handle close snackbar    
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

    //Render the page
    return (
        <Box>
            <h1><CategoryIcon /> { (id && parseInt(id) > 0) ? t.titleUpdate : t.titleCreate}</h1>
            <Divider sx={{marginBottom:3}}/>
            <Button
                variant="contained"
                color="primary"
                onClick={handleBackButton}
                startIcon={<ViewListIcon />}
            >
                {t.backButton}
            </Button>
            <Paper sx={{ mt: 2, p: 2 }}>
                <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
                    <Grid container spacing={2}>
                        <Grid item xs={3}>
                            <RadioGroup
                                row
                                name="row-radio-buttons-group-types"
                                value={formState.categoryType.value || 'Expense'}
                                onChange={handleRadioChange}
                            >
                                <FormControlLabel 
                                    value="Expense"
                                    name="categoryType"
                                    control={<Radio sx={{
                                        color: red[800],
                                        '&.Mui-checked': {
                                            color: red[600],
                                        },
                                    }} />} 
                                    label="Expense" 
                                    sx={{
                                        color: red[800],
                                        '&.Mui-checked': {
                                            color: red[600],
                                        },
                                    }}
                                />
                                <FormControlLabel 
                                    value="Income" 
                                    name="categoryType"
                                    control={<Radio sx={{
                                        color: green[800],
                                        '&.Mui-checked': {
                                            color: green[600],
                                        },
                                    }} />} 
                                    label="Income" 
                                    sx={{
                                        color: green[800],
                                        '&.Mui-checked': {
                                            color: green[600],
                                        },
                                    }}
                                />
                            </RadioGroup>
                        </Grid>
                        <Grid item xs={7}>
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
                        </Grid>
                        <Grid item xs={2}>
                            <Button variant="contained" color="primary" type="submit">
                                {t.saveButton}
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
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