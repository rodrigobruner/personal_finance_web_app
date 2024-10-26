import {defineRouting} from 'next-intl/routing';
import {createSharedPathnamesNavigation} from 'next-intl/navigation';

const locales = process.env.LOCALES?.split(',') || ['en-us', 'pt-br'];
const defaultLocale = process.env.DEFAULT_LOCALE || 'en-us';

export const routing = defineRouting({
    locales: locales,

    defaultLocale: defaultLocale
});

export const {Link, redirect, usePathname, useRouter} = createSharedPathnamesNavigation(routing);