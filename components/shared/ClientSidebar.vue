<template>
  <div class="sidebar__buttons">
    <div class="sidebar__button" @click="$router.push('/client/catalog')">
      <img loading="lazy" src="~/assets/icons/blocks.svg" alt="blocks" />
      Find a specialist
    </div>
    <div class="sidebar__button" @click="$router.push('/client/orders/my')">
      <img loading="lazy" src="~/assets/icons/orders.svg" alt="orders" />
      My orders
    </div>
    <div class="sidebar__button" @click="$router.push('/client/account')">
      <img loading="lazy" src="~/assets/icons/settings.svg" alt="settings" />
      Settings
    </div>
  </div>
</template>

<script setup lang="ts">

</script>

<style lang="scss" scoped>
.sidebar {
  &__buttons {
    display: flex;
    flex-direction: column;
    gap: 16px;

    @media screen and (max-width: 1024px) {
      flex-direction: row;
    }

    @media screen and (max-width: 640px) {
      width: 100%;
      justify-content: space-around;
      gap: 12px;

      img:not(.filter__img) {
        display: none;
      }
    }

  }

  &__button {
    cursor: pointer;
    font-size: 18px;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 0;

    @media screen and (max-width: 640px) {
      font-size: 16px;
      padding: 4px 0;
    }
  }
}
</style>