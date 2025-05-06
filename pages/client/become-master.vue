<template>
  <BaseBlock style="padding: 32px; margin-top: 0;">
    <BecomeMaster />
  </BaseBlock>
</template>

<script setup lang="ts">
import BaseBlock from '~/components/UI/BaseBlock.vue';
import BecomeMaster from '~/components/auth/BecomeMaster.vue';

definePageMeta({
  middleware: ['auth'],
});
</script>

<style scoped>
</style> 