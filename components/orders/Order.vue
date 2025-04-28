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
        <div v-if="!(type === 'completed')" class="order__description">
            <p>{{ order.description }}
            </p>
        </div>
        <!-- Thumbnails under description -->
        <div v-if="order.images && order.images.length" class="order__images order__images--small">
            <div class="order__image" v-for="(img, idx) in order.images" :key="idx">
                <img loading="lazy" :src="getImageUrl(img)" alt="Attached Image" @click="openImage(getImageUrl(img))" />
            </div>
        </div>
        <div class="order__info" :class="type === 'completed' ? 'border' : ''">
            <div class="info">
                <img loading="lazy" src="~/assets/icons/timer.svg" alt="time" />
                {{ deadline }}
            </div>
            <div class="info">
                <img loading="lazy" src="~/assets/icons/location.svg" alt="location" />
                {{ [
                    order.address.country,
                    order.address.city?.name,
                    order.address.street,
                    order.address.house_number && `house ${order.address.house_number}`,
                    order.address.apartment_number && `apt ${order.address.apartment_number}`,
                    order.address.postal_code && `postal ${order.address.postal_code}`
                ].filter(Boolean).join(', ') }}
            </div>
            <div class="info">
                <img loading="lazy" src="~/assets/icons/price.svg" alt="price" />
                {{ Number(order.price) }} $
            </div>
        </div>
        <div v-if="type === 'searching'" class="order__actions border">
            <div class="actions" @click="$emit('cancel', order.id)">
                <img loading="lazy" src="~/assets/icons/cross.svg" alt="cross" />
                Cancel the order
            </div>
            <div class="actions">
                <img loading="lazy" src="~/assets/icons/edit.svg" alt="edit" />
                Edit order
            </div>
        </div>
        <template v-if="type === 'selected'">
            <div class="modal__body_info border">
                <Avatar size="80px"></Avatar>
                <div class="info_main">
                    <div class="header">
                        <div class="stars">
                            <img loading="lazy" src="~/assets/icons/star.svg" alt="star" width="13px" height="15px" />
                            {{ master?.average_rating_value?.toFixed(1) || '5.00' }}
                        </div>
                        <div class="passport">
                            <img loading="lazy" src="~/assets/icons/verify.svg" alt="verify" />
                            Passport verified
                        </div>
                    </div>
                    <div class="name">
                        <p @click="navigateTo(`/client/master/${master?.id}`);">
                            {{ master?.first_name || 'Master Name' }}
                            {{ master?.last_name || '' }}</p>
                        <span>Samara region • Online 1 day ago</span>
                    </div>
                </div>
            </div>
            <div class="order__actions">
                <div style="display: flex; gap: 8px">
                    <BaseButton type="flat" @click="$emit('cancel')">Cancel the order</BaseButton>
                    <BaseButton type="cancel" @click="$router.push(`/client/chat/${order.id}`)">
                        <img loading="lazy" src="~/assets/icons/chat.svg" alt="chat">
                        Chat
                    </BaseButton>
                </div>
            </div>
        </template>
    </BaseBlock>
    <!-- Modal for full-size image -->
    <BaseModal v-if="selectedImage" @close="selectedImage = null">
        <img :src="selectedImage" alt="Full Image" style="max-width:100%; max-height:80vh; object-fit:contain;" />
    </BaseModal>
</template>

<script setup lang="ts">
import { api } from '~/app/api';
import type { PropType } from 'vue';
import Avatar from '../shared/Avatar.vue';
import BaseBlock from '../UI/BaseBlock.vue';
import BaseButton from '../UI/BaseButton.vue';
import { type Order } from '~/app/api/orderApi';
import { type City, type Address } from '~/app/api/locationApi';
import { ref } from 'vue';
import BaseModal from '../UI/BaseModal.vue';

const props = defineProps({
    type: {
        type: String,
        default: 'searching'
    },
    master: {
        type: Object
    },
    order: {
        type: Object as PropType<Order>,
        required: true
    }
});

defineEmits(['chat', 'cancel']);

const status = useParseStatus(props.order.status as any);
const created = useParseTime(props.order.created || '');
const deadline = useParseDeadline(props.order.deadline || '');
const priceType = useParsePriceType(props.order.type_price as any);

// Reactive variable to hold clicked image URL
const selectedImage = ref<string | null>(null);

function formatAddress(order: any): string {
    const addr = order.address;
    if (!addr) return 'No location';
    const parts: string[] = [];
    // Country
    if (addr.country) parts.push(addr.country);
    // City
    if (addr.city && 'name' in addr.city && addr.city.name) parts.push(addr.city.name);
    // Street and house number
    if (addr.street) parts.push(addr.street);
    if (addr.house_number) parts.push(`house ${addr.house_number}`);
    // Apartment number and postal code
    if (addr.apartment_number) parts.push(`apt ${addr.apartment_number}`);
    if (addr.postal_code) parts.push(`postal ${addr.postal_code}`);
    return parts.join(', ') || 'No location';
}

// Helper to build full image URLs
function getImageUrl(path: string): string {
    if (path.startsWith('http')) return path;
    // Ensure leading slash
    const prefix = api.defaults.baseURL || '';
    return `${prefix}${path.startsWith('/') ? '' : '/'}${path}`;
}

// Function to open modal with full-size image
function openImage(url: string): void {
    selectedImage.value = url;
}
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

            @media screen and (max-width: 725px) {
                font-size: 10px;
            }

            .status__info {
                @media screen and (max-width: 650px) {
                    display: flex;
                    flex-direction: column;

                    &>span>span {
                        display: none;
                    }
                }
            }

            p {
                font-size: 12px;

                line-height: 16.8px;
                text-align: center;
                color: rgba(225, 172, 0, 1);
                background: rgba(255, 196, 5, 0.2);
                padding: 6px 10px;
                border-radius: 6px;
            }

            span {
                font-size: 12px;

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
        // margin-bottom: 16px;
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

        .actions {
            font-size: 14px;
            font-weight: 500;
            line-height: 16.8px;
            letter-spacing: -0.02em;
            cursor: pointer;
            display: flex;
            flex-direction: row;
            gap: 8px;
            align-items: center;
        }
    }
}

.modal__body_info {
    display: flex;
    gap: 10px;

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
}

.border {
    border-top: 1.5px solid #F4F4F4;
    padding-top: 16px;
}

/* Constrain attached images to a static container size */
.order__images {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 16px;
    width: 100%;
}

.order__image {
    width: 100%;
    aspect-ratio: 4 / 3;
    overflow: hidden;
}

.order__image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    cursor: pointer;
}

/* Smaller previews on mobile */
@media screen and (max-width: 550px) {
    .order__images {
        grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
        gap: 8px;
    }
    .order__image {
        aspect-ratio: 1 / 1;
    }
}

/* Smaller thumbnails variant */
.order__images--small {
    display: grid;
    grid-template-columns: repeat(auto-fit, 80px);
    grid-auto-rows: 80px;
    gap: 8px;
    margin-top: 8px;
}

/* Ensure each thumbnail cell is square */
.order__images--small .order__image {
    width: 80px;
    height: 80px;
}
</style>