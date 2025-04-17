<script setup lang="ts">
import BaseBlock from '~/components/UI/BaseBlock.vue';
import BaseButton from '~/components/UI/BaseButton.vue';
import { getMasterMe } from '~/app/api/masterApi';
import { useMasterStore } from '~/stores/masterStore';

defineProps({
    loading: {
        type: Boolean,
        default: false
    }
})

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
    <BaseBlock :loading="loading">
        <div class="header">
            <img loading="lazy" v-if="!hasPassport"
                src="~/assets/icons/passport-not.svg" alt="passport-not-verified">
            <img loading="lazy" v-else src="~/assets/icons/green-cross.svg" width="25px" height="25px" alt="passport-verified">
            <p>Check your passport (ID card)</p>
        </div>
        <p v-if="!hasPassport">We need to make sure that
            you are you. To do this, you need to show your passport, <span>without which you
                will not be able to respond to ads</span></p>
        <p v-else style="width: 100%;">Your passport (ID card) is verified</p>

        <BaseButton v-if="!hasPassport" type="cancel" @click="$router.push('/master/account/passport')">
            <img loading="lazy" src="~/assets/icons/black-plus.svg" alt="plus">
            Pass the verification
        </BaseButton>
        <BaseButton v-else type="cancel" @click="$router.push('/master/account/passport')">
            <img loading="lazy" src="~/assets/icons/black-plus.svg" alt="plus">
            Reshoot
        </BaseButton>
    </BaseBlock>
</template>

<style lang="scss" scoped>
p {
    font-size: 14px;
    line-height: 19.6px;

    span {
        color: #F04438;
    }

    @media screen and (max-width: 425px) {
        font-size: 13px;
    }
}

.header {
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;

    p {
        font-size: 18px;
        font-weight: 500;
        line-height: 18px;
        letter-spacing: -0.02em;
    }
}
</style>