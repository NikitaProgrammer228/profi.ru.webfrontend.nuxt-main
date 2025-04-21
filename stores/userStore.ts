import { setToken } from "~/app/api";
import { getClient } from "~/app/api/clientApi";
import { navigateTo } from "#app";

export interface City {
    id: string;
    name: string;
    country: {
        id: string;
        name: string;
    }
}

interface Profile {
    id: string;
    city: City;
    first_name: string;
    last_name: string;
    is_social_account: boolean;
    is_required_field_fill: boolean;
    avatar: string;
    email: string;
    phone_number: string;
    created: string;
    modified: string;
}

interface User {
    id: string;
    city: string | City;
    first_name: string;
    last_name: string;
    is_social_account: boolean;
    is_required_field_fill: boolean;
    avatar: string;
    email: string;
    phone_number: string;
    created: string;
    modified: string;
}

export const useUserStore = defineStore("user", () => {
    const isAuth = ref(false);
    const idToken = ref("");
    const accessToken = ref("");
    const refreshToken = ref("");
    const photoURL = ref("");
    const loading = ref(false);
    const user = ref<User>({
        id: "",
        city: "",
        first_name: "",
        last_name: "",
        is_social_account: false,
        is_required_field_fill: false,
        avatar: "",
        email: "",
        phone_number: "",
        created: "",
        modified: "",
    });
    const profile = ref<Profile>({
        id: "",
        city: {
            id: "",
            name: "",
            country: {
                id: "",
                name: ""
            }
        },
        first_name: "",
        last_name: "",
        is_social_account: false,
        is_required_field_fill: false,
        avatar: "",
        email: "",
        phone_number: "",
        created: "",
        modified: "",
    });

    async function checkAuth() {
        const tokenLS = localStorage.getItem("profiru-token-firebase");
        const userLS = localStorage.getItem("profiru-user");
        const refreshTokenLS = localStorage.getItem("profiru-refreshToken");
        const accessTokenLS = localStorage.getItem("profiru-accessToken");
        const photoURLLS = localStorage.getItem("profiru-avatar");

        if (accessTokenLS && refreshTokenLS) {
            setToken(accessTokenLS);
        }

        if (accessTokenLS && userLS) {
            try {
                loading.value = true;
                const client = await getClient();
                
                // Update user with basic data
                user.value = {
                    id: client.id || "",
                    city: client.city || "",
                    first_name: client.first_name || "",
                    last_name: client.last_name || "",
                    is_social_account: client.is_social_account || false,
                    is_required_field_fill: client.is_required_field_fill || false,
                    avatar: client.avatar || "",
                    email: client.email || "",
                    phone_number: client.phone_number || "",
                    created: client.created || "",
                    modified: client.modified || ""
                };

                // Update profile with full data including city object
                profile.value = {
                    id: client.id || "",
                    city: typeof client.city === 'string' ? {
                        id: "",
                        name: client.city,
                        country: {
                            id: "",
                            name: ""
                        }
                    } : (client.city as City) || {
                        id: "",
                        name: "",
                        country: {
                            id: "",
                            name: ""
                        }
                    },
                    first_name: client.first_name || "",
                    last_name: client.last_name || "",
                    is_social_account: client.is_social_account || false,
                    is_required_field_fill: client.is_required_field_fill || false,
                    avatar: client.avatar || "",
                    email: client.email || "",
                    phone_number: client.phone_number || "",
                    created: client.created || "",
                    modified: client.modified || ""
                };

                isAuth.value = true;
                if (accessTokenLS) {
                    accessToken.value = accessTokenLS;
                }
                if (refreshTokenLS) {
                    refreshToken.value = refreshTokenLS;
                }
                
                if (tokenLS) {
                    idToken.value = tokenLS;
                }
                photoURL.value = (photoURLLS ?? '') as string;
            } catch (error) {
                console.error('Error fetching client data:', error);
                completeLogout();
            } finally {
                loading.value = false;
            }
        }
    }

    function completeLogout() {
        localStorage.removeItem("profiru-token-firebase");
        localStorage.removeItem("profiru-user");
        localStorage.removeItem("profiru-refreshToken");
        localStorage.removeItem("profiru-accessToken");
        localStorage.removeItem("profiru-avatar");

        isAuth.value = false;
        idToken.value = "";
        accessToken.value = "";
        refreshToken.value = "";
        photoURL.value = "";
        
        user.value = {
            id: "",
            city: "",
            first_name: "",
            last_name: "",
            is_social_account: false,
            is_required_field_fill: false,
            avatar: "",
            email: "",
            phone_number: "",
            created: "",
            modified: "",
        };

        profile.value = {
            id: "",
            city: {
                id: "",
                name: "",
                country: {
                    id: "",
                    name: ""
                }
            },
            first_name: "",
            last_name: "",
            is_social_account: false,
            is_required_field_fill: false,
            avatar: "",
            email: "",
            phone_number: "",
            created: "",
            modified: "",
        };

        navigateTo('/client/auth');
    }

    return {
        isAuth,
        idToken,
        user,
        profile,
        photoURL,
        accessToken,
        refreshToken,
        loading,

        checkAuth,
        completeLogout,
    };
})