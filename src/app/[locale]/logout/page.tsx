"use client";
//React
import { redirect } from 'next/navigation';
//Helpers
import { clearSession } from '@/helpers/userSession';

export default function Logout(
    { params: { locale } }: Readonly<{ params: { locale: string } }>
) {
    clearSession(); //Clear the session
    //Redirect to the login page
    redirect(`/${locale}/login`);
    return (
        <div>
            <h1>Logging out...</h1>
        </div>
    );
}