import { api } from ".";
import type { Master } from "./categoryApi";

export type TypePrice = "in_a_hour" | "per_price" | "for_the_service";

export type Status = "search_for_performers" | "in_progress" | "completed" | "cancelled" | "archived" | "deleted" | "pending";

export interface Reason {
    id: string;
    reason: string;
}

export interface Order {
    id: string;
    title: string;
    description: string;
    price: number | string;
    type_price: TypePrice;
    at_home_client: boolean;
    remotely: boolean;
    address: {
        id?: number;
        city?: { id: number; name: string; country: { id: number; name: string } };
        country?: string;
        street?: string;
        house_number?: string;
        apartment_number?: string;
        postal_code?: string;
    };
    city?: { id: number; name: string; country: { id: number; name: string } };
    subcategory: {
        id: string;
        name: string;
        category: { id: string; name: string };
    };
    client: { id: string };
    master?: {
        avatar: { image: string | null };
        first_name: string;
        last_name: string;
    };
    currency: { id: number; fullname: string; code: string; symbol: string };
    for_all: boolean;
    created: string;
    modified: string;
    archived: boolean;
    images: string[];
    deadline: string | null;
    responses_count: number;
    status: string;
    reason_cancel: any;
    has_chat?: boolean;
}

export interface OrderResponse {
    id: string;
    master: Master;
    order: string;
    message: string;
    created: string;
    photos: Array<string>;
    price_offer: string;
    type_price: string;
}

// /orders:
// get:
//   operationId: orders_list
export async function getOrders(): Promise<Order[]> {
    const res = await api.get("/api/v1/orders");

    return res.data;
}

// post:
//   operationId: orders_create
export async function postOrder(formData: FormData): Promise<string> {
    const res = await api.request({
        url: "/api/v1/orders",
        method: 'POST',
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        // Prevent axios from serializing FormData to JSON
        transformRequest: [(data) => data]
    });
    return res.data;
}

/**
 * Update an existing order via multipart/form-data.
 * @param id The ID of the order to update.
 * @param formData FormData with fields and files to update.
 * @returns The updated Order object.
 */
export async function updateOrder(id: string, formData: FormData): Promise<Order> {
    const res = await api.request<Order>({
        url: `/api/v1/orders/${id}`,
        method: 'PATCH',
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
        transformRequest: [(data) => data]
    });
    return res.data;
}

// /orders/{id}:
// get:
//   operationId: orders_read
export async function getOrder(id: string): Promise<Order> {
    const res = await api.get(`/api/v1/orders/${id}`);

    return res.data;
}

// /orders/{id}/complete:
// post:
//   operationId: orders_complete
export async function completeOrder(id: string): Promise<Order> {
    const res = await api.get(`/api/v1/orders/${id}/complete`);

    return res.data;
}

// /orders/{id}/cancel:
// post:
//   operationId: orders_cancel
export async function cancelOrder(id: string, data: any): Promise<Order> {
    const res = await api.post(`/api/v1/orders/${id}/cancel`, data);

    return res.data;
}

// /orders/my_orders:
// get:
//   operationId: orders_my_orders
export async function getMyOrders(): Promise<Order[]> {
    const res = await api.get("/api/v1/orders/my_orders");

    return res.data;
}

// /orders/my_archive_orders:
// get:
//   operationId: orders_my_archive_orders
export async function getArchiveOrders(): Promise<Order[]> {
    const res = await api.get(`/api/v1/orders/my_archive_orders`);

    return res.data;
}

// /orders/{id}/choose_master:
// patch:
//   operationId: orders_choose_master
export async function orderChooseMaster(id: string, data: any): Promise<Order> {
    const res = await api.patch(`/api/v1/orders/${id}/choose_master`, data);

    return res.data;
}

// /orders/{id}/delete_response:
// delete:
//   operationId: orders_delete_response
export async function orderDeleteResponse(id: string): Promise<Order> {
    const res = await api.delete(`/api/v1/orders/${id}/delete_response`);

    return res.data;
}

// /orders/{id}/edit_response:
// patch:
//   operationId: orders_edit_response
export async function orderEditResponse(id: string): Promise<Order[]> {
    const res = await api.patch(`/api/v1/orders/${id}/edit_response`);

    return res.data;
}

// /orders/{id}/order_responses:
// get:
//   operationId: orders_order_responses
export async function orderGetResponses(id: string): Promise<OrderResponse[]> {
    const res = await api.get(`/api/v1/orders/${id}/order_responses`);

    return res.data;
}

// /orders/{id}/recommended_masters:
// get:
//   operationId: orders_recommended_masters
export async function orderGetRecommendedMasters(id: string): Promise<Master[]> {
    const res = await api.get(`/api/v1/orders/${id}/recommended_masters`);

    return res.data;
}

// /orders/{id}/response_master:
// post:
//   operationId: orders_response_master
export async function orderResponseMaster(id: string, data: any): Promise<Order[]> {
    const res = await api.post(`/api/v1/orders/${id}/response_master`, data);

    return res.data;
}

// /reason-cancel:
// get:
//   operationId: reason-cancel_list
export async function orderGetReasonCancel(): Promise<Reason[]> {
    const res = await api.get(`/api/v1/reason-cancel`);

    return res.data.results;
}

export async function orderRejectResponse(id: string, orderId: string): Promise<Order[]> {
    const res = await api.delete(`/api/v1/orders/${orderId}/reject_response?response_id=${id}`);

    return res.data;
} 