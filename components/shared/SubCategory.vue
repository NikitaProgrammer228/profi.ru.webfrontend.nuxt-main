<template>
      <BackButton class="back" color="black" v-if="chosenCategory">Choosing a category • {{ chosenCategory }}</BackButton>
    <BaseBlock>
        <div class="wrapper main" @click="$emit('nextStep')">
            <div class="list">
                <p>Category 1</p>
                <p>Category 2</p>
                <p>Category 3</p>
                <p>Category 4</p>
            </div>
            <div class="list">
                <p>Category 1</p>
                <p>Category 2</p>
                <p>Category 3</p>
                <p>Category 4</p>
            </div>
            <div class="list">
                <p>Category 1</p>
                <p>Category 2</p>
                <p>Category 3</p>
                <p>Category 4</p>
            </div>
            <div class="list">
                <p>Category 1</p>
                <p>Category 2</p>
                <p>Category 3</p>
                <p>Category 4</p>
            </div>
        </div>
    </BaseBlock>
    <div class="wrapper">
        <div class="list">
            <p>Category 1</p>
            <p>Category 2</p>
            <p>Category 3</p>
            <p>Category 4</p>
        </div>
        <div class="list">
            <p>Category 1</p>
            <p>Category 2</p>
            <p>Category 3</p>
            <p>Category 4</p>
        </div>
        <div class="list">
            <p>Category 1</p>
            <p>Category 2</p>
            <p>Category 3</p>
            <p>Category 4</p>
        </div>
        <div class="list">
            <p>Category 1</p>
            <p>Category 2</p>
            <p>Category 3</p>
            <p>Category 4</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import BaseBlock from '~/components/UI/BaseBlock.vue';
import BackButton from '../UI/BackButton.vue';

defineEmits(['nextStep']);

const chosenCategory = ref('aboba');
</script>

<style lang="scss" scoped>
.wrapper {
    width: 100%;
    display: grid;
    grid-template-columns: 25% 25% 25% 25%;
    gap: 16px;

    .list {
        display: flex;
        flex-direction: column;
        gap: 8px;

        p {
            cursor: pointer;
            font-size: 16px;
            line-height: 22.4px;
        }
    }

    &.main {
        p {
            font-weight: 500;
        }
    }
}
</style>