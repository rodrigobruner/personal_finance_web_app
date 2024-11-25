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


export default function SettingsPage(
    { params: { locale } }: Readonly<{ params: { locale: string } }>
) {
    //Loading
    const [loading, setLoading] = useState(true);

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

    //ADD LOGIC HERE
    useEffect(() => {
        setLoading(false);
    });

    //Loading
    if (loading) {
        return (<Loading />);
    }
    
    //Render the page
    return (
        <div>
            <h1><SettingsIcon /> Settings</h1>
        </div>
    );
}