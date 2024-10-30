import { UserSession } from '../types/UserSession';

// WARNING: This implementation is insecure
// TODO: implement JWT to perform the authorization and authentication process.


export const saveSession = (user: UserSession) => {
    localStorage.setItem('user', JSON.stringify(user));
};

export const getSession = (): UserSession | null => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};

export const clearSession = () => {
    localStorage.removeItem('user');
};

export const checkUserSession = () => {
    return getSession() !== null;
};