<template>
    <BaseBlock :center="false">
        Personal Information
        <div class="personal__block">
            <BaseInput type="text-editable" v-model="name" @save="saveProfile" placeholder="Name" />
            <PhoneInput :value="phone" placeholder="32000243891" @update="updatePhone"
                :hint="'This is a hint text to help user.'" />
            <BaseInput type="text-editable" v-model="surname" @save="saveProfile" placeholder="Surname" />
            <BaseInput type="text-editable" v-model="city" @save="saveProfile" placeholder="City" />
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
import PhoneInput from '~/components/UI/PhoneInput.vue';

const user = useUserStore();

const name = ref('');
const surname = ref('');
const city = ref('');
const email = ref('');
const phone = ref(0);
const digits = ref('');

onMounted(async () => {
    await user.checkAuth();
    if (user.profile) {
        name.value = user.profile.first_name || '';
        surname.value = user.profile.last_name || '';
        city.value = user.profile.city?.name || '';
        email.value = user.profile.email || '';
        if (user.profile.phone_number) {
            phone.value = Number(user.profile.phone_number.split('+7')[1]) || 0;
        }
    }
});

function updatePhone(value: { digits: string; phone: string | number }) {
    digits.value = value.digits;
    phone.value = Number(value.phone);
}

async function saveProfile() {
    const profile = {
        ...user.profile,
        first_name: name.value,
        last_name: surname.value,
        city: typeof user.profile.city === 'string' ? city.value : {
            ...user.profile.city,
            name: city.value
        },
        email: email.value,
        phone_number: user.profile.phone_number?.length ? user.profile.phone_number : undefined,
        avatar: user.profile.avatar?.length ? user.profile.avatar : undefined
    };

    const res = await patchClient(profile as unknown as Profile, user.profile.id);
    user.profile = res as unknown as typeof user.profile;
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
</style>