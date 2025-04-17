<template>
    <BackButton style="font-size: 18px; margin-bottom: 32px;" @click="redirect">Back</BackButton>
    <BaseBlock v-if="!addMenu" :center="false" :flat="true" padding="0px">
        <h2>Addresses</h2>
        <BaseBlock>
            <div class="header">
                <p>Your home address</p>
                <span>We will look for orders near this location and show your profile more often to clients in these
                    areas</span>
            </div>
            <div class="address">
                <div class="address__header">
                    <p>Садовая улица, 66</p>
                    <span>СНТ Ручеёк-2, рабочий посёлок Монино, городской округ Щёлково, Московская область</span>
                </div>
                <img loading="lazy" @click="editMenu = !editMenu" src="~/assets/icons/edit-2.svg" alt="edit" />
            </div>
            <div v-if="editMenu" class="add__address-block">
                <BaseInput type="text" placeholder="Example: Sadovaya str, 215" v-model="address"
                    style="max-width: 100% !important;" />
                <div class="buttons">
                    <BaseButton :disabled="!valid" type="base" @click="editMenu = false">Save</BaseButton>
                </div>
            </div>
            <div v-else class="add__address">
                <BaseButton type="cancel" @click="addMenu = true">
                    <img loading="lazy" src="~/assets/icons/black-plus.svg" alt="plus">
                    Add new address
                </BaseButton>
            </div>
        </BaseBlock>
    </BaseBlock>
    <BaseBlock v-else :center="false" :flat="true" padding="0px">
        <h2>Add new address</h2>
        <BaseBlock>
            <div class="header">
                <span>
                    Indicate the street and house where you are ready to receive clients. House number is
                    required</span>
            </div>
            <div class="add__address">
                <div class="add__address-block">
                    <BaseInput type="text" placeholder="Example: Sadovaya str, 215" v-model="address"
                        style="max-width: 100% !important;" />
                    <div class="buttons">
                        <BaseButton :disabled="!valid" type="base" @click="addMenu = false">Save</BaseButton>
                    </div>
                </div>
            </div>
        </BaseBlock>
    </BaseBlock>
</template>

<script setup lang="ts">
import { getMasterAddress } from '~/app/api/masterApi';
import BackButton from '~/components/UI/BackButton.vue';
import BaseBlock from '~/components/UI/BaseBlock.vue';
import BaseButton from '~/components/UI/BaseButton.vue';
import BaseInput from '~/components/UI/BaseInput.vue';

definePageMeta({
    middleware: ['auth'],
});

const router = useRouter();

const addMenu = ref(false);
const editMenu = ref(false);
const address = ref('');

const valid = computed(() => {
    return address.value.length > 0
});

function redirect() {
    if (addMenu.value) {
        addMenu.value = false;
        return;
    }
    router.go(-1);
}

onMounted(async () => {
    await getMasterAddress("29ba2192-82cf-43e7-95b4-44a791883c4e");
})
</script>

<style lang="scss" scoped>
h2 {
    font-size: 36px;
    font-weight: 500;
    line-height: 36px;
}

.header {
    display: flex;
    flex-direction: column;
    gap: 6px;
    border-bottom: 1.5px solid #F4F4F4;
    padding-bottom: 10px;
    width: 100%;

    p {
        font-size: 20px;
        font-weight: 500;
        line-height: 24px;
        letter-spacing: -0.02em;
    }

    span {
        font-size: 14px;
        line-height: 19.6px;
    }
}

.add__address {
    display: flex;
    justify-content: center;
    width: 100%;

    &-block {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 16px;
        align-items: center;
    }
}

.address {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;

    p {
        font-size: 14px;
        line-height: 19.6px;
        color: #676767;
    }

    span {
        font-size: 12px;
        line-height: 16.8px;
        color: #9C9C9C;
    }

    img {
        cursor: pointer;
    }
}
</style>