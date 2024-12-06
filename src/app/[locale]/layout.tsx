"use client";

// React & Next
import React from 'react';
import { NextIntlClientProvider, useMessages } from 'next-intl';
// MUI
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import { AppProvider, Navigation } from '@toolpad/core/AppProvider';
// Custom
import { appBranding, getMenuNavigation } from '@/helpers/layoutHelpper';
import theme from '../../theme';
import "./globals.css";
import { routerHelper } from '@/helpers/routerHelper';

//Component
export default function RootLayout({
  children,
  params: {locale}
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {

  //Get translations
  // const messages = useMessages();
  const messages = require(`@/i18n/languages/${locale}.json`);

  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <NextIntlClientProvider 
              locale={locale} 
              messages={messages}>
              <InnerLayout locale={locale}>
                {children}  
              </InnerLayout>
            </NextIntlClientProvider>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}


function InnerLayout({ children, locale }: { children: React.ReactNode, locale: string }) {
  const messages = useMessages();

  //Translate the page components
  const navBarOptions = React.useMemo(() => (messages as any).Configs.NavBarOptions, [messages]);
  const menuNavegation =  getMenuNavigation(navBarOptions, locale) as Navigation;
  return (
              <AppProvider 
                navigation={menuNavegation}
                branding={appBranding}
              >
                {children}
              </AppProvider>
  );
}