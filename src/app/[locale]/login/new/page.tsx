"use client";
import React from 'react';
import { useMessages } from 'next-intl';
import { FieldValidationHelper } from '@/types';
import { POST } from '@/helpers/httpClient';

import { Alert, AlertTitle, Box, Button, Divider, FormControl, FormHelperText, IconButton, Input, InputAdornment, InputLabel, Link, Typography } from '@mui/material';
import Paper from '@mui/material/Paper';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { createInitialFormState } from '@/helpers/forms';

const initialFormNewUser = createInitialFormState(['name', 'email', 'password']);

export default function Login(
    { params: { locale } }: Readonly<{ params: { locale: string } }>
) {
    const messages = useMessages();
    const t = (messages as any).Pages.NewUser;
    const app = (messages as any).Pages.App;

    // Form state
    const [user, setUser] = React.useState<FieldValidationHelper>(initialFormNewUser);

    // User created
    const [showMsgUserWasCreated, setShowMsgUserWasCreated] = React.useState(false);

    // Password visibility
    const [showPassword, setShowPassword] = React.useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

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
        newUser.name.error = false;
        newUser.email.error = false;
        newUser.password.error = false;

        let error = false;

        // Validate the form
        if(user.name.value.length < 2) {
            newUser.name.error = true;
            newUser.name.helperText = t.msg["required-name"];
            error = true;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (user.email.value === "" || !emailRegex.test(user.email.value)) {
            newUser.email.error = true;
            newUser.email.helperText = t.msg["required-email"];
            error = true;
        }

        const regexStrongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$!%*?&])[A-Za-z\d@$#!%*?&]{8,}$/; 
        if (user.password.value === "" || !regexStrongPassword.test(user.password.value)) {
            newUser.password.error = true;
            newUser.password.helperText = t.msg["required-strong-password"];
            error = true;
        }

        if (!error) {
            const objUser = {
                name: user.name.value,
                email: user.email.value,
                password: user.password.value,
                status:"Active"
            };

            POST('/Users/', objUser)
                .then((response) => {
                    if (response && (response.status === 200 || response.status === 201)) {
                        setShowMsgUserWasCreated(true);
                    }else {
                        const newUser = { ...user };
                        newUser.password.error = true;
                        newUser.password.helperText = `${t.msg["create-error"]} ${response?.data}`;
                        setUser(newUser);
                    }
                }).catch((error) => {
                    console.error('Error creating a new account:', error);
                });
        } else {
            setUser(newUser);
        }
    };

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
                flexDirection: 'column', // Organiza os elementos verticalmente
                alignItems: 'center', // Centraliza os elementos horizontalmente
                width: '100%', // Garante que o contêiner ocupe 100% da largura
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
                        padding: '20px' }}
                    >
                    <Typography variant="h4" component="h4" sx={{ mb: 2, textAlign: 'center' }}>
                        {t.title}
                    </Typography>
                    
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
                                href="../"
                                underline="hover">
                                {t['login-page']}
                            </Link>
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </Box>
    );
}