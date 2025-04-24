import { api } from ".";
import type { CityData } from "./types";
import { useUserStore } from "~/stores/userStore";

// Models matching mobile app implementation
export interface FindAddressDictModel {
    country: string;
    city: string;
    street: string;
    house_number: string;
}

export interface FindAddressModel {
    id?: number;
    country_id?: number;
    address_dict: FindAddressDictModel;
    formatted_address: string;
    apartment_number: string;
    postal_code: string;
}

// API Models based on Swagger definitions
export interface Country {
    id: number;
    name: string;
}

export interface City {
    id: number;
    name: string;
    country: Country;
}

export interface Address {
    id: number;
    street: string;
    house_number: string;
    apartment_number: string;
    postal_code: string;
    city: {
        id: number;
        name: string;
        country: {
            id: number;
            name: string;
        };
        __typename?: string;
    };
    __typename?: string;
}

export interface Currency {
    id: number;
    fullname: string;
    code: string;
    symbol: string;
}

interface PaginatedResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
}

// API timeout configuration
const TIMEOUT = 30000; // 30 seconds

// Find city by query - matches mobile implementation
export async function findCity(query: string): Promise<FindAddressModel[]> {
    try {
        const res = await api.get(`/api/v1/location/find_city`, {
            params: { 
                query,
                limit: 100,
                type: 'city' // Указываем, что ищем только города
            },
            timeout: TIMEOUT
        });
        return res.data;
    } catch (error) {
        console.error('Error in findCity:', error);
        return [];
    }
}

// Get city by name and country
export async function getOrCreateCity(cityName: string, countryName: string): Promise<City | null> {
    try {
        // Search for existing city
        const cityRes = await api.get(`/api/v1/city`, { 
            params: {
                name: cityName,
                limit: 100
            },
            timeout: TIMEOUT
        });
        
        const cityData = cityRes.data as PaginatedResponse<City>;
        
        // Return exact match if found
        const exactMatch = cityData.results?.find(city => 
            city.name.toLowerCase() === cityName.toLowerCase() && 
            city.country.name.toLowerCase() === countryName.toLowerCase()
        );
        
        return exactMatch || null;
    } catch (error: any) {
        if (error.code === 'ECONNABORTED') {
            console.error('Timeout error in getOrCreateCity:', error);
        } else {
            console.error('Error in getOrCreateCity:', error);
        }
        return null;
    }
}

// Create address with city reference
export async function createAddress(data: {
    city_id: number;
    city_name: string;
    street?: string;
    house_number?: string;
    apartment_number?: string;
    postal_code?: string;
    country?: string;
}): Promise<Address | null> {
    try {
        const res = await api.post('/api/v1/client/add_address', {
            address_dict: {
                city: data.city_name,
                country: data.country || '',
                street: data.street || '',
                house_number: data.house_number || ''
            },
            apartment_number: data.apartment_number || '',
            postal_code: data.postal_code || ''
        }, {
            timeout: TIMEOUT
        });
        return res.data;
    } catch (error) {
        console.error('Error creating address:', error);
        return null;
    }
}

// Get user addresses
export async function getUserAddresses(): Promise<Address[]> {
    try {
        console.log('Fetching addresses...');
        const res = await api.get('/api/v1/client/list_addresses');
        console.log('Raw API response:', res);
        // Проверяем, есть ли данные и являются ли они массивом
        const addresses = Array.isArray(res.data) ? res.data : [];
        console.log('Processed addresses:', addresses);
        return addresses;
    } catch (error) {
        console.error('Error getting user addresses:', error);
        return [];
    }
}

// Delete user address
export async function deleteAddress(addressId: number): Promise<boolean> {
    try {
        console.log('Deleting address with API:', addressId);
        const userStore = useUserStore();
        const userId = userStore.profile.id;
        
        const response = await api.delete(`/api/v1/client/${userId}/delete_address`, {
            params: { address_id: addressId }
        });
        
        console.log('Address deleted successfully with status:', response.status);
        // 204 статус означает успешное удаление без контента в ответе
        return response.status === 204;
    } catch (error) {
        console.error('Error deleting address:', error);
        return false;
    }
}

// Update user address
export async function updateAddress(addressId: number, data: {
    city_id: number;
    city_name: string;
    street?: string;
    house_number?: string;
    apartment_number?: string;
    postal_code?: string;
    country?: string;
}): Promise<Address | null> {
    try {
        console.log('Updating address with data:', { addressId, ...data });
        
        const userStore = useUserStore();
        const userId = userStore.profile.id;
        
        const res = await api.patch(`/api/v1/client/${userId}/update_address`, {
            address_dict: {
                city: data.city_name,
                country: data.country || '',
                street: data.street || '',
                house_number: data.house_number || ''
            },
            apartment_number: data.apartment_number || '',
            postal_code: data.postal_code || ''
        }, {
            params: { address_id: addressId }  // Передаем address_id как query параметр
        });
        
        console.log('Update address response:', res.data);
        return res.data;
    } catch (error) {
        console.error('Error updating address:', error);
        return null;
    }
}

// Get list of available currencies
export async function getCurrencies(): Promise<Currency[]> {
    const res = await api.get('/api/v1/currency');
    return res.data.results;
}

// Find address by query - matches mobile implementation
export async function findAddress(query: string): Promise<FindAddressModel[]> {
    try {
        const res = await api.get(`/api/v1/location/find_address`, {
            params: { 
                query,
                limit: 100
            },
            timeout: TIMEOUT
        });
        return res.data;
    } catch (error) {
        console.error('Error in findAddress:', error);
        return [];
    }
} 