<template>
    <div class="switch__wrapper" @click="$emit('update:active', !active)">
        <slot></slot>
        <div class="switch" :class="{ 'active': active }">
            <div class="switch_circle" :class="{ 'active': active }"></div>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps({
    active: {
        type: Boolean,
        default: false
    }
});

defineEmits(['update:active']);
</script>

<style lang="scss" scoped>
.switch__wrapper {
    // width: 237px;
    display: flex;
    justify-content: space-between;
    cursor: pointer;
    user-select: none;

    .switch {
        position: relative;
        background: rgba(234, 234, 234, 1);
        border-radius: 12px;
        width: 36px;
        height: 20px;
        transition: all 0.3s ease;

        &.active {
            background: rgba(255, 196, 5, 1);

            &_circle {
                right: 2px !important;
            }
        }

        &_circle {
            position: absolute;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: white;
            box-shadow: 0px 1px 2px 0px rgba(16, 24, 40, 0.06);
            box-shadow: 0px 1px 3px 0px rgba(16, 24, 40, 0.1);
            top: 2px;
            left: 2px;
            transition: all 0.3s ease;

            &.active {
                left: 18px;
            }
        }
    }
}
</style>