<template>
    <div class="wrapper">
        <p>We sent an SMS with a 6-digit confirmation code to the number {{ hiddenNumber }}</p>
        <CodeInput @sendCode="canSendCode" :error="error"/>
        <BaseButton style="margin-top: 8px;" type="base" :disabled="!canSend" @click="emit('sendCode', codeValue)">Send
        </BaseButton>
        <p v-if="canResendInterval < 60" class="send__again">Send the code again adter <span>00:{{ 60 - canResendInterval }}</span></p>
        <p v-if="canResendInterval >= 60" @click="resendCode" class="send__again active">Send the code again</p>
    </div>
</template>

<script setup lang="ts">
import BaseButton from '~/components/UI/BaseButton.vue';
import CodeInput from '~/components/UI/CodeInput.vue';

const emit = defineEmits(['sendCode', 'resendCode']);
const props = defineProps({
    phone: {
        type: String,
        default: ''
    },
    digits: {
        type: String,
        default: ''
    },
    error: {
        type: Boolean,
        default: false
    }
});

const canSend = ref(false);
const canResendInterval = ref(0);
const codeValue = ref('');

const hiddenNumber = computed(() => {
    return props.digits + props.phone.replace(/(\d{8})(\d{2})/, '*********-$2');
})

function canSendCode(code: string) {
    canSend.value = code.length === 6;
    codeValue.value = code;
}

function resendCode() {
    canResendInterval.value = 0;
    canSend.value = false;
    emit('resendCode', codeValue.value);
}

onMounted(() => {
    setInterval(() => {
        canResendInterval.value += 1;
    }, 1000);
})
</script>

<style lang="scss" scoped>
.wrapper {
    display: flex;
    flex-direction: column;
    gap: 16px;
    align-items: center;

    p {
        max-width: 400px;
        font-size: 14px;
        line-height: 19.6px;
        text-align: center;
    }

    .send__again {
        font-size: 14px;
        font-weight: 500;
        line-height: 14px;
        color: rgba(156, 156, 156, 1);

        &.active {
            cursor: pointer;
            color: rgba(255, 175, 5, 1);
        }

        span {
            color: rgba(255, 175, 5, 1);
        }
    }
}
</style>