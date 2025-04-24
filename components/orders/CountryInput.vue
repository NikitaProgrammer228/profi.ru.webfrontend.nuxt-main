<template>
    <div class="input__wrapper" ref="selectRef">
        <div class="number input" @click="opened = !opened">
            <div
                style="display: flex; align-items: center; gap: 8px; width: -webkit-fill-available; width: -moz-available;">
                {{ displayValue }}
            </div>
            <img loading="lazy" src="~/assets/icons/help.svg" alt="help" />
        </div>
        <div class="dropdown" v-if="opened">
            <h3>Select location</h3>
            <BaseInput type="search" v-model="search" placeholder="Search city or country" style="margin-bottom: -10px;" @input="searchLocations" />
            <div class="dropdown__items" v-memo="[search]">
                <template v-if="uniqueCountries.length > 0">
                    <div class="dropdown__section">Countries</div>
                    <div class="dropdown__item" v-for="(item, i) in uniqueCountries" :key="'country-'+i" @click="selectCountry(item)">
                        <span>{{ item.address_dict.country }}</span>
                    </div>
                </template>
                <template v-if="uniqueCities.length > 0">
                    <div class="dropdown__section">Cities</div>
                    <div class="dropdown__item" v-for="(item, i) in uniqueCities" :key="'city-'+i" @click="selectCity(item)">
                        <span>{{ item.address_dict.city }}, {{ item.address_dict.country }}</span>
                    </div>
                </template>
                <div v-if="uniqueCountries.length === 0 && uniqueCities.length === 0" class="dropdown__empty">
                    No results found
                </div>
            </div>
        </div>
        <span class="hint">{{ hint }}</span>
        <span class="error" v-if="error">{{ error }}</span>
    </div>
</template>

<script setup lang="ts">
import BaseInput from '../UI/BaseInput.vue';
import { findCity, type FindAddressModel } from '~/app/api/locationApi';
import type { City } from '~/stores/userStore';

// Custom debounce function
function debounce<T extends (...args: any[]) => any>(fn: T, delay: number) {
    let timeoutId: number;
    return function (this: any, ...args: Parameters<T>) {
        clearTimeout(timeoutId);
        timeoutId = window.setTimeout(() => fn.apply(this, args), delay);
    };
}

const props = defineProps<{
    placeholder?: string;
    type?: string;
    hint?: string;
    country?: { id: number; name: string; } | null;
    error?: string;
}>();

const emit = defineEmits(['update:country', 'country-selected', 'blur', 'focus', 'update:error']);

const opened = ref(false);
const selectRef = ref(null);
const search = ref('');
const searchResults = ref<FindAddressModel[]>([]);
const loading = ref(false);

const displayValue = computed(() => {
    if (!props.country) return props.placeholder || 'Select location';
    return props.country.name;
});

const uniqueCountries = computed(() => {
    const uniqueMap = new Map();
    searchResults.value.forEach(item => {
        if (!item?.address_dict?.country) return;
        const key = item.address_dict.country.toLowerCase();
        if (!uniqueMap.has(key)) {
            uniqueMap.set(key, item);
        }
    });
    return Array.from(uniqueMap.values());
});

const uniqueCities = computed(() => {
    const uniqueMap = new Map();
    searchResults.value.forEach(item => {
        if (!item?.address_dict?.city || !item?.address_dict?.country) return;
        
        const cityName = item.address_dict.city.toLowerCase().trim();
        // Исключаем области/регионы
        if (cityName.includes('область') || 
            cityName.includes('район') || 
            cityName.includes('край') ||
            cityName.includes('округ')) {
            return;
        }
        
        const key = `${cityName}-${item.address_dict.country.toLowerCase()}`;
        if (!uniqueMap.has(key)) {
            uniqueMap.set(key, item);
        }
    });
    return Array.from(uniqueMap.values());
});

