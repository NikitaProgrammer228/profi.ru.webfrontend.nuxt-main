<template>
    <BaseBlock class="order" :center="false">
        <div class="order__title">
            <div class="title">
                <h3 @click="redirect(order)">{{ order.title }}</h3>
                <p>${{ Number(order.price) }} {{ priceType }}</p>
            </div>
            <div class="category">
                {{ order.subcategory.category.name }} • {{ order.subcategory.name }}
            </div>
            <div class="status">
                <p>{{ order.archived ? 'Archived' : status }}</p>
                <div class="status__info">
                    <span v-if="!order.archived" style="color: #FFC700;">
                        <svg style="margin-right: 2px;" width="6" height="7" viewBox="0 0 6 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="3" cy="3.5" r="3" fill="#FFC700" />
                        </svg> {{ order.responses_count }} responses</span>
                    <span> <span>
                        •
                    </span> {{ created }}</span>
                </div>
            </div>
        </div>
        <div class="order__info">
            <div class="info">
                <img loading="lazy" src="~/assets/icons/timer.svg" alt="time" />
                {{ deadline }}
            </div>
            <div class="info">
                <img loading="lazy" src="~/assets/icons/location.svg" alt="location" />
                {{ formatAddress(order) }}
            </div>
            <div class="info">
                <img loading="lazy" src="~/assets/icons/price.svg" alt="price" />
                {{ Number(order.price) }} $
            </div>
            <div v-if="order.archived" style="display: flex;">
                <BaseButton type="base" @click="repeatOrder(order.id)">Repeat order</BaseButton>
            </div>
        </div>
    </BaseBlock>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import BaseBlock from '../UI/BaseBlock.vue';
import BaseButton from '../UI/BaseButton.vue';
import { type Order, orderGetResponses, orderGetRecommendedMasters, getOrder } from '~/app/api/orderApi';
import { type City, type Address } from '~/app/api/locationApi';
import { useOrderStore } from '~/stores/orderStore';

const props = defineProps({
    order: {
        type: Object as PropType<Order>,
        required: true
    }
});

const router = useRouter();
const orderStore = useOrderStore();

const status = useParseStatus(props.order.status);
const created = useParseTime(props.order.created);
const deadline = useParseDeadline(props.order.deadline);
const priceType = useParsePriceType(props.order.type_price);

function formatAddress(order: Order): string {
    const parts = [];
    
    // Проверяем и используем поле city из заказа
    if (order.city && typeof order.city === 'object') {
        const cityObj = order.city as unknown as { name: string; country?: { name: string } };
        if (cityObj.country?.name) {
            parts.push(cityObj.country.name);
        }
        if (cityObj.name) {
            parts.push(cityObj.name);
        }
    }
    
    return parts.join(', ') || 'No location';
}

async function redirect(order: Order) {
    orderStore.currentOrder = order;
    orderStore.orderResponses = await orderGetResponses(order.id);
    orderStore.recommendedMasters = await orderGetRecommendedMasters(order.subcategory.id);

    router.push(`/client/orders/${order.id}`);
}

async function repeatOrder(id: string) {
    orderStore.repeatOrder = await getOrder(id);
    router.push('/client/orders/create?order=' + id);
}
</script>

<style lang="scss" scoped>
.order {
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 100%;

    &__title {
        display: flex;
        flex-direction: column;
        gap: 8px;
        border-bottom: 1.5px solid #F4F4F4;
        padding-bottom: 10px;

        .title {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            width: -webkit-fill-available;
            width: -moz-available;

            h3 {
                font-size: 20px;
                font-weight: 500;
                line-height: 24px;
                letter-spacing: -0.02em;
                cursor: pointer;
            }

            p {
                font-size: 20px;
                font-weight: 500;
                line-height: 24px;
                letter-spacing: -0.02em;
            }

            @media screen and (max-width: 550px) {
                flex-direction: column;
                align-items: start;
                gap: 8px;
                
                h3 {
                    font-size: 18px;
                }
                p {
                    font-size: 16px;
                }
            }
        }

        .category {
            font-size: 14px;

            line-height: 19.6px;
            text-align: left;
            color: rgba(156, 156, 156, 1);
        }

        .status {
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 12px;

            @media screen and (max-width: 725px) {
                font-size: 10px;
            }

            .status__info {
                @media screen and (max-width: 650px) {
                    display: flex;
                    flex-direction: column;

                    & > span > span {
                        display: none;
                    }
                }
            }

            p {
                line-height: 16.8px;
                text-align: center;
                color: rgba(225, 172, 0, 1);
                background: rgba(255, 196, 5, 0.2);
                padding: 6px 10px;
                border-radius: 6px;
            }

            span {
                line-height: 15.6px;
                text-align: left;
                color: rgba(156, 156, 156, 1);
            }

            @media screen and (max-width: 650px) {
                font-size: 10px;
            }
        }
    }

    &__description {
        p {
            font-size: 14px;

            line-height: 19.6px;

            .link {
                color: rgba(33, 64, 186, 1);
            }
        }
    }

    &__info {
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin-bottom: 16px;
        font-size: 14px;

        line-height: 19.6px;

        .info {
            display: flex;
            align-items: center;
            gap: 8px;
        }
    }

    &__actions {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;

        .client {
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 8px;
            font-size: 18px;
            font-weight: 500;
            line-height: 25.2px;
            letter-spacing: -0.02em;
        }

        .actions {
            display: flex;
            flex-direction: row;
            gap: 8px;
            align-items: center;
        }
    }
}
</style>