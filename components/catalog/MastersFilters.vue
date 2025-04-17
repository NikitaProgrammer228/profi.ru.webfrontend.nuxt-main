<template>
    <div class="filters">
        <div class="filter">
            <div class="filter_catalog__wrapper">
                <div class="filter_catalog" v-for="cat in catalog.categories">
                    <p :class="{ selected: cat.id === $route.params.id }" @click="loadCategories(cat.id)">{{ cat.name }}
                    </p>
                    <div class="subcategories" v-if="cat.id === $route.params.id">
                        <div class="subcategory" v-for="sub in catalog.subcategories.subcategories">
                            <p :class="{ selected: sub.id === $route.params.subId }"
                                @click="$router.push(`/client/catalog/${cat.id}/sub/${sub.id}`)">{{ sub.name }}</p>
                        </div>
                    </div>
                    <div class="subcategories" v-else-if="cat.id === nextCategory">
                        <div class="subcategory" v-for="sub in localCategories">
                            <p :class="{ selected: sub.id === $route.params.subId }"
                                @click="$router.push(`/client/catalog/${cat.id}/sub/${sub.id}`)">{{ sub.name }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="filter checkboxes">
            <BaseCheckbox>With guarantee</BaseCheckbox>
            <div class="block">
                <p>Accommodation on site</p>
                <BaseCheckbox>Yes</BaseCheckbox>
                <BaseCheckbox>No</BaseCheckbox>
            </div>
            <BaseCheckbox>Work under contract</BaseCheckbox>
            <BaseCheckbox>Brigade</BaseCheckbox>
            <BaseCheckbox>With examples</BaseCheckbox>
            <div class="block">
                <p>Performer type</p>
                <BaseCheckbox v-model:checked="filters.is_person">Private person</BaseCheckbox>
                <BaseCheckbox v-model:checked="filters.is_organization">Organization</BaseCheckbox>
            </div>
            <div class="block">
                <p>Place</p>
                <BaseInput v-model="place" type="text" placeholder="City, region or metro" />
            </div>
            <BaseCheckbox v-model:checked="filters.is_verify">With a verified passport</BaseCheckbox>
            <BaseCheckbox v-model:checked="filters.has_special_offer">Discounts and promotions</BaseCheckbox>
            <BaseCheckbox v-model:checked="filters.is_available_now">Working now</BaseCheckbox>
        </div>
        <div class="filter_buttons">
            <BaseButton type="base" @click="applyFilters">Apply</BaseButton>
            <BaseButton type="cancel" @click="resetFilters">Reset</BaseButton>
        </div>
    </div>
    <BaseModal v-if="show" @close="show = false">
        <div style="display: flex; justify-content: end;">
            <img loading="lazy" style="cursor: pointer;" src="~/assets/icons/black-cross.svg" alt="clsoe" @click="show = false">
        </div>
        <div class="filters mobile">
            <div class="filter checkboxes">
                <BaseCheckbox>With guarantee</BaseCheckbox>
                <div class="block">
                    <p>Accommodation on site</p>
                    <BaseCheckbox>Yes</BaseCheckbox>
                    <BaseCheckbox>No</BaseCheckbox>
                </div>
                <BaseCheckbox>Work under contract</BaseCheckbox>
                <BaseCheckbox>Brigade</BaseCheckbox>
                <BaseCheckbox>With examples</BaseCheckbox>
                <div class="block">
                    <p>Performer type</p>
                    <BaseCheckbox>Private person</BaseCheckbox>
                    <BaseCheckbox>Organization</BaseCheckbox>
                </div>
                <div class="block">
                    <p>Place</p>
                    <BaseInput v-model="place" type="text" placeholder="City, region or metro" />
                </div>
                <BaseCheckbox>With a verified passport</BaseCheckbox>
                <BaseCheckbox>Discounts and promotions</BaseCheckbox>
                <BaseCheckbox>Working now</BaseCheckbox>
            </div>
            <div class="filter">
                <div class="filter_catalog__wrapper">
                    <div class="filter_catalog" v-for="cat in catalog.categories">
                        <p :class="{ selected: cat.id === $route.params.id }" @click="loadCategories(cat.id)">{{
                            cat.name }}
                        </p>
                        <div class="subcategories" v-if="cat.id === $route.params.id">
                            <div class="subcategory" v-for="sub in catalog.subcategories">
                                <p :class="{ selected: sub.id === $route.params.subId }"
                                    @click="$router.push(`/client/catalog/${cat.id}/sub/${sub.id}`)">{{ sub.name
                                    }}
                                </p>
                            </div>
                        </div>
                        <div class="subcategories" v-else-if="cat.id === nextCategory">
                            <div class="subcategory" v-for="sub in localCategories">
                                <p :class="{ selected: sub.id === $route.params.subId }"
                                    @click="$router.push(`/client/catalog/${cat.id}/sub/${sub.id}`)">{{ sub.name
                                    }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="filter_buttons">
                    <BaseButton type="base" @click="show = false">Apply</BaseButton>
                    <BaseButton type="cancel" @click="show = false">Reset</BaseButton>
                </div>
            </div>
        </div>
    </BaseModal>

    <Teleport defer to="#filter">
        <img loading="lazy" @click="show = !show" class="filter__img" src="~/assets/icons/filters.svg" alt="filters">
    </Teleport>
</template>

<script setup lang="ts">
import { type Category, getSubcategories } from '~/app/api/categoryApi';
import BaseButton from '../UI/BaseButton.vue';
import BaseCheckbox from '../UI/BaseCheckbox.vue';
import BaseInput from '../UI/BaseInput.vue';
import BaseModal from '../UI/BaseModal.vue';

const router = useRouter();

const catalog = useCatalogStore();

const show = ref(false);
const place = ref('');
const filters = reactive({
    is_organization: false,
    is_person: false,
    my_place: false,
    performer_place: false,
    is_verify: false,
    is_available_now: false,
    has_special_offer: false,
})

const nextCategory = ref<string | undefined>(undefined);
const localCategories = ref<Category[]>([]);

async function loadCategories(id: string) {
    const res = await getSubcategories(id);
    nextCategory.value = id;

    localCategories.value = res.subcategories;
}

function applyFilters() {
    let res = [];

    for (const key in filters) {
        if (filters[key]) {
            res.push(key);
        }
    }
    router.push(`${router.currentRoute.value.fullPath}?${res.join('=true&')}=true`);
}

function resetFilters() {
    
}
</script>

<style lang="scss" scoped>
.filters {
    width: -webkit-fill-available;
    width: -moz-available;
    display: flex;
    flex-direction: column;
    gap: 32px;

    @media screen and (max-width: 875px) {
        &:not(.mobile) {
            display: none;
        }
    }

    &.mobile {
        flex-direction: row;

        .filter {
            gap: 20px;
            justify-content: space-between;
        }

        @media screen and (max-width: 625px) {
            flex-direction: column;
            gap: 20px;
        }
    }

    .filter {
        display: flex;
        flex-direction: column;

        &.checkboxes {
            gap: 24px;

            .block {
                display: flex;
                flex-direction: column;
                gap: 16px;

                p {
                    font-size: 16px;
                    font-weight: 500;
                    line-height: 22.4px;
                    letter-spacing: -0.02em;
                }
            }
        }
    }

    .filter_buttons {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .filter_catalog__wrapper {
        display: flex;
        flex-direction: column;
        gap: 16px;

        p {
            cursor: pointer;

            &.selected {
                font-weight: 600;
            }
        }
    }

    .filter_catalog {
        display: flex;
        flex-direction: column;
        gap: 16px;

        .subcategories {
            padding-left: 20px;
            display: flex;
            flex-direction: column;
            gap: 12px;
        }
    }
}

.filter__img {
    cursor: pointer;
}
</style>