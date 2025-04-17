<template>
    <BaseBlock class="order" :center="false">
        <div class="order__title">
            <div class="title">
                <h3>{{ order.title }}</h3>
                <p>${{ Number(order.price) }} {{ priceType }}</p>
            </div>
            <div class="category">
                {{ order.subcategory.category.name }} • {{ order.subcategory.name }}
            </div>
            <div class="status">
                <p>{{ order.archived ? 'Archived' : status }}</p>
                <span class="status__info">
                    <span>Web Designer • {{ order.responses_count }} responses</span>
                    <span><span> •</span> {{ created }}</span>
                </span>
            </div>
        </div>
        <div class="order__description">
            <p>
                {{ order.description }}
            </p>
        </div>
        <div class="order__info">
            <div class="info">
                <img loading="lazy" src="~/assets/icons/timer.svg" alt="time" />
                {{ deadline }}
            </div>
            <div class="info">
                <img loading="lazy" src="~/assets/icons/location.svg" alt="location" />
                {{ `${order.city?.name}, ${order.city?.country?.name}` || order.address || 'No location' }}
            </div>
            <div class="info">
                <img loading="lazy" src="~/assets/icons/price.svg" alt="price" />
                {{ order.price }} $
            </div>
        </div>
        <div class="order__actions">
            <div class="client">
                <Avatar :small="true" class="desktop" />
                {{ clientName }}
            </div>
            <div class="actions" v-if="!type">
                <BaseButton class="mini" type="base" @click="$router.push(`/master/orders/${order.id}`)">Respond</BaseButton>
                <BaseButton class="mini" type="cancel">
                    <img loading="lazy" src="~/assets/icons/black-cross.svg" alt="cross" />
                </BaseButton> 
            </div>
            <div class="actions" v-else>
                <BaseButton type="cancel" @click="$router.push(`/client/chat/${order.id}`)">
                    <div style="display: flex; align-items: center; gap: 8px; justify-content: center;">
                        <img loading="lazy" src="~/assets/icons/chat.svg" alt="chat" />
                        Chat
                    </div>
                </BaseButton>
                <BaseButton type="base" v-if="type == 'active' && !completed">The order is completed</BaseButton>
            </div>
        </div>
    </BaseBlock>
</template>

<script setup lang="ts">
import type { Order } from '~/app/api/orderApi';
import Avatar from '../shared/Avatar.vue';
import BaseBlock from '../UI/BaseBlock.vue';
import BaseButton from '../UI/BaseButton.vue';
import type { PropType } from 'vue';
import { getClientById, type Profile } from '~/app/api/clientApi';

const props = defineProps({
    order: {
        type: Object as PropType<Order>,
        required: true
    },
    type: {
        type: String,
        required: false
    },
    completed: {
        type: Boolean,
        required: false
    }
});

const client = ref<Profile | null>(null);
    const clientName = computed(() => {
    if (props.order.client) {
        return `${props.order.client.first_name} ${props.order.client.last_name.slice(0, 1) || ''}.`;
    }
    return '';
});

const status = useParseStatus(props.order.status);
const created = useParseTime(props.order.created);
const deadline = useParseDeadline(props.order.deadline);
const priceType = useParsePriceType(props.order.type_price);

onMounted(async () => {
    client.value = await getClientById(props.order.client);
});
</script>

<style lang="scss" scoped>
.order {
    display: flex;
    flex-direction: column;
    gap: 16px;

    &__title {
        display: flex;
        flex-direction: column;
        gap: 8px;

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

            .status__info {
                @media screen and (max-width: 650px) {
                    display: flex;
                    flex-direction: column;

                    &>span>span {
                        display: none;
                    }
                }
            }

            @media screen and (max-width: 725px) {
                font-size: 10px;
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

            @media screen and (max-width: 550px) {
                gap: 4px;
                font-size: 16px;
            }
        }

        .actions {
            display: flex;
            flex-direction: row;
            gap: 8px;
            align-items: center;

            .mini {
                min-width: 0px !important;
            }
        }
    }
}
</style>