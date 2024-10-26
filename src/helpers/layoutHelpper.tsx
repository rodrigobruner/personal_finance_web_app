import * as React from 'react';
import { Navigation } from '@toolpad/core/AppProvider';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BarChartIcon from '@mui/icons-material/BarChart';
import DescriptionIcon from '@mui/icons-material/Description';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';


export const appBranding = { 
    title: 'Personal finance', 
    logo: <img src="/images/logo.png" alt="Personal Finance"/>
};

export function getMenuNavigation(navBarOptions: any, locale: string): Navigation {
    return [
        {
            kind: 'header',
            title: navBarOptions.main.title,
        },
        {
            title: navBarOptions.main.dashboard,
            segment: `./${locale}/app/`,
            icon: <DashboardIcon />,
        },
        {
            title: navBarOptions.main.accounts,
            segment: `./${locale}/app/accounts/`,
            icon: <AccountBalanceIcon />,
        },
        {
            kind: 'divider',
        },
        {
            kind: 'header',
            title: navBarOptions.reports.title,
        },
        {
            title:  navBarOptions.reports.expenses,
            segment: `./${locale}/app/reports/expenses/`,
            icon: <DescriptionIcon />,
        },
        {
            title: navBarOptions.reports.incomes,
            segment: `./${locale}/app/reports/incomes/`,
            icon: <DescriptionIcon />,
        },
    ];
}