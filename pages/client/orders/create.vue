<template>
  <BackButton @click="$router.push('/client/catalog')" class="back">
    Back to orders</BackButton>
  <BaseBlock :center="false" v-if="!isCategorySelect">
    <h2>Select performers without any hassle</h2>
    <div class="form">
      <div v-if="error" class="error-message">
        {{ error }}
      </div>
      <BaseInput placeholder="Short task name" type="text" style="max-width: 100%;" v-model="order.title" />
      <BaseTextarea placeholder="Tell us about your task" v-model="order.description"></BaseTextarea>
      <div class="offer-input" @click="isCategorySelect = true">
        <div class="input-wrapper">
          {{ subcategory || 'Select category' }}
          <img loading="lazy" src="~/assets/icons/arrow-down.svg" alt="arrow-down" />
        </div>
      </div>
      <AddressInput v-model:value="selectedAddress" placeholder="address"></AddressInput>
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
          <img loading="lazy" :src="getImageUrl(image)" alt="Uploaded Image" />
        </div>
      </div>
      <div class="form-data">
        <DateSelect v-model="response.date" placeholder="Deadline"></DateSelect>
        <div class="files">
          <input
            type="file"
            accept="image/*"
            multiple
            @change="handleFileChange"
          />
          <span>Files</span>
          <img loading="lazy" src="~/assets/icons/file.svg" alt="file">
        </div>
        <BaseSelect :list="[{ title: 'At master', value: false, }, { title: 'On my place', value: true, }]"
          v-model:selected="response.place" placeholder="Place" style="max-width: 100% !important;"></BaseSelect>
        <BaseButton type="base" @click="createOrder" :disabled="!valid">
          {{ isEdit ? 'Save changes' : 'Post an order' }}
        </BaseButton>
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
import { getOrder, postOrder, updateOrder, type Order } from '~/app/api/orderApi';
import { getUserAddresses, type FindAddressModel } from '~/app/api/locationApi';
import { uploadImage } from '~/app/api/photoApi';
import AddressInput from '~/components/orders/AddressInput.vue';
import PriceInput from '~/components/orders/PriceInput.vue';
import BackButton from '~/components/UI/BackButton.vue';
import BaseBlock from '~/components/UI/BaseBlock.vue';
import BaseButton from '~/components/UI/BaseButton.vue';
import BaseInput from '~/components/UI/BaseInput.vue';
import BaseModal from '~/components/UI/BaseModal.vue';
import BaseSelect from '~/components/UI/BaseSelect.vue';
import BaseTextarea from '~/components/UI/BaseTextarea.vue';
import DateSelect from '~/components/UI/DateSelect.vue';
import { useRouter } from 'vue-router';
import { api } from '~/app/api';

definePageMeta({
  middleware: ['auth'],
});

const route = useRoute();
const router = useRouter();
const isCategorySelect = ref(false);
const catalog = useCatalogStore();
const user = useUserStore();

const selectedAddress = ref<FindAddressModel | null>(null);
const categoryId = ref('');
const subcategory = ref();
const orderCreated = ref(false);
const error = ref('');

interface OrderAddress {
  country?: string;
  city?: string;
  street?: string;
  house_number?: string;
  apartment_number?: string;
  postal_code?: string;
  entrance?: string;
  floor?: string;
  intercom?: string;
}

interface ResponseData {
  currency: number;
  images: string[]; // preview URLs
  place: boolean;
  time: string;
  date: string;
}

// Data model for the order form: only store File objects for images
interface OrderData {
  id: string;
  title: string;
  description: string;
  price: number;
  type_price: string;
  at_home_client: boolean;
  remotely: boolean;
  images: File[]; // always File objects
  address: OrderAddress;
  subcategory: string;
  client: string;
  currency: number;
  for_all: boolean;
  city?: string;
}

const response = ref<ResponseData>({
  currency: 1,
  images: [],
  place: false,
  time: '',
  date: ''
});

const refferenceOrder = ref<Order | null>(null);
// Initialize form data, images[] is File list
const order = ref<OrderData>({
  id: '',
  title: '',
  description: '',
  price: 0,
  type_price: '',
  at_home_client: false,
  remotely: false,
  images: [],
  address: {},
  subcategory: '',
  client: '',
  currency: 1,
  for_all: false,
  city: ''
});

// Определяем режим редактирования и повторного создания
const isRepeat = computed(() => Boolean(route.query.repeat));
const isEdit = computed(() => Boolean(route.query.order) && !isRepeat.value);

const categories = computed(() => {
  if (catalog.subcategories.subcategories.length) {
    return catalog.subcategories.subcategories;
  }
  return catalog.categories;
});

const valid = computed(() => {
  return order.value.title && 
         order.value.description && 
         order.value.type_price && 
         order.value.price && 
         selectedAddress.value && 
         order.value.subcategory;
});

const currency = computed(() => response.value.currency);

