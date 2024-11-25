"use client";
//React & Next
import { useEffect, useMemo, useState } from "react";
import { useRouter } from 'next/navigation';
import { useMessages } from "next-intl";
//Material UI
import CategoryIcon from '@mui/icons-material/Category';
import ViewListIcon from '@mui/icons-material/ViewList';

//Types, components and helpers
import { UserSession } from "@/types/UserSession";
import { checkUserSession, getSession } from "@/helpers/userSession";
import Loading from "@/components/Layout/loading";
import { Alert, Box, Button, Divider, FormControl, FormControlLabel, FormHelperText, Grid, Input, InputLabel, Paper, Radio, RadioGroup, SelectChangeEvent, Snackbar } from "@mui/material";
import { FormField } from "@/types/From";
import axios from "axios";
import { SnackbarInitialState, SnackbarState } from "@/types/SnackbarState";
import { green, red } from "@mui/material/colors";

type FormCategoriesState = {
    uid: FormField;
    name: FormField;
    categoryType: FormField;
    [key: string]: FormField;
};

const initialFormCategories = {
    uid: { value: '', error: false, helperText: '' },
    name: { value: '', error: false, helperText: '' },
    categoryType: { value: '', error: false, helperText: '' },
};


export default function FormCategoriesPage(
    { params: { locale, id: initialId } }: Readonly<{ params: { locale: string, id?: string } }>
) {
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
                    const response = await axios.get(`http://localhost:8080/Categories/${id}`);
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
        const { name, value } = e.target;
        setFormState({
            ...formState,
            [name]: { ...formState[name], value },
        });
    };

    const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = event.target;
        setFormState({
            ...formState,
            [name]: { ...formState[name], value },
        });
    }
    

    // Validate form fields
    const validateForm = () => {
        let isValid = true;
        const newForm = { ...formState };
        
        // Validate name field and set error state
        if (!formState.name.value) {
            alert('validateForm'+t.msg.requiredName+"|||"+formState.name.value);
            newForm.name.error = true;
            newForm.name.helperText = t.msg.requiredName;
            isValid = false;
        } else {
            newForm.name.error = false;
            newForm.name.helperText = '';
        }

        //Set default category type
        if(!formState.categoryType.value){
            newForm.categoryType.value = 'Expense';
        }

        // Update form state
        setFormState(newForm);
        return isValid;
    };


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>):Promise<void> => {
        e.preventDefault(); //prevent default form submission

        setLoading(true);
        if (validateForm()) {
            // Submit form data
            console.log('Form submitted:', formState);
            try{
                const data = {
                    "user": {
                        "uid": session?.uid
                    },
                    "name": formState.name.value,
                    "categoryType": formState.categoryType.value
                }
                console.log(data);


                if (id && parseInt(id) > 0) {
                    await axios.put(`http://localhost:8080/Categories/${id}`, data);
                    setSnackbar({ open: true, message: t.msg.successfullyUpdated, severity: 'success' });
                } else {
                    await axios.post(`http://localhost:8080/Categories`, data);
                    setSnackbar({ open: true, message: t.msg.successfullyCreated, severity: 'success' });
                }
                // Redirect to account list after a short delay
                setTimeout(() => {
                    router.push(`/${locale}/app/categories`);
                }, 2000);
            } catch (error) {
                console.error('Error creating account:', error);
                if (axios.isAxiosError(error) && error.response) {
                    console.error('Response data:', error.response.data);
                    console.error('Response status:', error.response.status);
                    console.error('Response headers:', error.response.headers);
                }
                if (id && parseInt(id) > 0) {
                    setSnackbar({ open: true, message: t.msg.updateError, severity: 'error' });
                    return;
                }
                setSnackbar({ open: true, message: t.msg.createError, severity: 'error' });
            } finally {
                setLoading(false);
            }
        }
        setLoading(false);
    };

    const handleBackButton = () => {
        router.push(`/${locale}/app/categories`);
    };

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
            <h1><CategoryIcon /> { t.title }</h1>
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