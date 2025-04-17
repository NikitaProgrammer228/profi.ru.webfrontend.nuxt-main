import { api } from ".";

export interface Category {
    id: string;
    name: string;
}

export interface Service {
    custom_description: string;
    id: string;
    master: string;
    photos: Array<any>;
    price: string;
    service: string;
    type_price: string;
}

export interface Specialization {
    description: string;
    experience: string;
    id: string;
    subcategory: string;
    work_days: Array<string>;
    work_end: string;
    work_start: string;
    service_details: Array<Service>;
}

export interface Master {
    id: string;
    user: number;
    name_organization: string | null;
    description: string;
    address: string | null;
    is_verify: boolean;
    is_publish: boolean;
    average_rating_value: number | null;
    reviews_count: number;
    reviews: Array<any>;
    specializations: Array<Specialization>;
    special_offers: Array<any>;
    created: string;
    modified: string;
    date_of_birth: string;

    first_name: string;
    last_name: string;
    avatar: {
        id: string;
        image: string;
    } | null;
    email: string;
}

export interface MasterResponse {
    count: number;
    next: string;
    previous: string;
    results: Array<Master>;
}

// /categories:
// get:
//   operationId: categories_list
export async function getCategories(): Promise<Category[]> {
    const res = await api.get("/api/v1/categories");

    return res.data;
}

export async function searchCategories(text: string): Promise<MasterResponse> {
    const res = await api.get(`/api/v1/categories/search?text=${text}`);
    return res.data.results;
}

// /categories/{id}/subcategories:
// get:
//   operationId: categories_subcategories
export async function getSubcategories(id: string): Promise<Category[]> {
    const res = await api.get(`/api/v1/categories/${id}/subcategories`);

    return res.data;
}

// /categories/{id}/subcategories/{subcategory_pk}/masters:
// get:
//   operationId: categories_subcategories_masters

export async function getSubcategory(id: string, subcategoryId: string): Promise<MasterResponse> {
    const res = await api.get(`/api/v1/categories/${id}/subcategories/${subcategoryId}/masters`);
    
    return res.data;
}

export async function getSubcategoryWithQuery(id: string, subcategoryId: string, query: any): Promise<MasterResponse> {
    let q = [];

    for (const key in query) {
        if (query[key]) {
            q.push(key);
        }
    }
    const res = await api.get(`/api/v1/categories/${id}/subcategories/${subcategoryId}/masters?${q.join('=true&')}=true`);
    
    return res.data;
}

export async function getMasterById(id: string): Promise<Master> {
    const res = await api.get(`/api/v1/master/${id}`);

    return res.data;
}

export async function getMasters(): Promise<MasterResponse> {
    const res = await api.get(`/api/v1/master`);

    return res.data;
}

export async function getMastersByQueryString(query: string): Promise<MasterResponse> {
    query = query.split('45.147.177.69:80')[1];
    const res = await api.get(query);

    return res.data;
}
