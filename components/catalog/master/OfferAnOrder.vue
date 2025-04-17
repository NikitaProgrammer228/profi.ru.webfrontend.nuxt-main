<template>
    <BaseModal v-if="!isOffer" @close="$emit('close')">
        <div class="modal__header">
            <p>Suggest your orders</p>
            <img loading="lazy" src="~/assets/icons/black-cross.svg" alt="close" @click="$emit('close')">
        </div>
        <div v-if="filteredOrders.length" class="modal__body">
            <div v-for="order in filteredOrders" class="modal__order" :key="order.id" @click="offer(order.id)">
                <p>{{ order.title }}</p>
                <span>Created {{ useParseTime(order.created) }}</span>
            </div>
        </div>
        <div class="modal__footer">
            <div class="modal__footer-button" @click="$router.push(`/client/orders/personal/${master.id}`)">
                <img loading="lazy" src="~/assets/icons/yellow-plus.svg" alt="plus">
                Or create new
            </div>
        </div>
    </BaseModal>
    <ConfirmOrderModal v-else @select="confirmOrder" :master="master" @cancel="$emit('close')" @close="$emit('close')"/>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import type { Master } from '~/app/api/categoryApi';
import { orderChooseMaster } from '~/app/api/orderApi';
import ConfirmOrderModal from '~/components/orders/modal/ConfirmOrderModal.vue';
import BaseModal from '~/components/UI/BaseModal.vue';

const props = defineProps({
    master: {
        type: Object as PropType<Master>,
        required: true
    }
});

defineEmits(['close']);

const isOffer = ref(false);
const orderId = ref('');

const orders = useOrderStore();

const filteredOrders = computed(() => {
    return orders.activeOrders.filter((order) => {
        return !order.master.id;
    });
})

async function offer(id: string) {
    orderId.value = id;
    isOffer.value = true;
}

async function confirmOrder(data: any) {
    const res = await orderChooseMaster(orderId.value, {
        master_id: props.master.id,
        price: data.price,
        type_price: data.type_price,
        deadline: data.deadline,
    });

    if (res.id) {
        navigateTo(`/client/orders/${res.id}`);
    }
}
</script>

<style lang="scss" scoped>
.modal__header,
.modal__body,
.modal__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 10px;
    border-bottom: 1.5px solid #F4F4F4;
    min-width: 350px;

    @media screen and (max-width: 450px) {
        min-width: 250px;
    }

    p {
        font-size: 16px;
        font-weight: 600;
        line-height: 22.4px;
    }

    span {
        font-size: 14px;
        line-height: 19.6px;
    }

    img {
        cursor: pointer;
    }

    .modal__footer-button {
        display: flex;
        gap: 8px;
        font-size: 16px;
        font-weight: 500;
        line-height: 16px;
        color: #FFC700;
        cursor: pointer;
        user-select: none;
    }
}

.modal__footer {
    border-bottom: none;
}

.modal__body {
    flex-direction: column;
    gap: 10px;
    padding-bottom: 0px;
    border-bottom: none;
}

.modal__order {
    width: 100%;
    cursor: pointer;
    border-bottom: 1.5px solid rgba(244, 244, 244, 1);
    padding-bottom: 10px;
}
</style>