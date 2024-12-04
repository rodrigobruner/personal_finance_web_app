//react
import { ReactNode } from "react";
//Material UI
import { Card } from "@mui/material";

//Widget card component
export default function WidgetCard({ children }: { children: ReactNode }){
    //Return widget card
    return(
        <Card sx={{width:'48%', margin:'1%', padding:'10px', minHeight:'400px', float:'left'}}>
            {children}
        </Card>
    );
}