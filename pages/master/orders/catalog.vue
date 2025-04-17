<template>
    <BaseBlock :center="false" :flat="true" padding="0px">
        <div class="head">
            <h2>Search for orders</h2>
            <div id="filter-master">
                <img loading="lazy" @click="show = !show" class="filter__img" src="~/assets/icons/filters.svg" alt="filters">
            </div>
        </div>
        <div class="wrapper">
            <div class="orders">
                <MasterOrder v-for="order in orders" :key="order.id" :order="order" :isResponded="false" />
            </div>
            <MasterFilters class="filters__desktop" />
        </div>
    </BaseBlock>
    <BaseModal v-if="show" @close="show = false">
        <div style="display: flex; justify-content: end;">
            <img loading="lazy" style="cursor: pointer;" src="~/assets/icons/black-cross.svg" alt="clsoe" @click="show = false">
        </div>
        <MasterFilters @close="show = false" />
    </BaseModal>
</template>

<script setup lang="ts">
import { getOrders, type Order } from '~/app/api/orderApi';
import { getServices } from '~/app/api/serviceApi';
import MasterFilters from '~/components/orders/MasterFilters.vue';
import MasterOrder from '~/components/orders/MasterOrder.vue';
import BaseBlock from '~/components/UI/BaseBlock.vue';
import BaseModal from '~/components/UI/BaseModal.vue';

definePageMeta({
    middleware: ['auth'],
});

const show = ref(false);
const orders = ref<Order[]>([]);

onMounted(async () => {
    orders.value = await getOrders();
    await getServices();
});
</script>

<style lang="scss" scoped>
h2 {
    font-size: 36px;
    font-weight: 500;
    line-height: 36px;
}

.wrapper {
    display: flex;
    gap: 32px;

    @media screen and (max-width: 875px) {

        .filters__desktop {
            display: none;
        }
    }

}

.head {
    display: flex;
    justify-content: space-between;

    #filter-master {
        display: none;
        align-items: center;
        justify-content: center;
        height: 40px;
        width: 40px;
        box-shadow: 4px 4px 8px 4px #2B21000A;
        box-shadow: -4px 0px 8px 2px #2B21000A;
        background: white;
        border-radius: 6px;
        position: relative;

        @media screen and (max-width: 875px) {
            display: flex;
        }
    }
}

.orders {
    max-width: 564px;
    width: 100%;

}
</style>