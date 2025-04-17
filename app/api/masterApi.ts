import type { ProfileMaster } from "~/stores/masterStore";
import { api } from ".";
import type { Master, MasterResponse } from "./categoryApi";

// /master:
// get:
//   operationId: master_list
export async function getMasters(): Promise<MasterResponse> {
    const res = await api.get(`/api/v1/master`);

    return res.data;
}

// /master/{id}:
// get:
//   operationId: master_read
export async function getMasterById(id: string): Promise<Master> {
    const res = await api.get(`/api/v1/master/${id}`);

    return res.data;
}
 
// /master/find_address:
// get:
//   operationId: master_find_address
export async function getAddress(): Promise<any> {
    const res = await api.get(`/api/v1/master/find_address`);

    return res.data;
}

// /master/me:
// get:
//   operationId: master_me
export async function getMasterMe(): Promise<any> {
    const res = await api.get(`/api/v1/master/me`);

    return res.data;
}

export async function patchMaster(id: string, data: any): Promise<ProfileMaster> {
    const res = await api.patch(`/api/v1/master/${id}`, data);

    return res.data;
}

// /master/{id}/education:
// get:
//   operationId: master_education_read
export async function getMasterEducation(id: string) {
    const res = await api.get(`/api/v1/master/${id}/education`);

    return res.data;
}

// /master/{id}/service_detail:
// get:
//   operationId: master_service_detail_read
export async function getMasterServiceDetail(id: string) {
    const res = await api.get(`/api/v1/master/${id}/service_detail`);

    return res.data;
}

// /master/{id}/special_offer:
// get:
//   operationId: master_special_offer_read
export async function getMasterSpecialOffer(id: string) {
    const res = await api.get(`/api/v1/master/${id}/special_offer`);

    return res.data;
}

// /master/{id}/specializations:
// get:
//   operationId: master_specializations_read
export async function getMasterSpecializations(id: string) {
    const res = await api.get(`/api/v1/master/${id}/specializations`);

    return res.data;
}

export async function getMasterAddress(id: string) {
    const res = await api.get(`/api/v1/location/find_address?query=Ростов`);

    return res.data;
}
