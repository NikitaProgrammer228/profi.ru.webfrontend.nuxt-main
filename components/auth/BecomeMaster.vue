<template>
  <!-- Invisible reCAPTCHA container required for phone auth -->
  <div id="recaptcha-container" style="display: none;"></div>
  <div class="become-master-block">
    <!-- Step 1: Request SMS code -->
    <template v-if="step === 0">
      <h2>Become a master</h2>
      <p>We will send a confirmation code to your phone: {{ phoneNumber }}</p>
      <BaseButton :disabled="loading" @click="sendSmsCode">Get Confirmation Code</BaseButton>
      <p v-if="error" class="error">{{ error }}</p>
    </template>

    <!-- Step 2: Enter SMS code -->
    <template v-else-if="step === 1">
      <CodeInputWrapper
        :phone="phoneNumber"
        :digits="phoneCode"
        :error="codeError"
        @sendCode="verifySmsCode"
        @resendCode="sendSmsCode"
      />
      <p v-if="error" class="error">{{ error }}</p>
    </template>

    <!-- No extra data needed for private person, complete automatically after code -->
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '~/stores/userStore';
import { sendCode, verifyCode, becomeMaster, completeRegistration } from '~/app/api/authApi';
import { getMasterMe, getMasterSpecializations } from '~/app/api/masterApi';
import { setToken } from '~/app/api';
import { useMasterStore } from '~/stores/masterStore';
import CodeInputWrapper from '~/components/auth/CodeInputWrapper.vue';
import BaseButton from '~/components/UI/BaseButton.vue';

const router = useRouter();
const userStore = useUserStore();

const phoneNumber = computed(() => userStore.user.phone_number);
const phoneCode = computed(() => userStore.profile.phone_code);
const phoneCountryCode = computed(() => userStore.profile.phone_country_code);

const step = ref(0);
const loading = ref(false);
const error = ref('');
const codeError = ref(false);
const verificationId = ref('');

async function sendSmsCode() {
  loading.value = true;
  error.value = '';
  codeError.value = false;
  try {
    const id = await sendCode(phoneNumber.value, '');
    console.log('sendSmsCode received verificationId:', id);
    if (!id || typeof id !== 'string') {
      throw new Error('Failed to send SMS code');
    }
    verificationId.value = id;
    step.value = 1;
  } catch (e: any) {
    error.value = e.message || 'Error sending SMS code';
  } finally {
    loading.value = false;
  }
}

async function verifySmsCode(code: string) {
  loading.value = true;
  error.value = '';
  codeError.value = false;
  try {
    const ok = await verifyCode(verificationId.value, code);
    if (!ok) {
      codeError.value = true;
      throw new Error('Invalid confirmation code');
    }
    // Private clients don't need extra info; complete upgrade immediately
    await completeUpgrade();
  } catch (e: any) {
    error.value = e.message || 'Error verifying code';
  } finally {
    loading.value = false;
  }
}

async function completeUpgrade() {
  loading.value = true;
  error.value = '';
  try {
    // First, fill required client fields (last_name, first_name, email, city, country, phone codes)
    await completeRegistration(
      {
        last_name: userStore.profile.last_name,
        first_name: userStore.profile.first_name,
        email: userStore.profile.email || '',
        city: typeof userStore.profile.city === 'string' ? '' : userStore.profile.city.name,
        country:
          typeof userStore.profile.city === 'string'
            ? ''
            : (userStore.profile.city as any).country.name,
        phone_code: phoneCode.value,
        phone_country_code: phoneCountryCode.value
      },
      userStore.user.id
    );
    // Now create master
    const result = await becomeMaster({
      is_organization: false,
      phone_number: phoneNumber.value,
      phone_code: phoneCode.value,
      phone_country_code: phoneCountryCode.value
    });
    // Reapply existing auth token (don't override with incorrect value)
    setToken();
    // Refresh master profile
    const masterStore = useMasterStore();
    const profile = await getMasterMe();
    masterStore.profile = profile;
    // Optionally load specializations
    await getMasterSpecializations(profile.id);
    router.push('/master/account');
  } catch (e: any) {
    error.value = e.message || 'Error completing registration';
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.become-master-block {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.block {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.error {
  color: red;
  margin-top: 8px;
}
</style> 