<template>
    <BaseBlock :center="false">
        Addresses
        <div class="addresses">
            <template v-if="!loading">
                <template v-if="addressList.length > 0">
                    <Address 
                        v-for="address in addressList" 
                        :key="address.id" 
                        :address="address"
                        @delete="deleteAddress(address.id)"
                        @edit="editAddress(address)"
                    />
                </template>
                <div v-else class="no-addresses">
                    No addresses added yet
                </div>
            </template>
            <div v-else class="loading">
                Loading addresses...
            </div>
            <div v-if="error" class="error-message">
                {{ error }}
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
import { useRouter } from 'vue-router';

const router = useRouter();

const loading = ref(false);
const error = ref<string | null>(null);
const addressList = ref<AddressType[]>([]);

async function loadAddresses() {
    try {
        loading.value = true;
        error.value = null;
        console.log('Starting to load addresses...');
        const addresses = await getUserAddresses();
        console.log('Received addresses:', addresses);
        addressList.value = addresses;
        console.log('Updated addresses state:', addressList.value);
    } catch (err) {
        console.error('Error loading addresses:', err);
        error.value = 'Failed to load addresses. Please try again later.';
        addressList.value = [];
    } finally {
        loading.value = false;
    }
}

async function deleteAddress(id: number) {
    try {
        error.value = null;
        loading.value = true;
        console.log('Attempting to delete address with id:', id);
        
        const success = await deleteAddressApi(id);
        
        if (success) {
            console.log('Address deleted successfully, reloading addresses...');
            await loadAddresses();
            error.value = null; // Clear any previous errors
        } else {
            console.error('Delete address API call failed');
            error.value = 'Failed to delete address. Please try again.';
        }
    } catch (err) {
        console.error('Error in deleteAddress function:', err);
        error.value = 'Failed to delete address. Please try again.';
    } finally {
        loading.value = false;
    }
}

function editAddress(address: AddressType) {
    router.push({
        path: '/client/account/edit-address',
        query: { id: address.id.toString() }
    });
}

onMounted(() => {
    console.log('AddressInfo component mounted');
    loadAddresses();
});

watch(addressList, (newValue) => {
    console.log('Address list changed:', newValue);
}, { deep: true });
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
    min-height: 100px;
}

.no-addresses {
    text-align: center;
    color: #9C9C9C;
    padding: 16px;
}

.error-message {
    text-align: center;
    color: #ff4444;
    padding: 16px;
}

.loading {
    text-align: center;
    color: #666;
    padding: 16px;
}
</style>