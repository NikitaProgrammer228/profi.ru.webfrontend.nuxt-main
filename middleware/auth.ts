import { api } from '~/app/api';
import type { InternalAxiosRequestConfig } from 'axios';

let beenUsed = false;

export default defineNuxtRouteMiddleware(async (to, from) => {
    if (import.meta.server) return;

    const userStore = useUserStore();

    if (!beenUsed) {

        beenUsed = true;
        try {
            await userStore.checkAuth();
        } catch (error) {
            return navigateTo("/client/auth");
        }
    }


    const pathes = [
        "/client/auth",
        "/client/auth/recovery",
        // "/master/auth",
        // "/master/auth/recovery",
        // "/master/auth/login"
    ];
    const needAuthClient = [
        "/client/catalog",
        "/client/account",
        "/client/account/add-address",
        "/client/account/change-password",
        "/client/orders/create",
        "/client/orders/my",
    ];
    const needAuthMaster = [
        "/master/account",
        "/master/account/add-address",
        "/master/account/change-password",
        "/master/orders/catalog",
        "/master/orders/invitations",
        "/master/orders/my",
        "/master/orders/responses",
    ];

    if (pathes.includes(to.path)) {
        if (userStore.isAuth) {
            return abortNavigation();
        }
    }
    if (needAuthClient.includes(to.path)) {
        if (!userStore.isAuth) {
            return navigateTo("/client/auth");
        }
    }
    if (needAuthMaster.includes(to.path)) {
        if (!userStore.isAuth) {
            return navigateTo("/master/auth");
        }
    }
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    config.headers['Content-Type'] = 'application/json';
    config.headers['Accept'] = '*/*';
    config.headers['Access-Control-Allow-Origin'] = '*';
    return config;
})