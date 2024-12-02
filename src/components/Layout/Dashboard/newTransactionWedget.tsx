//React & Next
import * as React from 'react';
import { useMessages } from 'next-intl';
import { useMemo } from 'react';
//MUI
import Tabs from '@mui/material/Tabs';
import Box from '@mui/material/Box';
//React Icons
import { MdLocalAtm, MdOutlineReceipt, MdOutlineRepeat } from 'react-icons/md';
//Custom Components
import { NewTransactionForm } from '../Transactions/Form';
import { FormTransactionType } from '@/types/From';
import WidgetCard from '@/components/Layout/Dashboard/widgetCard';
import CustomTab from './customTab';
import axios from 'axios';
import { UserSession } from '@/types/UserSession';
import { getSession } from '@/helpers/userSession';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

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

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

//New transaction widget
export default function NewTransactionWidget() {

    const [tabValue, setTabValue] = React.useState(1);    

    //Get translations
    const messages = useMessages();
    var t = useMemo(() => (messages as any)?.Components?.NewTransactionWidget || {}, 
    [messages]);
    
    const currency = useMemo(() => (messages as any)?.Configs?.Currency || {}, [messages]);

    //Handle tab change
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const [categories, setCategories] = React.useState<{ expenses: [], incomes: [] }>({ expenses: [], incomes: [] });
    const [accounts, setAccounts] = React.useState<AccountRow[]>([]);

    const fetchCategories = async (session: UserSession | null) => {
        if (!session) return;
        try {
            const response = await axios.get(`http://localhost:8080/Categories/user/${session?.uid}`);
            const expenses = response.data.filter((category: any) => category.categoryType == 'Expense');
            const incomes = response.data.filter((category: any) => category.categoryType == 'Income');
            setCategories({ expenses, incomes });
        } catch (error) {
            console.error('Error fetching account types:', error);
        } finally {
            // setLoading(false);
        }
    };

    const fetchAccount = async (session: UserSession | null) => {
        if (!session) return;
        try {
            const response = await axios.get(`http://localhost:8080/Accounts/user/${session?.uid}`);
            console.log(response.data);
            setAccounts(response.data);
        } catch (error) {
            console.error('Error fetching account types:', error);
        } finally {
            // setLoading(false);
        }
    }

    React.useEffect(() => {
        const session = getSession();
        fetchCategories(session);
        fetchAccount(session);
    }, []);

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