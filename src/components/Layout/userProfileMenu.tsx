//React & Next
import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
//Material UI
import Logout from "@mui/icons-material/Logout";
import Settings from "@mui/icons-material/Settings";
import { Avatar, ListItemIcon, Menu, MenuItem, Tooltip } from "@mui/material";
import { blue } from "@mui/material/colors";
//Custom
import { getSession } from "@/helpers/userSession";
import { UserSession } from "@/types/UserSession";

//User profile menu
export function UserProfileMenu() {
    //Get user session
    const [sessionState, setSessionState] = useState<UserSession | null>(null);
    useEffect(() => {
        if (getSession) {
            const sessionData = getSession();
            setSessionState(sessionData);
        }
    }, []);

    //Router
    const router = useRouter();
    const pathname = usePathname();
    const locale = pathname.split('/')[1];

    //Menu state
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    //Handle click
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    //Handle close
    const handleClose = () => {
        setAnchorEl(null);
    };

    //Handle logout option
    const handleLogout = () => {
        router?.push(`/${locale}/logout`);
    };

    //Handle settings option
    const handleSettings = () => {
        router?.push(`/${locale}/app/profile`);
    };

    //Return user profile menu
    return (
        <>
            <Tooltip title={`${sessionState?.name} ( ${sessionState?.email} )`} placement="left">
                <Avatar
                    sx={{ bgcolor: blue[100], color: blue[600] }}
                    alt={sessionState?.name}
                    src={sessionState ? `/images/${sessionState.image}` : ""}
                    onClick={handleClick}
                ></Avatar>
            </Tooltip>
            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                slotProps={{
                    paper: {
                        elevation: 0,
                        sx: {
                            overflow: 'visible',
                            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                            mt: 1.5,
                            '& .MuiAvatar-root': {
                                width: 32,
                                height: 32,
                                ml: -0.5,
                                mr: 1,
                            },
                            '&::before': {
                                content: '""',
                                display: 'block',
                                position: 'absolute',
                                top: 0,
                                right: 14,
                                width: 10,
                                height: 10,
                                bgcolor: 'background.paper',
                                transform: 'translateY(-50%) rotate(45deg)',
                                zIndex: 0,
                            },
                        },
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <MenuItem onClick={handleSettings}>
                    <ListItemIcon>
                        <Settings fontSize="small" />
                    </ListItemIcon>
                    Settings
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                        <Logout fontSize="small" />
                    </ListItemIcon>
                    Logout
                </MenuItem>
            </Menu>
        </>
    );
}