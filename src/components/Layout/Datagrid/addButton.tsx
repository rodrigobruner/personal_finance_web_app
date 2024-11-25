import { Box, Button } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';

export const AddButton = ({ onClick, text }: { onClick: () => void, text: string }) => {
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