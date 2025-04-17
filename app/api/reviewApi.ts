import { api } from ".";

// /review:
// get:
//   operationId: services_list
export async function getReview() {
    const res = await api.get("/api/v1/review");

    return res.data;
}

export async function postReview(data: any) {
    const res = await api.post("/api/v1/review", data, { headers: { "Content-Type": "multipart/form-data" } });

    return res.data;
}

// /review/{id}:
// get:
//   operationId: services_read
export async function getReviewById(id: string) {
    const res = await api.get(`/api/v1/review/${id}`);

    return res.data;
}
