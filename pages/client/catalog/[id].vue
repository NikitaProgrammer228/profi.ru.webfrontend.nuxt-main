<template>
    <BaseBlock :center="false" :flat="true" padding="0px">
        <div class="head">
            <BackButton @click="redirect">
                {{ category }} <template v-if="sub.name">
                    • {{ sub.name }}
                </template>
            </BackButton>
            <div v-show="sub.name" id="filter"></div>
        </div>
        <template v-if="!$route.params.subId">
            <BaseBlock :center="false" class="categories">
                <template v-for="n in 4">
                    <div class="category" v-for="category in catalog.subcategories.subcategories"
                        @click="searchMasters(category)">
                        {{ category.name }}
                    </div>
                </template>
            </BaseBlock>
            <div class="categories rest">
                <template v-for="n in 4">
                    <div class="category" v-for="category in catalog.subcategories.subcategories"
                        @click="searchMasters(category)">
                        {{ category.name }}
                    </div>
                </template>
            </div>
        </template>
        <template v-else>
            <div class="masters__list">
                <Masters @offer="openModal" />
                <MastersFilters />
            </div>
        </template>
    </BaseBlock>
    <OfferAnOrder v-if="modal && master" :master="master" @close="modal = false" />
</template>

<script setup lang="ts">
import BaseBlock from '~/components/UI/BaseBlock.vue';
import { type Category, type Master } from '~/app/api/categoryApi';
import BackButton from '~/components/UI/BackButton.vue';
import Masters from '~/components/catalog/Masters.vue';
import MastersFilters from '~/components/catalog/MastersFilters.vue';
import OfferAnOrder from '~/components/catalog/master/OfferAnOrder.vue';
import { getMyOrders } from '~/app/api/orderApi';

definePageMeta({
    middleware: ['auth'],
});

const route = useRoute();

const modal = ref(false);
const catalog = useCatalogStore();
const orders = useOrderStore();

const category = ref<string | undefined>('');
const id = ref<string | undefined>('');

const subId = ref<string | undefined>('');
const sub = computed(() => {
    if (subId.value) {
        return catalog.subcategories.subcategories.find((c) => c.id === subId.value);
    }
    return {
        name: '',
    };
});

const master = ref<Master | null>(null);

watch(route, async () => {
    if (route.params.subId) {
        subId.value = route.params.subId as string;
        await catalog.getMasters(route.params.id as string, route.params.subId as string);
    }
});

function searchMasters(sub: Category) {
    navigateTo(`/client/catalog/${id.value}/sub/${sub.id}`);
}

function redirect() {
    if (subId.value) {
        subId.value = undefined;
        navigateTo(`/client/catalog/${id.value}`);
        return;
    }
    navigateTo(`/client/catalog`);
}

function openModal(val: Master) {
    master.value = val;
    modal.value = true;
}

onMounted(async () => {
    await catalog.getAllCategories();

    const categoryRoute = catalog.categories.find((c) => c.id === route.params.id);
    id.value = categoryRoute?.id;
    category.value = categoryRoute?.name;
    await catalog.getAllSubcategories(route.params.id as string);

    if (route.params.subId) {
        subId.value = route.params.subId as string;
        await catalog.getMasters(route.params.id as string, route.params.subId as string);
    }

    orders.activeOrders = await getMyOrders();
});
</script>

<style lang="scss" scoped>
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

.masters__list {
    display: flex;
    gap: 32px;
}

.head {
    display: flex;
    justify-content: space-between;

    #filter {
        display: none;
        align-items: center;
        justify-content: center;
        min-width: 40px;
        min-height: 40px;
        height: 40px;
        width: 40px;
        box-shadow: 4px 4px 8px 4px #2B21000A;
        box-shadow: -4px 0px 8px 2px #2B21000A;
        background: white;
        border-radius: 6px;
        position: relative;

        @media screen and (max-width: 875px) {
            display: flex;
        }
    }
}
</style>