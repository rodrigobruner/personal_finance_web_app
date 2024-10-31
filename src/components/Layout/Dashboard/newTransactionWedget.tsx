//React & Next
import * as React from 'react';
import { useMessages } from 'next-intl';
import { useMemo } from 'react';
//MUI
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
//React Icons
import { MdLocalAtm, MdOutlineReceipt, MdOutlineRepeat } from 'react-icons/md';
//Custom Components
import { NewTransactionForm } from '../Transactions/Form';
import { FormTransactionType } from '@/types/From';
import WidgetCard from '@/components/Layout/Dashboard/widgetCard';

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
    const [value, setValue] = React.useState(0);

    const messages = useMessages();
    var t = useMemo(() => (messages as any)?.Components?.NewTransactionWidget || {}, [messages]);
    const currency = useMemo(() => (messages as any)?.Configs?.Currency || {}, [messages]);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <WidgetCard>
            <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs   value={value} 
                            onChange={handleChange} 
                            variant="fullWidth" 
                            aria-label="basic tabs example">
                        <Tab icon={<MdLocalAtm />} iconPosition="start"  label={t.addIncomes.title} {...a11yProps(0)} />
                        <Tab icon={<MdOutlineReceipt />} iconPosition="start"  label={t.addExpenses.title} {...a11yProps(1)} />
                        <Tab icon={<MdOutlineRepeat />} iconPosition="start"  label={t.transfer.title} {...a11yProps(2)} />
                    </Tabs>
                </Box>
                <CustomTabPanel value={value} index={0}>
                    <NewTransactionForm 
                        type={FormTransactionType.INCOME}
                        title={t.addIncomes.title}
                        from={t.addIncomes.from}
                        amount={t.addIncomes.amount}
                        to={t.addIncomes.to}
                        description={t.addIncomes.description}
                        button={t.addIncomes.button}
                        msg={t.addIncomes.msg}
                        currencyName={currency.name}
                        currencySymbol={currency.symbol}
                        currencyDecimal={currency.decimal}
                        currencyThousand={currency.thousand}
                    />
                </CustomTabPanel>
                <CustomTabPanel value={value} index={1}>
                    <NewTransactionForm 
                        type={FormTransactionType.EXPENSE}
                        title={t.addExpenses.title}
                        from={t.addExpenses.from}
                        amount={t.addExpenses.amount}
                        to={t.addExpenses.to}
                        description={t.addExpenses.description}
                        button={t.addExpenses.button}
                        msg={t.addExpenses.msg}
                        currencyName={currency.name}
                        currencySymbol={currency.symbol}
                        currencyDecimal={currency.decimal}
                        currencyThousand={currency.thousand}
                    />
                </CustomTabPanel>
                <CustomTabPanel value={value} index={2}>
                    <NewTransactionForm 
                        type={FormTransactionType.TRANSFER}
                        title={t.transfer.title}
                        from={t.transfer.from}
                        amount={t.transfer.amount}
                        to={t.transfer.to}
                        description={t.transfer.description}
                        button={t.transfer.button}
                        msg={t.transfer.msg}
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