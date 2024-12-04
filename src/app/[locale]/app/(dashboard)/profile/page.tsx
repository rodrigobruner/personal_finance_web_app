"use client";

//React & Next
import { useEffect, useMemo, useState } from "react";
import { useRouter } from 'next/navigation';
import { useMessages } from "next-intl";
//Material UI
import SettingsIcon from '@mui/icons-material/Settings';
import {  Divider, Paper, Typography } from "@mui/material";
//Types, components and helpers
import { UserSession } from "@/types/UserSession";
import { checkUserSession, getSession } from "@/helpers/userSession";
import appConfig from "@/config";

export default function SettingsPage(
    { params: { locale } }: Readonly<{ params: { locale: string } }>
) {
    //App Config
    const config = useMemo(() => appConfig, []);

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

    //TODO: Implement the user account update

    //Render the page
    return (
        <div>
            <h1><SettingsIcon /> Settings</h1>
            <Divider sx={{ margin: '20px' }}/>
            <Typography variant="h6">User Information</Typography>
            <Paper elevation={3} 
                    sx={{ 
                        width: { xs: '100%', md: 'auto' },
                        minWidth: '100px', 
                        padding: '20px' }}
                    >
                    <Typography>Name: {session?.name}</Typography>
                    <Typography>E-mail: {session?.email}</Typography>
            </Paper>
            <Divider />
            <Divider sx={{ margin: '20px' }}/>
            <Typography variant="h6">System Information</Typography>
            <Paper elevation={3} 
                    sx={{ 
                        width: { xs: '100%', md: 'auto' },
                        minWidth: '100px', 
                        padding: '20px' }}
                    >
                    <Typography>Name: {config?.app.name}</Typography>
                    <Typography>Version: {config?.app.version}</Typography>
            </Paper>
        </div>
    );
}