async function searchLocations() {
    if (!search.value || search.value.length < 1) {
        searchResults.value = [];
        return;
    }
    
    loading.value = true;
    try {
        const results = await findCity(search.value);
        if (results && Array.isArray(results)) {
            searchResults.value = results.filter(item => {
                if (!item?.address_dict) return false;
                
                const cityName = (item.address_dict.city || '').toLowerCase().trim();
                const countryName = (item.address_dict.country || '').toLowerCase().trim();
                const searchTerms = search.value.toLowerCase().trim().split(/\s+/);
                
                return searchTerms.every(term => 
                    cityName.includes(term) || countryName.includes(term)
                );
            });

            // Сортируем результаты
            searchResults.value.sort((a, b) => {
                const searchLower = search.value.toLowerCase().trim();
                const countryA = a.address_dict.country.toLowerCase().trim();
                const countryB = b.address_dict.country.toLowerCase().trim();
                const cityA = (a.address_dict.city || '').toLowerCase().trim();
                const cityB = (b.address_dict.city || '').toLowerCase().trim();
                
                // Приоритет точных совпадений
                if (countryA === searchLower && countryB !== searchLower) return -1;
                if (countryB === searchLower && countryA !== searchLower) return 1;
                if (cityA === searchLower && cityB !== searchLower) return -1;
                if (cityB === searchLower && cityA !== searchLower) return 1;
                
                return countryA.localeCompare(countryB) || cityA.localeCompare(cityB);
            });
        } else {
            searchResults.value = [];
        }
    } catch (error) {
        console.error('Error searching locations:', error);
        searchResults.value = [];
    } finally {
        loading.value = false;
    }
}

function selectCountry(country: FindAddressModel) {
    if (!country?.address_dict?.country) return;
    
    const selectedCountry = {
        id: country.country_id || 0,
        name: country.address_dict.country
    };
    
    emit('update:country', selectedCountry);
    emit('country-selected', selectedCountry);
    search.value = '';
    opened.value = false;
}

function selectCity(city: FindAddressModel) {
    if (!city?.address_dict?.city || !city?.address_dict?.country) return;
    
    const selectedCountry = {
        id: city.country_id || 0,
        name: city.address_dict.country
    };
    
    emit('update:country', selectedCountry);
    emit('country-selected', selectedCountry);
    search.value = '';
    opened.value = false;
}

const debouncedSearch = debounce(searchLocations, 300);

watch(search, () => {
    debouncedSearch();
});

useClickOutside(selectRef, () => opened.value = false);
</script>

<style lang="scss" scoped>
.input {
    width: 100%;
    display: flex;
    border-radius: 6px;

    &__wrapper {
        width: 100%;
        position: relative;

        .dropdown {
            position: absolute;
            top: calc(100% + 4px);
            left: 0;
            z-index: 1000;
            width: 100%;
            background: white;
            border-radius: 16px;
            padding: 24px;
            border: 1px solid rgba(244, 244, 244, 1);
            box-shadow: 0px 2px 20px 2px rgba(43, 33, 0, 0.08);
            box-shadow: 4px 4px 8px 4px rgba(43, 33, 0, 0.04);
            box-shadow: -4px 0px 8px 2px rgba(43, 33, 0, 0.04);

            display: flex;
            flex-direction: column;
            gap: 20px;
            max-height: 500px;

            .dropdown__items {
                overflow-y: auto;

                &::-webkit-scrollbar {
                    display: none;
                }
            }

            .dropdown__section {
                font-weight: 500;
                color: #9C9C9C;
                padding: 8px 10px;
                font-size: 14px;
            }

            .dropdown__item {
                border-bottom: 1.5px solid rgba(244, 244, 244, 1);
                padding: 10px;
                display: flex;
                flex-direction: row;
                gap: 10px;
                cursor: pointer;
                user-select: none;

                &:hover {
                    background-color: rgba(244, 244, 244, 0.5);
                }
            }

            .dropdown__empty {
                text-align: center;
                color: #9C9C9C;
                padding: 10px;
            }
        }
    }

    img {
        cursor: pointer;
        margin-left: 8px;
    }
}

.number {
    justify-content: space-between;
    align-items: center;
    gap: 8px;
    padding: 14px;
    background: white;
    border: 1px solid #9C9C9C;
    border-radius: 6px;
    font-size: 16px;
    line-height: 1.5;
    color: #000;
    height: 48px;
    transition: all 0.2s ease-in-out;

    &:hover {
        border-color: #000;
    }
}

.hint {
    font-size: 14px;
    line-height: 19.6px;
    color: rgba(156, 156, 156, 1);
    margin-top: 4px;
    display: block;
}

.error {
    font-size: 14px;
    line-height: 19.6px;
    color: red;
    margin-top: 4px;
    display: block;
}
</style> 