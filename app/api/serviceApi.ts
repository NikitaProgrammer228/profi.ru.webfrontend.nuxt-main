import { api } from ".";

// /services:
// get:
//   operationId: services_list
export async function getServices() {
    const res = await api.get("/api/v1/services");

    return res.data;
}

// /services/{id}:
// get:
//   operationId: services_read
export async function getServiceById(id: string) {
    const res = await api.get(`/api/v1/services/${id}`);

    return res.data;
}
