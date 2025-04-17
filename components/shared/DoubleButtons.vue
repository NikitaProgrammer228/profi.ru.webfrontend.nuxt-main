<template>
    <div class="auth__buttons" :class="wide ? 'wide' : ''">
        <div :class="toggle ? '' : 'active'" class="auth__button" @click="setLogin(false)">
            <slot name="left"></slot>
        </div>
        <div :class="toggle ? 'active' : ''" class="auth__button" @click="setLogin(true)">
            <slot name="right"></slot>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps({
    toggle: Boolean,
    wide: {
        type: Boolean,
        default: false
    }
});
const emit = defineEmits(['update:toggle']);

function setLogin(value: boolean) {
    emit('update:toggle', value);
}
</script>

<style lang="scss" scoped>
    .auth__buttons {
        display: flex;
        flex-direction: row;
        border-radius: 6px;
        background: rgba(244, 244, 244, 1);
        user-select: none;

        &.wide .auth__button {
            min-width: 220px;
        }

        .auth__button {
            min-width: 120px;
            height: 44px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 6px;
            cursor: pointer;

            &.active {
                background: rgba(255, 199, 0, 1);
            }
        }
    }
</style>