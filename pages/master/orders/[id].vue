<template>
    <div class="wrapper" v-if="!isResponded">
        <h2>Add response</h2>
        <BaseBlock :center="false">
            <BaseTextarea v-model="response.message" placeholder="Your response"></BaseTextarea>
            <div class="offer_block">
                <p>Offer your price</p>
                <span>The price specified by the customer: 500 €</span>
                <div class="offer-input">
                    <div class="input-wrapper">
                        {{ values[response.currency].value }}
                        <input type="number" v-model="response.price_offer" placeholder="Your price">
                    </div>
                    <div class="change-value" @click="show = !show" ref="selectRef">
                        {{ response.currency }}
                        <img loading="lazy" src="~/assets/icons/arrow-down.svg" alt="arrow" />

                        <div class="dropdown" v-if="show">
                            <div class="dropdown__item" v-for="(item, i) in values" :key="i"
                                @click="changeValue(item.title)">
                                {{ item.title }}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="offer-input-type">
                    <div class="type" v-for="typeOfPrice in typesOfPrice" :key="typeOfPrice"
                        @click="response.type_price = typeOfPrice"
                        :class="{ 'active': response.type_price === typeOfPrice }">
                        {{ typeOfPrice.split('_').join(' ') }}
                    </div>
                </div>
                <div class="images">
                    <div v-if="!response.images.length" class="no-images">
                        <input type="file" accept="image/*" multiple @change="onFileChange" />
                        <img loading="lazy" src="~/assets/icons/pin.svg" alt="pin" />
                        Add work examples
                    </div>
                    <div v-else class="image-list">
                        <div class="image" v-for="(image, index) in response.images" :key="index">
                            <div class="delete" @click="deleteFile(index)">
                                <img loading="lazy" src="~/assets/icons/delete.svg" alt="delete" />
                            </div>
                            <img loading="lazy" :src="image" alt="Uploaded Image" />
                        </div>
                        <div class="add-image">
                            <input type="file" accept="image/*" multiple @change="onFileChange" />
                            <img loading="lazy" src="~/assets/icons/plus.svg" alt="plus" />
                        </div>
                    </div>
                </div>
            </div>
            <div class="buttons">
                <BaseButton type="base" :disabled="!isValid" @click="respondToOrder">Respond</BaseButton>
            </div>
        </BaseBlock>
    </div>
    <div class="wrapper" v-else>
        <h2 v-if="type === 'active'">Your active order</h2>
        <h2 v-else-if="type === 'archive'">Your archive order</h2>
        <BackButton class="back" v-else color="black" @click="$router.replace('/master/orders/catalog')"
            style="font-size: 36px;">
            Search for orders</BackButton>
        <MasterOrder v-if="order" :order="order" :type="type" />
        <h3 v-if="type === 'active' || type === 'archive'">You have been chosen as a performer</h3>
        <MasterResponse :response="response" :type="type" />
    </div>
</template>

<script setup lang="ts">
import { getOrder, orderResponseMaster } from '~/app/api/orderApi';
import { postImage, uploadImage } from '~/app/api/photoApi';
import MasterOrder from '~/components/orders/MasterOrder.vue';
import MasterResponse from '~/components/orders/MasterResponse.vue';
import BackButton from '~/components/UI/BackButton.vue';
import BaseBlock from '~/components/UI/BaseBlock.vue';
import BaseButton from '~/components/UI/BaseButton.vue';
import BaseTextarea from '~/components/UI/BaseTextarea.vue';

definePageMeta({
    middleware: ['auth'],
});

const order = ref<any>(null);
const isResponded = ref(false);
const type = ref<any>('viewed');

const response = reactive({
    currency: 'USD',
    type_price: '',
    price_offer: '',
    message: '',
    images: [] as File[],
});

const values = ref({
    'USD': {
        title: 'USD',
        value: '$',
    },
    'EUR': {
        title: 'EUR',
        value: '€',
    },
    'RUB': {
        title: 'RUB',
        value: '₽',
    }
});
const typesOfPrice = ref(['in an hour', 'per piece', 'for the service']);

const selectRef = ref(null);
const show = ref(false);

const isValid = computed(() => {
    return response.type_price && response.price_offer && response.message;
});

function changeValue(value: string) {
    response.currency = value;
}

function onFileChange(event: { target: { files: any; }; }) {
    const files = event.target.files;
    console.log(files, 'files');
    const newImages: File[] = [];

    for (let i = 0; i < files.length; i++) {
        const file = files[i];

        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                newImages.push(e.target.result);
                if (newImages.length === files.length) {
                    response.images = [...response.images, ...newImages];
                }
            };
            reader.readAsDataURL(file);
        }
    }
};

function deleteFile(index: number) {
    response.images.splice(index, 1);
}