const createOrder = async () => {
  try {
    const formData = new FormData();
    // Append all File objects (existing and new)
    order.value.images.forEach((file) => formData.append('images', file));

    // 2. Остальные поля
    formData.append('for_all', order.value.for_all.toString());
    formData.append('at_home_client', response.value.place.toString());
    formData.append('remotely', order.value.remotely.toString());
    formData.append('title', order.value.title);
    formData.append('description', order.value.description);
    formData.append('subcategory', order.value.subcategory);
    formData.append('type_price', order.value.type_price);
    formData.append('price', order.value.price.toString());
    formData.append('currency', order.value.currency.toString());

    if (response.value.date) {
      formData.append('deadline', response.value.date);
    }

    // 4. Адрес: всегда отправляем данные адреса, чтобы сервер не сбрасывал поля
    if (response.value.place && selectedAddress.value) {
      formData.append('address', JSON.stringify({
        country: selectedAddress.value.address_dict.country,
        city: selectedAddress.value.address_dict.city,
        street: selectedAddress.value.address_dict.street,
        house_number: selectedAddress.value.address_dict.house_number,
        apartment_number: selectedAddress.value.apartment_number,
        postal_code: selectedAddress.value.postal_code,
      }));
    } else {
      // отправляем пустой объект, если адрес не указан
      formData.append('address', JSON.stringify({}));
    }

    if (isRepeat.value && refferenceOrder.value) {
      // Повтор заказа: сбрасываем archived и возвращаем в поиск исполнителей
      formData.append('archived', 'false');
      formData.append('status', 'search_for_performers');
      await updateOrder(refferenceOrder.value.id, formData);
      router.push('/client/orders/my');
    } else if (isEdit.value && refferenceOrder.value) {
      // Редактирование существующего заказа
      await updateOrder(refferenceOrder.value.id, formData);
      router.push('/client/orders/my');
    } else {
      // Новое создание заказа
      await postOrder(formData);
      orderCreated.value = true;
    }
  } catch (error: any) {
    error.value = 'Ошибка при сохранении заказа. Попробуйте ещё раз.';
    console.error(error);
  }
};

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

/** Handle file input change to append multiple new images */
const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (!input.files) return;
  const files = Array.from(input.files) as File[];
  // Merge new files with existing
  order.value.images.push(...files);
  // Base64 previews
  files.forEach((file) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) response.value.images.push(e.target.result as string);
      };
      reader.readAsDataURL(file);
    }
  });
  input.value = '';
};

function deleteFile(index: number) {
  response.value.images.splice(index, 1);
  order.value.images.splice(index, 1);
}

watch(() => categoryId.value, async () => {
  if (categoryId.value) {
    await catalog.getAllSubcategories(categoryId.value);
  }
});

// Watch for address changes
watch(selectedAddress, (newAddress) => {
  if (newAddress) {
    order.value.city = newAddress.address_dict.city;
  }
});

// Watch for currency changes
watch(() => response.value.currency, (newCurrency) => {
  if (newCurrency !== null) {
    order.value.currency = newCurrency;
  }
});

onMounted(async () => {
  catalog.subcategories.subcategories = [];
  await catalog.getAllCategories();
  if (route.query.order) {
    const id = route.query.order as string;
    const existing = await getOrder(id);
    refferenceOrder.value = existing;
    // Prefill preview URLs
    response.value.images = [...existing.images];
    response.value.currency = existing.currency.id;
    response.value.place = existing.at_home_client;
    response.value.date = existing.deadline || '';
    // Prefetch existing images as File objects
    const existingFiles: File[] = await Promise.all(
      existing.images.map(async (path) => {
        const url = getImageUrl(path);
        const res = await api.get<Blob>(url, { responseType: 'blob' });
        const blob = res.data;
        const name = path.split('/').pop() || 'image';
        return new File([blob], name, { type: blob.type });
      })
    );
    order.value.images = existingFiles;
    // Prefill other fields
    order.value.id = existing.id;
    order.value.title = existing.title;
    order.value.description = existing.description;
    order.value.price = Number(existing.price);
    order.value.type_price = existing.type_price;
    order.value.at_home_client = existing.at_home_client;
    order.value.remotely = existing.remotely;
    order.value.for_all = existing.for_all;
    order.value.city = existing.city?.name;
    order.value.currency = existing.currency.id;
    order.value.subcategory = existing.subcategory.id;
    order.value.client = existing.client.id;
    subcategory.value = existing.subcategory.name;
    selectedAddress.value = {
      id: existing.address.id,
      address_dict: {
        country: existing.address.country || existing.address.city?.country.name || '',
        city: existing.address.city?.name || '',
        street: existing.address.street || '',
        house_number: existing.address.house_number || ''
      },
      apartment_number: existing.address.apartment_number || '',
      postal_code: existing.address.postal_code || '',
      formatted_address: ''
    } as FindAddressModel;
  }
});

/**
 * Build full URL for image preview.
 * If path is relative, prefix with baseURL.
 */
function getImageUrl(path: string): string {
  // Return full HTTP URLs and data URLs unchanged
  if (path.startsWith('http') || path.startsWith('data:')) return path;
  const base = api.defaults.baseURL || '';
  return `${base}${path.startsWith('/') ? '' : '/'}${path}`;
}
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

.error-message {
  background-color: #fde8e8;
  color: #e53e3e;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 16px;
  font-size: 14px;
  border: 1px solid #f8b4b4;
}
</style>