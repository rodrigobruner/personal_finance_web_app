"use client";
//React & Next
import { useEffect, useMemo, useState } from "react";
import { useRouter } from 'next/navigation';
import { useMessages } from "next-intl";
//Material UI
import SettingsIcon from '@mui/icons-material/Settings';
//Types, components and helpers
import { UserSession } from "@/types/UserSession";
import { checkUserSession, getSession } from "@/helpers/userSession";
import Loading from "@/components/Layout/loading";
import axios from "axios";
import { Alert, AlertTitle, Box, Button, Divider, FormControl, FormHelperText, IconButton, Input, InputAdornment, InputLabel, Paper } from "@mui/material";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";
import { createInitialFormState } from "@/helpers/forms";
import { FormField } from "@/types/From";

interface Row {
    uid: number;
    name: string;
    email: string;
    password: string;
}

type FormUserAccountState = {
    uid: FormField;
    name: FormField;
    email: FormField;
    password: FormField;
    [key: string]: FormField;
};

const initialFormUserAccount: FormUserAccountState = createInitialFormState(['uid', 'name', 'email','password']) as FormUserAccountState;

export default function SettingsPage(
    { params: { locale } }: Readonly<{ params: { locale: string } }>
) {
    //Loading
    const [user, setUser] = useState(initialFormUserAccount);
    const [showPassword, setShowPassword] = useState(false);
    const [showMsgUserWasCreated, setShowMsgUserWasCreated] = useState(false);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setUser(prevState => ({
            ...prevState,
            [name]: { ...prevState[name], error: false, helperText: value }
        }));
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // Handle form submission
    };
    const [loading, setLoading] = useState(false);

    //Get translations
    const messages = useMessages();

    //Translate the page components
    const t = useMemo(() => (messages as any).Pages.CategoryList, [messages]);

    //Get the router instance
    const router = useRouter();

    //Get the user session
    const [session, setSession] = useState<UserSession | null>(null);


    //Check if the user is logged in
    useEffect(() => {
        if(!checkUserSession()){
            router.push(`/${locale}/`);
        }
        setSession(getSession());
    }, []);

    //Define the rows state
    const [rows, setRows] = useState<Row[]>([]);

    //Fetch all the incomes method
    const fetchAll = async (): Promise<void> => {
        try {
            //Get the incomes from the API
            if (!session) return;
            //Get the incomes from the API
            const response = await axios.get(`http://localhost:8080/Users/accounts/${session?.uid}`);

            console.log('Response:', response);
            const incomes = Array.isArray(response.data) ? response.data : [response.data];
            if (incomes.length !== 1) {
                return;
            }
            setRows(incomes);
        } catch (error) {
            //Log the error
            console.error('Error insert:', error);
            if (axios.isAxiosError(error) && error.response) {
                console.error('Response data:', error.response.data);
                console.error('Response status:', error.response.status);
                console.error('Response headers:', error.response.headers);
            }
        } finally {
            //Set loading to false
            setLoading(false);
        }
    };

    //Fetch all the incomes
    useEffect(() => {
        setLoading(true);
        fetchAll();
    }, []);

    //Loading
    if (loading) {
        return (<Loading />);
    }
    
    //Render the page
    return (
        <div>
            <h1><SettingsIcon /> Settings</h1>
            <Paper elevation={3} 
                    sx={{ 
                        width: { xs: '100%', md: 'auto' },
                        minWidth: '100px', 
                        padding: '20px' }}
                    >
                    
                    <Box component="form"
                        onSubmit={onSubmit}
                        sx={{
                            width: { xs: '100%', md: 'auto' }, // 100% width on small devices
                            padding: { xs: '20px', md: '0' } // Optional: Add padding on small devices
                        }}
                        >
                        <FormControl sx={{ width: '100%' }}>
                            <InputLabel htmlFor="name">
                                {t.name}
                            </InputLabel>
                            <Input
                                id="name"
                                name='name'
                                sx={{ width: '100%' }}
                                onChange={handleChange}
                                error={user.name.error}
                                aria-describedby="name-helper-text"
                            />
                            <FormHelperText id="name-helper-text" error={user.name.error}>
                                {user.name.error ? user.name.helperText : ""}
                            </FormHelperText>
                        </FormControl>
                        <FormControl sx={{ width: '100%', marginTop: '20px' }}>
                            <InputLabel htmlFor="email">
                                {t.email}
                            </InputLabel>
                            <Input
                                id="email"
                                name='email'
                                sx={{ width: '100%' }}
                                onChange={handleChange}
                                error={user.email.error}
                                aria-describedby="email-helper-text"
                            />
                            <FormHelperText id="email-helper-text" error={user.email.error}>
                                {user.email.error ? user.email.helperText : ""}
                            </FormHelperText>
                        </FormControl>
                        <FormControl sx={{ width: '100%', marginTop: '20px' }}>
                            <InputLabel htmlFor="password">
                                {t.password}
                            </InputLabel>
                            <Input
                                id="password"
                                name='password'
                                sx={{ width: '100%' }}
                                type={showPassword ? 'text' : 'password'}
                                onChange={handleChange}
                                error={user.password.error}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            onMouseUp={handleMouseUpPassword}
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                aria-describedby="password-helper-text"
                            />
                            <FormHelperText id="password-helper-text" error={user.password.error}>
                                {user.password.error ? user.password.helperText : ""}
                            </FormHelperText>
                        </FormControl>
                        <Button
                            sx={{
                                width: '100%',
                                marginBottom: '20px',
                                marginTop: '30px'
                            }}
                            variant="contained"
                            type='submit'
                            size="large"
                        >
                            {t["signin-button"]}
                        </Button>
                    </Box>
                    {showMsgUserWasCreated ? (
                        <Alert severity="success">
                            <AlertTitle>Success</AlertTitle>
                            {t.msg["successfully-created"]}
                        </Alert>
                    ) : null}
                    <Divider sx={{ margin: '20px' }} />
                </Paper>
        </div>
    );
}