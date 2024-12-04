import { UserSession } from '../types/UserSession';

// WARNING: This implementation is insecure
// TODO: implement JWT to perform the authorization and authentication process.

// Save the user session in the local storage
export const saveSession = (user: UserSession) => {
    localStorage.setItem('user', JSON.stringify(user));
};

// Get the user session from the local storage
export const getSession = (): UserSession | null => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};

// Clear the user session from the local storage
export const clearSession = () => {
    localStorage.removeItem('user');
};

// Check if the user session is active
export const checkUserSession = () => {
    return getSession() !== null;
};