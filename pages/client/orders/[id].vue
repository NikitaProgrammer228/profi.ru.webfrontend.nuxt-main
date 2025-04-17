<template>
    <BackButton class="back" @click="$router.go(-1)">My orders</BackButton>
    <BaseBlock v-if="orderStore.currentOrder?.archived" padding="0" :flat="true" :center="true">
        <h2>The order is completed</h2>
        <Order :order="orderStore.currentOrder" type="completed" />
        <OrderFeedback :order="orderStore.currentOrder" />
    </BaseBlock>
    <BaseBlock v-else-if="orderStore.currentOrder?.status === 'search_for_performers'" padding="0" :flat="true" :center="false">
        <Order v-if="orderStore.currentOrder" :order="orderStore.currentOrder" type="searching" @cancel="cancel"></Order>
        <template v-if="orderStore.orderResponses.length">
            <p class="order__feedback">Feedback from the masters <span>{{ orderStore.orderResponses.length }}</span> </p>
            <Master v-for="response in orderStore.orderResponses" :key="response.id" :response="response" :master="response.master" @offer="offerOrder" type="order" @reject="rejectOrder" />
        </template>
        <template v-else>
            <p class="order__feedback">Recommended masters <span>{{ recommendedMasters.length }}</span> </p>
            <Master v-for="master in recommendedMasters" :key="master.id" :master="master" @offer="offerOrder" type="order" @reject="rejectOrder" />
        </template>
    </BaseBlock>
    <BaseBlock v-else padding="0" :flat="true" :center="false">
        <Order v-if="orderStore.currentOrder" :order="orderStore.currentOrder" type="selected" :master="orderStore.currentOrder.master" @cancel="showCancel = true"></Order>
        <!-- <p class="order__feedback">Selected Master</p>
        <Master v-if="orderStore.currentOrder" :master="orderStore.currentOrder.master" @offer="offerOrder" type="selected" /> -->
    </BaseBlock>

    <ConfirmOrderModal v-if="showOrder" @select="selected = true; showOrder = false" @cancel="showOrder = false" />
    <CancelOrderModal v-if="showCancel && orderStore.currentOrder" @cancel="showCancel = false" :reasons="reject" :order-id="orderStore.currentOrder.id" />
</template>

<script setup lang="ts">
import BackButton from '~/components/UI/BackButton.vue';
import BaseBlock from '~/components/UI/BaseBlock.vue';
import Master from '~/components/catalog/Master.vue';
import CancelOrderModal from '~/components/orders/modal/CancelOrderModal.vue';
import ConfirmOrderModal from '~/components/orders/modal/ConfirmOrderModal.vue';
import Order from '~/components/orders/Order.vue';
import OrderFeedback from '~/components/orders/OrderFeedback.vue';
import { useOrderStore } from '~/stores/orderStore';
import { cancelOrder, getOrder, orderGetReasonCancel, orderGetResponses, orderRejectResponse, type Reason, orderGetRecommendedMasters } from '~/app/api/orderApi';
import { type Master as MasterType } from '~/app/api/categoryApi';
import { getReviewById } from '~/app/api/reviewApi';

const route = useRoute();
const orderStore = useOrderStore();

const showOrder = ref(false);
const showCancel = ref(false);
const selected = ref(false);

const reject = ref<Reason[]>([]);

const recommendedMasters = ref<MasterType[]>([]);

function offerOrder(id: number) {
    showOrder.value = true;
}

async function cancel(id: string) {
    await cancelOrder(id);
}

async function rejectOrder(id: string) {
    await orderRejectResponse(id, orderStore.currentOrder?.id as string); // если саксес то удалить респонс на фронте. либо с бека снова их получать. лучше 2е
}

onMounted(async () => {
    orderStore.currentOrder = await getOrder(route.params.id as string);
    orderStore.orderResponses = await orderGetResponses(route.params.id as string);
    recommendedMasters.value = await orderGetRecommendedMasters(orderStore.currentOrder.subcategory.id);

    if (orderStore.currentOrder.archived) {
        orderStore.currentFeedback = await getReviewById(orderStore.currentOrder.id);
    }

    reject.value = await orderGetReasonCancel();
});
</script>

<style lang="scss" scoped>
h2 {
    font-size: 36px;
    font-weight: 500;
    line-height: 36px;
    color: #3D3D3D;
}

.order__feedback {
    font-size: 26px;
    font-weight: 500;
    line-height: 26px;
    letter-spacing: -0.02em;

    span {
        color: #9C9C9C;
    }
}

.info_main {
    display: flex;
    flex-direction: column;
    gap: 12px;

    .header {
        display: flex;
        gap: 12px;

        .stars {
            display: flex;
            gap: 4px;
        }
    }

    .name {
        p {
            font-size: 20px;
            font-weight: 500;
            line-height: 24px;
            letter-spacing: -0.02em;
            cursor: pointer;
        }

        span {
            font-size: 12px;

            line-height: 15.6px;
            color: #9C9C9C;
        }
    }

    .description {
        font-size: 14px;

        line-height: 19.6px;
    }
}
</style>