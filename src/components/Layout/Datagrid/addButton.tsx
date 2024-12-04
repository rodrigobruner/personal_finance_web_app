//Material UI components
import { Box, Button } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';

//Add button component
export const AddButton = ({ onClick, text }: { onClick: () => void, text: string }) => {
    //Return add button
    return (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <Button 
                variant="contained" 
                color="primary" 
                sx={{ m: 1 }}
                onClick={onClick}
                startIcon={<AddIcon />}
            >
                {text}
            </Button>
        </Box>
    );
};