//React imports
import React, { useEffect } from 'react';
//Material UI imports
import { Tab, TabProps } from '@mui/material';

//Custom tab props
interface CustomTabProps extends TabProps {
    color: string;
    selected: boolean;
}

//Custom tab component
const CustomTab: React.FC<CustomTabProps> = ({ color, selected, ...props }) => {
    //Change indicator color when selected
    useEffect(() => {
        const indicator = document.querySelector('.MuiTabs-indicator') as HTMLElement;
        if (indicator && selected) {
            //Change indicator color
            indicator.style.backgroundColor = color;
        }
    }, [color, selected]);
    //Return custom tab
    return (
        <Tab
            {...props}
            style={{ color: selected ? color : 'inherit' }}
        />
    );
};

export default CustomTab;