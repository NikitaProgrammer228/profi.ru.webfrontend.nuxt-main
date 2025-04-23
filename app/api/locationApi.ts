import { api } from ".";

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
    city: City;
    street?: string;
    house_number?: string;
    apartment_number?: string;
    postal_code?: string;
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
            params: { query },
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
    street?: string;
    house_number?: string;
    apartment_number?: string;
    postal_code?: string;
}): Promise<Address | null> {
    try {
        const res = await api.post('/api/v1/address', {
            city: {
                id: data.city_id
            },
            street: data.street,
            house_number: data.house_number,
            apartment_number: data.apartment_number,
            postal_code: data.postal_code
        }, {
            timeout: TIMEOUT
        });
        return res.data;
    } catch (error) {
        console.error('Error creating address:', error);
        return null;
    }
} 