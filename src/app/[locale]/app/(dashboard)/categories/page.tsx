"use client";
//React & Next
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from 'next/navigation';
import { useMessages } from "next-intl";
//Material UI
import { Box, Divider, Paper } from "@mui/material";
import { DataGrid, GridRowSelectionModel} from "@mui/x-data-grid";
import CategoryIcon from '@mui/icons-material/Category';
//Others
import axios from "axios";
//Types, components and helpers
import { UserSession } from "@/types/UserSession";
import { checkUserSession, getSession } from "@/helpers/userSession";
import Loading from "@/components/Layout/loading";
import getDatagridColumns from "./datagrid";
import { useDialogs } from "@toolpad/core/useDialogs";
import { AddButton } from "@/components/Layout/Datagrid/addButton";
import appConfig from "@/config";

//Category Row interface
interface CategoryRow {
    id: number;
    name: string;
    categoryType: string;
}

export default function CategoriesPage(
    { params: { locale } }: Readonly<{ params: { locale: string } }>
) {
    //App Config
    const config = useMemo(() => appConfig, []);
        
    //Loading
    const [loading, setLoading] = useState(true);

    //Get translations
    const messages = useMessages();

    //Translate the page components
    const t = useMemo(() => (messages as any).Pages.CategoryList, [messages]);

    // Translate the datagrid components
    const configs = useMemo(() => (messages as any).Configs, [messages]);
    const translationForDatagrid = useMemo(() => configs.Datagrid, [configs]);
    const translationForPagination = useMemo(() => configs.DatagridPagination, [configs]);

    //Create a dialog instance
    const dialogs = useDialogs();

    //Get the router instance
    const router = useRouter();

    //Get the user session
    const [session, setSession] = useState<UserSession | null>(null);

    //Check if the user is logged in
    useEffect(() => {
        if(!checkUserSession()){
            router.push(`/${locale}/`);
        }
        setSession(getSession());
    }, []);

    // Fetch all categories
    const [rows, setRows] = useState<CategoryRow[]>([]);
    
    // create a function to fetch all categories
    const fetchAll = async (): Promise<void> => {
        try {
            if (!session) return; // No session, no fetch
            // Fetch all categories from the API
            const response = await axios.get(`${config.api.url}/Categories/user/${session?.uid}`);
            // Map the response data to the rows
            const categories = response.data.map((category: any) => ({
                id: category.id,
                name: category.name,
                categoryType: category.categoryType,
            }));
            // Set the rows
            setRows(categories);
        } catch (error) {
            // Log the error
            console.error('Error insert:', error);
            if (axios.isAxiosError(error) && error.response) {
                console.error('Response data:', error.response.data);
                console.error('Response status:', error.response.status);
                console.error('Response headers:', error.response.headers);
            }
        } finally {
            //  Stop loading
            setLoading(false);
        }
    };

    useEffect(() => {       
        // Fetch all categories 
        fetchAll();
    }, [session, locale, configs]);


    // Save selected rows
    const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);


    // Handle add account
    const handleAddButton = useCallback(() => {
        // Redirect to the new account page
        router?.push(`/${locale}/app/categories/form/0`);
    }, [router, locale]);

    // Handle edit account
    const handleEditButton = useCallback((id: number) => {
        // Redirect to the edit account page
        router?.push(`/${locale}/app/categories/form/${id}`);
    }, [router, locale]);

    // Handle delete 
    const handleDeleteButton = useCallback(async (id: number) => {

        // Show a confirmation dialog
        const confirmed = await dialogs.confirm(t.alerts.delete.message, {
            title: t.alerts.delete.title,
            okText: t.alerts.delete.delete,
            cancelText: t.alerts.delete.cancel,
        });

        // If the user not confirmed the action skip the delete
        if (!confirmed) {
            return;
        }

        if (id) {
            try{
                //Delete the category through the API
                await axios.delete(`http://localhost:8080/Categories/${id}`);
                //Remove the row from the datagrid
                setRows(prevRows => prevRows.filter(row => row.id !== id));
                //Fetch all the categories again
                fetchAll();
            } catch (error) {
                // Log the error
                console.error('Error delete:', error);
                if (axios.isAxiosError(error) && error.response) {
                    console.error('Response data:', error.response.data);
                    console.error('Response status:', error.response.status);
                    console.error('Response headers:', error.response.headers);
                }
            }
        } else {
            // Log the error
            console.error('Category not found');
        }
    }, [dialogs, t, rows]);

    // Get datagrid columns
    const columns = getDatagridColumns({ t, editAction: handleEditButton, deleteAction: handleDeleteButton });
    
    // Custom toolbar for the datagrid
    const CustomToolbar = () => {
        return <AddButton onClick={handleAddButton} text={t.datagrid.actions.edit} />;
    };

    //Loading
    if (loading) {
        return (<Loading />);
    }
    
    //Render the page
    return (
        <Box sx={{ width: '100%', padding: '5px' }} >
            <h1><CategoryIcon /> { t.title }</h1>
            <Divider sx={{margin:"20px"}} />
            <Paper sx={{ width: { xs: '62%', sm: '97%', md: '100%' } }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    localeText={translationForDatagrid}
                    pagination
                    slots={{
                        toolbar: CustomToolbar,
                    }}
                    sx={{ border: 0 }}
                    slotProps={translationForPagination}
                />
            </Paper>
        </Box>
    );
}

