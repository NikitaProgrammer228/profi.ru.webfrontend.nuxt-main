<template>
    <BaseModal>
        <div class="modal__header reason">
            <p>Cancel the order</p>
            <img loading="lazy" src="~/assets/icons/black-cross.svg" alt="close" @click="$emit('cancel')">
        </div>
        <!-- если нет привязанного мастера, показываем простое подтверждение -->
        <template v-if="!masterExists">
            <div class="modal__body_input reason">
                <p>Are you sure you want to cancel this order? It will be moved to the archive.</p>
            </div>
            <BaseButton @click="cancelSimple" type="base">Cancel the Order</BaseButton>
        </template>
        <!-- иначе оставляем выбор причины -->
        <template v-else>
            <div class="modal__body_input reason">
                <p>Is the reason for your order deletion related to the master?</p>
                <DoubleButtons :wide="false" :toggle="toggle" @update:toggle="toggle = $event">
                    <template #left>Yes</template>
                    <template #right>No</template>
                </DoubleButtons>
            </div>
            <div class="modal__body_input reason">
                <p>For what reason do you want to close the order?</p>
                <BaseSelect :list="list" v-model:selected="reason"></BaseSelect>
            </div>
            <BaseButton @click="cancel">Cancel</BaseButton>
        </template>
    </BaseModal>
</template>

<script setup lang="ts">
import { cancelOrder } from '~/app/api/orderApi';
import DoubleButtons from '~/components/shared/DoubleButtons.vue';
import BaseButton from '~/components/UI/BaseButton.vue';
import BaseModal from '~/components/UI/BaseModal.vue';
import BaseSelect from '~/components/UI/BaseSelect.vue';

const props = defineProps({
    reasons: {
        type: Array,
        required: true
    },
    orderId: {
        type: String,
        required: true
    },
    masterExists: {
        type: Boolean,
        default: true
    }
});
const emit = defineEmits(['cancel']);

const toggle = ref(false);
const list = ref([
    {
        value: 1,
        title: 'Reason 1',
    },
    {
        value: 2,
        title: 'Reason 2',
    },
    {
        value: 3,
        title: 'Reason 3',
    },
]);
const reason = ref('');

async function cancel() {
    await cancelOrder(props.orderId, {
        reason: reason.value
    });    
    emit('cancel');
    navigateTo('/client/orders/my');
}

async function cancelSimple() {
    await cancelOrder(props.orderId, {});
    emit('cancel');
    navigateTo('/client/orders/my');
}

onMounted(() => {
    list.value = props.reasons.map((res: any) => {
        return {
            value: res.id,
            title: res.reason
        }
    });
})
</script>

<style lang="scss" scoped>
.modal__header {
    display: flex;
    justify-content: space-between;
    padding-bottom: 10px;
    border-bottom: 1.5px solid #F4F4F4;
    width: -webkit-fill-available;
    min-width: 500px;

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
</style>