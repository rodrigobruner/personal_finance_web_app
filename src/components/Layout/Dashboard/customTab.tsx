import React, { useEffect } from 'react';
import { Tab, TabProps } from '@mui/material';

interface CustomTabProps extends TabProps {
    color: string;
    selected: boolean;
}

const CustomTab: React.FC<CustomTabProps> = ({ color, selected, ...props }) => {
    useEffect(() => {
        const indicator = document.querySelector('.MuiTabs-indicator') as HTMLElement;
        if (indicator && selected) {
            indicator.style.backgroundColor = color;
        }
    }, [color, selected]);

    return (
        <Tab
            {...props}
            style={{ color: selected ? color : 'inherit' }}
        />
    );
};

export default CustomTab;