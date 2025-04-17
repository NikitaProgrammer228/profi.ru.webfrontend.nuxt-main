<template>
    <BaseBlock :center="false">
        <div class="notifications">
            <BaseCheckbox v-model:checked="pushNotifications">Push-notifications</BaseCheckbox>
            <BaseCheckbox v-model:checked="emailNotifications">Email-notifications</BaseCheckbox>
        </div>
        <div class="notifications">
            <h3>When to send letters and notifications</h3>
            <div class="selects">
                <BaseSelect :list="list" v-model:selected="selected">From</BaseSelect>
                <BaseSelect :list="list">Up to</BaseSelect>
            </div>
        </div>
        <div class="notifications">
            <h3>What notifications do I want to receive</h3>
            <BaseSwitch v-model:active="orderChange">Order status change</BaseSwitch>
            <BaseSwitch v-model:active="newMessages">New messages</BaseSwitch>
            <BaseSwitch v-model:active="newResponses">New responses to the task</BaseSwitch>
            <BaseSwitch v-model:active="advertising">Advertising mailings</BaseSwitch>
        </div>
        <div style="display: flex; align-items: center; justify-content: center;">
            <BaseButton type="base">Save</BaseButton>
        </div>
    </BaseBlock>
</template>

<script setup lang="ts">
import BaseBlock from '~/components/UI/BaseBlock.vue';
import BaseCheckbox from '~/components/UI/BaseCheckbox.vue';
import BaseButton from '../UI/BaseButton.vue';
import BaseSelect from '../UI/BaseSelect.vue';
import BaseSwitch from '../UI/BaseSwitch.vue';

const pushNotifications = ref(false);
const emailNotifications = ref(false);

const orderChange = ref(false);
const newMessages = ref(false);
const newResponses = ref(false);
const advertising = ref(false);

const list = ref([
    {
        title: 'Push-notifications',
        value: 'pushNotifications'
    },
    {
        title: 'Email-notifications',
        value: 'emailNotifications'
    }
]);
const selected = ref('pushNotifications');
</script>

<style lang="scss" scoped>
h3 {
    font-size: 20px;
    font-weight: 500;
    line-height: 24px;
    letter-spacing: -0.02em;
}

.notifications {
    display: flex;
    flex-direction: column;
    gap: 12px;
    display: flex;
    flex-direction: column;
    gap: 12px;

    .selects {
        display: flex;
        gap: 10px;

        @media screen and (max-width: 725px) {
            flex-direction: column;
        }
    }
}
</style>