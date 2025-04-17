<template>
    <div class="wide-input">
        <textarea :value="modelValue" :placeholder="placeholder"
            @input="$emit('update:modelValue', $event.target.value)"></textarea>
    </div>
</template>

<script setup lang="ts">
defineProps({
    modelValue: String,
    placeholder: String
});
</script>

<style lang="scss" scoped>
.wide-input {
    width: 100%;

    textarea {
        overflow: hidden;
        overflow-wrap: break-word;
        resize: none;
        min-height: 170px;
        width: 100%;
        border: 1px solid rgba(156, 156, 156, 1);
        box-shadow: 0px 1px 2px 0px rgba(16, 24, 40, 0.05);
        border-radius: 6px;
        padding: 16px 14px;
        outline: none;

        font-size: 16px;
        
        line-height: 22.4px;

        &::placeholder {
            color: rgba(156, 156, 156, 1);
        }
    }
}
</style>