<script setup lang="ts">
import Passport from '~/components/auth/Passport.vue';
import { getMasterMe } from '~/app/api/masterApi';
import { useMasterStore } from '~/stores/masterStore';

const masterStore = useMasterStore();

const hasPassport = computed(() => {
    if (masterStore.profile?.passport_front && masterStore.profile?.passport_back) {
        return true;
    }
    return false;
});

onMounted(async () => {
    masterStore.profile = await getMasterMe();
});
</script>

<template>
    <Passport :master="masterStore.profile" @next-step="$router.push('/master/account')"/>
</template>