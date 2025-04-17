<template>
    <BaseBlock style="padding: 32px;">
        <Login :master="true" :org="isOrg" />
        <p>Don't have an account? <NuxtLink to="/master/auth">Sign in</NuxtLink></p>
    </BaseBlock>
</template>

<script setup lang="ts">
import BaseBlock from '~/components/UI/BaseBlock.vue';
import Login from '~/components/auth/Login.vue';

definePageMeta({
  middleware: ['auth'],
});

const isOrg = ref(false);
</script>

<style lang="scss" scoped>
.action__buttons {
    display: flex;
    gap: 16px;
    justify-content: center;
}

p {
    a {
        font-weight: 700;
        font-size: 14px;
        font-weight: 700;
        line-height: 19.6px;

    }
}
</style>