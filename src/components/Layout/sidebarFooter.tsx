//MUI
import { Typography } from "@mui/material";
import { SidebarFooterProps } from "@toolpad/core/DashboardLayout";

export function SidebarFooter({ mini }: SidebarFooterProps) {
    const appName = process.env.NEXT_PUBLIC_APP_NAME;
    const appVersion = process.env.NEXT_PUBLIC_APP_VERSION;
    return (
        <Typography
            variant="caption"
            sx={{ m: 1, whiteSpace: 'nowrap', overflow: 'hidden' }}
        >
            {`${appName} © - ${appVersion} - ${new Date().getFullYear()} `}
        </Typography>
    );
}