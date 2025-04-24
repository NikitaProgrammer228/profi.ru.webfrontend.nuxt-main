<template>
    <BaseBlock :center="false">
        Personal Information
        <div class="personal__block">
            <BaseInput type="text-editable" v-model="name" @save="saveProfile" placeholder="Name" />
            <div class="phone-input-wrapper">
                <div class="phone-display">
                    <img :src="`https://flagcdn.com/w20/ru.png`" alt="RU" class="flag" />
                    <span>{{ formatPhoneNumber(user.profile?.phone_number) }}</span>
                </div>
            </div>
            <BaseInput type="text-editable" v-model="surname" @save="saveProfile" placeholder="Surname" />
            <div class="city-input-wrapper">
                <CityInput v-model:city="selectedCity" placeholder="City" @update:city="onCityChange" />
            </div>
            <BaseInput type="text-editable" v-model="email" @save="saveProfile" placeholder="Email" />
            <ChangePassword @click="$router.push('/client/account/change-password')" />
        </div>
    </BaseBlock>
</template>

<script setup lang="ts">
import { patchClient, type Profile } from '~/app/api/clientApi';
import ChangePassword from '~/components/account/client/ChangePassword.vue';
import BaseBlock from '~/components/UI/BaseBlock.vue';
import BaseInput from '~/components/UI/BaseInput.vue';
import CityInput from '~/components/orders/CityInput.vue';
import type { City } from '~/stores/userStore';

const user = useUserStore();

const name = ref('');
const surname = ref('');
const selectedCity = ref<City | null>(null);
const email = ref('');

function formatPhoneNumber(phoneNumber?: string) {
    if (!phoneNumber) return '';
    return phoneNumber;
}

onMounted(async () => {
    await user.checkAuth();
    if (user.profile) {
        name.value = user.profile.first_name || '';
        surname.value = user.profile.last_name || '';
        selectedCity.value = typeof user.profile.city === 'string' ? null : user.profile.city;
        email.value = user.profile.email || '';
    }
});

async function onCityChange(city: City) {
    selectedCity.value = city;
    await saveProfile();
}

async function saveProfile() {
    const profile = {
        ...user.profile,
        first_name: name.value,
        last_name: surname.value,
        city: selectedCity.value?.name || '',
        country: selectedCity.value?.country?.name || '',
        email: email.value,
        phone_number: user.profile.phone_number,
        avatar: user.profile.avatar?.length ? user.profile.avatar : undefined
    };

    try {
        const res = await patchClient(profile as unknown as Profile, user.profile.id);
        if (res) {
            user.profile = res as unknown as typeof user.profile;
            selectedCity.value = typeof res.city === 'string' ? null : res.city as City;
        }
    } catch (error) {
        console.error('Error updating profile:', error);
    }
}
</script>

<style lang="scss" scoped>
.personal__block {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;

    @media screen and (max-width: 725px) {
        grid-template-columns: 1fr;
    }
}

.city-input-wrapper {
    :deep(.input) {
        border: 1px solid rgba(156, 156, 156, 1);
        box-shadow: 0px 1px 2px 0px rgba(16, 24, 40, 0.05);
        
        &:hover {
            border-color: rgba(255, 199, 0, 1);
        }
    }
}

.phone-input-wrapper {
    .phone-display {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 10px 14px;
        background: white;
        border: 1px solid rgba(156, 156, 156, 1);
        box-shadow: 0px 1px 2px 0px rgba(16, 24, 40, 0.05);
        border-radius: 6px;
        height: 42px;
        
        .flag {
            width: 20px;
            height: 15px;
            border-radius: 2px;
        }
        
        span {
            font-size: 16px;
            color: #1C1C1C;
        }
    }
}
</style>