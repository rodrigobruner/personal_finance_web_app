//Material UI
import { Box, CircularProgress } from "@mui/material";

//Loading component
export default function Loading() {
    //Return loading component
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '10vh',height: '100%' }}>
            <CircularProgress />
        </Box>
    );
}