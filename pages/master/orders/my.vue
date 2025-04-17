<template>
    <BaseBlock :flat="true">
        <div class="buttons__desk">
            <DoubleButtons :wide="true" :toggle="toggle" @update:toggle="toggle = $event">
                <template #left>
                    Current
                </template>
                <template #right>
                    Archive
                </template>
            </DoubleButtons>
        </div>
        <div class="buttons__mobile">
            <DoubleButtons :wide="false" :toggle="toggle" @update:toggle="toggle = $event">
                <template #left>
                    Current
                </template>
                <template #right>
                    Archive
                </template>
            </DoubleButtons>
        </div>
        <h2>No one has chosen you as a performer yet</h2>
        <div class="info__block">
            To receive orders, go to the “Orders” section, select the advertisement you are interested in and contact
            the
            customer to discuss the conditions
        </div>
        <BaseButton @click="$router.push('/master/orders/catalog')">Find order</BaseButton>
    </BaseBlock>
</template>

<script setup lang="ts">
import BaseBlock from '~/components/UI/BaseBlock.vue';
import BaseButton from '~/components/UI/BaseButton.vue';
import DoubleButtons from '~/components/shared/DoubleButtons.vue';

definePageMeta({
    middleware: ['auth'],
});

const toggle = ref(false);
</script>

<style lang="scss" scoped>
h2 {
    font-size: 36px;
    font-weight: 500;
    line-height: 36px;
    text-align: center;
}

.info__block {
    width: -webkit-fill-available;
    width: -moz-available;
    text-align: center;
}

.buttons__mobile {
    display: none;

    @media screen and (max-width: 650px) {
        display: flex;
    }
}

.buttons__desk {
    @media screen and (max-width: 650px) {
        display: none;
    }
}
</style>