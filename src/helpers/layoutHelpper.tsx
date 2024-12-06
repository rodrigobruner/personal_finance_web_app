//Matirial UI
import { Navigation } from '@toolpad/core/AppProvider';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import CategoryIcon from '@mui/icons-material/Category';
//React Icons
import { MdLocalAtm, MdOutlineReceipt, MdOutlineRepeat } from 'react-icons/md';
import { Metadata } from 'next';
import appConfig from '@/config';


//Metadata
export const metadata: Metadata = {
    title: appConfig.app.name,
    description: appConfig.app.description,
  };
  
//App branding
export const appBranding = { 
    title: 'Personal finance', 
    logo: <img src="/images/logo.png" alt="Personal Finance"/>
};

//Get the navigation menu
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
            title: navBarOptions.main.categories,
            segment: `./${locale}/app/categories/`,
            icon: <CategoryIcon />,
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
            icon: <MdOutlineReceipt />,
        },
        {
            title: navBarOptions.reports.incomes,
            segment: `./${locale}/app/reports/incomes/`,
            icon: <MdLocalAtm />,
        },
        {
            title: navBarOptions.reports.transfers,
            segment: `./${locale}/app/reports/transfers/`,
            icon: <MdOutlineRepeat />,
        },
    ];
}