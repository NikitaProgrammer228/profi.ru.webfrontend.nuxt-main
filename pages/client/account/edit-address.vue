<template>
    <BackButton style="font-size: 18px; padding: 12px 0px;" @click="$router.go(-1)">Profile settings</BackButton>
    <BaseBlock>
        <h2>Edit address</h2>
        <BaseInput type="text" placeholder="House number" v-model="address.houseNumber" />
        <BaseInput type="text" placeholder="Street name" v-model="address.street" />
        <BaseInput type="text" placeholder="Apartment number" v-model="address.apartment" />
        <CityInput 
            v-model:city="selectedCity" 
            placeholder="Name of the city (and state – for the USA)" 
            @update:city="onCitySelect"
        />
        <CountryInput 
            v-model:country="selectedCountry" 
            placeholder="Country name"
            @country-selected="onCountrySelect"
        />
        <BaseInput type="text" placeholder="Postal code" v-model="address.postalCode" />
        <div v-if="error" class="error-message">{{ error }}</div>
        <BaseButton :disabled="!valid || loading" @click="saveAddress">
            {{ loading ? 'Saving...' : 'Save' }}
        </BaseButton>
    </BaseBlock>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import BackButton from '~/components/UI/BackButton.vue';
import BaseBlock from '~/components/UI/BaseBlock.vue';
import BaseButton from '~/components/UI/BaseButton.vue';
import BaseInput from '~/components/UI/BaseInput.vue';
import CityInput from '~/components/orders/CityInput.vue';
import CountryInput from '~/components/orders/CountryInput.vue';
import { updateAddress, getUserAddresses, findCity } from '~/app/api/locationApi';
import type { City } from '~/stores/userStore';
import type { Address } from '~/app/api/locationApi';

definePageMeta({
    middleware: ['auth']
});

const route = useRoute();
const router = useRouter();

interface AddressForm {
    houseNumber: string;
    street: string;
    apartment: string;
    postalCode: string;
}

const address = reactive<AddressForm>({
    houseNumber: '',
    street: '',
    apartment: '',
    postalCode: ''
});

const selectedCity = ref<City | null>(null);
const selectedCountry = ref<{ id: number; name: string; } | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);

// When city is selected, update country
function onCitySelect(city: City) {
    if (city && city.country) {
        selectedCountry.value = {
            id: city.country.id,
            name: city.country.name
        };
    }
}

// When country is selected, find first city in that country
async function onCountrySelect(country: { id: number; name: string; }) {
    if (!country) return;
    
    try {
        // Ищем города в выбранной стране
        const results = await findCity(country.name);
        if (results && Array.isArray(results)) {
            // Фильтруем города в выбранной стране и исключаем области/регионы
            const citiesInCountry = results.filter(item => {
                if (!item?.address_dict?.city || !item?.address_dict?.country) return false;
                
                const cityName = item.address_dict.city.toLowerCase().trim();
                const countryName = item.address_dict.country.toLowerCase().trim();
                
                return countryName === country.name.toLowerCase().trim() &&
                    !cityName.includes('область') && 
                    !cityName.includes('район') && 
                    !cityName.includes('край') &&
                    !cityName.includes('округ');
            });

            // Если нашли города, берем первый
            if (citiesInCountry.length > 0) {
                const firstCity = citiesInCountry[0];
                selectedCity.value = {
                    id: firstCity.id || 0,
                    name: firstCity.address_dict.city,
                    country: {
                        id: country.id,
                        name: country.name
                    }
                };
            } else {
                // Если городов не нашли, очищаем выбор города
                selectedCity.value = null;
            }
        }
    } catch (error) {
        console.error('Error finding city in country:', error);
        selectedCity.value = null;
    }
}

const valid = computed(() => {
    return address.houseNumber.length > 0 && selectedCity.value !== null && selectedCity.value.id !== 0;
});

async function loadAddress() {
    try {
        loading.value = true;
        error.value = null;
        
        const addresses = await getUserAddresses();
        const currentAddress = addresses.find(addr => addr.id.toString() === route.query.id);
        
        if (!currentAddress) {
            error.value = 'Address not found';
            return;
        }

        // Заполняем форму данными текущего адреса
        address.houseNumber = currentAddress.house_number;
        address.street = currentAddress.street;
        address.apartment = currentAddress.apartment_number;
        address.postalCode = currentAddress.postal_code;
        
        // Устанавливаем город и страну
        selectedCity.value = {
            id: currentAddress.city.id,
            name: currentAddress.city.name,
            country: {
                id: currentAddress.city.country.id,
                name: currentAddress.city.country.name
            }
        };
        
        selectedCountry.value = {
            id: currentAddress.city.country.id,
            name: currentAddress.city.country.name
        };
        
    } catch (err) {
        console.error('Error loading address:', err);
        error.value = 'Failed to load address. Please try again later.';
    } finally {
        loading.value = false;
    }
}

async function saveAddress() {
    if (!selectedCity.value || !selectedCountry.value) {
        console.error('Invalid city or country selected');
        return;
    }
    
    try {
        loading.value = true;
        error.value = null;
        
        const result = await updateAddress(Number(route.query.id), {
            city_id: selectedCity.value.id,
            city_name: selectedCity.value.name,
            street: address.street,
            house_number: address.houseNumber,
            apartment_number: address.apartment,
            postal_code: address.postalCode,
            country: selectedCountry.value.name
        });
        
        if (result) {
            router.go(-1);
        } else {
            error.value = 'Failed to update address';
        }
    } catch (err) {
        console.error('Error saving address:', err);
        error.value = 'Failed to save address. Please try again.';
    } finally {
        loading.value = false;
    }
}

onMounted(() => {
    if (!route.query.id) {
        router.push('/client/account');
        return;
    }
    loadAddress();
});
</script>

<style scoped>
h2 {
    font-size: 36px;
    font-weight: 500;
    line-height: 36px;
    text-align: center;
    margin-bottom: 24px;
}

.error-message {
    color: #ff4444;
    text-align: center;
    margin-top: 8px;
}

@media screen and (max-width: 725px) {
    h2 {
        font-size: 28px;
    }
}
</style> 