<template>
    <BaseBlock v-if="!search" :center="false" :flat="true" padding="0px">
        <h2>Service catalog of 12,400 specialists in Togliatti</h2>
        <BaseBlock :center="false" class="categories">
            <template v-for="n in 4">
                <div class="category" v-for="category in catalog.categories"
                    @click="getSub(category.id)">
                    {{ category.name }}
                </div>
            </template>
        </BaseBlock>
        <div class="categories rest">
            <template v-for="n in 4">
                <div class="category" v-for="category in catalog.categories"
                    @click="getSub(category.id)">
                    {{ category.name }}
                </div>
            </template>
        </div>
    </BaseBlock>
    <Masters v-else :masters="masters" @offer="openModal" />
    <OfferAnOrder v-if="modal && master" :master="master" @close="modal = false" />
</template>

<script setup lang="ts">
import { type Master, searchCategories } from '~/app/api/categoryApi';
import OfferAnOrder from '~/components/catalog/master/OfferAnOrder.vue';
import Masters from '~/components/catalog/Masters.vue';
import BaseBlock from '~/components/UI/BaseBlock.vue';
import { useCatalogStore } from '~/stores/catalogStore';

definePageMeta({
  middleware: ['auth'],
});

const catalog = useCatalogStore();
const router = useRouter();
const route = useRoute();
const search = ref('');
const modal = ref(false);
const masters = ref<Master[]>([]);
const master = ref<Master | null>(null);

function openModal(val: Master) {
    master.value = val;
    modal.value = true;
}

async function getSub(id: string) {
    await catalog.getAllSubcategories(id);
    router.push(`/client/catalog/${id}`);
}

watch(route, () => {
    search.value = route.query.search as string;
});

watch(search, async () => {
    masters.value = await searchCategories(search.value);
});

onMounted(async () => {
    if (route.query.search) {
        search.value = route.query.search as string;
    }
    await catalog.getAllCategories();
});
</script>
 
<style lang="scss" scoped>
h2 {
    font-size: 36px;
    font-weight: 500;
    line-height: 36px;
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
</style>