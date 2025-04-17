<template>
    <BackButton @click="$router.go(-1)" class="back">
        Back to orders</BackButton>
    <BaseBlock :flat="true" :center="false" v-if="!isCategorySelect">
        <div class="master">
            <Avatar :link="catalog.master?.avatar?.image"></Avatar>
            <div class="info_main">
                <div class="header">
                    <div class="stars">
                        <img loading="lazy" src="~/assets/icons/star.svg" alt="star" width="13px" height="15px" />
                        {{ catalog.master?.average_rating_value?.toFixed(1) || '5.00' }}
                    </div>
                    <div class="passport">
                        <img loading="lazy" src="~/assets/icons/verify.svg" alt="verify" />
                        Passport verified
                    </div>
                </div>
                <div class="name">
                    <p @click="navigateTo(`/client/master/${catalog.master?.id}`);">{{ catalog.master?.first_name || 'Master Name' }} {{
                        catalog.master?.last_name || '' }}</p>
                    <span>Samara region • Online 1 day ago</span>
                </div>
            </div>
        </div>
        <div class="form">
            <BaseInput placeholder="Short task name" type="text" style="max-width: 100%;" v-model="order.title" />
            <BaseTextarea placeholder="Tell us about your task" v-model="order.description"></BaseTextarea>
            <div class="offer-input" @click="isCategorySelect = true">
                <div class="input-wrapper">
                    {{ subcategory || 'Select category' }}
                    <img loading="lazy" src="~/assets/icons/arrow-down.svg" alt="arrow-down" />
                </div>
            </div>
            <div class="form-data">
                <CityInput :placeholder="'City'" :value="order.city" @update:city="(city) => order.city = city">
                </CityInput>
                <BaseSelect :list="[{ title: 'At master', value: false, }, { title: 'On my place', value: true, }]"
                    v-model:selected="response.place" placeholder="Place" style="max-width: 100% !important;">
                </BaseSelect>
                <PriceInput :response="response" v-model:price="order.price" />
                <DateSelect placeholder="Deadline"></DateSelect>
                <div class="offer-input-type">
                    <div class="type" v-for="typeOfPrice in ['in_a_hour', 'per_price', 'for_the_service']"
                        :key="typeOfPrice" @click="order.type_price = typeOfPrice"
                        :class="{ 'active': order.type_price === typeOfPrice }">
                        {{ typeOfPrice.split('_').join(' ') }}
                    </div>
                </div>
                <div class="files">
                    <input type="file" accept="image/*" multiple @change="onFileChange" />
                    <span>Files</span>
                    <img loading="lazy" src="~/assets/icons/file.svg" alt="file">
                </div>
            </div>
            <div v-if="response.images.length" class="image-list">
                <div class="image" v-for="(image, index) in response.images" :key="index">
                    <div class="delete" @click="deleteFile(index)">
                        <img loading="lazy" src="~/assets/icons/delete.svg" alt="delete" />
                    </div>
                    <img loading="lazy" :src="image" alt="Uploaded Image" />
                </div>
            </div>
            <div class="form__checkbox">
                <span>Allow other masters to contact you</span>
                <BaseSwitch v-model:active="order.allow_contact" />
            </div>
            <div class="form__button">
                <BaseButton type="base" @click="createOrder" :disabled="!valid">Post an order</BaseButton>
            </div>
        </div>
    </BaseBlock>
    <BaseBlock :center="false" :flat="true" v-else>
        <h2>Service catalog of 12,400 specialists in Togliatti</h2>
        <BaseBlock :center="false" class="categories">
            <template v-for="n in 4">
                <div class="category" v-for="category in categories" @click="selectCategory(category)">
                    {{ category.name }}
                </div>
            </template>
        </BaseBlock>
        <div class="categories rest">
            <template v-for="n in 4">
                <div class="category" v-for="category in categories" @click="selectCategory(category)">
                    {{ category.name }}
                </div>
            </template>
        </div>
    </BaseBlock>

    <BaseModal v-if="orderCreated" @close="isCategorySelect = false">
        Your order has been created
        <BaseButton @click="$router.push('/client/orders/my')">Go to my orders</BaseButton>
    </BaseModal>
</template>

