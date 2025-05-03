<template>
    <div class="input__wrapper" ref="selectRef">
        <div class="number input">
            <div
                style="display: flex; align-items: baseline; gap: 8px; width: -webkit-fill-available; width: -moz-available;">
                <div class="flag" @click="opened = !opened">
                    <div style="display: flex; align-items: center;" v-html="flag"></div>
                    <span>{{ digits }}</span>
                </div>
                <input type="number" :placeholder="placeholder" v-model="phone" @blur="$emit('blur')" @focus="$emit('focus')">
            </div>
            <!-- <img loading="lazy" src="~/assets/icons/help.svg" alt="help" /> -->
        </div>
        <div class="dropdown" v-if="opened">
            <h3>Select country / Region</h3>
            <BaseInput type="search" v-model="search" placeholder="Search" style="margin-bottom: -10px;" />
            <div class="dropdown__items" v-memo="[search]">
                <div class="dropdown__item" v-for="(item, i) in countries" :key="i"
                    @click="selectCountry(item.dialCode, Flags[item.code], item.code)">
                    <div class="flag" v-html="Flags[item.code]"></div>
                    <span>{{ item.name }} ({{ item.code }})</span>
                </div>
            </div>
        </div>
        <!-- <span class="hint">{{ hint }}</span> -->
        <span class="error" v-if="error">{{ error }}</span>
    </div>
</template>

<script setup lang="ts">
import CountryList, { Country } from 'country-list-with-dial-code-and-flag';
import * as Flags from '~/assets/svg';
import BaseInput from './BaseInput.vue';

const props = defineProps({
    placeholder: String,
    type: String,
    hint: String,
    value: {
        type: [Number, String],
        default: ''
    },
    error: String,
    countryCode: {
        type: String,
        default: 'RU'
    },
    phoneCode: {
        type: String,
        default: '+7'
    },
    readonly: {
        type: Boolean,
        default: false
    }
});
const emit = defineEmits(['update', 'blur', 'focus']);

const countriesAll = ref<Country[]>([]);

const opened = ref(false);
const selectRef = ref(null);
const flag = ref(Flags['RU']);
const search = ref('');

const digits = ref(props.phoneCode);
const phone = ref(props.value?.toString() || '');

const countries = computed(() => {
    return search.value.length ? searchCountries(search.value) : countriesAll.value;
});

function searchCountries(search: string) {
    return countriesAll.value.filter(item => item.name.toLowerCase().includes(search.toLowerCase()));
}

function selectCountry(code: string, flagSVG: string, countryCode: string) {
    flag.value = flagSVG;
    search.value = '';
    digits.value = code;
    opened.value = false;

    emit('update', {
        digits: digits.value,
        phone: phone.value,
        countryCode: countryCode
    });
}

watch(() => props.phoneCode, (newCode) => {
    if (newCode) {
        digits.value = newCode;
    }
});

watch(() => props.countryCode, (newCode) => {
    if (newCode && Flags[newCode]) {
        flag.value = Flags[newCode];
    }
});

watch(() => props.value, (newValue) => {
    if (newValue !== undefined) {
        phone.value = newValue.toString();
    }
});

watch(phone, () => {
    emit('update', {
        digits: digits.value,
        phone: phone.value
    });
});

useClickOutside(selectRef, () => opened.value = false);

onMounted(() => {
    countriesAll.value = CountryList.getAll();
    const country = countriesAll.value.find(c => c.code === props.countryCode);
    if (country) {
        flag.value = Flags[country.code];
        if (!props.phoneCode) {
            digits.value = country.dialCode;
        }
    }
});
</script>

<style lang="scss" scoped>
.input {
    width: -webkit-fill-available;
    width: -moz-available;
    max-width: 400px;
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
        max-width: 400px;
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
        width: 100%;
        height: 20px;

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
        align-items: baseline;
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
