<template>
        <BackButton style="font-size: 18px; padding: 12px 0px;" @click="$router.go(-1)">Profile settings</BackButton>
        <BaseBlock>
            <h2>Add an address</h2>
            <BaseInput type="text" placeholder="House number" v-model="address.houseNumber" />
            <BaseInput type="text" placeholder="Street name" v-model="address.street" />
            <BaseInput type="text" placeholder="Apartment number" v-model="address.apartment" />
            <BaseInput type="text" placeholder="Name of the city (and state – for the USA) " v-model="address.city" />
            <BaseInput type="text" placeholder="Postal code" v-model="address.postalCode" />
            <BaseInput type="text" placeholder="Country name" v-model="address.country" />
            <BaseButton :disabled="!valid">Save</BaseButton>
        </BaseBlock>
</template>

<script setup lang="ts">
import BackButton from '~/components/UI/BackButton.vue';
import BaseBlock from '~/components/UI/BaseBlock.vue';
import BaseButton from '~/components/UI/BaseButton.vue';
import BaseInput from '~/components/UI/BaseInput.vue';

definePageMeta({
  middleware: ['auth'],
});

const address = reactive({
    houseNumber: '',
    street: '',
    apartment: '',
    city: '',
    postalCode: '',
    country: '',
});

const valid = computed(() => {
    return address.houseNumber.length > 0
});

</script>

<style scoped>
h2 {
    font-size: 36px;
    font-weight: 500;
    line-height: 36px;
    text-align: center;
}
</style>