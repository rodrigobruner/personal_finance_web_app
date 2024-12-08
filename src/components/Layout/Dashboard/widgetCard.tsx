//react
import { ReactNode } from "react";
//Material UI
import { Card } from "@mui/material";

//Widget card component
export default function WidgetCard({ children }: { children: ReactNode }){
    //Return widget card
    return(
        <Card sx={{
            height: '400px',
            padding: '10px',
            margin: '1%',
            minHeight: '100px',
            display: 'flex',
            flexDirection: 'column',
            float: 'left',
            '@media (min-width: 1020px)': {
                width: '45%',
            },

            '@media (max-width: 600px)': {
                width: '85%',
            },
        }}>
            {children}
        </Card>
    );
}