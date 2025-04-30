<template>
    <div class="wrapper">
        <h2>Login</h2>
        <p style="color: #1C1C1C;">The specialists don't see your number. You will decide for yourself who it will be available
            to.</p>
        <div class="block">
            <p>Phone number</p>
            <PhoneInput :phone="phone" placeholder="32000243891" @update="updatePhone" @blur="validatePhone"
                @focus="clearError('phone')" :error="errors.phone.message" />
        </div>
        <div class="block">
            <p>Enter the password</p>
            <BaseInput type="password" v-model="password" placeholder="password" @blur="validatePassword"
                @focus="clearError('password')" :error="errors.password.message" />
        </div>
        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
        <BaseButton @click="loginByNumber" :disabled="!valid">Continue</BaseButton>
        <p class="restore" @click="$router.push('/client/auth/recovery')">Restore password</p>
        <div class="block">
            <p style="margin-bottom: 16px;">Login via:</p>
            <div class="icons">
                <img loading="lazy" src="~/assets/icons/google.svg" alt="google" @click="ByGoogle" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import BaseButton from '~/components/UI/BaseButton.vue';
import BaseInput from '~/components/UI/BaseInput.vue';
import PhoneInput from '../UI/PhoneInput.vue';
import { loginByGoogle, login } from '~/app/api/authApi';
import { useRouter } from 'vue-router';
import { getMasterMe } from '~/app/api/masterApi';
import { useMasterStore } from '~/stores/masterStore';

const props = defineProps({
    master: {
        type: Boolean,
        default: false
    }
});
const router = useRouter();
const masterStore = useMasterStore();

const errorMessage = ref('');

const phone = ref('');
const digits = ref('');
const password = ref('');

const valid = computed(() => {
    return phone.value.length >= 8 && password.value.length >= 6
});

function updatePhone(value: { digits: string; phone: string }) {
    digits.value = value.digits;
    phone.value = String(value.phone);
}

async function handlePostLoginRouting() {
    try {
        const profileData = await getMasterMe();
        masterStore.profile = profileData;
        router.push('/master/account');
    } catch {
        router.push('/client/catalog');
    }
}

async function ByGoogle() {
    const res = await loginByGoogle();

    if (res) {
        await handlePostLoginRouting();
    } else {
        errorMessage.value = 'Error when logging in with Google. Please try again.';
    }
}

async function loginByNumber() {
    const res = await login({
        phone_number: digits.value + phone.value,
        password: password.value
    });

    if (!res.success) {
        if (res.message) {
            errorMessage.value = res.message;
            return;
        }
        errorMessage.value = 'Error. Incorrect phone number or password. Please try again.';
        return
    }
    await handlePostLoginRouting();
}

const errors = reactive({
    phone: {
        isFocused: false,
        message: '',
    },
    password: {
        isFocused: false,
        message: '',
    },
});

const validatePhone = () => {
    if (errors.phone.isFocused) {
        if (phone.value.length < 8) {
            errors.phone.message = 'Phone number must be at least 8 digits.';
        } else {
            errors.phone.message = '';
        }
    }
};

const validatePassword = () => {
    if (errors.password.isFocused) {
        if (password.value.length < 8) {
            errors.password.message = 'Password must be at least 8 characters.';
        } else {
            errors.password.message = '';
        }
    }
};


const clearError = (type: 'phone' | 'password') => {
    errors[type].isFocused = true;
    errors[type].message = '';
};
</script>

<style lang="scss" scoped>
.wrapper {
    display: flex;
    flex-direction: column;
    gap: 16px;
    align-items: center;
    width: -webkit-fill-available;
    width: -moz-available;

    h2 {
        font-size: 18px;
        font-weight: 500;
        line-height: 18px;
        letter-spacing: -0.02em;
        color: #1C1C1C;
    }

    p {
        max-width: 400px;
        font-size: 14px;
        line-height: 19.6px;
        text-align: center;
    }

    .block {
        max-width: 400px;
        width: -webkit-fill-available;
        width: -moz-available;

        p {
            text-align: left;
            margin-bottom: 6px;
            font-size: 14px;
            font-weight: 500;
            line-height: 16.8px;
            letter-spacing: -0.02em;
            color: #4F4F4F;

            @media screen and (max-width: 350px) {
                display: flex;
                flex-direction: column;
                align-items: center;
            }
        }
    }

    .restore {
        font-size: 16px;
        font-weight: 500;
        line-height: 16px;
    }
}

.icons {
    background: rgba(244, 244, 244, 1);
    width: fit-content;
    height: 44px;
    padding: 10px;
    border-radius: 10px;
    cursor: pointer;
    user-select: none;
}

.error {
    color: rgba(240, 68, 56, 1);
}
</style>