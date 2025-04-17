<template>
    <div ref="selectRef" class="input__wrapper" @click="opened = !opened">
        <div class="input" :class="opened ? 'opened' : ''">
            {{ list.find(i => i.value === selected)?.title || placeholder || 'Select' }}
            <img loading="lazy" src="~/assets/icons/arrow-down.svg" alt="down" :class="opened ? 'opened' : ''" />
        </div>
        <div class="dropdown" v-if="opened">
            <div class="dropdown__item" v-for="item in list" :key="item.value"
                @click="$emit('update:selected', item.value)" :class="{ 'active': item.value === selected }">
                {{ item.title }}
            </div>
        </div>
        <span class="hint">{{ hint }}</span>
    </div>
</template>

<script lang="ts" setup>
import { useClickOutside } from '../../composables/useClickOutside';

interface Option {
    title: string;
    value: string | number | boolean;
}

defineProps<{
    hint?: string;
    list: Option[];
    selected?: string;
    placeholder?: string;
}>();

defineEmits(['update:selected']);

const selectRef = ref(null);
const opened = ref(false);

useClickOutside(selectRef, () => opened.value = false);
</script>

<style lang="scss" scoped>
.input__wrapper {
    position: relative;
    width: -webkit-fill-available;
    width: -moz-available;
    max-width: 400px;
    user-select: none;

    @media screen and (max-width: 725px) {
        max-width: 100%;
    }

    .dropdown {
        position: absolute;
        top: calc(100% + 8px);
        left: 0;
        z-index: 1000;
        width: 100%;
        background: white;
        border-radius: 6px;
        box-shadow: 4px 4px 8px 4px rgba(43, 33, 0, 0.04);
        box-shadow: -4px 0px 8px 2px rgba(43, 33, 0, 0.04);
        padding: 12px;

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

.input {
    display: flex;
    border-radius: 6px;
    align-items: center;
    justify-content: space-between;
    padding: 11px 14px;
    background: white;
    border: 1px solid rgba(156, 156, 156, 1);
    box-shadow: 0px 1px 2px 0px rgba(16, 24, 40, 0.05);
    cursor: pointer;

    &.opened {
        border: 1px solid rgba(255, 199, 0, 1);
    }

    img {
        transform: rotate(0deg);
        transition: all 0.3s ease;

        &.opened {
            transform: rotate(180deg);
        }
    }
}

.hint {
    font-size: 14px;
    line-height: 19.6px;
    color: rgba(156, 156, 156, 1);
}
</style>
