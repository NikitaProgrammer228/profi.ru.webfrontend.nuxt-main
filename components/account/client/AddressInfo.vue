<template>
    <BaseBlock :center="false">
        Addresses
        <div class="addresses">
            <Address />
        </div>
        <div class="add__address">
            <BaseButton type="base" @click="$router.push('/client/account/add-address')">Add new address</BaseButton>
        </div>
    </BaseBlock>
</template>

<script setup lang="ts">
import Address from '~/components/account/client/Address.vue';
import BaseBlock from '~/components/UI/BaseBlock.vue';
import BaseButton from '~/components/UI/BaseButton.vue';
</script>

<style lang="scss" scoped>
.add__address {
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>