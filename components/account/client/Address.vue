<template>
    <div class="address">
        <div class="address__header">
            <p>Do you recieve master at home?</p>
            <span>{{ formatAddress }}</span>
        </div>
        <div class="address__actions">
            <div class="address__action" @click="$emit('delete')">
                <img loading="lazy" src="~/assets/icons/cross.svg" alt="delete" />
                Cancel the address
            </div>
            <div class="address__action" @click="$emit('edit')">
                <img loading="lazy" src="~/assets/icons/edit.svg" alt="edit" />
                Edit address
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Address } from '~/app/api/locationApi';

const props = defineProps<{
    address: Address;
}>();

const emit = defineEmits(['delete', 'edit']);

const formatAddress = computed(() => {
    const parts = [];
    if (props.address.street) parts.push(props.address.street);
    if (props.address.house_number) parts.push(props.address.house_number);
    if (props.address.city?.name) parts.push(props.address.city.name);
    if (props.address.city?.country?.name) parts.push(props.address.city.country.name);
    return parts.join(', ');
});
</script>

<style lang="scss" scoped>
.address {
    display: flex;
    flex-direction: column;
    gap: 12px;

    &__header {
        display: flex;
        flex-direction: column;
        gap: 4px;

        p {
            font-size: 16px;
            font-weight: 500;
            line-height: 22.4px;
            letter-spacing: -0.02em;
        }

        span {
            font-size: 14px;
            line-height: 19.6px;
        }
    }

    .address__actions {
            width: -webkit-fill-available;
            width: -moz-available;
            display: flex;
            justify-content: space-between;

            .address__action {
                display: flex;
                flex-direction: row;
                gap: 4px;
                align-items: center;

                font-size: 12px;
                font-weight: 500;
                line-height: 14.4px;
                letter-spacing: -0.02em;
                color: rgba(156, 156, 156, 1);

                cursor: pointer;
                user-select: none;
            }
        }
}
</style>