<template>
  <div class="wrapper">
    <header>
      <div style="display: flex; gap: 16px; align-items: center;">
        <Logo />
        <Location @changeType="changeType" />
      </div>
      <BaseInput v-model="text" type="search" placeholder="Search" @save="search" />
      <nav class="header__nav">
        <NuxtLink to="/client/orders/create">Create an order</NuxtLink>
        <NuxtLink to="/client/catalog">Find a specialist</NuxtLink>
        <NuxtLink to="/client/orders/my">My orders</NuxtLink>
        <NuxtLink to="/master/auth">Become a specialist</NuxtLink>
        <Avatar :small="true" @click="redirect" />
      </nav>
      <nav class="header__nav_mobile">
        <div class="icon" ref="NavRef" @click="navOpened = !navOpened">
          <img loading="lazy" src="~/assets/icons/nav.svg" alt="nav" />

          <div class="links" v-if="navOpened">
            <NuxtLink to="/client/orders/create">Create an order</NuxtLink>
            <NuxtLink to="/client/catalog">Find a specialist</NuxtLink>
            <NuxtLink to="/client/orders/my">My orders</NuxtLink>
            <NuxtLink to="/master/auth">Become a specialist</NuxtLink>
          </div>
        </div>
        <Avatar class="avatar_header" :small="true" @click="redirect" />
      </nav>
    </header>
    <div class="container">
      <div class="sidebar">
        <ClientSidebar v-if="type === 'Client'" />
        <MasterSidebar v-else />
        <QRCode />
      </div>
      <div class="main">
        <NuxtPage />
      </div>
    </div>
  </div>
  <footer>
    <div class="footer">
      <div class="footer__top">
        <Logo></Logo>
        <div class="footer__links">
          <NuxtLink to="/">Help</NuxtLink>
          <NuxtLink to="/">Blog</NuxtLink>
          <NuxtLink to="/">About the service</NuxtLink>
          <NuxtLink to="/">Advertisting</NuxtLink>
        </div>
        <QRCode :footer="true" />
      </div>
      <div class="footer__bottom">
        <span>
          Terms of use
        </span>

        <span>
          For legal issues: uslugi@support.yandex.ru
        </span>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import Logo from './components/icons/Logo.vue';
import Avatar from './components/shared/Avatar.vue';
import ClientSidebar from './components/shared/ClientSidebar.vue';
import Location from './components/shared/Location.vue';
import MasterSidebar from './components/shared/MasterSidebar.vue';
import QRCode from './components/shared/QRCode.vue';
import BaseInput from './components/UI/BaseInput.vue';
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { setToken } from './app/api';

const runtimeConfig = useRuntimeConfig();
const app = initializeApp(runtimeConfig.public.firebaseConfig);
const auth = getAuth(app);
auth.useDeviceLanguage();

const userStore = useUserStore();
const catalog = useCatalogStore();
const orderStore = useOrderStore();
const router = useRouter();

onMounted(async () => {
  setToken();
  await userStore.checkAuth();

  if (userStore.isAuth) {
    await catalog.getAllCategories();
    await orderStore.getClientOrders();
  }
});

const navOpened = ref(false);
const NavRef = ref<HTMLElement | null>(null);
const type = ref('Client');

const text = ref('');

function search() {
  if (!text.value) return;
  router.push({ path: '/client/catalog', query: { search: text.value } });
  text.value = '';
}

function changeType(val: string) {
  type.value = val;
}

function redirect() {
  if (userStore.isAuth) {
    if (type.value === 'Master') {
      router.push('/master/account');
    } else {
      router.push('/client/account');
    }
  } else {
    router.push('/client/auth');
  }
}

useClickOutside(NavRef, () => {
  navOpened.value = false;
});
</script>

<style lang="scss" scoped>
.wrapper {
  max-width: 1160px;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  min-height: calc(100vh - 180px);
  padding: 0 20px;

  @media screen and (max-width: 640px) {
    padding: 0;
  }
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 1em 0;
  background-color: #fff;
  gap: 16px;
  white-space: nowrap;

  nav {
    display: flex;
    gap: 16px;
    align-items: center;
  }

  @media screen and (max-width: 1024px) {
    padding: 1em;
  }
}

.header__nav {
  user-select: none;

  @media screen and (max-width: 1024px) {
    display: none;
  }

  &_mobile {
    position: relative;

    @media screen and (width > 1024px) {
      display: none;
    }

    .links {
      position: absolute;
      z-index: 100000;
      top: 100%;
      left: -160%;
      background: white;
      width: 200%;
      border-radius: 8px;
      padding: 16px;
      box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1), 0 8px 16px 0 rgba(0, 0, 0, 0.1);
      display: flex;
      flex-direction: column;
      gap: 8px;


      @media screen and (max-width: 480px) {
        left: -400%;
        width: 500%;
        top: 120%;
      }
    }

    .icon {
      width: 34px;
      height: 34px;
      border-radius: 8px;
      padding: 8px;
      background: rgba(244, 244, 244, 1);
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .avatar_header {
      @media screen and (max-width: 480px) {
        display: none;
      }
    }
  }
}

.container {
  display: flex;
  margin: 40px 0 80px 0;
  gap: 32px;

  @media screen and (max-width: 1024px) {
    padding: 0 1em;
    flex-direction: column;
    gap: 24px;
    margin: 20px 0 40px 0;
  }

  @media screen and (max-width: 725px) {
    gap: 12px;
    margin: 10px 0 20px 0;
  }

  .sidebar {
    height: -webkit-fill-available;
    height: -moz-available;
    max-width: 266px;
    white-space: nowrap;
    display: flex;
    flex-direction: column;
    gap: 24px;
    user-select: none;

    @media screen and (max-width: 1024px) {
      flex-direction: row;
    }

    @media screen and (max-width: 640px) {
      max-width: 100%;
      justify-content: space-between;
      margin-bottom: 12px;
    }
  }

  .main {
    width: -webkit-fill-available;
    width: -moz-available;
    max-width: 860px;
  }
}

footer {
  background: rgba(248, 248, 248, 1);
  padding: 33px 10px 24px 10px;

  @media screen and (max-width: 725px) {
    padding: 24px 10px;
  }

  @media screen and (max-width: 625px) {
    padding: 12px 10px 24px 10px;
  }

  .footer {
    display: flex;
    flex-direction: column;
    gap: 24px;
    max-width: 1160px;
    margin: 0 auto;
    justify-content: end;
    align-items: flex-start;
  }

  .footer__top {
    display: flex;
    flex-direction: row;
    gap: 24px;
    align-items: center;
    border-bottom: 1px solid rgba(230, 230, 230, 1);
    padding-bottom: 33px;
    width: -webkit-fill-available;
    width: -moz-available;

    @media screen and (max-width: 1024px) {
      justify-content: space-around;
    }

    @media screen and (max-width: 625px) {
      align-items: start;
    }


    .footer__links {
      display: flex;
      flex-direction: row;
      gap: 32px;
      font-size: 16px;
      font-weight: 500;
      line-height: 16px;

      @media screen and (max-width: 725px) {
        font-size: 14px;
        gap: 12px;
      }

      @media screen and (max-width: 625px) {
        font-size: 12px;
        gap: 8px;
        flex-direction: column;
        display: flex;
      }

    }

  }

  .footer__bottom {
    display: flex;
    justify-content: space-between;
    width: -webkit-fill-available;
    width: -moz-available;
    font-size: 14px;

    line-height: 19.6px;


    @media screen and (max-width: 1024px) {
      padding: 0 1em;
    }
  }
}

.router-link-active {
  color: rgba(255, 199, 0, 1);
}
</style>
