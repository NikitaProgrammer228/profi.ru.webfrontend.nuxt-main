<template>
    <BackButton class="back" color="black" v-if="chosenCategory">Choosing a category • {{ chosenCategory }}</BackButton>
    <BaseBlock v-if="!registered" style="padding: 32px;">
        <div class="action__buttons">
            <BaseButton :type="isOrg ? 'cancel' : 'base'" @click="isOrg = false">A private person</BaseButton>
            <BaseButton :type="isOrg ? 'base' : 'cancel'" @click="isOrg = true">Organisation</BaseButton>
        </div>
        <Register :master="true" :org="isOrg" />
        <p>Already have an account? <NuxtLink to="/master/auth/login">Log in</NuxtLink>
        </p>
    </BaseBlock>
    <div v-else-if="step === 1" class="block__wrapper">
        <Category @nextStep="step = 2" />
    </div>
    <div v-else-if="step === 2" style="display: flex; flex-direction: column; gap: 24px;">
        <SubCategory @nextStep="step = 3" />
    </div>
    <div v-else-if="step === 3">
        <Photo @nextStep="step = 4" />
    </div>
    <div v-else-if="step === 4">
        <Passport @nextStep="step = 4" />
    </div>
</template>

<script setup lang="ts">
import BaseBlock from '~/components/UI/BaseBlock.vue';
import BaseButton from '~/components/UI/BaseButton.vue';
import Register from '~/components/auth/Register.vue';
import BackButton from '~/components/UI/BackButton.vue';
import Category from '~/components/auth/Category.vue';
import SubCategory from '~/components/shared/SubCategory.vue';
import Photo from '~/components/auth/Photo.vue';
import Passport from '~/components/auth/Passport.vue';

definePageMeta({
  middleware: ['auth'],
});

const isOrg = ref(false);
const registered = ref(false);
const chosenCategory = ref('');
const step = ref(1);
</script>

<style lang="scss" scoped>
.block__wrapper {
    padding: 0 130px;
}

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