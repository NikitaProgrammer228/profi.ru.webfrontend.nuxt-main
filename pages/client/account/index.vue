<template>
    <h2>Profile settings</h2>
    <AccountInfo :user="user.profile" />
    <PersonalInfo />
    <AddressInfo />
    <div class="actions">
        <span @click="logout">Logout</span>
        <span class="delete" @click="deleteModal = true">Delete profile</span>
    </div>
    <BaseModal v-if="deleteModal" @close="deleteModal = false">
        <p style="max-width: 305px; text-align: center;">Deleting a profile will result in the loss of all completed
            information</p>
        <div class="actions-modal">
            <BaseButton @click="deleteProfile">Delete</BaseButton>
            <BaseButton type="cancel" @click="deleteModal = false">Cancel</BaseButton>
        </div>
    </BaseModal>
</template>

<script setup lang="ts">
import AccountInfo from '~/components/account/client/AccountInfo.vue';
import AddressInfo from '~/components/account/client/AddressInfo.vue';
import PersonalInfo from '~/components/account/client/PersonalInfo.vue';
import BaseButton from '~/components/UI/BaseButton.vue';
import BaseModal from '~/components/UI/BaseModal.vue';
import { deleteAccount, logout as logoutUser } from '~/app/api/authApi';

definePageMeta({
    middleware: ['auth'],
});

const user = useUserStore();

const deleteModal = ref(false);

function logout() {
    navigateTo('/client/auth');
    logoutUser();
}

async function deleteProfile() {
    await deleteAccount();
    user.completeLogout();
    navigateTo('/client/auth');
    deleteModal.value = false;
}
</script>

<style lang="scss" scoped>
h2 {
    font-size: 32px;
    font-weight: 500;
    line-height: 32px;
    margin: 12px 0;
}

.actions {
    margin-top: 12px;
    display: flex;
    flex-direction: row;
    gap: 50px;
    align-items: center;
    justify-content: center;

    &-modal {
        display: flex;
        flex-direction: row;
        gap: 24px;
        align-items: center;
        justify-content: center;
    }

    span {
        font-size: 14px;
        font-weight: 500;
        line-height: 14px;
        color: rgba(156, 156, 156, 1);
        cursor: pointer;

        &.delete {
            color: rgba(222, 18, 18, 1);
        }
    }
}
</style>