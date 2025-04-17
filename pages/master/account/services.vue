<script setup lang="ts">
import PriceInput from '~/components/orders/PriceInput.vue';
import BackButton from '~/components/UI/BackButton.vue';
import BaseBlock from '~/components/UI/BaseBlock.vue';
import BaseButton from '~/components/UI/BaseButton.vue';
import BaseInput from '~/components/UI/BaseInput.vue';
import BaseMultiSelect from '~/components/UI/BaseMultiSelect.vue';
import BaseSelect from '~/components/UI/BaseSelect.vue';
import BaseTextarea from '~/components/UI/BaseTextarea.vue';

const response = ref({
    currency: 'USD',
    type: '',
    price: '',
    type_price: '',
});
</script>

<template>
    <BaseBlock :flat="true" padding="0px" style="margin: 0;">
        <BackButton style="font-size: 18px; width: 100%;" @click="$router.go(-1)">Back</BackButton>
        <h2>Add Services</h2>
        <BaseBlock :center="false" class="service">
            <p>1 service</p>
            <div class="service__details">
                <div>
                    <p>Landing design</p>
                    <p>1000 ₸</p>
                </div>
                <span>Lorem ipsum dolor sit amet consectetur</span>
            </div>
            <div class="service__buttons">
                <p>Delete</p>
                <p>Edit</p>
            </div>
        </BaseBlock>
        <BaseBlock>
            <div class="services__add">
                <div v-for="i in 3" class="services__add-block">
                    <p>Lorem ipsum</p>
                    <img loading="lazy" src="~/assets/icons/black-plus.svg" alt="plus">
                </div>
            </div>
            <BaseButton type="cancel">Add services</BaseButton>
        </BaseBlock>
        <h2>About specialization</h2>
        <BaseBlock>
            <div class="block first">
                <p>Work experience</p>
                <BaseSelect :list="[]" placeholder="Select" style="max-width: 100%;"></BaseSelect>
            </div>
            <div class="block">
                <p>Working days and hours</p>
                <BaseMultiSelect :list="[]" placeholder="Select" style="max-width: 100%;"></BaseMultiSelect>
                <div class="special__offer">
                    <BaseSelect :list="[]" placeholder="From" style="max-width: 100%;"></BaseSelect>
                    <BaseSelect :list="[]" placeholder="To" style="max-width: 100%;"></BaseSelect>
                </div>
            </div>
        </BaseBlock>
        <h2>Special offer</h2>
        <BaseBlock :center="false">
            <div class="special__offer">
                <div class="block">
                    <p>Deadlines</p>
                    <BaseInput type="text" placeholder="7 days" style="max-width: 100%;"></BaseInput>
                </div>
                <div class="block">
                    <p>Amount of discount</p>
                    <PriceInput :response="response" v-model:price="response.price" style="max-width: 100%;" />
                </div>
            </div>
            <div class="block">
                <p>Description</p>
                <BaseTextarea placeholder="Describe your offer"></BaseTextarea>
            </div>
        </BaseBlock>
        <BaseButton type="base">Save</BaseButton>
    </BaseBlock>
</template>

<style scoped lang="scss">
h2 {
    font-size: 36px;
    font-weight: 500;
    line-height: 36px;
    color: #3D3D3D;
    width: 100%;
}

.service {
    p {
        line-height: 22.4px;
        color: #3D3D3D;
    }

    &__details {
        display: flex;
        flex-direction: column;

        &>div {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        span {
            color: #9C9C9C;
            font-size: 15px;
        }
    }

    &__buttons {
        display: flex;
        justify-content: space-between;
        gap: 12px;

        p {
            cursor: pointer;
            font-weight: 500;
            line-height: 16px;
            color: #9C9C9C;
        }
    }
}

.services__add {
    display: flex;
    flex-direction: column;
    width: 100%;

    &-block {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        padding: 10px 0;
        border-bottom: 1.5px solid #F4F4F4;

        img {
            width: 32px;
            height: 32px;
            background: #F4F4F4;
            padding: 4px;
            border-radius: 100%;
            cursor: pointer;
        }
    }
}

.block {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding-bottom: 10px;
    font-size: 14px;
    line-height: 19.6px;

    &.first {
        border-bottom: 1.5px solid #F4F4F4;
    }
}

.special__offer {
    display: flex;
    gap: 6px;

    @media screen and (max-width: 650px) {
        flex-direction: column;
    }
}
</style>