async function uploadImages() {
    const form = new FormData();

    for (let i = 0; i < response.images.length; i++) {
        await uploadImage(response.images[i] as any);
        form.append('image', response.images[i]);
    }

    isResponded.value = true;
}

async function respondToOrder() {
    await uploadImages();
    await orderResponseMaster(useRoute().params.id as string, {
        type_price: response.type_price,
        price_offer: response.price_offer,
        message: response.message,
        photos: response.images
    });
}

useClickOutside(selectRef, () => show.value = false);

onMounted(async () => {
    order.value = await getOrder(useRoute().params.id as string);
})
</script>

<style lang="scss" scoped>
.wrapper {
    display: flex;
    flex-direction: column;
    gap: 20px;

    h2 {
        font-size: 36px;
        font-weight: 500;
        line-height: 36px;
    }

    h3 {
        font-size: 18px;
        font-weight: 500;
        line-height: 18px;
        letter-spacing: -0.02em;
    }

    .offer_block {
        display: flex;
        flex-direction: column;
        gap: 6px;

        &>p {
            font-size: 18px;
            font-weight: 500;
            line-height: 18px;
            letter-spacing: -0.02em;
        }

        &>span {
            font-size: 12px;

            line-height: 16.8px;
            color: rgba(156, 156, 156, 1);
        }

        .offer-input {
            display: flex;
            justify-content: space-between;
            width: 100%;
            border: 1px solid rgba(156, 156, 156, 1);
            box-shadow: 0px 1px 2px 0px rgba(16, 24, 40, 0.05);
            border-radius: 10px;
            padding: 11px 14px;
            outline: none;

            input {
                border: none;
                outline: none;
                width: 100%;
                font-size: 16px;

                line-height: 20.8px;
            }

            .change-value {
                user-select: none;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 2px;
                font-size: 12px;

                line-height: 15.6px;
                color: rgba(79, 79, 79, 1);
                position: relative;

                img {
                    width: 16px;
                }

                .dropdown {
                    position: absolute;
                    top: calc(100% + 8px);
                    left: -20%;
                    z-index: 1000;
                    width: 130%;
                    background: white;
                    border-radius: 6px;
                    box-shadow: 4px 4px 8px 4px rgba(43, 33, 0, 0.04);
                    box-shadow: -4px 0px 8px 2px rgba(43, 33, 0, 0.04);
                    padding: 6px;

                    &__item {
                        cursor: pointer;
                        padding: 10px;
                        border-bottom: 1.5px solid rgba(244, 244, 244, 1);
                        margin-bottom: 4px;
                        border-radius: 4px;

                        &:hover {
                            background: rgba(255, 199, 0, 0.1);
                        }

                        &.active {
                            background: rgba(255, 199, 0, 0.1);
                        }
                    }
                }
            }

            .input-wrapper {
                display: flex;
                align-items: center;
                gap: 8px;
                width: 100%;

                input {
                    margin-bottom: -2px;
                }
            }
        }

        .offer-input-type {
            display: flex;
            gap: 8px;

            .type {
                border-radius: 6px;
                padding: 12px 24px;
                background: rgba(244, 244, 244, 1);
                font-size: 14px;
                font-weight: 500;
                line-height: 14px;
                cursor: pointer;

                @media screen and (max-width: 450px) {
                    padding: 8px 12px;
                    font-size: 12px;
                }

                &.active {
                    background: rgba(255, 199, 0, 1);
                }
            }
        }

        .images {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin: 16px 0;
            font-size: 16px;
            font-weight: 500;
            line-height: 16px;
            text-align: center;
            color: rgba(255, 199, 0, 1);

            .no-images {
                display: flex;
                gap: 8px;
                align-items: center;
                position: relative;

                &>input {
                    opacity: 0;
                    position: absolute;
                    width: 100%;
                    cursor: pointer;
                }
            }

            .image-list {
                display: flex;
                gap: 8px;
                align-items: center;
                flex-wrap: wrap;

                img {
                    width: 60px;
                    height: 60px;
                    object-fit: cover;
                    border-radius: 6px;
                }

                .image {
                    position: relative;

                    .delete {
                        position: absolute;
                        top: 4px;
                        right: 4px;
                        display: flex;
                        cursor: pointer;
                        padding: 4px;
                        background: white;
                        border-radius: 100%;

                        img {
                            width: 10px;
                            height: 10px;
                        }
                    }
                }

                .add-image {
                    width: 60px;
                    height: 60px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    border: 1px solid rgba(255, 199, 0, 1);
                    border-radius: 6px;
                    cursor: pointer;
                    position: relative;

                    &>input {
                        opacity: 0;
                        position: absolute;
                        width: 100%;
                        height: 100%;
                        cursor: pointer;
                    }

                    img {
                        width: 24px;
                        height: 24px;
                    }
                }
            }
        }
    }

    .buttons {
        display: flex;
        justify-content: center;
    }
}
</style>