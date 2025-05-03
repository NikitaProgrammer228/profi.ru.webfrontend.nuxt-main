import { api } from ".";
import type { CompletePayload, CityData } from "./types";

export interface Profile {
    id: string;
    city: CityData;
    first_name: string;
    last_name: string;
    is_social_account?: boolean;
    is_required_field_fill?: boolean;
    avatar?: { id: string; image: string };
    email: string;
    phone_number?: string;
    phone_code?: string;
    phone_country_code?: string;
    created?: string;
    modified?: string;
}

// /client:
// get:
//   operationId: client_list
export async function getClientList(): Promise<Profile[]> {
    const res = await api.get("/api/v1/client");

    return res.data;
}

// /client/me:
// get:
//   operationId: client_me
export async function getClient(): Promise<Profile> {
    const res = await api.get("/api/v1/client/me");

    return res.data;
}

// patch:
//   operationId: client_partial_update
/**
 * Partially update client profile; send fields as multipart/form-data
 */
export async function patchClient(payload: Record<string, any> | CompletePayload, id: string): Promise<Profile> {
    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            formData.append(key, String(value));
        }
    });
    const res = await api.patch(`/api/v1/client/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
}

// /client/{id}:
// get:
//   operationId: client_read
export async function getClientById(id: string): Promise<Profile> {
    const res = await api.get(`/api/v1/client/${id}`);

    return res.data;
}
