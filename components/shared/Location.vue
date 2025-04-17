<template>
    <div class="location" @click="changeType">
        {{ type }}
        <img loading="lazy" src="~/assets/icons/arrow-down.svg" :class="reversed ? 'reversed' : ''" alt="arrow-down" />
    </div>
</template>

<script setup lang="ts">
const emit = defineEmits(['changeType']);

const reversed = ref(false);
const type = ref('Client');

function changeType() {
    type.value = type.value === 'Client' ? 'Master' : 'Client';
    emit('changeType', type.value);
}
</script>

<style lang="scss" scoped>
.location {
    display: flex;
    align-items: center;
    gap: 10px;
    user-select: none;
    cursor: pointer;

    @media screen and (max-width: 570px) {
        display: none;
    }

    img {
        transform: rotate(0deg);
        transition: all 0.3s ease;
    }

    img.reversed {
        transform: rotate(180deg);
    }
}
</style>