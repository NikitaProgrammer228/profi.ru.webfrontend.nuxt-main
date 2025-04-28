<template>
    <BaseBlock :center="false" class="profile" :loading="userStore.loading || loadingUpload || loading">
        <!-- Hidden file input for avatar upload -->
        <input
            type="file"
            accept="image/*"
            ref="fileInput"
            style="display: none;"
            @change="onFileChange"
        />
        <Avatar class="avatar"
            :link="profile.avatar || ''" />
        <div class="info">
            <div v-if="profile?.first_name" class="info__block">
                <p>{{ profile?.first_name }} {{ profile?.last_name }}</p>
                <EmailConfirmed :confirmed="profile?.email?.length > 0" />
            </div>
            <div class="avatar__actions">
                <div class="avatar__action" @click="deleteAvatar">
                    <img loading="lazy" src="~/assets/icons/cross.svg" alt="delete" />
                    <span v-if="!deletingAvatar">Delete photo</span>
                    <span v-else>Deleting...</span>
                </div>
                <div class="avatar__action" @click="triggerFileInput">
                    <img loading="lazy" src="~/assets/icons/edit.svg" alt="edit" /> Edit photo
                </div>
            </div>
        </div>
    </BaseBlock>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import Avatar from '~/components/shared/Avatar.vue';
import BaseBlock from '~/components/UI/BaseBlock.vue';
import EmailConfirmed from '~/components/account/client/EmailConfirmed.vue';
import { useUserStore } from '~/stores/userStore';
import { patchClient } from '~/app/api/clientApi';
import { uploadImage, deleteImage } from '~/app/api/photoApi';

const props = defineProps({
    user: {
        type: Object as any,
        required: true
    },
    loading: {
        type: Boolean,
        default: false
    }
});

const userStore = useUserStore();
const profile = ref(userStore.profile);
const loadingUpload = ref(false);
// Store current avatar resource ID for deletion
const avatarId = ref<string | null>(null);
// Deleting state
const deletingAvatar = ref(false);

// Reference to the hidden file input element
const fileInput = ref<HTMLInputElement | null>(null);

// Safely trigger file selector
function triggerFileInput() {
    fileInput.value?.click();
}

async function onFileChange(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    loadingUpload.value = true;
    try {
        // Upload file directly; uploadImage builds FormData internally
        const { id: imageId, image: imageUrl } = await uploadImage(file);
        // Patch avatar id
        await patchClient({ avatar: imageId }, profile.value.id);
        // Save current avatar resource ID
        avatarId.value = imageId;
        // Update store with new avatar URL
        userStore.profile.avatar = imageUrl;
        profile.value.avatar = imageUrl;
        localStorage.setItem('profiru-avatar', imageUrl);
    } catch (err) {
        console.error('Avatar upload failed', err);
    } finally {
        loadingUpload.value = false;
    }
}

// Delete avatar: clear on server and in local state
async function deleteAvatar() {
    if (!avatarId.value) return;
    deletingAvatar.value = true;
    try {
        // Delete the image resource on server
        await deleteImage(avatarId.value);
        // Update local store and UI
        userStore.profile.avatar = '';
        profile.value.avatar = '';
        localStorage.removeItem('profiru-avatar');
        avatarId.value = null;
    } catch (err) {
        console.error('Avatar deletion failed', err);
    } finally {
        deletingAvatar.value = false;
    }
}

// Sync local profile when props.user changes
watch(
    () => props.user,
    (newUser) => {
        if (newUser) profile.value = newUser;
    },
    { deep: true }
);
</script>

<style lang="scss" scoped>
.profile {
    flex-direction: row !important;

    .info {
        display: flex;
        flex-direction: column;
        gap: 20px;
        width: -webkit-fill-available;
        width: -moz-available;

        &__block {
            display: flex;
            flex-direction: column;
            gap: 10px;

            p {
                font-size: 18px;
                font-weight: 700;
                line-height: 18px;
                letter-spacing: -0.02em;

                @media screen and (max-width: 400px) {
                    font-size: 14px;
                }
            }
        }

        .avatar__actions {
            width: -webkit-fill-available;
            width: -moz-available;
            display: flex;
            justify-content: space-between;

            .avatar__action {
                display: flex;
                flex-direction: row;
                gap: 4px;
                align-items: center;

                font-size: 12px;
                font-weight: 500;
                line-height: 14.4px;
                letter-spacing: -0.02em;
                color: rgba(156, 156, 156, 1);

                cursor: pointer;
                user-select: none;
            }
        }
    }
}
</style>