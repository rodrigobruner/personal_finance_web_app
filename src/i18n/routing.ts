import {defineRouting} from 'next-intl/routing';
import {createSharedPathnamesNavigation} from 'next-intl/navigation';
import appConfig from '@/config';

// Get the locales and default locale from the app config
const locales = appConfig.locales || ['en-us'];
const defaultLocale = appConfig.defaultLocale || 'en-us';

// Define the routing configuration
export const routing = defineRouting({
    locales: locales,
    defaultLocale: defaultLocale
});

// Export the routing configuration
export const {Link, redirect, usePathname, useRouter} = createSharedPathnamesNavigation(routing);