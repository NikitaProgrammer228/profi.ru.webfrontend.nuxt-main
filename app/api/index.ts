import axios from "axios";

let api = axios.create({
    baseURL: `http://45.147.177.69`,
});

api.defaults.timeout = 10000;
api.interceptors.request.use((config) => {
    // config.headers['Content-Type'] = 'application/json';
    config.headers['Accept'] = '*/*';
    config.headers['Access-Control-Allow-Origin'] = '*';
    // config.headers['Connection'] = 'keep-alive';

    return config;
}
)
api.interceptors.response.use(
    (response) => {
        if (response.status >= 200 && response.status < 300) {
            return response;
        } else { // пока не продумывал
            return response;
        }
    },
    async (error) => {
        const config = error?.config;
        const res = error.response;

        if (res?.status == 401) {
            if (!config.sent) {
                config.sent = true;
                return api(config);
            }
        }
        return Promise.reject(error);
    }
)

export function setToken(_token?: string) {
    const token = localStorage.getItem("profiru-accessToken") || "";
    if (token.length) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    if (_token?.length) {
        api.defaults.headers.common['Authorization'] = `Bearer ${_token}`;
    }
}

export { api };