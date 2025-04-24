<template>
    <div class="offer-input">
        <div class="input-wrapper">
            <span>{{ selectedCurrency?.symbol || '$' }}</span>
            <input type="number" :value="price" @input="onPriceInput"
                placeholder="Your price">
        </div>
        <div class="change-value" @click="show = !show" ref="selectRef">
            {{ selectedCurrency?.code || 'USD' }}
            <img loading="lazy" src="~/assets/icons/arrow-down.svg" alt="arrow" />

            <div class="dropdown" v-if="show">
                <div class="dropdown__item" v-for="currency in currencies" :key="currency.id" @click="changeValue(currency)">
                    {{ currency.code }} ({{ currency.fullname }})
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { getCurrencies, type Currency } from '~/app/api/locationApi';

const props = defineProps<{
    response: { currency: number },
    price: number | null | string | undefined
}>();

const emit = defineEmits(['update:price']);

const currencies = ref<Currency[]>([]);
const show = ref(false);
const selectRef = ref(null);

const selectedCurrency = computed(() => 
    currencies.value.find(c => c.id === props.response.currency)
);

function onPriceInput(event: Event) {
    const target = event.target as HTMLInputElement;
    emit('update:price', target.value);
}

function changeValue(currency: Currency) {
    props.response.currency = currency.id;
    show.value = false;
}

onMounted(async () => {
    try {
        currencies.value = await getCurrencies();
        // If no currency is selected, set the first one (usually USD) as default
        if (!props.response.currency && currencies.value.length > 0) {
            props.response.currency = currencies.value[0].id;
        }
    } catch (error) {
        console.error('Failed to load currencies:', error);
    }
});

useClickOutside(selectRef, () => show.value = false);
</script>

<style lang="scss" scoped>
.offer-input {
    display: flex;
    justify-content: space-between;
    width: 100%;
    border: 1px solid rgba(156, 156, 156, 1);
    box-shadow: 0px 1px 2px 0px rgba(16, 24, 40, 0.05);
    border-radius: 10px;
    padding: 11px 14px;
    outline: none;

    input {
        border: none;
        outline: none;
        width: 100%;
        font-size: 16px;

        line-height: 20.8px;
    }

    .change-value {
        user-select: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 2px;
        font-size: 16px;

        line-height: 15.6px;
        color: rgba(79, 79, 79, 1);
        position: relative;

        img {
            width: 16px;
        }

        .dropdown {
            position: absolute;
            top: calc(100% + 8px);
            left: -20%;
            z-index: 1000;
            width: 130%;
            background: white;
            border-radius: 6px;
            box-shadow: 4px 4px 8px 4px rgba(43, 33, 0, 0.04);
            box-shadow: -4px 0px 8px 2px rgba(43, 33, 0, 0.04);
            padding: 6px;

            &__item {
                cursor: pointer;
                padding: 10px;
                border-bottom: 1.5px solid rgba(244, 244, 244, 1);
                margin-bottom: 4px;
                border-radius: 4px;

                &:hover {
                    background: rgba(255, 199, 0, 0.1);
                }

                &.active {
                    background: rgba(255, 199, 0, 0.1);
                }
            }
        }
    }

    .input-wrapper {
        display: flex;
        align-items: center;
        gap: 8px;
        width: 100%;

        input {
            margin-bottom: -2px;
        }

        span {
            color: rgba(79, 79, 79, 1);
        }
    }
}
</style>