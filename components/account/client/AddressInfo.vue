<template>
    <BaseBlock :center="false">
        Addresses
        <div class="addresses">
            <Address 
                v-for="address in addresses" 
                :key="address.id" 
                :address="address"
                @delete="deleteAddress(address.id)"
                @edit="editAddress(address)"
            />
            <div v-if="addresses.length === 0" class="no-addresses">
                No addresses added yet
            </div>
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
import { getUserAddresses, deleteAddress as deleteAddressApi } from '~/app/api/locationApi';
import type { Address as AddressType } from '~/app/api/locationApi';

const addresses = ref<AddressType[]>([]);

async function loadAddresses() {
    addresses.value = await getUserAddresses();
}

async function deleteAddress(id: number) {
    try {
        const success = await deleteAddressApi(id);
        if (success) {
            await loadAddresses(); // Reload addresses after successful deletion
        }
    } catch (error) {
        console.error('Error deleting address:', error);
    }
}

function editAddress(address: AddressType) {
    // TODO: Implement edit address functionality
    console.log('Edit address:', address);
}

onMounted(() => {
    loadAddresses();
});
</script>

<style lang="scss" scoped>
.add__address {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 16px;
}

.addresses {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.no-addresses {
    text-align: center;
    color: #9C9C9C;
    padding: 16px;
}
</style>