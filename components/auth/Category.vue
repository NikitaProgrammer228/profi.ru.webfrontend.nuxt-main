<template>
    <h2>Choosing a category</h2>
    <BaseBlock>
      <BaseInput type="search" placeholder="Search"></BaseInput>
      <div class="categories" @click="$emit('nextStep')">
        <div class="category__list">
          <p>Category 1</p>
          <p>Category 2</p>
          <p>Category 3</p>
          <p>Category 4</p>
        </div>
        <div class="category__list">
          <p>Category 1</p>
          <p>Category 2</p>
          <p>Category 3</p>
          <p>Category 4</p>
        </div>
      </div>
    </BaseBlock>
  </template>
  
  <script setup lang="ts">
  import BaseBlock from '~/components/UI/BaseBlock.vue';
  import BaseInput from '~/components/UI/BaseInput.vue';
  
  defineEmits(['nextStep']);
  </script>
  
  <style lang="scss" scoped>
  .categories {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-gap: 8px;
  
    @media screen and (max-width: 650px) {
      grid-template-columns: 1fr 1fr 1fr;
    }
  
    @media screen and (max-width: 450px) {
      grid-template-columns: 1fr 1fr;
    }
  
    .category {
      padding: 8px 0;
      user-select: none;
      cursor: pointer;
  
      font-weight: 500;
      font-size: 18px;
      line-height: 25px;
    }
  
    &.rest {
      padding: 0 24px;
    }
  }
  
  h2 {
    font-size: 36px;
    font-weight: 500;
    line-height: 36px;
    text-align: center;
  }
  </style>