export interface RegisterPayload {
    phone_number: string;
    password: string;
    repeatPassword: string;
}
export interface LoginPayload {
    phone_number: string;
    password: string;
}
export interface TokenResponse {
    access: string;
    refresh: string;
    city?: string;
}

export interface CompletePayload {
    phone_number?: string;
    city: string;
    email: string;
    first_name: string;
    last_name: string;
}

export interface UserStore {
    isAuth: boolean;
    idToken: string;
    accessToken: string;
    refreshToken: string;
    photoURL: string | null;
    user: {
        city?: string;
        [key: string]: any;
    };
}