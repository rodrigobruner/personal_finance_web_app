// React & Next
import React from 'react';
import { NextIntlClientProvider, useMessages } from 'next-intl';
import type { Metadata } from "next";
// MUI
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import { AppProvider, Navigation } from '@toolpad/core/AppProvider';
// Custom
import { appBranding, getMenuNavigation } from '@/helpers/layoutHelpper';
import theme from '../../theme';
import "./globals.css";
import appConfig from '@/config';

//Metadata
export const metadata: Metadata = {
  title: appConfig.app.name,
  description: appConfig.app.description,
};
//Component
export default function RootLayout({
  children,
  params: {locale}
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {

  //Get translations
  const messages = useMessages();

  //Translate the page components
  const navBarOptions = React.useMemo(() => (messages as any).Configs.NavBarOptions, [messages]);
  const menuNavegation =  getMenuNavigation(navBarOptions, locale) as Navigation;

  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <NextIntlClientProvider 
              locale={locale} 
              messages={messages}>
              <AppProvider 
                navigation={menuNavegation}
                branding={appBranding}
              >
                {children}
              </AppProvider>
            </NextIntlClientProvider>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
