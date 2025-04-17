<template>
    <BaseBlock>
        <h2>Invitations</h2>
    </BaseBlock>
</template>

<script setup lang="ts">
import BaseBlock from '~/components/UI/BaseBlock.vue';

definePageMeta({
  middleware: ['auth'],
});
</script>