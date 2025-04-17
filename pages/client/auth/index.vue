<template>
    <BaseBlock style="padding: 32px; margin-top: 0px;">
        <DoubleButtons :toggle="toggle" @update:toggle="toggle = $event">
            <template #left>
                Registration
            </template>
            <template #right>
                Login
            </template>
        </DoubleButtons>
        <Login v-if="toggle" />
        <Register v-else />
    </BaseBlock>
</template>

<script setup lang="ts">
import DoubleButtons from '~/components/shared/DoubleButtons.vue';
import BaseBlock from '~/components/UI/BaseBlock.vue';
import Login from '~/components/auth/Login.vue';
import Register from '~/components/auth/Register.vue';

definePageMeta({
  middleware: ['auth'],
});

const userStore = useUserStore();

if (userStore.isAuth) {
    navigateTo('/client/account');
}

const toggle = ref(false);
</script>

<style lang="scss" scoped>
.wrapper {
    display: flex;
    flex-direction: column;
    gap: 16px;
    align-items: center;

    h2 {
        font-size: 18px;
        font-weight: 500;
        line-height: 18px;
        letter-spacing: -0.02em;
    }

    p {
        max-width: 400px;
        font-size: 14px;
        line-height: 19.6px;
        text-align: center;
    }

    .block {
        max-width: 400px;
        width: -webkit-fill-available;
        width: -moz-available;

        p {
            text-align: left;
            margin-bottom: 6px;
            font-size: 14px;
            font-weight: 500;
            line-height: 16.8px;
            letter-spacing: -0.02em;
        }
    }
}
</style>