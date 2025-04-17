<script setup lang="ts">
import BackButton from '~/components/UI/BackButton.vue';
import BaseBlock from '~/components/UI/BaseBlock.vue';
import BaseButton from '~/components/UI/BaseButton.vue';
import BaseCheckbox from '~/components/UI/BaseCheckbox.vue';

definePageMeta({
    middleware: ['auth'],
});

const router = useRouter();
const catalog = useCatalogStore();

const addMenu = ref(false);
const addSpeciality = ref(false);


function redirect() {
    if (addMenu.value) {
        addMenu.value = false;
        return;
    }
    router.go(-1);
}

onMounted(async () => {
    await catalog.getAllCategories();
})
</script>


<template>
    <BaseBlock v-if="addSpeciality" gap="32px" :flat="true" padding="0px" style="margin: 0px;">
        <h2>Choose category</h2>
        <BaseBlock :center="false" class="categories__list">
            <BaseCheckbox>Plumbing</BaseCheckbox>
            <BaseCheckbox>Plumbing</BaseCheckbox>
            <BaseCheckbox>Plumbing</BaseCheckbox>
            <BaseCheckbox>Plumbing</BaseCheckbox>
            <BaseCheckbox>Plumbing</BaseCheckbox>
            <BaseCheckbox>Plumbing</BaseCheckbox>
            <BaseCheckbox>Plumbing</BaseCheckbox>
            <BaseCheckbox>Plumbing</BaseCheckbox>
            <BaseCheckbox>Plumbing</BaseCheckbox>
            <BaseCheckbox>Plumbing</BaseCheckbox>
        </BaseBlock>
        <div class="buttons">
            <BaseButton type="cancel" @click="addSpeciality = false">Back</BaseButton>
            <BaseButton type="base" @click="addSpeciality = false; addMenu = false">Save</BaseButton>
        </div>
    </BaseBlock>
    <BaseBlock v-else-if="!addMenu" gap="32px" :flat="true" padding="0px" style="margin: 0px;">
        <BackButton style="font-size: 18px; width: 100%;" @click="redirect">Back</BackButton>
        <div class="header">
            <h2>Specialties</h2>
            <p>
                Specialties are the categories of services you provide. In each of them we have pre-installed sets of
                popular services; all you have to do is set their prices</p>
        </div>
        <BaseBlock :center="false">
            <div class="speciality">
                <p>Plumbing</p>
                <span>
                    <img loading="lazy" src="~/assets/icons/cross.svg" alt="delete">
                    Lorem ipsum
                </span>
            </div>
            <div class="speciality">
                <p>Plumbing</p>
                <span>
                    <img loading="lazy" src="~/assets/icons/cross.svg" alt="delete">
                    Lorem ipsum
                </span>
            </div>
        </BaseBlock>
        <BaseButton type="base" @click="addMenu = true">
            <img loading="lazy" src="~/assets/icons/black-plus.svg" alt="plus">
            Add specialty
        </BaseButton>
    </BaseBlock>
    <BaseBlock v-else :center="false" :flat="true" padding="0px" style="margin: 0px;">
        <h2>Choose category</h2>
        <BaseBlock :center="false" class="categories" style="margin: 0px;">
            <template v-for="n in 4">
                <div class="category" v-for="category in catalog.categories" @click="addSpeciality = true">
                    {{ category.name }}
                </div>
            </template>
        </BaseBlock>
        <div class="categories rest">
            <template v-for="n in 4">
                <div class="category" v-for="category in catalog.categories" @click="addSpeciality = true">
                    {{ category.name }}
                </div>
            </template>
        </div>
    </BaseBlock>
</template>

<style lang="scss" scoped>
.header {
    display: flex;
    flex-direction: column;
    gap: 10px;
    color: #3D3D3D;

    h2 {
        font-size: 36px;
        font-weight: 500;
        line-height: 36px;
    }

    p {
        line-height: 22.4px;
    }
}

.speciality {
    display: flex;
    flex-direction: column;
    gap: 6px;
    cursor: pointer;
    width: 100%;

    p {
        font-size: 18px;
        font-weight: 500;
        line-height: 18px;
        letter-spacing: -0.02em;
    }

    span {
        display: flex;
        align-items: center;
        gap: 4px;

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

    &__list {
        display: grid;
        grid-template-columns: 1fr 1fr;
        max-width: 600px;
        width: 100%;
    }
}

.buttons {
    display: flex;
    justify-content: center;
    gap: 8px;
}
</style>