"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from 'next/navigation';
//Types and helpers
import { UserSession } from "@/types/UserSession";
import { checkUserSession, getSession } from "@/helpers/userSession";
import DashboardIcon from '@mui/icons-material/Dashboard';
import NewTransactionWidgets from "@/components/Layout/Dashboard/newTransactionWedget";
import IncomeAndExpensesChart from "@/components/Layout/Dashboard/Charts/incomeAndExpensesChart";
import ExpensesByCategory from "@/components/Layout/Dashboard/Charts/expensesByCategory";
import { useMessages } from "next-intl";
import IncomesByCategory from "@/components/Layout/Dashboard/Charts/incomesByCategory";


export default function IndexPage(
    { params: { locale } }: Readonly<{ params: { locale: string } }>
) {
    const [session, setSession] = useState<UserSession | null>(null);
    const router = useRouter();

    //Get translations
    const messages = useMessages();
    // Translate the datagrid components
    const configs = useMemo(() => (messages as any).Configs, [messages]);
    const components = useMemo(() => (messages as any).Components, [messages]);

    useEffect(() => {
        if(!checkUserSession()){
            router.push(`/${locale}/`);
        }
        setSession(getSession());
    }, []);

    return (
        <div>
            <h1><DashboardIcon /> Dashboard</h1>
            <NewTransactionWidgets/>

            <IncomeAndExpensesChart
                title={components.IncomeAndExpensesChart.title}
                locale={locale}
                currency={configs.Currency.name}
                labels={components.IncomeAndExpensesChart.labels}
            />
            <IncomesByCategory
                locale={locale}
                currency={configs.Currency.name}
                title={components.IncomesByCategory.title}
                start={components.IncomesByCategory.start}
                end={components.IncomesByCategory.end}
            />
            <ExpensesByCategory
                locale={locale}
                currency={configs.Currency.name}
                title={components.ExpensesByCategory.title}
                start={components.ExpensesByCategory.start}
                end={components.ExpensesByCategory.end}
            />
        </div>
    );
}