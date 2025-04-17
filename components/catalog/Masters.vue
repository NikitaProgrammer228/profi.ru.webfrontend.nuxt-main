<template>
    <div class="masters" v-if="catalog.masters.length" v-cloak>
        <MasterBlock v-for="master in catalog.masters" :key="master.id" :master="master" @offer="$emit('offer', master.id)" />
        <BaseBlock :center="false">
            <h3>{{ catalog.count }} performers</h3>
            <p>Describe the task an the performers will respond to it themselves</p>
            <BaseButton @click="$router.push('/client/orders/create')" style="align-self: center;">Create an order</BaseButton>
        </BaseBlock>
        <Pagination :count="catalog.count" :next="catalog.next" :previous="catalog.previous" @next="catalog.getMastersByQuery" />
    </div>
    <div class="masters no-masters" v-else>
        <BaseBlock>
            <p>No masters found</p>
        </BaseBlock>
    </div>
</template>

<script setup lang="ts">
import BaseBlock from '~/components/UI/BaseBlock.vue';
import MasterBlock from './Master.vue';
import BaseButton from '~/components/UI/BaseButton.vue';
import Pagination from '~/components/shared/Pagination.vue';

defineEmits(['offer']);

const catalog = useCatalogStore();
</script>

<style lang="scss" scoped>
.masters {
    display: flex;
    flex-direction: column;
    width: 100%;
    min-width: 527px;

    @media screen and (max-width: 875px) {
        min-width: 0;
    }
}

.no-masters {
    width: 100%;
    p {
        font-size: 20px;
        font-weight: 500;
        line-height: 24px;
        letter-spacing: -0.02em;
    }
}

[v-cloak] {
    display: none;
}
</style>