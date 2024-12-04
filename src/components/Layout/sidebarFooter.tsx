//React
import React from "react";
//MUI
import { Typography } from "@mui/material";
import { SidebarFooterProps } from "@toolpad/core/DashboardLayout";
//Custom
import appConfig from "@/config";

//Sidebar footer component
export function SidebarFooter({ mini }: SidebarFooterProps) {

    //App Config
    const config = React.useMemo(() => appConfig, []);

    const appName = config.app.name;
    const appVersion = config.app.version;
    //Return footer
    return (
        <Typography
            variant="caption"
            sx={{ m: 1, whiteSpace: 'nowrap', overflow: 'hidden' }}
        >
            {`${appName} © - ${appVersion} - ${new Date().getFullYear()} `}
        </Typography>
    );
}