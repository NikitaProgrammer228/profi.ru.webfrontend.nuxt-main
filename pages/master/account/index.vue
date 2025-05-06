<template>
    <h2>Profile settings (Master)</h2>
    <AccountInfo :user="masterStore.profile" />
    <Passport />
    <BaseBlock class="block" @click="$router.push('/master/account/about')">
        <div class="info__block">
            <p>About me</p>
            <span>{{ aboutFilled ? 'Filled' : 'Not filled' }}</span>
        </div>
        <img loading="lazy" src="~/assets/icons/arrow-right.svg" alt="arrow">
    </BaseBlock>
    <BaseBlock class="block" @click="$router.push('/master/account/address')">
        <div class="info__block">
            <p>Addresses</p>
            <span>No addresses added</span>
        </div>
        <img loading="lazy" src="~/assets/icons/arrow-right.svg" alt="arrow">
    </BaseBlock>
    <BaseBlock class="block" @click="$router.push('/master/account/services')">
        <div class="info__block">
            <span>Ремонт и строительство</span>
            <p>Сантехнические работы</p>
            <span>1 service</span>
        </div>
        <div>
            <BaseButton type="cancel">
                <img loading="lazy" src="~/assets/icons/black-plus.svg" alt="add">
                Add services
            </BaseButton>
        </div>
    </BaseBlock>
    <div class="actions">
        <BaseButton type="cancel" @click="deleteModal = true">Remove from publication</BaseButton>
        <BaseButton type="cancel" @click="deleteModal = true">Delete</BaseButton>
        <BaseButton type="cancel" @click="handleLogout">Log out</BaseButton>
    </div>

    <BaseModal v-if="deleteModal">
        <p style="max-width: 305px; text-align: center;">Deleting a profile will result in the loss of all completed
            information</p>
        <div class="actions">
            <BaseButton @click="deleteModal = false">Delete</BaseButton>
            <BaseButton type="cancel" @click="deleteModal = false">Cancel</BaseButton>
        </div>
    </BaseModal>
</template>

<script setup lang="ts">
import { getMasterMe, getMasterSpecializations } from '~/app/api/masterApi';
import AccountInfo from '~/components/account/master/AccountInfo.vue';
import Passport from '~/components/account/master/Passport.vue';
import BaseBlock from '~/components/UI/BaseBlock.vue';
import BaseButton from '~/components/UI/BaseButton.vue';
import BaseModal from '~/components/UI/BaseModal.vue';
import { useMasterStore } from '~/stores/masterStore';
import { logout } from '~/app/api/authApi';
import { useRouter } from 'vue-router';
import { setToken } from '~/app/api';

const router = useRouter();

const deleteModal = ref(false);

const masterStore = useMasterStore();

const aboutFilled = computed(() => {
    if (masterStore.profile?.gender && masterStore.profile?.date_of_birth && masterStore.profile?.description) {
        return true;
    }
    return false;
});

function handleLogout() {
    logout();
    router.push('/client/auth');
}

onMounted(async () => {
    try {
        // Ensure axios has auth header
        setToken();
        const profile = await getMasterMe();
        masterStore.profile = profile;
        await getMasterSpecializations(profile.id);
    } catch (err: any) {
        console.error('Error loading master profile:', err);
        // profile remains as-is; handle unauthorized or missing profile
    }
});
</script>

<style lang="scss" scoped>
h2 {
    font-size: 32px;
    font-weight: 500;
    line-height: 32px;
    margin: 12px 0;
}

.actions {
    display: flex;
    flex-direction: row;
    gap: 10px;
    align-items: center;
    justify-content: center;
}

.block {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;

    .info__block {
        display: flex;
        flex-direction: column;
        gap: 1px;

        p {
            font-size: 18px;
            font-weight: 500;
            line-height: 18px;
            letter-spacing: -0.02em;
        }

        span {
            font-size: 14px;
            line-height: 19.6px;
            color: #9C9C9C;
        }

        @media screen and (max-width: 550px) {
            p {
                font-size: 16px;
                line-height: 16px;
            }

            span {
                font-size: 13px;
                line-height: 16.6px;
            }
        }
    }
}
</style>