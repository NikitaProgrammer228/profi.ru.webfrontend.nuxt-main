<template>
    <div class="button" :class="{ [type]: true, 'disabled': disabled, 'fill': fill }" @click="setClick">
        <slot></slot>
    </div>
</template>

<script setup lang="ts">
const props = defineProps({
    type: {
        type: String,
        default: 'base'
    },
    disabled: {
        type: Boolean,
        default: false
    },
    fill: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['click']);

function setClick() {
    if (!props.disabled) {
        emit('click');
    }
}
</script>

<style lang="scss" scoped>
.button {
    min-width: 140px;
    text-align: center;
    padding: 6px 16px;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    line-height: 16.41px;
    cursor: pointer;
    white-space: nowrap;
    user-select: none;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;

    &.base {
        background: rgba(255, 199, 0, 1);
        padding: 12px 16px;

        // &:hover {
        //     background: rgba(242, 214, 115, 1);
        // }
    }

    &.cancel {
        background: rgba(244, 244, 244, 1);
        padding: 12px 16px;
    }

    &.disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }

    &.flat {
        background: transparent;
        padding: 12px 16px;
        color: #9C9C9C;
    }

    &.fill {
        width: 100%;
    }

    @media screen and (max-width: 550px) {
        min-width: 0px;
        padding: 12px 16px;
    }
}
</style>