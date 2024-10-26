import { UserSession } from '../types/User';

// WARNING: This implementation is insecure
// TODO: implement JWT to perform the authorization and authentication process.

const SESSION_NAME = process.env.NEXT_PUBLIC_SESSION_NAME || "userSession";



function isBrowser() {
    return typeof window !== 'undefined';
}

export function setUserSession(user: UserSession) {
    localStorage.setItem(SESSION_NAME, JSON.stringify(user));
}

export function getUserSession(): Promise<UserSession | null> {
    return new Promise((resolve, reject) => {
        if (isBrowser()) {
            localStorage.getItem(SESSION_NAME);
        } else {
            resolve(null);
        }
    });
}

export function removeUserSession() {
    localStorage.removeItem(SESSION_NAME);
}

export async function isUserSessionValid(): Promise<boolean> {
    if (isBrowser()) {
        const user = await getUserSession();
        if (user) {
            return user.expiration > new Date();
        }
    }
    return false;
}

export async function checkUserSession(): Promise<UserSession | null> {
    try {
        const session = await getUserSession();
        return session;
    } catch (error) {
        console.error("Error checking user session:", error);
        return null;
    }
}