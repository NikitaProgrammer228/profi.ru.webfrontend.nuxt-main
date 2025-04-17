<template>
    <BackButton class="back" v-if="isCode" @click="isCode = false">Back</BackButton>
    <BaseBlock>
        <DoubleButtons :toggle="toggle" @update:toggle="toggle = $event">
            <template #left>
                Registration
            </template>
            <template #right>
                Login
            </template>
        </DoubleButtons>
        <div class="wrapper" v-if="!isCode">
            <h2>Forgot password?</h2>
            <p>Enter your phone number for the password recovery</p>
            <div class="block">
                <p>Phone number</p>
                <PhoneInput :value="phone" placeholder="32000243891" @update="updatePhone"
                :hint="'This is a hint text to help user.'" />
            </div>
            <BaseButton style="margin-top: 8px;" @click="isCode = true" :disabled="phone.length < 9">Recovery</BaseButton>
        </div>
        <div class="wrapper" v-else-if="isNewPassword">
            <h2>Setup New Passowrd</h2>
            <div class="block">
                <p>Please provide a password</p>
                <BaseInput type="password" v-model="password" placeholder="Enter the password" />
            </div>
            <div class="block">
                <p>Repeat the password</p>
                <BaseInput type="password" v-model="repeatPassword" placeholder="Re-enter the password" />
            </div>
            <BaseButton style="margin-top: 8px;" @click="isCode = true">Recovery</BaseButton>
        </div>
        <CodeInputWrapper v-else :phone="phone" @sendCode="setupNewPassword" />
    </BaseBlock>
</template>

<script setup lang="ts">
import CodeInputWrapper from '~/components/auth/CodeInputWrapper.vue';
import BackButton from '~/components/UI/BackButton.vue';
import BaseBlock from '~/components/UI/BaseBlock.vue';
import BaseButton from '~/components/UI/BaseButton.vue';
import BaseInput from '~/components/UI/BaseInput.vue';
import DoubleButtons from '~/components/shared/DoubleButtons.vue';
import PhoneInput from '~/components/UI/PhoneInput.vue';

definePageMeta({
  middleware: ['auth'],
});

const router = useRouter();

const toggle = ref(true);
const isCode = ref(false);
const isNewPassword = ref(false);

const phone = ref('');
const digits = ref('');
const password = ref('');
const repeatPassword = ref('');

function setupNewPassword() {
    isNewPassword.value = true;
}

function updatePhone(value: { digits: string; phone: string }) {
    digits.value = value.digits;
    phone.value = value.phone;
}

watch(toggle, () => {
    router.push('/client/auth');
});
</script>

<style lang="scss" scoped>
.wrapper {
    display: flex;
    flex-direction: column;
    gap: 16px;
    align-items: center;

    h2 {
        font-size: 18px;
        font-weight: 500;
        line-height: 18px;
        letter-spacing: -0.02em;
    }

    p {
        max-width: 400px;
        width: 400px;
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
        }
    }
}
</style>