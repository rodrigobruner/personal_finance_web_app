"use client";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
//Types and helpers
import { UserSession } from "@/types/User";
import { checkUserSession } from "@/helpers/userSession";
//Material UI
import { Link } from "@mui/material";


export default function IndexPage(
    { params: { locale } }: Readonly<{ params: { locale: string } }>
) {
    const [session, setSession] = useState<UserSession | null>(null);
    const router = useRouter();

    useEffect(() => {
        checkUserSession()
            .then((sessionData) => {
                setSession(sessionData);
            })
            .catch((error) => {
                console.error("Error getting user session:", error);
                router.push(`/${locale}/`);
            });
    }, []);

    useEffect(() => {
        if (session) {
            // router.push(`/${locale}/`);
        }
    }, [session, locale, router]);

    return (
        <div>
            <h1>Dashboard</h1>
        </div>
    );
}