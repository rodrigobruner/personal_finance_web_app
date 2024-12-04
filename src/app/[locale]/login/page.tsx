"use client";
//React & Next
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMessages } from 'next-intl';
//Material UI components
import { Box, Button, Divider, FormControl, FormHelperText, IconButton, Input, InputAdornment, InputLabel, Link, Typography } from '@mui/material';
import Paper from '@mui/material/Paper';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
//Types and helpers
import { FieldValidationHelper } from '@/types';
import { POST } from '@/helpers/httpClient';
import { checkUserSession, getSession, saveSession } from '@/helpers/userSession';
import { UserSession } from '@/types/UserSession';

export default function Login(
    { params: { locale } }: Readonly<{ params: { locale: string } }>
) {
    // Redirect to the app if the user is already logged in
    const [sessionState, setSession] = useState<UserSession | null>(null);
    const router = useRouter();

    //Check if the user is logged in
    useEffect(() => {
        if (getSession) {
            const sessionData = getSession();
            setSession(sessionData);
        }
    }, []);

    //Redirect to the app if the user is already logged in
    useEffect(() => {
        if (sessionState) {
            router.push(`/${locale}/app/`);
        }
    }, [sessionState, locale, router]);

    //Get translations
    const messages = useMessages();
    const t = (messages as any).Pages.Login;
    const app = (messages as any).Pages.App;

    // Form state
    const [user, setUser] = useState<FieldValidationHelper>({
        username: {
            value: '',
            error: false,
            helperText: t.msg["required-username"]
        },
        password: {
            value: '',
            error: false,
            helperText: t.msg["required-password"]
        }
    });

    // Password visibility
    const [showPassword, setShowPassword] = useState(false);

    // Handle password visibility
    const handleClickShowPassword = () => setShowPassword((show) => !show);

    // Handle mouse down password
    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    // Handle mouse up password
    const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    // Handle input change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUser({
            ...user,
            [name]: {
                ...user[name],
                value
            }
        });
    };

    // Handle form submit
    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // Create a new user object and reset the error state
        const newUser = { ...user };
        newUser.username.error = false;
        newUser.password.error = false;

        let error = false;

        // Validate the form
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (user.username.value === "" || !emailRegex.test(user.username.value)) {
            newUser.username.error = true;
            newUser.username.helperText = t.msg["required-username"];
            error = true;
        }
        // Validate the password
        if (user.password.value === "") {
            newUser.password.error = true;
            newUser.password.helperText = t.msg["required-password"];
            error = true;
        }
        //  Submit the form
        if (!error) {
            // Call the API to login
            const objUser = {
                email: user.username.value,
                password: user.password.value
            };
            // Call the API to login
            POST('/Users/login', objUser)
                .then((response) => {
                    // Check if the user is active
                    if (response && response.status === 200) {
                        // Save the user session
                        const userData = response?.data;
                        if (userData["status"] === "Active") {
                            delete userData["password"];
                            delete userData["status"];
                            userData["image"] = "default-user.png";
                            saveSession(userData);
                            setSession(userData);
                        } else {
                            // User is deactivated
                            const newUser = { ...user };
                            newUser.password.error = true;
                            newUser.password.helperText = t.msg["user-deactivated"];
                            setUser(newUser);
                        }
                    } else {
                        // Invalid credentials
                        const newUser = { ...user };
                        newUser.password.error = true;
                        newUser.password.helperText = t.msg["invalid-credentials"];
                        setUser(newUser);
                    }
                }).catch((error) => {
                    // Handle the error
                    console.error('Error during login:', error);
                });
        } else {
            // Set the new user state
            setUser(newUser);
        }
    };

    // Render the login page
    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 2,
                flexDirection: { xs: 'column', md: 'row' },
            }}
        >
            <Box component="img"
                sx={{
                    height: '70%',
                    width: '55%',
                    maxHeight: '70%',
                    maxWidth: '55%',
                    margin: 'auto',
                    display: { xs: 'none', md: 'block' },
                }}
                alt="The house from the offer."
                src="/images/home.jpg"
            />
            <Box sx={{
                display: 'flex',
                flexDirection: 'column', 
                alignItems: 'center',
                width: '100%',
            }}>
                <Typography variant="h3" component="h2">
                    {app.name}
                </Typography>
                <Typography variant="h5" component="h3" sx={{ mb: 2 }}>
                    {app.slogan}
                </Typography>
                <Paper elevation={3}
                    sx={{
                        width: { xs: '100%', md: 'auto' },
                        minWidth: '100px',
                        padding: '20px'
                    }}
                >
                    <Typography variant="h4" component="h4" sx={{ mb: 2, textAlign: 'center' }}>
                        {t.title}
                    </Typography>

                    <Box component="form"
                        onSubmit={onSubmit}
                        sx={{
                            width: { xs: '100%', md: 'auto' },
                            padding: { xs: '20px', md: '0' }
                        }}
                    >
                        <FormControl sx={{ width: '100%' }}>
                            <InputLabel htmlFor="username">
                                {t.username}
                            </InputLabel>
                            <Input
                                id="username"
                                name='username'
                                sx={{ width: '100%' }}
                                onChange={handleChange}
                                error={user.username.error}
                                aria-describedby="username-helper-text"
                            />
                            <FormHelperText id="username-helper-text" error={user.username.error}>
                                {user.username.error ? user.username.helperText : ""}
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
                    <Divider sx={{ margin: '20px' }} />
                    <Box sx={{ display: 'flex' }}>
                        {/* <Box sx={{
                            float: 'left',
                            width: '50%'
                        }}>
                            <Link
                                href="#"
                                underline="hover"
                                sx={{ float: 'left' }}>
                                {t['forgot-password']}
                            </Link>
                        </Box> */}
                        <Box sx={{
                            float: 'left',
                            width: '50%'
                        }}>
                            <Link
                                href="./login/new"
                                underline="hover">
                                {t['create-account']}
                            </Link>
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </Box>
    );
}