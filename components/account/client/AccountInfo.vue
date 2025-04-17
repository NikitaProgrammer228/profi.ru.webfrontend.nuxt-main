<template>
    <BaseBlock :center="false" class="profile" :loading="userStore.loading || loading">
        <Avatar class="avatar" :link="profile?.avatar?.image || ''" />
        <div class="info">
            <div v-if="profile?.first_name" class="info__block">
                <p>{{ profile?.first_name }} {{ profile?.last_name }}</p>
                <EmailConfirmed :confirmed="profile?.email?.length > 0" />
            </div>
            <div class="avatar__actions">
                <div class="avatar__action">
                    <img loading="lazy" src="~/assets/icons/cross.svg" alt="delete" />
                    Delete photo
                </div>
                <div class="avatar__action">
                    <!-- <input type="file" accept="image/*" @change="uploadPhoto($event.target.files[0])"> -->
                    <img loading="lazy" src="~/assets/icons/edit.svg" alt="edit" />
                    Edit photo
                </div>
            </div>
        </div>
    </BaseBlock>
</template>

<script setup lang="ts">
import Avatar from '~/components/shared/Avatar.vue';
import BaseBlock from '~/components/UI/BaseBlock.vue';
import EmailConfirmed from '~/components/account/client/EmailConfirmed.vue';
import { useMasterStore } from '~/stores/masterStore';
import { patchClient } from '~/app/api/clientApi';
import { uploadImage } from '~/app/api/photoApi';

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
const photo = ref(null);

async function uploadPhoto(img: File) {
    photo.value = img;
    if (photo.value) {
        await uploadImage(photo.value);
    }
}

watch(() => props.user, (newUser) => {
    if (newUser) {
        profile.value = newUser;
    }
}, { deep: true });
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