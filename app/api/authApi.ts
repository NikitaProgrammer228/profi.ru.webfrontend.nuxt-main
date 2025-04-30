import { api, setToken } from ".";
import { useUserStore } from "~/stores/userStore";
import { getAuth, GoogleAuthProvider, signInWithPopup, RecaptchaVerifier, signInWithPhoneNumber, PhoneAuthProvider, signInWithCredential } from 'firebase/auth';
import { type RegisterPayload, type TokenResponse, type CompletePayload, type LoginPayload } from "./types";
import { getClient, patchClient } from "./clientApi";
import { AxiosError } from 'axios';

function parseError(errorObject: any) {
    if (typeof errorObject === 'object') {
        return parseError(Object.values(errorObject)[0]);
    }
    return errorObject;
}

export async function register(payload: RegisterPayload) {
    const passwordResponse = await checkPassword(payload.password);

    if (!passwordResponse.success) {
        return passwordResponse;
    }

    const phoneResponse = await checkPhone(payload.phone_number);

    if (!phoneResponse.success) {
        return phoneResponse;
    }

    const res = await sendCode(payload.phone_number, payload.password);

    return res;
}

export async function login(payload: LoginPayload) {
    try {
        const res = await api.post("/api/v1/user/login_via_phone", payload);

        const userStore = useUserStore();

        localStorage.setItem("profiru-accessToken", res.data.access);
        localStorage.setItem("profiru-refreshToken", res.data.refresh);
        setToken(res.data.access);

        userStore.user = await getClient();
        userStore.isAuth = true;

        localStorage.setItem("profiru-user", JSON.stringify(userStore.user));

        return res.data;
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            return {
                success: false,
                message: parseError(error.response?.data),
            }
        }
        return {
            success: false,
            message: 'Unknown error occurred'
        }
    }
}

export async function loginByGoogle(): Promise<any> {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    await fillAuthData(user);

    return user.email;
}

async function verifyToken(token: string, isGoogle: boolean, password: string): Promise<TokenResponse> {
    try {
        if (isGoogle) {
            const response = await api.post("/api/v1/user/login_via_google", {
                id_token: token
            });
            return response.data;
        }

        const auth = getAuth();
        const currentUser = auth.currentUser;
        
        const response = await api.post("/api/v1/user/register_via_sms", {
            verification_id: token,
            password: password,
            fb_id: currentUser?.uid || '',
            phone_number: currentUser?.phoneNumber || ''
        });
        return response.data;
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            console.error('Ошибка при верификации:', error.response?.data);
        }
        throw error;
    }
}

export async function completeRegistration(payload: CompletePayload, id: string) {

    const response = await patchClient(payload, id);

    if (response) {
        const userStore = useUserStore();

        localStorage.setItem('profiru-user', JSON.stringify(response));
        userStore.user = response;
    }

    return response;
}
async function fillAuthData(user: any, isGoogle = true, password = '') {
try{
    const idToken = await user.getIdToken();
    const loginData = await verifyToken(idToken, isGoogle, password);

    localStorage.setItem("profiru-accessToken", loginData.access);
    localStorage.setItem("profiru-refreshToken", loginData.refresh);
    setToken(loginData.access);

    const userStore = useUserStore();
    userStore.isAuth = true;
    userStore.idToken = idToken;
    userStore.accessToken = user.accessToken as string;
    userStore.refreshToken = user.refreshToken as string;
    userStore.user.city = loginData.city;

    if (user.photoURL) {
        userStore.photoURL = user.photoURL as string;
        localStorage.setItem("profiru-avatar", user.photoURL);
    }

    localStorage.setItem("profiru-token-firebase", idToken);
    return true;
} catch (error) {
    console.error('Ошибка при заполнении данных:', error);
    return false;
}
}

async function checkPassword(password: string) {
    try {
        const response = await api.post("/api/v1/user/validate_password", {
            password
        });
        return response.data;
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            console.error('Ошибка валидации пароля:', error.response?.data);
            return {
                success: false,
                message: parseError(error.response?.data),
            }
        }
        return {
            success: false,
            message: 'Unknown error occurred'
        }
    }
}
async function checkPhone(phone_number: string) {
    try {
        const response = await api.post("/api/v1/user/validate_phone", {
            phone_number
        });
        return response.data;
    } catch (error) {
        return {
            success: false,
            message: parseError(error.response.data),
        }
    }
}
export async function sendCode(phone_number: string, password: string): Promise<string | boolean> {
    const auth = getAuth();
    const appVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible'
    });

    let verificationId = '';
    let error = false;

    await signInWithPhoneNumber(auth, phone_number, appVerifier)
        .then(async (confirmationResult) => {
            verificationId = confirmationResult.verificationId;
        })
        .catch((error) => {
            console.error('Ошибка при отправке SMS:', error);
            error = true;
        });
    return verificationId || error;
}
export async function verifyCode(verificationId: string, code: string, password = ''): Promise<boolean> {
    const auth = getAuth();
       try {
           const credential = PhoneAuthProvider.credential(verificationId, code);
           const result = await signInWithCredential(auth, credential);
           const user = result.user;
           
           await fillAuthData(user, false, password);
           return true;
       } catch (error) {
           console.error('Ошибка при подтверждении кода:', error);
           return false;
       }
};

export function logout() {
    const user = useUserStore();
    user.completeLogout();
}

export async function updatePassword(old_password: string, new_password: string, confirm_password: string): Promise<any> {
    try {
        const res = await api.post("/api/v1/user/update_password", {
            old_password,
            new_password,
            confirm_password
        });

        return res;
    } catch (error: any) {
        return {
            success: false,
            message: parseError(error.response.data),
        }
    }
}

export async function deleteAccount(): Promise<any> {
    const res = await api.post("/api/v1/user/delete_account", {
    });

    return res;
}

export async function restorePassword(number: string): Promise<any> {
    
}

export async function becomeMaster(payload: {
    is_organization: boolean;
    name_organization?: string;
    phone_code: string;
    phone_country_code: string;
    phone_number: string;
}): Promise<any> {
    const res = await api.post(`/api/v1/user/become_master`, payload);
    return res.data;
}