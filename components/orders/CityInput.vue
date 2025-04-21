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
            <h3>Select city</h3>
            <BaseInput type="search" v-model="search" placeholder="Search" style="margin-bottom: -10px;" @input="searchCities" />
            <div class="dropdown__items" v-memo="[search]">
                <div class="dropdown__item" v-for="(item, i) in uniqueCities" :key="i" @click="selectCity(item)">
                    <span>{{ item.formatted_address }}</span>
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
    value?: string | City;
    error?: string;
}>();

const emit = defineEmits(['update:city', 'blur', 'focus']);

const opened = ref(false);
const selectRef = ref(null);
const search = ref('');
const cities = ref<FindAddressModel[]>([]);
const loading = ref(false);

const displayValue = computed(() => {
    if (!props.value) return props.placeholder || 'Select';
    if (typeof props.value === 'string') return props.value;
    return props.value.name && props.value.country?.name 
        ? `${props.value.name}${props.value.country.name ? `, ${props.value.country.name}` : ''}`
        : props.placeholder || 'Select';
});

const uniqueCities = computed(() => {
    const uniqueMap = new Map();
    cities.value.forEach(item => {
        if (!item?.address_dict) return;
        const key = `${item.address_dict.country}-${item.address_dict.city}`;
        if (!uniqueMap.has(key)) {
            uniqueMap.set(key, item);
        }
    });
    return Array.from(uniqueMap.values());
});

async function searchCities() {
    if (!search.value || search.value.length < 2) {
        cities.value = [];
        return;
    }
    
    loading.value = true;
    try {
        const results = await findCity(search.value);
        if (results && Array.isArray(results)) {
            cities.value = results.filter(item => {
                if (!item?.address_dict) return false;
                const searchLower = search.value.toLowerCase().trim();
                const cityName = item.address_dict.city?.toLowerCase().trim() || '';
                const countryName = item.address_dict.country?.toLowerCase().trim() || '';
                const formattedAddress = item.formatted_address?.toLowerCase().trim() || '';
                
                return cityName.includes(searchLower) ||
                       countryName.includes(searchLower) ||
                       formattedAddress.includes(searchLower);
            });
        } else {
            cities.value = [];
        }
    } catch (error) {
        console.error('Error searching cities:', error);
        cities.value = [];
    } finally {
        loading.value = false;
    }
}

function selectCity(city: FindAddressModel) {
    if (!city?.address_dict) return;
    
    const selectedCity: City = {
        id: '',
        name: city.address_dict.city || '',
        country: {
            id: '',
            name: city.address_dict.country || ''
        }
    };
    
    emit('update:city', selectedCity);
    search.value = '';
    opened.value = false;
}

const debouncedSearch = debounce(searchCities, 300);

watch(search, () => {
    debouncedSearch();
});

useClickOutside(selectRef, () => opened.value = false);
</script>

<style lang="scss" scoped>
.input {
    width: -webkit-fill-available;
    width: -moz-available;
    display: flex;
    border-radius: 6px;

    @media screen and (max-width: 725px) {
        max-width: 100%;
    }

    @media screen and (max-width: 350px) {
        max-width: 75%;
    }

    &__wrapper {
        width: -webkit-fill-available;
        width: -moz-available;
        position: relative;

        @media screen and (max-width: 725px) {
            max-width: 100%;
        }

        @media screen and (max-width: 350px) {
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        .dropdown {
            position: absolute;
            top: calc(100% - 130px);
            left: -25px;
            z-index: 1000;
            width: calc(100% + 50px);
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

            .dropdown__item {
                border-bottom: 1.5px solid rgba(244, 244, 244, 1);
                padding: 10px;
                display: flex;
                flex-direction: row;
                gap: 10px;
                cursor: pointer;
                user-select: none;

                .flag {
                    width: 20px;
                }
            }
        }
    }

    img {
        cursor: pointer;

        @media screen and (max-width: 350px) {
            display: none;
        }
    }

    input {
        border: none;
        outline: none;
        font-size: 16px;
        width: -webkit-fill-available;
        width: -moz-available;

        &::placeholder {
            color: rgba(156, 156, 156, 1);
        }

        @media screen and (max-width: 350px) {
            max-width: 50%;
        }
    }
}

.number {
    justify-content: space-between;
    align-items: center;
    gap: 8px;
    padding: 10px 14px;
    background: white;
    border: 1px solid rgba(156, 156, 156, 1);
    box-shadow: 0px 1px 2px 0px rgba(16, 24, 40, 0.05);
    height: 42px;

    @media screen and (max-width: 380px) {
        gap: 0px;
    }

    .flag {
        display: flex;
        align-items: center;
        gap: 8px;
        user-select: none;
        cursor: pointer;

        div {
            width: 20px;
            height: min-content;

            svg {
                width: 20px;
                height: min-content;
                border: 0.5px solid rgba(168, 183, 212, 1);
                box-shadow: 0px 8px 12px 0px rgba(66, 71, 76, 0.08);
                box-shadow: 0px 0px 1px 0px rgba(66, 71, 76, 0.32);
            }

        }

        span {
            font-size: 16px;
            margin-bottom: 2px;
        }
    }

    &:focus-within {
        border: 1px solid rgba(255, 199, 0, 1);
    }
}

.hint {
    font-size: 14px;
    line-height: 19.6px;
    color: rgba(156, 156, 156, 1);
}

.error {
    font-size: 14px;
    line-height: 19.6px;
    color: red;
}
</style>