<script setup lang="ts">
import type { Category, Master } from '~/app/api/categoryApi';
import { postOrder } from '~/app/api/orderApi';
import CityInput from '~/components/orders/CityInput.vue';
import PriceInput from '~/components/orders/PriceInput.vue';
import BackButton from '~/components/UI/BackButton.vue';
import BaseBlock from '~/components/UI/BaseBlock.vue';
import BaseButton from '~/components/UI/BaseButton.vue';
import BaseSwitch from '~/components/UI/BaseSwitch.vue';
import BaseInput from '~/components/UI/BaseInput.vue';
import BaseModal from '~/components/UI/BaseModal.vue';
import BaseSelect from '~/components/UI/BaseSelect.vue';
import BaseTextarea from '~/components/UI/BaseTextarea.vue';
import DateSelect from '~/components/UI/DateSelect.vue';
import Avatar from '~/components/shared/Avatar.vue';

definePageMeta({
    middleware: ['auth'],
});

const route = useRoute();
const catalog = useCatalogStore();
const user = useUserStore();

const isCategorySelect = ref(false);
const categories = computed(() => {
    if (catalog.subcategories.length) {
        return catalog.subcategories
    }
    return catalog.categories;
});
const categoryId = ref('');
const subcategory = ref();

const response = reactive({
    currency: 'USD',
    images: [] as File[],
    place: '',
    time: '',
});
const order = reactive({
    title: '',
    description: '',
    type_price: '',
    price: null,
    city: '',
    at_home_client: false,
    client: user.profile.id,
    subcategory: '',
    allow_contact: false,
});
const orderCreated = ref(false);

const valid = computed(() => {
    return order.title && order.description && order.type_price && order.price && order.city && order.subcategory
});

async function createOrder() {
    orderCreated.value = true;
    await postOrder(order);
}

function selectCategory(category: Category) {
    if (!categoryId.value.length) {
        categoryId.value = category.id;
    } else {
        catalog.subcategories = [];
        categoryId.value = '';
        subcategory.value = category.name;
        order.subcategory = category.id;
        isCategorySelect.value = false;
    }

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

watch(() => categoryId.value, async () => {
    if (categoryId.value) {
        await catalog.getAllSubcategories(categoryId.value);
    }
});

onMounted(async () => {
    await catalog.getAllCategories();
    await catalog.getMaster(route.params.id as string);
});
</script>
<style lang="scss" scoped>
.form {
    display: flex;
    flex-direction: column;
    gap: 16px;

    .offer-input {
        display: flex;
        justify-content: space-between;
        width: 100%;
        border: 1px solid rgba(156, 156, 156, 1);
        box-shadow: 0px 1px 2px 0px rgba(16, 24, 40, 0.05);
        border-radius: 6px;
        padding: 11px 14px;
        outline: none;
        cursor: pointer;

        .input-wrapper {
            display: flex;
            justify-content: space-between;
            width: 100%;
            align-items: center;
            user-select: none;
        }
    }

    .offer-input-type {
        display: flex;
        gap: 8px;

        .type {
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            background: rgba(244, 244, 244, 1);
            font-size: 14px;
            font-weight: 500;
            line-height: 14px;
            cursor: pointer;

            @media screen and (max-width: 660px) {
                padding: 14px 0;
                font-size: 12px;
            }

            &.active {
                background: rgba(255, 199, 0, 1);
            }
        }
    }

    .form-data {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;

        @media screen and (max-width: 660px) {
            grid-template-columns: 1fr;
        }

        .files {
            position: relative;
            display: flex;
            justify-content: space-between;
            border-radius: 6px;
            background: #E5E5E5;
            padding: 12px;
            cursor: pointer;
            font-size: 14px;
            line-height: 19.6px;

            &>input {
                opacity: 0;
                position: absolute;
                width: 100%;
                cursor: pointer;
            }
        }
    }

    .form__button {
        display: flex;
    }

    .form__checkbox {
        display: flex;
        justify-content: space-between;
        width: 100%;
    }
}

.master {
    display: flex;
    gap: 24px;
    margin-bottom: 4px;
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

        line-height: 19.6px;
    }
}

.categories {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-gap: 8px;

    @media screen and (max-width: 650px) {
        grid-template-columns: 1fr 1fr 1fr;
    }

    @media screen and (max-width: 450px) {
        grid-template-columns: 1fr 1fr;
    }

    .category {
        padding: 8px 0;
        user-select: none;
        cursor: pointer;

        font-weight: 500;
        font-size: 18px;
        line-height: 25px;
    }

    &.rest {
        padding: 0 24px;
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
}
</style>