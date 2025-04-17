<template>
  <BackButton @click="$router.push('/client/catalog')" class="back">
    Back to orders</BackButton>
  <BaseBlock :center="false" v-if="!isCategorySelect">
    <h2>Select performers without any hassle</h2>
    <div class="form">
      <BaseInput placeholder="Short task name" type="text" style="max-width: 100%;" v-model="order.title" />
      <BaseTextarea placeholder="Tell us about your task" v-model="order.description"></BaseTextarea>
      <div class="offer-input" @click="isCategorySelect = true">
        <div class="input-wrapper">
          {{ subcategory || 'Select category' }}
          <img loading="lazy" src="~/assets/icons/arrow-down.svg" alt="arrow-down" />
        </div>
      </div>
      <CityInput :placeholder="'City'" :value="order.city" @update:city="(city) => order.city = city"></CityInput>
      <PriceInput :response="response" v-model:price="order.price" />
      <div class="offer-input-type">
        <div class="type" v-for="typeOfPrice in ['in_a_hour', 'per_price', 'for_the_service']" :key="typeOfPrice"
          @click="order.type_price = typeOfPrice" :class="{ 'active': order.type_price === typeOfPrice }">
          {{ typeOfPrice.split('_').join(' ') }}
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
      <div class="form-data">
        <DateSelect placeholder="Deadline"></DateSelect>
        <div class="files">
          <input type="file" accept="image/*" multiple @change="onFileChange" />
          <span>Files</span>
          <img loading="lazy" src="~/assets/icons/file.svg" alt="file">
        </div>
        <BaseSelect :list="[{ title: 'At master', value: false, }, { title: 'On my place', value: true, }]"
          v-model:selected="response.place" placeholder="Place" style="max-width: 100% !important;"></BaseSelect>
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
import type { Category } from '~/app/api/categoryApi';
import { getOrder, postOrder, type Order } from '~/app/api/orderApi';
import CityInput from '~/components/orders/CityInput.vue';
import PriceInput from '~/components/orders/PriceInput.vue';
import BackButton from '~/components/UI/BackButton.vue';
import BaseBlock from '~/components/UI/BaseBlock.vue';
import BaseButton from '~/components/UI/BaseButton.vue';
import BaseInput from '~/components/UI/BaseInput.vue';
import BaseModal from '~/components/UI/BaseModal.vue';
import BaseSelect from '~/components/UI/BaseSelect.vue';
import BaseTextarea from '~/components/UI/BaseTextarea.vue';
import DateSelect from '~/components/UI/DateSelect.vue';

definePageMeta({
  middleware: ['auth'],
});

const route = useRoute();
const isCategorySelect = ref(false);
const catalog = useCatalogStore();
const user = useUserStore();

const categories = computed(() => {
  if (catalog.subcategories.subcategories.length) {
    return catalog.subcategories.subcategories;
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
const refferenceOrder = ref<Order | null>(null);
const order = ref({
  title: '',
  description: '',
  type_price: '',
  price: null,
  city: '',
  at_home_client: false,
  client: user.profile.id,
  subcategory: '',
});

// const orderBase = computed(() => {
//   return refferenceOrder || orderBase;
// });


const orderCreated = ref(false);

const valid = computed(() => {
  return order.value.title && order.value.description && order.value.type_price && order.value.price && order.value.city && order.value.subcategory
});

async function createOrder() {
  orderCreated.value = true;
  await postOrder(order.value);
}

function selectCategory(category: Category) {
  if (!categoryId.value.length) {
    categoryId.value = category.id;
  } else {
    catalog.subcategories.subcategories = [];
    categoryId.value = '';
    subcategory.value = category.name;
    order.value.subcategory = category.id;
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
  catalog.subcategories.subcategories = [];
  await catalog.getAllCategories();

  if (route.query.order) {
    refferenceOrder.value = await getOrder(route.query.order as string);
  }
  console.log(refferenceOrder);
});
</script>

<style lang="scss" scoped>
h2 {
  font-size: 26px;
  font-weight: 500;
  line-height: 26px;
  letter-spacing: -0.02em;
}

.back {
  margin-bottom: 24px;
}

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

  .form-data {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;

    .files {
      display: flex;
      justify-content: space-between;
      border-radius: 6px;
      background: #E5E5E5;
      padding: 14px;
      cursor: pointer;
      font-size: 14px;
      line-height: 19.6px;
      position: relative;
    }
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

.files>input {
  opacity: 0;
  position: absolute;
  width: 100%;
  cursor: pointer;
}

.image-list {
  display: flex;
  gap: 8px;
  align-items: center;


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