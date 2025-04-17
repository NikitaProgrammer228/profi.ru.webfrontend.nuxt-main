<template>
    <div class="example">
        <div class="example__header" :class="open ? 'active' : ''" @click="open = !open">
            <p>{{ specialization.description }}</p>
            <img loading="lazy" src="~/assets/icons/arrow-down.svg" alt="arrow-down">
        </div>
        <div class="example__body" :class="open ? 'open' : ''">
            <div class="example__body__header">
                <p>Experience:
                    <span>{{ formatExperience(specialization.experience) }}</span>
                </p>
                <p>Work days:
                    <span>{{ specialization.work_days.join(', ') }}</span>
                </p>
                <p>Working hours:
                    <span>From {{ specialization.work_start }} to {{ specialization.work_end }}</span>
                </p>
                <p>Departure:
                    <span>No departure</span>
                </p>
            </div>
            <p>{{ specialization.description }}</p>
            <div class="example__body__services">
                <div v-for="service in specialization.service_details" class="service">
                    <div class="service__name">
                        <p>{{ service.custom_description }}</p>
                        <span>{{ Number(service.price) }} {{ types[service.type_price] }}</span>
                    </div>
                    <p>Description of service Lorem ipsum dolor sit amet consectetur. Id lectus mauris
                        cras vel lacus semper posuere est...</p>
                    <div class="service__image">
                        <img loading="lazy" v-for="image in service.images" :src="getImageUrl(image)" alt="edu.png">
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { getImage } from '~/app/api/photoApi';

const open = ref(false);

const props = defineProps({
    specialization: {
        type: Object,
        required: true
    }
});

const service_details = ref([]);

const types = reactive<any>({
    'per_price': 'per price',
    'in_a_hour': 'in a hour',
    'for_the_service': 'for the service',
});

function formatExperience(input: string): string {
    const isLessThan = input.startsWith('<');
    const isMoreThan = input.startsWith('>');

    let numberString = input.replace(/[<>]/g, '').trim();

    const number = Number(numberString);

    if (isNaN(number)) {
        return input;
    }

    const yearWord = number === 1 ? 'year' : 'years';

    if (isLessThan) {
        return `Less than ${number} ${yearWord}`;
    } else if (isMoreThan) {
        return `More than ${number} ${yearWord}`;
    } else {
        return `${number} ${yearWord}`;
    }
}

async function getImageUrl(image: string) {
    const res = await getImage(image);

    return res.image;
}

onMounted(async () => {
    service_details.value = props.specialization.service_details?.map((service: any) => {
        const serv = {
            ...service,
            // photos: service.photos?.map(async (image: string) => {
            //     const res = await getImage(image);
            //     console.log(res);
            //     return res;
            // })
        };
        return serv;
    });
    console.log(service_details, props.specialization);
})
</script>

<style lang="scss" scoped>
.example {
    background: #F8F8F8;
    padding: 16px;
    border-radius: 16px;

    &__header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 16px;
        font-weight: 500;
        line-height: 22.4px;
        letter-spacing: -0.02em;

        cursor: pointer;
        user-select: none;

        img {
            transition: all 0.3s ease;
            transform: rotate(0deg);
        }

        &.active {
            img {
                transform: rotate(180deg);
            }
        }
    }

    &__body {
        display: flex;
        flex-direction: column;
        gap: 24px;
        height: 0px;
        overflow: hidden;
        // transition: all 0.5s ease;

        &.open {
            margin-top: 16px;
            padding-top: 16px;
            height: auto;
        }

        &__header {
            display: flex;
            flex-direction: column;
            gap: 8px;

            p {
                font-size: 14px;
                font-weight: 500;
                line-height: 16.8px;
                letter-spacing: -0.02em;

                span {
                    font-size: 14px;

                    line-height: 19.6px;
                }
            }
        }

        &__services {
            .service {
                display: flex;
                flex-direction: column;
                gap: 12px;
                padding: 16px 0;
                border-top: 1px solid #E6E6E6;

                &__name {
                    display: flex;
                    justify-content: space-between;

                    p {
                        color: #2140BA;
                        font-size: 14px;
                        font-weight: 500;
                        line-height: 16.8px;
                        letter-spacing: -0.02em;
                    }

                    span {
                        font-size: 14px;

                        line-height: 19.6px;
                    }
                }

                &__image {
                    display: flex;
                    gap: 8px;

                    img {
                        width: 60px;
                        height: 60px;
                        object-fit: cover;
                    }
                }
            }
        }
    }
}
</style>