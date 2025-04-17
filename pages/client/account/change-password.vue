<template>
    <BackButton style="font-size: 18px; padding: 12px 0;" @click="$router.go(-1)">Profile settings</BackButton>
    <BaseBlock>
        <h2>Change password</h2>
        <BaseInput type="password" placeholder="Type your old password" v-model="oldPassword" />
        <BaseInput type="password" placeholder="Type new password" v-model="newPassword" />
        <BaseInput type="password" placeholder="Confirm password" v-model="repeatPassword" />
        <p v-if="errorMessage" class="error">{{ errorMessage }}</p> <p v-if="successMessage">{{ successMessage }}</p>
        <BaseButton :disabled="!valid" @click="changePassword">Save password</BaseButton>
    </BaseBlock>
</template>

<script setup lang="ts">
import { updatePassword } from '~/app/api/authApi';
import BackButton from '~/components/UI/BackButton.vue';
import BaseBlock from '~/components/UI/BaseBlock.vue';
import BaseButton from '~/components/UI/BaseButton.vue';
import BaseInput from '~/components/UI/BaseInput.vue';

definePageMeta({
  middleware: ['auth'],
});

const oldPassword = ref('');
const newPassword = ref('');
const repeatPassword = ref('');
const errorMessage = ref('');
const successMessage = ref('');

const valid = computed(() => {
    errorMessage.value = '';
    successMessage.value = '';

    return (oldPassword.value.length >= 6) && (newPassword.value.length >= 6) && (repeatPassword.value.length >= 6) && (newPassword.value === repeatPassword.value);
});

async function changePassword() {
    const res = await updatePassword(oldPassword.value, newPassword.value, repeatPassword.value);

    if (res.status === 200) {
        successMessage.value = res.data.detail;
    }

    if (!res.success) {
        errorMessage.value = res.message;
        return;
    }
}
</script>

<style scoped>
h2 {
    font-size: 36px;
    font-weight: 500;
    line-height: 36px;
    text-align: center;
}

.error {
    font-size: 14px;
    line-height: 19.6px;
    color: red;
}
</style>