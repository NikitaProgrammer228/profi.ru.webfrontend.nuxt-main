<template>
    <div class="wrapper" v-if="!isCodeInput">
        <h2 v-if="master">Become a performer</h2>
        <h2 v-else>Registration</h2>
        <p style="color: #1C1C1C;">The specialists don't see your number. You will decide for yourself who it will be available
            to.</p>
        <div class="block" v-if="org">
            <p>Enter organization name</p>
            <BaseInput type="text" v-model="performer.orgName" placeholder="Organization name" />
        </div>
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
        <div class="block">
            <p>Repeat the password</p>
            <BaseInput type="password" v-model="repeatPassword" placeholder="Re-enter the password"
                @blur="validateRepeatPassword" @focus="clearError('repeatPassword')"
                :error="errors.repeatPassword.message" />
        </div>
        <div class="block" style="margin-top: -16px;">
            <div id="recaptcha-container"></div>
        </div>
        <div class="block checkbox">
            <BaseCheckbox v-model:checked="agree">
                I give my consent to Ad Placement Services LLC
                to distribute my personal data specified in my ads in the service
            </BaseCheckbox>
        </div>
        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
        <BaseButton style="margin-top: 8px;" @click="sendCode" :disabled="!valid">Get the code</BaseButton>
        <div class="block">
            <p style="margin-bottom: 16px;">Register via:</p>
            <div class="icons">
                <img loading="lazy" src="~/assets/icons/google.svg" alt="google" @click="ByGoogle" />
            </div>
        </div>
    </div>
    <div class="wrapper" v-if="completedReg">
        <div class="block">
            <p>Surname</p>
            <BaseInput type="text" v-model="user.last_name" placeholder="Surname" />
        </div>
        <div class="block">
            <p>Name</p>
            <BaseInput type="text" v-model="user.first_name" placeholder="Name" />
        </div>
        <div class="block">
            <p>City</p>
            <CityInput v-model:city="user.city" placeholder="City" />
        </div>
        <div class="block" v-if="!isGoogle">
            <p>E-mail address</p>
            <BaseInput type="text" v-model="user.email" placeholder="example@yandex.ru" @blur="validateEmail"
            @focus="clearError('email')" :error="errors.email.message" />
        </div>
        <BaseButton style="margin-top: 8px;" @click="complete" :disabled="!validReg">To be completed</BaseButton>
    </div>
    <CodeInputWrapper v-if="isCodeInput && !completedReg" :phone="phone" @sendCode="checkCode" @resendCode="sendCode"
        :error="codeError" />
</template>

<script setup lang="ts">
import BaseButton from '~/components/UI/BaseButton.vue';
import BaseInput from '~/components/UI/BaseInput.vue';
import CodeInputWrapper from '~/components/auth/CodeInputWrapper.vue';
import BaseCheckbox from '../UI/BaseCheckbox.vue';
import { register, loginByGoogle, verifyCode, completeRegistration } from '~/app/api/authApi';
import PhoneInput from '../UI/PhoneInput.vue';
import { getClient } from '~/app/api/clientApi';
import CityInput from '~/components/orders/CityInput.vue';
import type { City } from '~/stores/userStore';
import { useRouter } from 'vue-router';

const props = defineProps({
    master: {
        type: Boolean,
        default: false
    },
    org: {
        type: Boolean,
        default: false
    }
});

const userStore = useUserStore();
const router = useRouter();

const isCodeInput = ref(false);
const completedReg = ref(false);
const phone = ref('');
const digits = ref('');
const password = ref('');
const repeatPassword = ref('');
const agree = ref(false);
const codeError = ref(false);
const errorMessage = ref('');
const isGoogle = ref(false);

let verificationId = '';

const performer = ref({
    orgName: '',
});

interface UserData {
    last_name: string;
    first_name: string;
    city: City | null;
    email: string;
}

const user = ref<UserData>({
    last_name: '',
    first_name: '',
    city: null,
    email: ''
});

const valid = computed(() => {
    return (phone.value.length >= 8) && (password.value.length >= 8) && (password.value === repeatPassword.value) && agree.value
});
const validReg = computed(() => {
    return user.value.last_name &&
        user.value.first_name &&
        user.value.city &&
        typeof user.value.city === 'object' &&
        user.value.city.name &&
        user.value.city.country?.name &&
        user.value.email;
});

async function sendCode() {
    localStorage.clear()
    const res = await register({
        phone_number: digits.value + phone.value,
        password: password.value,
        repeatPassword: repeatPassword.value,
    });

    if (!res.success && typeof res === 'object') {
        if (res.message) {
            errorMessage.value = res.message;
            return;
        }
        errorMessage.value = 'Error. Incorrect phone number or password. Please try again.';
        return;
    }

    verificationId = res;
    isCodeInput.value = res;
}

async function checkCode(code: string) {
    const res = await verifyCode(verificationId, code, password.value);

    if (res) {
        completedReg.value = true;
    } else {
        codeError.value = true;
    }
}

async function ByGoogle() {
    const res = await loginByGoogle();

    if (res) {
        user.value.email = res;

        isGoogle.value = true;
        completedReg.value = true;
        isCodeInput.value = true;
    } else {
        errorMessage.value = 'Error when logging in with Google. Please try again.';
    }
}

function updatePhone(value: { digits: string; phone: number }) {
    digits.value = value.digits;
    phone.value = String(value.phone);
}

const complete = async () => {
    if (!user.value.city || typeof user.value.city === 'string') {
        return;
    }

    try {
        const client = await getClient();
        await completeRegistration({
            last_name: user.value.last_name,
            first_name: user.value.first_name,
            city: user.value.city.name,
            country: user.value.city.country.name,
            email: user.value.email,
            phone_number: client.phone_number,
            phone_code: digits.value,
            phone_country_code: phone.value
        }, client.id);

        router.push('/client/account');
    } catch (error) {
        console.error('Registration error:', error);
        errorMessage.value = 'Registration failed. Please try again.';
    }
};

const errors = reactive({
    phone: {
        isFocused: false,
        message: '',
    },
    password: {
        isFocused: false,
        message: '',
    },
    repeatPassword: {
        isFocused: false,
        message: '',
    },
    email: {
        isFocused: false,
        message: '',
    }
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

const validateRepeatPassword = () => {
    if (errors.repeatPassword.isFocused) {
        if (repeatPassword.value !== password.value) {
            errors.repeatPassword.message = 'Passwords do not match.';
        } else {
            errors.repeatPassword.message = '';
        }
    }
};

const validateEmail = () => {
    if (errors.email.isFocused) {
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!emailPattern.test(user.value.email)) {
            errors.email.message = 'Incorrect email address.';
        } else {
            errors.email.message = '';
        }
    }
};

const clearError = (type: 'phone' | 'password' | 'repeatPassword' | 'email') => {
    errors[type].isFocused = true;
    errors[type].message = '';
};

watch(userStore, () => {
    if (userStore.user?.city && typeof userStore.user.city === 'object') {
        user.value.city = userStore.user.city;
    }
}, { deep: true });
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
            max-width: 400px;
            width: -webkit-fill-available;
            width: -moz-available;
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

        &.checkbox {
            font-size: 14px;
        }
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