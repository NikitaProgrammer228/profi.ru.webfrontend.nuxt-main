<template>
    <div class="back-button back" :style="{ color }">
        <svg width="7" height="12" viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 1.33317L1.68689 5.64628C1.49163 5.84155 1.49163 6.15813 1.68689 6.35339L6 10.6665"
                :stroke="color || '#3D3D3D'" stroke-width="1.5" stroke-linecap="round" />
        </svg>

        <slot></slot>
    </div>
</template>

<script lang="ts" setup>
defineProps({
    color: {
        type: String
    }
});
</script>

<style lang="scss" scoped>
.back-button {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    user-select: none;

    font-size: 36px;
    line-height: 36px;
    min-height: 36px;
    font-weight: 500;
    letter-spacing: -0.02em;
    // color: rgba(156, 156, 156, 1);
    color: #3D3D3D;

    @media screen and (max-width: 750px) {
        font-size: 22px;
        line-height: 22px;
        min-height: 22px;
    }

    svg {
        min-width: 24px;
        min-height: 24px;
    }
}
</style>