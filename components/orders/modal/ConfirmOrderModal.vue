<script setup lang="ts">
import BaseModal from '~/components/UI/BaseModal.vue';
import BaseButton from '~/components/UI/BaseButton.vue';
import BaseCheckbox from '~/components/UI/BaseCheckbox.vue';
import PriceInput from '~/components/orders/PriceInput.vue';
import Avatar from '~/components/shared/Avatar.vue';
import DateSelect from '~/components/UI/DateSelect.vue';
import type { PropType } from 'vue';
import type { Master } from '~/app/api/categoryApi';

defineProps({
    master: {
        type: Object as PropType<Master>,
        required: true
    }
});

defineEmits(['cancel', 'select']);

const response = ref({
    currency: 1,
    type: '',
    price: '',
    type_price: '',
    deadline: ''
});
</script>

<template>
    <BaseModal>
        <div class="modal__header">
            <p>Choosing a performer</p>
            <img loading="lazy" src="~/assets/icons/black-cross.svg" alt="close" @click="$emit('cancel')">
        </div>
        <div class="modal__body_info">
            <Avatar size="80px" :link="master.avatar?.image"></Avatar>
            <div class="info_main">
                <div class="header">
                    <div class="stars">
                        <img loading="lazy" src="~/assets/icons/star.svg" alt="star" width="13px" height="15px" />
                        {{ master?.average_rating_value?.toFixed(1) || '5.00' }}
                    </div>
                    <div class="passport">
                        <img loading="lazy" src="~/assets/icons/verify.svg" alt="verify" />
                        Passport verified
                    </div>
                </div>
                <div class="name">
                    <p @click="navigateTo(`/client/master/${master?.id}`);">
                        {{ master?.first_name || 'Master Name' }}
                        {{ master?.last_name || '' }}</p>
                    <span>Samara region • Online 1 day ago</span>
                </div>
            </div>
        </div>
        <div class="modal__body_input">
            <p>Sale amount</p>
            <PriceInput :response="response" v-model:price="response.price"></PriceInput>
            <div class="offer-input-type">
                <div class="type" v-for="typeOfPrice in ['in_a_hour', 'per_price', 'for_the_service']"
                    :key="typeOfPrice" @click="response.type_price = typeOfPrice"
                    :class="{ 'active': response.type_price === typeOfPrice }">
                    {{ typeOfPrice.split('_').join(' ') }}
                </div>
            </div>
            <BaseCheckbox>The price is not yet known</BaseCheckbox>
        </div>
        <div class="modal__body_input">
            <p>Deadlines</p>
            <DateSelect v-model="response.deadline" placeholder="Deadline"></DateSelect>
            <BaseCheckbox>The date is not yet known</BaseCheckbox>
        </div>
        <BaseButton @click="$emit('select', response, master.id)">Confirm</BaseButton>
    </BaseModal>
</template>

<style lang="scss" scoped>
.modal__header {
    display: flex;
    justify-content: space-between;
    padding-bottom: 10px;
    border-bottom: 1.5px solid #F4F4F4;
    width: -webkit-fill-available;
    max-width: 500px;
    width: 100%;

    img {
        cursor: pointer;
    }

    &.reason {
        border-bottom: none;
        min-width: 300px;
    }
}

.modal__body_info {
    display: flex;
    gap: 10px;
}

.modal__body_input {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding-bottom: 10px;
    border-bottom: 1.5px solid #F4F4F4;
    align-items: flex-start;

    &>p {
        font-size: 14px;
        font-weight: 500;
        line-height: 16.8px;
        letter-spacing: -0.02em;
        color: #4F4F4F;
    }

    &.reason {
        border-bottom: none;
    }
}

.info_main {
    display: flex;
    flex-direction: column;
    gap: 12px;

    .header {
        display: flex;
        gap: 12px;

        .stars {
            display: flex;
            gap: 4px;
        }
    }

    .name {
        p {
            font-size: 20px;
            font-weight: 500;
            line-height: 24px;
            letter-spacing: -0.02em;
            cursor: pointer;
        }

        span {
            font-size: 12px;

            line-height: 15.6px;
            color: #9C9C9C;
        }
    }

    .description {
        font-size: 14px;

        line-height: 19.6px;
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
</style>