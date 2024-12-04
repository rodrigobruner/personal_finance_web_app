import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';

// Export the routing configuration
export default createMiddleware(routing);
// Compare this snippet from src/pages/_app.tsx:
export const config = {
    // Match only internationalized pathnames
    matcher: ['/', `/(pt-br|en-us|en-ca)/:path*`]
};