"use client";
//React & next
import { useEffect } from "react";
import { useRouter } from 'next/navigation';

export default function IndexPage(
    { params: { locale } }: Readonly<{ params: { locale: string } }>
) {
    //Redirect to the dashboard
    const router = useRouter();
    useEffect(() => {
        router.push(`/${locale}/app/`);
    }, []);
}