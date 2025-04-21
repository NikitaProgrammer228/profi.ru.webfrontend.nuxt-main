import { api } from ".";

export interface FindAddressDictModel {
    country: string;
    city: string;
    street: string;
    house_number: string;
}

export interface FindAddressModel {
    address_dict: FindAddressDictModel;
    formatted_address: string;
    apartment_number: string;
    postal_code: string;
}

export async function findCity(query: string): Promise<FindAddressModel[]> {
    const response = await api.get('/api/v1/location/find_city', {
        params: {
            query
        }
    });
    return response.data;
} 