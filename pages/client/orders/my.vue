<template>
    <BaseBlock :flat="true" padding="0px" v-if="!toggle && orderStore.activeOrders.length" class="orders">
        <div class="header">
            <h2>My orders</h2>
            <div class="buttons__desk">
                <DoubleButtons :wide="true" :toggle="toggle" @update:toggle="toggle = $event">
                    <template #left>
                        Current
                    </template>
                    <template #right>
                        Archive
                    </template>
                </DoubleButtons>
            </div>
            <div class="buttons__mobile">
                <DoubleButtons :wide="false" :toggle="toggle" @update:toggle="toggle = $event">
                    <template #left>
                        Current
                    </template>
                    <template #right>
                        Archive
                    </template>
                </DoubleButtons>
            </div>
        </div>
        <ClientOrder v-for="order in orderStore.activeOrders" :key="order.id" :order="order"></ClientOrder>
        <div>
            <BaseButton type="base" @click="$router.push('/client/orders/create')">Create an order</BaseButton>
        </div>
    </BaseBlock>
    <BaseBlock padding="0px" :flat="true" v-else-if="toggle && orderStore.archiveOrders.length" class="orders">
        <div class="header">
            <h2>My orders</h2>
            <div class="buttons__desk">
                <DoubleButtons :wide="true" :toggle="toggle" @update:toggle="toggle = $event">
                    <template #left>
                        Current
                    </template>
                    <template #right>
                        Archive
                    </template>
                </DoubleButtons>
            </div>
            <div class="buttons__mobile">
                <DoubleButtons :wide="false" :toggle="toggle" @update:toggle="toggle = $event">
                    <template #left>
                        Current
                    </template>
                    <template #right>
                        Archive
                    </template>
                </DoubleButtons>
            </div>
        </div>
        <ClientOrder v-for="order in orderStore.archiveOrders" :key="order.id" :order="order" :acrhive="true">
        </ClientOrder>
        <div>
            <BaseButton type="base" @click="$router.push('/client/orders/create')">Create an order</BaseButton>
        </div>
    </BaseBlock>
    <BaseBlock :flat="true" v-else padding="0px">
        <div class="buttons__desk">
            <DoubleButtons :wide="true" :toggle="toggle" @update:toggle="toggle = $event">
                <template #left>
                    Current
                </template>
                <template #right>
                    Archive
                </template>
            </DoubleButtons>
        </div>
        <div class="buttons__mobile">
            <DoubleButtons :wide="false" :toggle="toggle" @update:toggle="toggle = $event">
                <template #left>
                    Current
                </template>
                <template #right>
                    Archive
                </template>
            </DoubleButtons>
        </div>
        <h2>You don't have any orders yet</h2>
        <div class="info__blocks">
            <div class="info__block" v-for="block, index in blocks">
                <div class="number">
                    {{ index + 1 }}
                </div>
                <div class="info__title">
                    {{ block.title }}
                </div>
                <div class="info__text">
                    {{ block.text }}
                </div>
            </div>
        </div>
        <BaseButton @click="$router.push('/client/orders/create')">Create an order</BaseButton>
    </BaseBlock>
</template>

<script setup lang="ts">
import BaseBlock from '~/components/UI/BaseBlock.vue';
import BaseButton from '~/components/UI/BaseButton.vue';
import ClientOrder from '~/components/orders/ClientOrder.vue';
import DoubleButtons from '~/components/shared/DoubleButtons.vue';
import { useOrderStore } from '~/stores/orderStore';

definePageMeta({
    middleware: ['auth'],
});

const orderStore = useOrderStore();

const toggle = ref(false);

const blocks = ref([
    {
        title: 'Place your order',
        text: 'Describe the task. If necessary, specify the time frame and budget.',
    },
    {
        title: 'Get offers',
        text: 'The performers themselves will respond to your order. Discuss order details via chat or phone.'
    },
    {
        title: 'Select artist',
        text: 'Agree on the final cost and timing.'
    }
]);

onMounted(async () => {
    orderStore.getClientOrders();
});
</script>

<style lang="scss" scoped>
h2 {
    font-size: 36px;
    font-weight: 500;
    line-height: 36px;
    text-align: center;
}

.info__blocks {
    display: flex;
    flex-direction: row;
    width: -webkit-fill-available;
    width: -moz-available;
    justify-content: space-between;

    @media screen and (max-width: 870px) {
        flex-direction: column;
        align-items: center;
        gap: 20px;
    }

    @media screen and (max-width: 550px) {
        flex-direction: column;
        align-items: start;
        gap: 20px;

        .info__block {
            width: 100%;
            max-width: 100% !important;
        }
    }

    .info__block {
        display: flex;
        flex-direction: column;
        gap: 8px;
        background: #F8F8F8;
        border-radius: 24px;
        max-width: 250px;
        height: 220px;
        padding: 24px 32px 24px 24px;

        .info__title {
            font-size: 20px;
            font-weight: 500;
            line-height: 24px;
            letter-spacing: -0.02em;
        }

        .info__text {
            font-size: 16px;

            line-height: 22.4px;
        }

        .number {
            width: 40px;
            height: 40px;
            background: #FFC405;
            border-radius: 8px;
            font-size: 18px;
            font-weight: 500;
            line-height: 25.2px;
            letter-spacing: -0.02em;

            display: flex;
            align-items: center;
            justify-content: center;
        }
    }
}

.orders {
    .header {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;


        h2 {
            font-size: 36px;
            font-weight: 500;
            line-height: 36px;
        }
    }
}

.buttons__mobile {
    display: none;

    @media screen and (max-width: 650px) {
        display: flex;
    }
}

.buttons__desk {
    @media screen and (max-width: 650px) {
        display: none;
    }
}
</style>