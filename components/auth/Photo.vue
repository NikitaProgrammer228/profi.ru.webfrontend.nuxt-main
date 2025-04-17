<template>
    <h2>Profile photo</h2>
    <BaseBlock class="photo__block">
        <div class="photo">
            <img loading="lazy" src="~/assets/icons/photo.svg" alt="photo" />
            <span>Tell us about your task</span>
        </div>
        <div class="recommended">
            <p>Recommendations</p>
            <span>The photo determines what first impression you will make on service users. Take a passport photo, just
                with a slight smile. It's best in natural light. A good photograph will make people trust you.</span>
        </div>
    </BaseBlock>
    <div class="action__buttons">
        <BaseButton type="cancel" @click="$emit('nextStep')">Not now</BaseButton>
        <BaseButton type="base" @click="$emit('nextStep')">Save</BaseButton>
    </div>
</template>

<script setup lang="ts">
import BaseBlock from '~/components/UI/BaseBlock.vue';
import BaseButton from '../UI/BaseButton.vue';

defineEmits(['nextStep']);
</script>

<style lang="scss" scoped>
.photo__block {
    display: flex;
    flex-direction: row;
    gap: 16px;

    .photo {
        max-width: 200px;
        width: -webkit-fill-available;
        width: -moz-available;
        height: 200px;
        border: 1px solid rgba(156, 156, 156, 1);
        border-radius: 8px;
        user-select: none;
        cursor: pointer;

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 8px;

        span {
            font-size: 12px;
            line-height: 15.6px;
            color: rgba(156, 156, 156, 1);
        }
    }

    .recommended {
        display: flex;
        flex-direction: column;
        gap: 8px;

        p {
            font-size: 20px;
            font-weight: 500;
            line-height: 24px;
            letter-spacing: -0.02em;
        }

        span {
            font-size: 16px;
            line-height: 22.4px;
        }
    }
}

.action__buttons {
    display: flex;
    flex-direction: row;
    justify-content: center;
    gap: 16px;
}

h2 {
    font-size: 36px;
    font-weight: 500;
    line-height: 36px;
    text-align: center;
}
</style>