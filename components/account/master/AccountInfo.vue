<template>
  <!-- Master Profile Avatar Upload/Deletion -->
  <BaseBlock :center="false" class="profile" :loading="loadingUpload || loading">
    <!-- Hidden file input -->
    <input type="file" accept="image/*" ref="fileInput" style="display: none;" @change="onFileChange" />
    <!-- Avatar display -->
    <Avatar class="avatar" :link="profile.avatar?.image || ''" />
    <div class="info">
      <div v-if="profile.first_name" class="info__block">
        <p>{{ profile.first_name }} {{ profile.last_name }}</p>
      </div>
      <div class="avatar__actions">
        <div class="avatar__action" @click="deleteAvatar">
          <img loading="lazy" src="~/assets/icons/cross.svg" alt="delete" />
          <span v-if="!deletingAvatar">Delete photo</span>
          <span v-else>Deleting...</span>
        </div>
        <div class="avatar__action" @click="triggerFileInput">
          <img loading="lazy" src="~/assets/icons/edit.svg" alt="edit" />
          Edit photo
        </div>
      </div>
    </div>
  </BaseBlock>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import BaseBlock from '~/components/UI/BaseBlock.vue';
import Avatar from '~/components/shared/Avatar.vue';
import { uploadImage, deleteImage } from '~/app/api/photoApi';
import { patchMaster } from '~/app/api/masterApi';
import { useMasterStore } from '~/stores/masterStore';

// Accept optional user prop or fallback to store
const props = defineProps({
  user: { type: Object as any, default: null }
});
const masterStore = useMasterStore();
const profile = ref(props.user || masterStore.profile);
const avatarId = ref<string | null>(profile.value.avatar?.id || null);
const loadingUpload = ref(false);
const loading = ref(false);
const deletingAvatar = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);

// Trigger hidden file input
function triggerFileInput() {
  fileInput.value?.click();
}

// Handle file selection and upload
async function onFileChange(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;
  loadingUpload.value = true;
  try {
    const { id: imageId, image: imageUrl } = await uploadImage(file);
    loading.value = true;
    await patchMaster(profile.value.id, { avatar: imageId });
    avatarId.value = imageId;
    const newAvatar = { id: imageId, image: imageUrl };
    masterStore.profile.avatar = newAvatar;
    profile.value.avatar = newAvatar;
  } catch (err) {
    console.error('Master avatar upload failed', err);
  } finally {
    loadingUpload.value = false;
    loading.value = false;
  }
}

// Handle avatar deletion
async function deleteAvatar() {
  if (!avatarId.value) return;
  deletingAvatar.value = true;
  try {
    await deleteImage(avatarId.value);
    await patchMaster(profile.value.id, { avatar: null });
    avatarId.value = null;
    masterStore.profile.avatar = null;
    profile.value.avatar = null;
  } catch (err) {
    console.error('Avatar deletion failed', err);
  } finally {
    deletingAvatar.value = false;
  }
}

// Keep local profile in sync with store
watch(
  () => masterStore.profile,
  (newProfile) => {
    profile.value = newProfile;
    avatarId.value = newProfile.avatar?.id || null;
  },
  { deep: true }
);
</script>

<style scoped>
.profile {
  display: flex;
  flex-direction: row !important;
  gap: 16px;
}
.info {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.info__block p {
  font-size: 18px;
  font-weight: 700;
  line-height: 18px;
}
.avatar__actions {
  display: flex;
  justify-content: space-between;
  gap: 16px;
}
.avatar__action {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
}
</style> 