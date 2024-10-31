"use client";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
//Types and helpers
import { UserSession } from "@/types/UserSession";
import { checkUserSession, getSession } from "@/helpers/userSession";
import DashboardIcon from '@mui/icons-material/Dashboard';
import NewTransactionWidgets from "@/components/Layout/Dashboard/newTransactionWedget";
import IncomeAndExpensesChart from "@/components/Layout/Dashboard/Charts/incomeAndExpensesChart";

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
                incomes={[13600, 13150, 13450, 13000, 13196, 13500, 13000, 13500, 14000, 13500, 13000, 13500]}
                expenses={[10400, 14200, 11020, 11250, 10980, 11500, 12000, 12500, 13000, 13500, 14000, 12900]}
                months={['Jan', 'Feb', 'Mar', 'Apr', 'May','Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']}
                labels={['Incomes', 'Expenses']}
            />
        </div>
    );
}