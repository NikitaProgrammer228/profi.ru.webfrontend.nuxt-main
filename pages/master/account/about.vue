<script setup lang="ts">
import { getMasterMe, patchMaster } from '~/app/api/masterApi';
import BackButton from '~/components/UI/BackButton.vue';
import BaseBlock from '~/components/UI/BaseBlock.vue';
import BaseButton from '~/components/UI/BaseButton.vue';
import BaseInput from '~/components/UI/BaseInput.vue';
import BaseSelect from '~/components/UI/BaseSelect.vue';
import BaseTextarea from '~/components/UI/BaseTextarea.vue';
import DateSelect from '~/components/UI/DateSelect.vue';
import { useMasterStore } from '~/stores/masterStore';

const list = ref([
    {
        title: 'Male',
        value: 'male'
    },
    {
        title: 'Female',
        value: 'female'
    }
]);

const masterStore = useMasterStore();

async function saveProfile() {
    masterStore.profile = await patchMaster(masterStore.profile.id, {
        gender: masterStore.profile.gender,
        date_of_birth: masterStore.profile.date_of_birth,
        description: masterStore.profile.description,
    });
}

onMounted(async () => {
    masterStore.profile = await getMasterMe();
});
</script>

<template>
    <BaseBlock :flat="true" :center="false" padding="0px" style="margin: 0px;">
        <BackButton class="back" @click="$router.go(-1)" style="margin-bottom: 16px;">Back</BackButton>
        <h2>About Me</h2>
        <BaseBlock :center="false" gap="32px">
            <div class="block">
                <h3>General information</h3>
                <div style="display: flex; flex-direction: row; gap: 16px; max-width: 500px;">
                    <BaseSelect :list="list" v-model:selected="masterStore.profile.gender" placeholder="Gender" />
                    <DateSelect placeholder="Date of birth" v-model="masterStore.profile.date_of_birth"
                        :showYear="true" />
                </div>
                <BaseTextarea v-model="masterStore.profile.description"
                    placeholder="Write briefly about your strengths, important qualities, what tools and technologies you use. Write about services and experience in the special fields .">
                </BaseTextarea>
                <div class="video__block">
                    <div class="video__description">
                        <p>Video about myself</p>
                        <span>Video tells about уои better than text. Record a short video presentation and greet
                            customers. The video will appear on your public profile. Upload a video where you talk about
                            your work.</span>
                    </div>
                    <div class="video__button">
                        <BaseButton type="cancel">
                            <img loading="lazy" src="~/assets/icons/black-plus.svg" alt="plus">
                            Add a video
                        </BaseButton>
                    </div>
                </div>
            </div>
            <div class="block">
                <div class="block__value">
                    <h3>Professional education</h3>
                    <p>Describe your education in detail: university, name of specialty, type of training, for example,
                        “RGGU, marketing and technology, bachelor” or “USTU UPI, graphic design, retraining courses”</p>
                </div>
                <div class="block__value">
                    <p style="font-weight: 500; font-size: 14px;">Education</p>
                    <BaseInput type="text" placeholder="Education" />
                </div>
                <div class="block__value">
                    <div class="block__text">
                        <p>Diplomas, certificates, licenses</p>
                        <span>Attach photographs or scans of documents confirming your qualifications</span>
                    </div>
                    <div class="photos">
                        <div class="photo" v-for="n in 4">
                            <img loading="lazy" src="~/assets/icons/photo.svg" alt="photo">
                            <span>Tell us about your task</span>
                        </div>
                    </div>
                </div>
            </div>
        </BaseBlock>
        <BaseButton type="base" style="align-self: center;" @click="saveProfile">Save</BaseButton>
    </BaseBlock>
</template>

<style lang="scss" scoped>
.back {
    font-size: 18px;
}

h2 {
    font-size: 32px;
    font-weight: 500;
    line-height: 32px;
}

h3 {
    font-size: 20px;
    font-weight: 500;
    line-height: 24px;
    letter-spacing: -0.02em;
}

.block {
    display: flex;
    flex-direction: column;
    gap: 16px;

    &>p {
        font-size: 14px;
        line-height: 19.6px;
    }

    .block__value {
        display: flex;
        flex-direction: column;
        gap: 6px;

        .block__text {
            p {
                font-weight: 500;
                line-height: 22.4px;
                letter-spacing: -0.02em;
            }

            span {
                font-size: 14px;
                line-height: 19.6px;
            }
        }

        .photos {
            display: flex;
            flex-wrap: wrap;
            gap: 16px;

            .photo {
                width: 80px;
                height: 80px;
                border: 1px solid #9C9C9C;
                border-radius: 8px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                gap: 4px;
                cursor: pointer;
                font-size: 12px;
                line-height: 15.6px;
                text-align: center;
                color: #9C9C9C;
            }
        }
    }
}

.video__block {
    display: flex;
    justify-content: space-between;
    gap: 24px;

    .video__description {
        display: flex;
        flex-direction: column;
        gap: 4px;

        p {
            font-weight: 500;
            line-height: 22.4px;
            letter-spacing: -0.02em;

        }

        span {
            font-size: 14px;
            line-height: 19.6px;
        }
    }

    .video__button {
        display: flex;
        align-items: center;
    }

    @media screen and (max-width: 650px) {
        flex-direction: column;
    }
}
</style>