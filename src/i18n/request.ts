//Next
import {notFound} from 'next/navigation';
import {getRequestConfig} from 'next-intl/server';
//custom routing
import {routing} from './routing';

// This function is called by the server to get the messages for the current locale
export default getRequestConfig(async ({locale}) => {
    // Validate that the incoming `locale` parameter is valid
    if (!routing.locales.includes(locale as any)) notFound();
    // Return the messages for the current locale
    return {
        messages: (await import(`./languages/${locale}.json`)).default
    };
});