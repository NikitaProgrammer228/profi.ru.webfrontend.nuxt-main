<template>
    <div class="code-input" :class="{ 'error': error }">
        <div class="code-input__wrapper">
            <input placeholder="0" maxlength="1" @keydown="nextField">
        </div>
        <div class="code-input__wrapper">
            <input placeholder="0" maxlength="1" @keydown="nextField">
        </div>
        <div class="code-input__wrapper">
            <input placeholder="0" maxlength="1" @keydown="nextField">
        </div>
        <div class="code-input__wrapper">
            <input placeholder="0" maxlength="1" @keydown="nextField">
        </div>
        <div class="code-input__wrapper">
            <input placeholder="0" maxlength="1" @keydown="nextField">
        </div>
        <div class="code-input__wrapper">
            <input placeholder="0" maxlength="1" @keydown="nextField">
        </div>
    </div>
</template>

<script lang="ts" setup>
const emit = defineEmits(['sendCode']);
defineProps({
    error: {
        type: Boolean,
        default: false
    }
});

const code = ref('');

function nextField(event: any) {
    event.preventDefault();
    
    if (event.key === 'Backspace') {
        event.target.value = '';
        code.value = code.value.slice(0, -1);
        if (event.target.parentElement.previousElementSibling.lastChild) {
            event.target.parentElement.previousElementSibling.lastChild.focus();
        }
    } else {
        if (event.key >= 0 && event.key <= 9) {
            event.target.value = event.key;

            if (code.value.length < 6) {
                code.value += event.key;
            } else {
                code.value = code.value.slice(0, -1) + event.key;
            }

            if (event.target.parentElement.nextElementSibling) {
                event.target.parentElement.nextElementSibling.lastChild.focus();
            }
        }
    }
}

watch(code, () => {
    emit('sendCode', code.value);
});
</script>

<style lang="scss" scoped>
.code-input {
    display: flex;
    flex-direction: row;
    gap: 16px;

    &.error {
        .code-input__wrapper {
            border: 1.5px solid rgba(240, 68, 56, 1);
        }
    }

    &__wrapper {
        width: 50px;
        height: 50px;
        border: 1.5px solid rgba(255, 199, 0, 1);
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 10px;
        input {
            outline: none;
            border: none;
            caret-color: rgba(255, 199, 0, 1);
            width: 10px;
            font-size: 17px;
            line-height: 25.2px;
        }
    }
}
</style>