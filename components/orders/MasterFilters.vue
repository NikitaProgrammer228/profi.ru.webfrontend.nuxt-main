<script setup lang="ts">
import BaseButton from '../UI/BaseButton.vue';
import BaseCheckbox from '../UI/BaseCheckbox.vue';
import BaseInput from '../UI/BaseInput.vue';
import BaseMultiSelect from '../UI/BaseMultiSelect.vue';

defineEmits(['close']);

interface Option {
    title: string;
    value: string;
}

const place = ref('');
const selected = ref<Option[]>([]);

const list = ref<Option[]>([
    {
        title: 'Category 1',
        value: '1'
    },
    {
        title: 'Category 2',
        value: '2'
    },
    {
        title: 'Category 3',
        value: '3'
    },
    {
        title: 'Category 4',
        value: '4'
    },
]);

const recieve = ref({
    byEmail: false,
    byMobile: false,
});
const orders = ref({
    any: false,
    noMore10: false,
    noMore20: false,
    noResponses: false,
});
const territory = ref({
    atMaster: false,
    atCustomer: false,
    remotely: false,
});

function removeCategory(category: Option) {
    const index = selected.value.indexOf(category);
    if (index > -1) {
        selected.value.splice(index, 1);
    }
}

function reset() {
    place.value = '';
    selected.value = [];
    recieve.value = {
        byEmail: false,
        byMobile: false,
    };
    orders.value = {
        any: false,
        noMore10: false,
        noMore20: false,
        noResponses: false,
    };
    territory.value = {
        atMaster: false,
        atCustomer: false,
        remotely: false,
    };
}
</script>

<template>
    <div class="filters">
        <div class="filter">
            <p>You receive notifications</p>
            <BaseCheckbox v-model:checked="recieve.byEmail">By email</BaseCheckbox>
            <BaseCheckbox v-model:checked="recieve.byMobile">Mobile notifications</BaseCheckbox>
        </div>
        <div class="filter">
            <p>Show me your orders</p>
            <BaseCheckbox v-model:checked="orders.any">Any</BaseCheckbox>
            <BaseCheckbox v-model:checked="orders.noMore10">No more than 10 responses</BaseCheckbox>
            <BaseCheckbox v-model:checked="orders.noMore20">No more than 20 responses</BaseCheckbox>
            <BaseCheckbox v-model:checked="orders.noResponses">No responses</BaseCheckbox>
        </div>
        <div class="filter">
            <p>Territory of service provision</p>
            <BaseCheckbox v-model:checked="territory.atMaster">I have</BaseCheckbox>
            <BaseCheckbox v-model:checked="territory.atCustomer">At the customer's</BaseCheckbox>
            <BaseCheckbox v-model:checked="territory.remotely">Remotely</BaseCheckbox>
        </div>
        <div class="filter">
            <p>Place</p>
            <BaseInput v-model="place" type="text" placeholder="City, region or metro" />
        </div>
        <div class="filter">
            <p>Category</p>
            <BaseMultiSelect :list="list" v-model:selected="selected"></BaseMultiSelect>
            <div class="selected">
                <div class="category" v-for="category in selected">
                    <img loading="lazy" src="~/assets/icons/cross.svg" alt="cross" @click="removeCategory(category)" />
                    {{ category.title }}
                </div>
            </div>
        </div>
        <div class="filter buttons">
            <BaseButton type="base" @click="$emit('close')">Apply</BaseButton>
            <BaseButton type="cancel" @click="reset; $emit('close');">Reset</BaseButton>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.filters {
    display: flex;
    flex-direction: column;
    gap: 24px;
    max-width: 430px;

    .filter {
        display: flex;
        flex-direction: column;
        gap: 16px;

        p {
            font-size: 16px;
            font-weight: 500;
            line-height: 22.4px;
            letter-spacing: -0.02em;
        }

        &.buttons {
            flex-direction: row;
            justify-content: space-between;
        }

        .selected {
            user-select: none;
            display: flex;
            flex-direction: row;
            gap: 8px;
            flex-wrap: wrap;

            .category {
                display: flex;
                gap: 4px;
                align-items: center;

                img {
                    cursor: pointer;
                }
            }
        }
    }
}
</style>