<template>
    <div class="base-block" :class="{ 'center': center, 'flat': flat }" :style="{ padding, gap }">
        <slot></slot>
    </div>
</template>

<script setup lang="ts">
defineProps({
    center: {
        type: Boolean,
        default: true
    },
    flat: {
        type: Boolean,
        default: false
    },
    padding: {
        type: String,
        default: '24px'
    },
    gap: {
        type: String,
        default: '16px'
    }
})
</script>

<style lang="scss" scoped>
    .base-block {
        width: 100%;
        padding: 24px;
        border-radius: 16px;
        border: 1px solid rgba(244, 244, 244, 1);
        box-shadow: 4px 4px 8px 4px rgba(43, 33, 0, 0.04);
        box-shadow: -4px 0px 8px 2px rgba(43, 33, 0, 0.04);
        background: white;
        margin: 12px 0;
        display: flex;
        flex-direction: column;
        gap: 16px;

        @media screen and (max-width: 650px) {
            padding: 16px;  
        }

        &.center {
            align-items: center;
        }
        
        &.flat {
            box-shadow: none;
            border: none;
        }
    }
</style>