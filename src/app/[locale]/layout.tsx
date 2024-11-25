import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import type { Metadata } from "next";
import "./globals.css";
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import theme from '../../theme';
import { NextIntlClientProvider, useMessages } from 'next-intl';
import { AppProvider, Navigation } from '@toolpad/core/AppProvider';
import React from 'react';
import { appBranding, getMenuNavigation } from '@/helpers/layoutHelpper';


export const metadata: Metadata = {
  title: process.env.APP_NAME,
  description: process.env.APP_DESCRIPTION,
};

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

  //TODO: Get the user session from the server
  const session = { user: { email: "rodrigo@bruner.net.br", id: "1", image: "image/bruner.png", name: "Rodrigo Bruner" } }

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
                session={session}
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
