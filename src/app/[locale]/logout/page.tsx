"use client";
import React from 'react';
import { redirect } from 'next/navigation';
//Helpers
import { removeUserSession } from '@/helpers/userSession';

export default function Login(
    { params: { locale } }: Readonly<{ params: { locale: string } }>
) {
    removeUserSession();
    redirect(`/${locale}/login`);
    return (
        <div>
            <h1>Logging out...</h1>
        </div>
    );
}