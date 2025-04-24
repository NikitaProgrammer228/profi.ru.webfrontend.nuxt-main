<template>
    <div class="address">
        <div class="address__header">
            <p>Do you receive masters at home?</p>
            <span>{{ formatAddress }}</span>
        </div>
        <div class="address__actions">
            <div class="address__action" @click="$emit('delete')">
                <img loading="lazy" src="~/assets/icons/cross.svg" alt="delete" />
                delete_address
            </div>
            <div class="address__action" @click="$emit('edit')">
                <img loading="lazy" src="~/assets/icons/edit.svg" alt="edit" />
                Edit Addresses
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
    
    // Сначала страна и город
    if (props.address.city?.country?.name) parts.push(props.address.city.country.name);
    if (props.address.city?.name) parts.push(props.address.city.name);
    
    // Затем улица
    if (props.address.street) parts.push(props.address.street);
    
    // Номер квартиры и дома
    if (props.address.apartment_number) parts.push(`apartment ${props.address.apartment_number}`);
    if (props.address.house_number) parts.push(`house ${props.address.house_number}`);
    
    // Почтовый индекс
    if (props.address.postal_code) parts.push(`postal ${props.address.postal_code}`);
    
    return parts.join(', ');
});
</script>

<style lang="scss" scoped>
.address {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 16px;
    background: #FFFFFF;
    border: 1px solid #EAECF0;
    border-radius: 8px;

    &__header {
        display: flex;
        flex-direction: column;
        gap: 4px;

        p {
            font-size: 16px;
            font-weight: 500;
            line-height: 22.4px;
            letter-spacing: -0.02em;
            color: #1C1C1C;
        }

        span {
            font-size: 14px;
            line-height: 19.6px;
            color: #676767;
        }
    }

    .address__actions {
        width: -webkit-fill-available;
        width: -moz-available;
        display: flex;
        justify-content: space-between;
        margin-top: 8px;

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

            &:hover {
                color: #1C1C1C;
            }

            img {
                width: 16px;
                height: 16px;
            }
        }
    }
}
</style>