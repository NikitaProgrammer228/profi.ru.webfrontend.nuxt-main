<template>
    <h2>Passport verification</h2>
    <BaseBlock :center="false">
        <div class="passport__info">
            <p>Photo spread</p>
            <span v-if="!hasPassport">
                <img loading="lazy" src="~/assets/icons/red-cross.svg" alt="not-verified" />
                Passport (ID-card) not verified
            </span>
            <span v-else>
                <img loading="lazy" src="~/assets/icons/green-cross.svg" alt="verified" />
                Passport (ID-card) verified
            </span>
        </div>
        <div class="passport__photo__wrapper">
            <div class="passport__photo">
                <p>Selfie with passport (ID-card)</p>
                <span>
                    Verified
                </span>
            </div>
            <BaseButton type="cancel" @click="$emit('nextStep')" style="align-self: flex-start">Reshoot</BaseButton>
        </div>
        <div class="safety">
            <img loading="lazy" src="~/assets/icons/security-safe.svg" alt="security-safe" />
            It's safe: other users won't see your passport (ID card)
        </div>
    </BaseBlock>
    <div class="action__buttons">
        <BaseButton type="base" @click="$emit('nextStep')">{{ hasPassport ? 'Save' : 'Not now' }}</BaseButton>
    </div>
</template>

<script setup lang="ts">
import BaseBlock from '~/components/UI/BaseBlock.vue';
import BaseButton from '../UI/BaseButton.vue';

defineEmits(['nextStep']);

const props = defineProps({
    master: {
        type: Object,
        required: false
    }
});

const unregisteredMaster = ref({
    passport_front: null,
    passport_back: null
});

const user = computed(() => props.master || unregisteredMaster.value);

const hasPassport = computed(() => {
    if (user.value.passport_front && user.value.passport_back) {
        return true;
    }
    return false;
})
</script>

<style lang="scss" scoped>
h2 {
    font-size: 36px;
    font-weight: 500;
    line-height: 36px;
    text-align: center;
    margin-bottom: 24px;
}

.passport__info,
.passport__photo {
    display: flex;
    flex-direction: column;
    gap: 8px;

    p {
        font-size: 20px;
        font-weight: 500;
        line-height: 24px;
        letter-spacing: -0.02em;

        @media screen and (max-width: 500px) {
            font-size: 16px;
            line-height: 18px;
            
        }
    }

    span {
        display: flex;
        gap: 8px;
        align-items: center;
    }
}

.passport__photo__wrapper {
    display: flex;
    justify-content: space-between;
}

.passport__photo {
    span {
        color: rgba(156, 156, 156, 1);
    }
}

.action__buttons {
    display: flex;
    flex-direction: row;
    justify-content: center;
}

.safety {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    
    line-height: 19.6px;
    color: rgba(156, 156, 156, 1);
}
</style>