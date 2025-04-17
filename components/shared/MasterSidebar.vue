<template>
    <div class="sidebar__buttons base">
        <div class="sidebar__button base" @click="$router.push('/master/orders/my')">
            <img loading="lazy" src="~/assets/icons/orders.svg" alt="orders" />
            My orders
        </div>
        <div class="sidebar__button base" @click="$router.push('/master/account')">
            <img loading="lazy" src="~/assets/icons/settings.svg" alt="settings" />
            Settings
        </div>
    </div>
    <div class="sidebar__buttons">
        <div class="sidebar__button">
            Orders
            <div class="sidebar__content">
                <NuxtLink class="sidebar__item" to="/master/orders/catalog">Search for orders</NuxtLink>
                <NuxtLink class="sidebar__item" to="/master/orders/responses">Responses</NuxtLink>
                <NuxtLink class="sidebar__item" to="/master/orders/invitations">Invitations</NuxtLink>
            </div>
        </div>
        <div class="sidebar__button">
            My profile
            <div class="sidebar__content">
                <!-- <NuxtLink class="sidebar__item" to="/master/account/examples">Work examples</NuxtLink> -->
                <NuxtLink class="sidebar__item" to="/master/account/specialites">Specialites</NuxtLink>
                <NuxtLink class="sidebar__item" to="/master/account/address">Addresses</NuxtLink>
                <NuxtLink class="sidebar__item" to="/master/account/about">About me</NuxtLink>
            </div>
        </div>
    </div>
    <div class="sidebar__buttons_mobile">
        <div class="sidebar__button" ref="ordersRef" @click="ordersOpened = !ordersOpened">
            Orders
            <div class="sidebar__content" v-if="ordersOpened">
                <NuxtLink class="sidebar__item" to="/master/orders/catalog">Search for orders</NuxtLink>
                <NuxtLink class="sidebar__item" to="/master/orders/responses">Responses</NuxtLink>
                <NuxtLink class="sidebar__item" to="/master/orders/invitations">Invitations</NuxtLink>
            </div>
        </div>
        <div class="sidebar__button" ref="profileRef" @click="profileOpened = !profileOpened">
            My profile
            <div class="sidebar__content" v-if="profileOpened">
                <!-- <NuxtLink class="sidebar__item" to="/master/account/examples">Work examples</NuxtLink> -->
                <NuxtLink class="sidebar__item" to="/master/account/specialites">Specialites</NuxtLink>
                <NuxtLink class="sidebar__item" to="/master/account/address">Addresses</NuxtLink>
                <NuxtLink class="sidebar__item" to="/master/account/about">About me</NuxtLink>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const ordersRef = ref(null);
const ordersOpened = ref(false);

const profileRef = ref(null);
const profileOpened = ref(false);

useClickOutside(ordersRef, () => {
    ordersOpened.value = false;
});

useClickOutside(profileRef, () => {
    profileOpened.value = false;
});

</script>

<style lang="scss" scoped>
.sidebar {
    &__buttons {
        display: flex;
        flex-direction: column;
        gap: 16px;

        @media screen and (max-width: 1024px) {
            flex-direction: row;

            &:not(.base) {
                display: none;
            }
        }

        @media screen and (max-width: 640px) {
            width: 100%;
            justify-content: space-around;
            gap: 12px;

            img {
                display: none;
            }
        }

        &_mobile {
            display: none;
            position: relative;

            @media screen and (max-width: 1024px) {
                display: flex;
                flex-direction: row;
                gap: 20px;
            }

            @media screen and (max-width: 640px) {
                width: 100%;
                justify-content: space-around;
            }

            .sidebar__content {
                position: absolute;
                z-index: 100000;
                top: 100%;
                left: 0;
                background: white;
                width: 150%;
                border-radius: 8px;
                padding: 16px;
                box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1), 0 8px 16px 0 rgba(0, 0, 0, 0.1);
                display: flex;
                flex-direction: column;
                gap: 8px;

                @media screen and (max-width: 640px) {
                    width: 100%;
                }
            }
        }
    }

    &__button {
        cursor: pointer;
        font-size: 20px;
        font-weight: 500;
        line-height: 24px;
        letter-spacing: -0.02em;
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding: 10px 0;

        &.base {
            flex-direction: row;
            cursor: pointer;
            font-size: 18px;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 10px;
        }
    }

    &__content {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }

    &__item {
        font-size: 16px;
        font-weight: 500;
        line-height: 22.4px;
        letter-spacing: -0.02em;

        padding: 12px 16px;
        border-radius: 6px;

        &:hover {
            background: rgba(244, 244, 244, 1);
        }

        &.router-link-active {
            background: rgba(244, 244, 244, 1);
        }
    }

}
</style>