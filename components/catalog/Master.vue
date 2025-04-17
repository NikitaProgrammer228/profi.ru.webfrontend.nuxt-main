<template>
    <BaseBlock class="master" :center="false">
        <Avatar class="desktop" :link="master.avatar?.image"></Avatar>
        <div class="master_info">
            <div class="info">
                <Avatar class="mobile" :link="master.avatar?.image"></Avatar>
                <div class="info_main">
                    <div class="header">
                        <div class="stars">
                            <img loading="lazy" src="~/assets/icons/star.svg" alt="star" width="13px" height="15px" />
                            {{ master.average_rating_value?.toFixed(1) || '5.00' }}
                        </div>
                        <div class="passport">
                            <img loading="lazy" src="~/assets/icons/verify.svg" alt="verify" />
                            {{ master.is_verify ? 'Passport verified' : 'Passport not verified' }}
                        </div>
                    </div>
                    <div class="name">
                        <p @click="navigateTo(`/client/master/${master.id}`);">{{ master.first_name || 'Master Name' }}
                            {{ master.last_name || '' }}</p>
                        <span>Samara region • Online 1 day ago</span>
                    </div>
                    <div class="description">
                        {{ master.description || 'Description of the master' }}
                    </div>
                </div>
                <div class="specializations desktop">
                    <div class="specialization">
                        <p>Tow truck for passenger cars</p>
                        <div></div>
                        <span>from $40 / km</span>
                    </div>
                    <div class="specialization">
                        <p>Tow truck for jeep</p>
                        <div></div>
                        <span>from $40 / km</span>
                    </div>
                    <div class="specialization">
                        <p>1 more service...</p>
                    </div>
                </div>
            </div>
            <div class="specializations mobile">
                <div class="specialization">
                    <p>Tow truck for passenger cars</p>
                    <div></div>
                    <span>from $40 / km</span>
                </div>
                <div class="specialization">
                    <p>Tow truck for jeep</p>
                    <div></div>
                    <span>from $40 / km</span>
                </div>
                <div class="specialization">
                    <p>1 more service...</p>
                </div>
            </div>
            <div class="buttons" v-if="type === 'order'">
                <BaseButton type="cancel" @click="$emit('reject', response?.id)">Reject</BaseButton>
                <BaseButton type="base" @click="$emit('offer', master.id)">Accept</BaseButton>
            </div>
            <div class="buttons" v-else-if="type !== 'selected'">
                <BaseButton type="cancel" @click="$router.push(`/client/chat/${master.id}`)">
                    <img loading="lazy" src="~/assets/icons/chat.svg" alt="chat">
                    Chat
                </BaseButton>
                <BaseButton type="base" @click="$emit('offer', master.id)">Offer an order</BaseButton>
            </div>
        </div>
    </BaseBlock>
</template>


<script setup lang="ts">
import { type Master } from '~/app/api/categoryApi';
import Avatar from '../shared/Avatar.vue';
import BaseBlock from '../UI/BaseBlock.vue';
import BaseButton from '../UI/BaseButton.vue';

const orderStore = useOrderStore();

const props = defineProps({
    response: {
        type: Object,
        required: false
    },
    master: {
        type: Object as () => Master,
        required: true
    },
    type: {
        type: String,
        required: false
    }
});

defineEmits(['offer', 'reject']);

watch(orderStore, () => {
    if (!orderStore.orderResponses.length) return;
    orderStore.currentResponse = orderStore.orderResponses.find(response => response.master.id === props.master.id) || null;
}, { deep: true });

onMounted(() => {
    if (!orderStore.orderResponses.length) return;
    orderStore.currentResponse = orderStore.orderResponses.find(response => response.master.id === props.master.id) || null;
});
</script>

<style lang="scss" scoped>
.master {
    display: flex;
    gap: 24px;
    flex-direction: row;
    align-items: start;
    

    &_info {
        display: flex;
        flex-direction: column;
        gap: 32px;
        width: 100%;

        .info {
            display: flex;
            flex-direction: column;
            gap: 16px;

            @media screen and (max-width: 875px) {
                flex-direction: row;
            }

            .info_main {
                display: flex;
                flex-direction: column;
                gap: 12px;

                .header {
                    display: flex;
                    gap: 12px;
                    font-size: 12px;

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
                    white-space: normal;
                    line-height: 19.6px;
                }
            }
        }

        .buttons {
            width: 100%;
            display: flex;
            gap: 8px;
            justify-content: flex-end;
        }
    }
}

.specializations {
    display: flex;
    flex-direction: column;
    gap: 16px;

    .specialization {
        display: flex;
        align-items: baseline;
        gap: 8px;
        font-size: 12px;
        font-weight: 500;
        line-height: 14.4px;
        letter-spacing: -0.02em;
        white-space: nowrap;

        span {
            color: #9C9C9C;
        }

        div {
            height: 1px;
            width: 100%;
            border-bottom: 1px solid #E6E6E6;
        }
    }
}

.desktop {
    @media screen and (max-width: 875px) {
        display: none !important;
    }
}

.mobile {
    @media screen and (min-width: 875px) {
        display: none !important;
    }
}
</style>