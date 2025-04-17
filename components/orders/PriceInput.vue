<template>
    <div class="offer-input">
        <div class="input-wrapper">
            <span>{{ values[response.currency].value }}</span>
            <input type="number" :value="price" @input="$emit('update:price', $event.target.value)"
                placeholder="Your price">
        </div>
        <div class="change-value" @click="show = !show" ref="selectRef">
            {{ response.currency }}
            <img loading="lazy" src="~/assets/icons/arrow-down.svg" alt="arrow" />

            <div class="dropdown" v-if="show">
                <div class="dropdown__item" v-for="(item, i) in values" :key="i" @click="changeValue(item.title)">
                    {{ item.title }}
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    response: any,
    price: number | null | string | undefined
}>();

const values = ref({
    'USD': {
        title: 'USD',
        value: '$',
    },
    'EUR': {
        title: 'EUR',
        value: '€',
    },
    'RUB': {
        title: 'RUB',
        value: '₽',
    }
});
const show = ref(false);
const selectRef = ref(null);

function changeValue(value: string) {
    props.response.currency = value;
}
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