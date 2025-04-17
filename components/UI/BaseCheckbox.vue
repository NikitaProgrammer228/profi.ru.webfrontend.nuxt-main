<template>
    <div class="checkbox__wrapper" @click="$emit('update:checked', !checked)">
        <div class="checkbox" :class="{ 'checked': checked }">
            <img loading="lazy" v-if="checked" src="~/assets/icons/check.svg" alt="check" />
        </div>
        <slot></slot>
    </div>
</template>

<script setup lang="ts">
defineProps({
    checked: {
        type: Boolean,
        default: false
    }
});

defineEmits(['update:checked']);
</script>

<style lang="scss" scoped>
.checkbox__wrapper {
    width: fit-content;
    display: flex;
    flex-direction: row;
    align-items: start;
    gap: 8px;

    cursor: pointer;
    user-select: none;

    .checkbox {
        border: 1.5px solid rgba(156, 156, 156, 1);
        min-width: 16px;
        width: 16px;
        height: 16px;
        border-radius: 4px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 2px;

        &.checked {
            background: rgba(255, 196, 5, 1);
            border: 1.5px solid rgba(255, 196, 5, 1);
        }
    }
}
</style>