<template>
    <div class="wrapper">
        <div class="block" style="cursor: default; flex-direction: column;">
            <h3>Внимание!</h3>
            <p>Эта версия сайта предназначена только для проверки ВЁРСТКИ. Не все части бекенда готовы и подключены к сайту. Если вы кликаете на кнопку и ничего не происходит - значит так и должно быть. Значит бекенд ещё не готов для этого момента. На все страницы можно зайти, но не все "тыкалки" возымеют эффект.</p>
            <p>Если будете сверяться с фигмой, будьте осторожны. Фигма сделана НЕ идеально, и, например, в блоке регистрации нет слова Registraion, хотя оно должно там быть. </p>
            <p>И ещё раз, провеяйте только вёрстку. Не логику, не наполнение, т.к. они ещё не до конца готовы. Мобильный адаптив делался без фигмы, так что могут быть мелкие проблемы.</p>

            <p>Для теста войдите в аккаунт:</p>
            <p>Логин: +1 2125552370</p>
            <p>Пароль: Test123456</p>
            <p>Аккаунт подразумевает как клиентскую часть, так и мастера. Переключение вида с мастера на клиента и обратно осуществляется через кнопку в верхнем левом углу возле лого (позже там будет отображаться город). </p>
        </div>
        <div class="block">
            <p>Страницы с id? не будут открываться с этой страницы, т.к. каждый ID уникален и относится к конкретному заказу/мастеру/клиенту</p>
        </div>
        <div class="block" v-for="page in pages" :key="page.path" @click="$router.push(page.path)" style="cursor: pointer;">
            <h3>{{ page.description }}</h3>
            <p>{{ page.path }}</p>
        </div>
    </div>
</template>

<script setup lang="ts">

const pages = shallowRef([
    {
        "path": "/client/account",
        "description": "Аккаунт клиента"
    },
    {
        "path": "/client/account/add-address",
        "description": "Добавить адрес клиента"
    },
    {
        "path": "/client/account/change-password",
        "description": "Изменить пароль клиента"
    },
    {
        "path": "/client/auth",
        "description": "Авторизация клиента"
    },
    {
        "path": "/client/auth/recovery",
        "description": "Восстановление доступа клиента"
    },
    {
        "path": "/client/catalog",
        "description": "Каталог для клиента"
    },
    {
        "path": "/client/catalog/id?",
        "description": "Элемент каталога клиента по ID (список подкаталогов)"
    },
    {
        "path": "/client/catalog/id?/sub/subId?",
        "description": "Список мастеров подкаталога"
    },
    {
        "path": "/client/master/id?",
        "description": "Мастер для клиента по ID"
    },
    {
        "path": "/client/master/id?/example/exId?",
        "description": "Пример работы мастера для клиента"
    },
    {
        "path": "/client/orders/id?",
        "description": "Заказ клиента по ID"
    },
    {
        "path": "/client/orders/create",
        "description": "Создать заказ клиента"
    },
    {
        "path": "/client/orders/my",
        "description": "Мои заказы клиента"
    },
    {
        "path": "/client/orders/personal/id?",
        "description": "Персональный заказ клиента для мастера по ID"
    },
    {
        "path": "/master/account",
        "description": "Аккаунт мастера"
    },
    {
        "path": "/master/account/about",
        "description": "Информация о мастере"
    },
    {
        "path": "/master/account/address",
        "description": "Адреса мастера"
    },
    {
        "path": "/master/account/passport",
        "description": "Паспортные данные мастера"
    },
    {
        "path": "/master/account/services",
        "description": "Услуги мастера"
    },
    {
        "path": "/master/account/specialites",
        "description": "Специальности мастера"
    },
    {
        "path": "/master/auth",
        "description": "Авторизация мастера"
    },
    {
        "path": "/master/auth/login",
        "description": "Вход мастера"
    },
    {
        "path": "/master/auth/recovery",
        "description": "Восстановление доступа мастера"
    },
    {
        "path": "/master/orders/id?",
        "description": "Заказ мастера по ID"
    },
    {
        "path": "/master/orders/catalog",
        "description": "Каталог заказов для мастера"
    },
    {
        "path": "/master/orders/invitations",
        "description": "Приглашения на заказы мастера"
    },
    {
        "path": "/master/orders/my",
        "description": "Мои заказы мастера"
    },
    {
        "path": "/master/orders/responses",
        "description": "Отклики мастера на заказы"
    },
    {
        "path": "/master/services/id?",
        "description": "Услуга мастера по ID"
    }
])


onNuxtReady(() => {
    // navigateTo('/client/catalog');
});
</script>

<style lang="scss" scoped>
.wrapper {
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 100%;

    .block {
        display: flex;
        align-items: center;
        gap: 16px;
        padding-bottom: 10px;
        border-bottom: 1.5px solid #F4F4F4;
    }
}
</style>