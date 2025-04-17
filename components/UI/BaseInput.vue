<template>
    <div v-if="type === 'search'" class="search input">
        <input type="text" :placeholder :value="modelValue" @input="$emit('update:modelValue', $event.target.value)"
            @keyup.enter="$emit('save')">
        <img loading="lazy" src="~/assets/icons/search.svg" alt="search" @click="$emit('save')" />
    </div>
    <div v-else class="input__wrapper" :class="{ 'error': error }">
        <div v-if="type === 'password'" class="password input">
            <input :type="showPass ? 'text' : 'password'" :placeholder :value="modelValue"
                @input="$emit('update:modelValue', $event.target.value)" autocomplete="new-password"
                @blur="$emit('blur')" @focus="$emit('focus')">
            <img loading="lazy" v-if="!showPass" src="~/assets/icons/eye.svg" alt="show" @click="showPass = !showPass" />
            <img loading="lazy" v-if="showPass" src="~/assets/icons/eye-off.svg" alt="show" @click="showPass = !showPass" width="20px"
                height="20px" />
        </div>
        <div v-if="type === 'text'" class="password input">
            <input type="text" :placeholder :value="modelValue" @input="$emit('update:modelValue', $event.target.value)"
                @blur="$emit('blur')" @focus="$emit('focus')">
        </div>
        <div v-if="type === 'text-editable'" class="password input" :class="{ 'disabled': !edit }">
            <input type="text" :placeholder :value="modelValue" @input="$emit('update:modelValue', $event.target.value)"
                :disabled="!edit">
            <img loading="lazy" v-if="saved" src="~/assets/icons/green-check.svg" alt="checked" :class="saved ? 'save' : ''" />
            <img loading="lazy" v-if="edit" @click="save" src="~/assets/icons/edit-3.svg" alt="edited" />
            <img loading="lazy" v-else-if="!saved" @click="edit = !edit" src="~/assets/icons/edit-2.svg" alt="edit" />
        </div>
        <span class="hint">{{ hint }}</span>
        <span class="error" v-if="error">{{ error }}</span>
    </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
    placeholder?: string;
    type?: string;
    hint?: string;
    modelValue?: string | number;
    error?: string;
}>();

const emit = defineEmits(['update:modelValue', 'save', 'blur', 'focus']);

const edited = ref(false);
const saved = ref(false);
const oldValue = ref(props.modelValue);
const edit = ref(false);
const showPass = ref(false);

watch(props, () => {
    if (oldValue.value !== props.modelValue) {
        edited.value = true;
    } else {
        edited.value = false;
    }
});

function save() {
    edited.value = false;
    saved.value = true;
    edit.value = false;
    emit('save');
    oldValue.value = props.modelValue;

    setTimeout(() => {
        saved.value = false;
    }, 2000);
}
</script>

<style lang="scss" scoped>
.input {
    width: -webkit-fill-available;
    width: -moz-available;
    display: flex;
    border-radius: 6px;

    @media screen and (max-width: 725px) {
        max-width: 100%;
    }

    @media screen and (max-width: 350px) {
        max-width: 75%;
    }

    &__wrapper {
        width: -webkit-fill-available;
        width: -moz-available;
        max-width: 400px;

        @media screen and (max-width: 725px) {
            max-width: 100%;
        }

        @media screen and (max-width: 350px) {
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        &.error>div {
            border: 1px solid red;
        }
    }

    img {
        cursor: pointer;
    }

    input {
        border: none;
        outline: none;
        font-size: 16px;
        width: -webkit-fill-available;
        width: -moz-available;

        @media screen and (max-width: 450px) {
            width: 100%;
            font-size: 13px;
        }

        &::placeholder {
            color: rgba(156, 156, 156, 1);
        }

        &:disabled {
            pointer-events: none;
            background-color: transparent;
        }
    }

    &.disabled {
        background-color: light-dark(rgba(239, 239, 239, 0.3), rgba(59, 59, 59, 0.3));
    }
}

.search {
    background: rgba(244, 244, 244, 1);
    display: flex;
    justify-content: space-between;
    padding: 12px 16px;

    input {
        font-size: 14px;
    }

    @media screen and (max-width: 525px) {
        max-width: 60%;
        padding: 8px;
    }

    input {
        background: rgba(244, 244, 244, 1);
    }
}

.password {
    align-items: center;
    gap: 8px;
    padding: 10px 14px;
    background: white;
    border: 1px solid rgba(156, 156, 156, 1);
    box-shadow: 0px 1px 2px 0px rgba(16, 24, 40, 0.05);
    height: 42px;

    &:focus-within {
        border: 1px solid rgba(255, 199, 0, 1);
    }
}

.hint {
    font-size: 14px;
    line-height: 19.6px;
    color: rgba(156, 156, 156, 1);
}

.error {
    font-size: 14px;
    line-height: 19.6px;
    color: red;
}

.save {
    animation: fade 2s ease-in-out infinite;
}

@keyframes fade {
    0% {
        opacity: 1;
    }

    100% {
        opacity: 0;
    }
}
</style>
