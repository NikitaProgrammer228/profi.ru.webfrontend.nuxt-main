<script setup lang="ts">
import Passport from '~/components/auth/Passport.vue';
import { getMasterMe } from '~/app/api/masterApi';
import { setToken } from '~/app/api';
import { useMasterStore } from '~/stores/masterStore';

const masterStore = useMasterStore();

const hasPassport = computed(() => {
    if (masterStore.profile?.passport_front && masterStore.profile?.passport_back) {
        return true;
    }
    return false;
});

onMounted(async () => {
    try {
        // ensure axios has the auth header
        setToken();
        const profile = await getMasterMe();
        masterStore.profile = profile;
    } catch (e: any) {
        console.error('Ошибка загрузки master/me в Passport.vue:', e);
    }
});
</script>

<template>
    <Passport :master="masterStore.profile" @next-step="$router.push('/master/account')"/>
</template>