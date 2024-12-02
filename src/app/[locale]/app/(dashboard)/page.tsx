"use client";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
//Types and helpers
import { UserSession } from "@/types/UserSession";
import { checkUserSession, getSession } from "@/helpers/userSession";
import DashboardIcon from '@mui/icons-material/Dashboard';
import NewTransactionWidgets from "@/components/Layout/Dashboard/newTransactionWedget";
import IncomeAndExpensesChart from "@/components/Layout/Dashboard/Charts/incomeAndExpensesChart";
import axios from "axios";

export default function IndexPage(
    { params: { locale } }: Readonly<{ params: { locale: string } }>
) {
    const [session, setSession] = useState<UserSession | null>(null);
    const router = useRouter();

    useEffect(() => {
        if(!checkUserSession()){
            router.push(`/${locale}/`);
        }
        setSession(getSession());
    }, []);


    useEffect(() => {
        if (session) {
            // router.push(`/${locale}/`);
        }
    }, [session, locale, router]);

    return (
        <div>
            <h1><DashboardIcon /> Dashboard</h1>
            <NewTransactionWidgets/>
            <IncomeAndExpensesChart
                locale={locale}
                labels={['Incomes', 'Expenses']}
            />
        </div>
    );
}