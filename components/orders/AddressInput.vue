<template>
    <div class="input__wrapper" ref="selectRef">
        <div class="number input" @click="opened = !opened">
            <div style="display: flex; align-items: center; gap: 8px; width: -webkit-fill-available; width: -moz-available;">
                {{ displayValue }}
            </div>
            <img loading="lazy" src="~/assets/icons/help.svg" alt="help" />
        </div>
        <div class="dropdown" v-if="opened">
            <h3>find_address</h3>
            <BaseInput 
                type="search" 
                v-model="search" 
                placeholder="Search" 
                style="margin-bottom: -10px;" 
                @input="searchAddresses" 
            />
            <div class="dropdown__items" v-memo="[search]">
                <div v-if="loading" class="dropdown__loading">
                    Searching...
                </div>
                <template v-else>
                    <div class="dropdown__item" v-for="(item, i) in addresses" :key="i" @click="selectAddress(item)">
                        <span>{{ formatAddress(item) }}</span>
                    </div>
                    <div v-if="addresses.length === 0 && search" class="dropdown__empty">
                        write_something
                    </div>
                </template>
            </div>
        </div>
        <span class="hint">{{ hint }}</span>
        <span class="error" v-if="error">{{ error }}</span>
    </div>
</template>

<script setup lang="ts">
import { findAddress, type FindAddressModel } from '~/app/api/locationApi';
import BaseInput from '../UI/BaseInput.vue';

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
    hint?: string;
    error?: string;
    value?: FindAddressModel | null;
}>();

const emit = defineEmits(['update:value']);

const opened = ref(false);
const selectRef = ref(null);
const search = ref('');
const addresses = ref<FindAddressModel[]>([]);
const loading = ref(false);

const displayValue = computed(() => {
    if (!props.value) return props.placeholder || 'address';
    return formatAddress(props.value);
});

function formatAddress(address: FindAddressModel): string {
    const parts = [];
    if (address.address_dict.country) parts.push(address.address_dict.country);
    if (address.address_dict.city) parts.push(address.address_dict.city);
    if (address.address_dict.street) parts.push(address.address_dict.street);
    if (address.address_dict.house_number) parts.push(address.address_dict.house_number);
    return parts.join(', ');
}

async function searchAddresses() {
    if (!search.value || search.value.length < 2) {
        addresses.value = [];
        return;
    }
    
    loading.value = true;
    try {
        addresses.value = await findAddress(search.value);
    } catch (error) {
        console.error('Error searching addresses:', error);
        addresses.value = [];
    } finally {
        loading.value = false;
    }
}

function selectAddress(address: FindAddressModel) {
    emit('update:value', address);
    search.value = '';
    opened.value = false;
}

const debouncedSearch = debounce(searchAddresses, 300);

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

            .dropdown__loading {
                text-align: center;
                color: #9C9C9C;
                padding: 10px;
            }
        }
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