import React, { createContext, useContext, useState } from 'react';
import { Alert, Snackbar } from '@mui/material';

const AlertContext = createContext();

export function AlertProvider({ children }) {
    const [alert, setAlert] = useState({
        open: false,
        severity: 'info',
        message: ''
    });

    const showAlert = (severity, message) => {
        setAlert({
            open: true,
            severity,
            message
        });
    };

    const handleClose = () => {
        setAlert(prev => ({
            ...prev,
            open: false
        }));
    };

    return (
        <AlertContext.Provider value={{ showAlert }}>
            {children}
            <Snackbar
                open={alert.open}
                autoHideDuration={6000}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert 
                    onClose={handleClose} 
                    severity={alert.severity}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {alert.message}
                </Alert>
            </Snackbar>
        </AlertContext.Provider>
    );
}

export const useAlert = () => useContext(AlertContext); 