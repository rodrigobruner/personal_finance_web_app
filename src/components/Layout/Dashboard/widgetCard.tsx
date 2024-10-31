import { Card } from "@mui/material";

import { ReactNode } from "react";

export default function WidgetCard({ children }: { children: ReactNode }){
    return(
        <Card sx={{width:'48%', margin:'1%', padding:'10px', minHeight:'400px', float:'left'}}>
            {children}
        </Card>
    );
}