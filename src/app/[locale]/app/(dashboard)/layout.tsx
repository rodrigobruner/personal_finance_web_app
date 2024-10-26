"use client";

//React & Next
import * as React from 'react';
//MUI
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { PageContainer } from '@toolpad/core/PageContainer';
//Components
import { UserProfileMenu } from '@/components/Layout/userProfileMenu';
import { SidebarFooter } from '@/components/Layout/sidebarFooter';


export default function Layout(props: { children: React.ReactNode }) {
    return (
        <DashboardLayout
            slots={{ toolbarActions: UserProfileMenu, 
                    sidebarFooter: SidebarFooter }}
        >
            <PageContainer>{props.children}</PageContainer>
        </DashboardLayout>
    );
}