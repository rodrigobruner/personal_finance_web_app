//React & Next
import * as React from 'react';
import { useMessages } from 'next-intl';
import { useMemo } from 'react';
//MUI
import Tabs from '@mui/material/Tabs';
import Box from '@mui/material/Box';
//Others
import { MdLocalAtm, MdOutlineReceipt, MdOutlineRepeat } from 'react-icons/md';
import axios from 'axios';
//Custom Components
import { NewTransactionForm } from '../Transactions/Form';
import { FormTransactionType } from '@/types/From';
import WidgetCard from '@/components/Layout/Dashboard/widgetCard';
import CustomTab from './customTab';
import { UserSession } from '@/types/UserSession';
import { getSession } from '@/helpers/userSession';
import appConfig from '@/config';

//Custom tab panel props
interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

//Custom tab panel component
function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
    //Return tab panel
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

//Custom tab props
function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

//New transaction widget
export default function NewTransactionWidget() {
    //App Config
    const config = React.useMemo(() => appConfig, []);
    
    //Tab value
    const [tabValue, setTabValue] = React.useState(0);    

    //Get translations
    const messages = useMessages();
    var t = useMemo(() => (messages as any)?.Components?.NewTransactionWidget || {}, 
    [messages]);
    //Get user session
    const [session, setSession] = React.useState<UserSession | null>(null);

    React.useEffect(() => {
        setSession(getSession());
    }, []);

    //Get currency
    const currency = useMemo(() => (messages as any)?.Configs?.Currency || {}, [messages]);

    //Handle tab change
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    //Categories and accounts
    const [categories, setCategories] = React.useState<{ expenses: [], incomes: [] }>({ expenses: [], incomes: [] });
    //Accounts
    const [accounts, setAccounts] = React.useState<AccountRow[]>([]);

    //Fetch categories and accounts
    React.useEffect(() => {
        //Fetch categories
        const fetchCategories = async (session: UserSession | null) => {
            if (!session) return; //If there is no session, return
            try {
                //Get categories
                const response = await axios.get(`${config.api.url}/Categories/user/${session?.uid}`);
                //Filter expenses
                const expenses = response.data.filter((category: any) => category.categoryType == 'Expense');
                //Filter incomes
                const incomes = response.data.filter((category: any) => category.categoryType == 'Income');
                //Set categories
                setCategories({ expenses, incomes });
            } catch (error) {
                //Error
                console.error('Error fetching account types:', error);
            } finally {
                // setLoading(false);
            }
        };

        //Fetch accounts
        const fetchAccount = async (session: UserSession | null) => {
            if (!session) return; //If there is no session, return
            try {
                //Get accounts
                const response = await axios.get(`${config.api.url}/Accounts/user/${session?.uid}/active`);
                //Set accounts
                setAccounts(response.data);
            } catch (error) {
                console.error('Error fetching account types:', error);
            } finally {
                // setLoading(false);
            }
        }

        fetchCategories(session); //Fetch categories
        fetchAccount(session); //Fetch accounts
    }, [session]);

    //Set tab value
    React.useEffect(() => {
        if(categories.expenses.length > 0 && accounts.length > 0) setTabValue(1);
    } , [categories, accounts]);
    
    //Return new transaction widget
    return (
        <WidgetCard>
            <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs   value={tabValue} 
                            indicatorColor="secondary"
                            onChange={handleChange} 
                            variant="fullWidth" 
                            aria-label="basic tabs example">
                        <CustomTab 
                            selected={false} 
                            icon={<MdLocalAtm />} 
                            iconPosition="start" 
                            label={t.addIncomes.title} 
                            {...a11yProps(0)} 
                            color='green'/>
                        <CustomTab 
                            color='red' 
                            selected={true} 
                            icon={<MdOutlineReceipt />} 
                            iconPosition="start" 
                            label={t.addExpenses.title} 
                            {...a11yProps(1)} />
                        <CustomTab 
                            color='blue' 
                            selected={false} 
                            icon={<MdOutlineRepeat />} 
                            iconPosition="start" 
                            label={t.transfer.title} 
                            {...a11yProps(2)} />
                    </Tabs>
                </Box>
                <CustomTabPanel value={tabValue} index={0}>
                    <NewTransactionForm 
                        type={FormTransactionType.INCOME}
                        title={t.addIncomes.title}
                        from={t.addIncomes.from}
                        fromOptions={categories.incomes}
                        amount={t.addIncomes.amount}
                        to={t.addIncomes.to}
                        toOptions={accounts}
                        description={t.addIncomes.description}
                        button={t.addIncomes.button}
                        msg={t.addIncomes.msg}
                        locale={currency.locale}
                        currencyName={currency.name}
                        currencySymbol={currency.symbol}
                        currencyDecimal={currency.decimal}
                        currencyThousand={currency.thousand}
                    />
                </CustomTabPanel>
                <CustomTabPanel value={tabValue} index={1}>
                    <NewTransactionForm 
                        type={FormTransactionType.EXPENSE}
                        title={t.addExpenses.title}
                        from={t.addExpenses.from}
                        fromOptions={accounts}
                        amount={t.addExpenses.amount}
                        to={t.addExpenses.to}
                        toOptions={categories.expenses}
                        description={t.addExpenses.description}
                        button={t.addExpenses.button}
                        msg={t.addExpenses.msg}
                        locale={currency.locale}
                        currencyName={currency.name}
                        currencySymbol={currency.symbol}
                        currencyDecimal={currency.decimal}
                        currencyThousand={currency.thousand}
                    />
                </CustomTabPanel>
                <CustomTabPanel value={tabValue} index={2}>
                    <NewTransactionForm 
                        type={FormTransactionType.TRANSFER}
                        title={t.transfer.title}
                        from={t.transfer.from}
                        fromOptions={accounts}
                        amount={t.transfer.amount}
                        to={t.transfer.to}
                        toOptions={accounts}
                        description={t.transfer.description}
                        button={t.transfer.button}
                        msg={t.transfer.msg}
                        locale={currency.locale}
                        currencyName={currency.name}
                        currencySymbol={currency.symbol}
                        currencyDecimal={currency.decimal}
                        currencyThousand={currency.thousand}
                    />
                </CustomTabPanel>
            </Box>
        </WidgetCard>
    );
}