<template>
    <BaseBlock :center="false" class="master" v-if="catalog.master && !exId">
        <div class="master_info">
            <div class="info">
                <div class="info_top">
                    <Avatar :link="catalog.master.avatar?.image"></Avatar>
                    <div class="info_main">
                        <div class="header">
                            <div class="starss">
                                <img loading="lazy" src="~/assets/icons/star.svg" alt="star" width="13px" height="15px" />
                                {{ catalog.master.average_rating_value?.toFixed(1) || '5.00' }} ({{ catalog.master.reviews_count }}
                                reviews)
                            </div>
                            <div class="passport">
                                <img loading="lazy" src="~/assets/icons/verify.svg" alt="verify" />
                                Passport verified
                            </div>
                        </div>
                        <div class="name">
                            <p>{{ catalog.master.first_name || 'Master Name' }} {{ catalog.master.last_name || '' }}</p>
                            <span>Samara region • Online 1 day ago</span>
                        </div>
                    </div>
                </div>
                <div class="block">
                    <p>About me</p>
                    <div class="description">
                        <p>{{ catalog.master.description || 'Description of the master' }}</p>
                        <p>
                            <span>Age: </span>{{ age }}
                        </p>
                        <p>
                            <span>Convenient time for contact: </span>from 0:00 to 23:00
                        </p>
                    </div>
                </div>
                <div class="block">
                    <p>Education</p>
                    <div class="description">
                        <p>TMT, technical device and repair of motor vehicles, auto mechanic technician</p>
                        <div class="images">
                            <img loading="lazy" src="~/assets/images/edu.png" alt="edu.png">
                            <img loading="lazy" src="~/assets/images/edu.png" alt="edu.png">
                            <img loading="lazy" src="~/assets/images/edu.png" alt="edu.png">
                        </div>
                    </div>
                </div>
                <div class="block">
                    <p>Work examples</p>
                    <Examples></Examples>

                    <div class="scroll-left">
                        <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M1.33301 1.16665L6.81279 6.64643C7.00805 6.84169 7.00805 7.15827 6.81279 7.35353L1.33301 12.8333"
                                stroke="#000000" stroke-width="1.5" stroke-linecap="round" />
                        </svg>
                    </div>
                    <div class="scroll-right">
                        <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M1.33301 1.16665L6.81279 6.64643C7.00805 6.84169 7.00805 7.15827 6.81279 7.35353L1.33301 12.8333"
                                stroke="#000000" stroke-width="1.5" stroke-linecap="round" />
                        </svg>
                    </div>
                </div>
                <div class="experience block">
                    <Specialization v-for="specialization in catalog.master.specializations"
                        :specialization="specialization"></Specialization>
                </div>
                <div class="reviews block">
                    <div class="reviews__header">
                        <div class="count">
                            <p>Reviews</p>
                            <span> • {{ catalog.master.reviews_count }} reviews</span>
                        </div>
                        <div class="stars">
                            <img loading="lazy" src="~/assets/icons/star.svg" alt="star" width="13px" height="15px" />
                            {{ catalog.master.average_rating_value?.toFixed(1) || '5.00' }}
                        </div>
                    </div>
                    <Review></Review>
                </div> 
            </div>
        </div>
    </BaseBlock>
    <BaseBlock :center="false" :flat="true" v-else-if="exId">
        <BackButton class="back" @click="$router.go(-1)">Back</BackButton>
        <BaseBlock :center="false">
            <h3>sdfdfgsdfgsd fgdsf gdfg dsfg</h3>
            <div class="description mobile">
                <p>В рамках проекта в подмосковском посёлке Полесье выполнены электромонтажные работы и отделка
                    деревянного двухэтажного дома</p>
                <span>10000 ₽</span>
            </div>
            <div class="info">
                <div class="big_image">
                    <img loading="lazy" src="~/assets/images/example.png" alt="example">
                </div>
                <div class="rest_info">
                    <div class="description">
                        <p>В рамках проекта в подмосковском посёлке Полесье выполнены электромонтажные работы и отделка
                            деревянного двухэтажного дома</p>
                        <span>10000 ₽</span>
                    </div>
                    <div class="rest_images">
                        <img loading="lazy" src="~/assets/images/example.png" alt="example">
                        <img loading="lazy" src="~/assets/images/example.png" alt="example">
                        <img loading="lazy" src="~/assets/images/example.png" alt="example">
                        <img loading="lazy" src="~/assets/images/example.png" alt="example">
                    </div>
                    <div class="buttons">
                        <BaseButton type="cancel" @click="$router.push(`/client/chat/${catalog.master?.id}`)">Chat</BaseButton>
                        <BaseButton type="base" @click="modal = true">Offer an order</BaseButton>
                    </div>
                </div>
            </div>
        </BaseBlock>
    </BaseBlock>

    <OfferAnOrder v-if="modal" :master="(route.params.id as string)" @close="modal = false" />
</template>

<script setup lang="ts">
import Specialization from '~/components/catalog/master/Specialization.vue';
import Review from '~/components/catalog/master/Review.vue';
import Avatar from '~/components/shared/Avatar.vue';
import BaseBlock from '~/components/UI/BaseBlock.vue';
import Examples from '~/components/catalog/master/Examples.vue';
import BaseButton from '~/components/UI/BaseButton.vue';
import BackButton from '~/components/UI/BackButton.vue';
import OfferAnOrder from '~/components/catalog/master/OfferAnOrder.vue';

const route = useRoute();
const catalog = useCatalogStore();
const modal = ref(false);
const exId = ref<string | undefined>('');
const age = useBirthDate(catalog.master?.date_of_birth);

watch(route, async () => {
    await catalog.getMaster(route.params.id as string);

    if (route.params.exId) {
        exId.value = route.params.exId as string;
    } else {
        exId.value = undefined;
    }
});

onMounted(async () => {
    await catalog.getMaster(route.params.id as string);

    if (route.params.exId) {
        exId.value = route.params.exId as string;
    } else {
        exId.value = undefined;
    }
});
</script>
<style lang="scss" scoped>
.reviews__header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    .count {
        display: flex;
        flex-direction: row;
        gap: 4px;

        p {
            font-size: 16px;
            font-weight: 500;
            line-height: 22.4px;
            letter-spacing: -0.02em;
        }

        span {
            color: #9C9C9C;
            font-size: 16px;

            line-height: 22.4px;
        }
    }
}

.master {
    display: flex;
    gap: 24px;
    flex-direction: row;
    align-items: start;
    width: 100%;

    &_info {
        display: flex;
        flex-direction: column;
        gap: 32px;
        width: 100%;

        .info {
            display: flex;
            flex-direction: column;
            gap: 16px;

            .info_top {
                display: flex;
                flex-direction: row;
                gap: 24px;
                align-items: center;

                .info_main {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;

                    .header {
                        display: flex;
                        gap: 12px;
                        font-size: 12px;

                        .stars {
                            display: flex;
                            gap: 4px;
                        }
                    }

                    .name {
                        p {
                            font-size: 20px;
                            font-weight: 500;
                            line-height: 24px;
                            letter-spacing: -0.02em;
                        }

                        span {
                            font-size: 12px;

                            line-height: 15.6px;
                            color: #9C9C9C;
                        }
                    }
                }
            }

            .block {
                background: #F4F4F4;
                padding: 20px;
                display: flex;
                flex-direction: column;
                gap: 16px;
                border-radius: 16px;
                position: relative;

                &.experience {
                    gap: 8px;
                    background: none;
                    padding: 0px;
                }

                &.reviews {
                    gap: 24px;
                    background: none;
                    padding: 0px;
                }

                &>p {
                    font-size: 18px;
                    font-weight: 700;
                    line-height: 25.2px;
                    letter-spacing: -0.02em;
                }

                .description {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;

                    p {
                        span {
                            font-size: 16px;
                            font-weight: 500;
                            line-height: 22.4px;
                            letter-spacing: -0.02em;
                        }
                    }

                    .images {
                        display: flex;
                        flex-direction: row;
                        gap: 10px;

                        img {
                            width: 80px;
                            height: 80px;
                            border-radius: 10px;
                            object-fit: cover;
                        }
                    }
                }
            }
        }
    }
}


.scroll-left {
    transform: rotate(180deg);
    left: 8px;
}

.scroll-right {
    right: 8px;
}

.scroll-left,
.scroll-right {
    position: absolute;
    top: 114px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    background: white;
    border-radius: 100%;
    cursor: pointer;
}

.info {
    display: flex;
    gap: 20px;

    @media screen and (max-width: 785px) {
        flex-direction: column;
    }

    .big_image {
        min-width: 350px;

        img {
            width: 100%;
            object-fit: cover;
        }

        @media screen and (max-width: 450px) {
            min-width: 100%;
        }
    }

    .rest_info {
        display: flex;
        flex-direction: column;
        gap: 20px;


        .rest_images {
            display: flex;
            flex-direction: row;
            gap: 10px;
            width: 100%;
            flex-wrap: wrap;

            img {
                width: 80px;
                height: 80px;
                object-fit: cover;
                border-radius: 10px;
                cursor: pointer;
            }
        }

        .buttons {
            display: flex;
            gap: 10px;
        }
    }
}

.description {
    display: flex;
    flex-direction: column;
    gap: 20px;

    &.mobile {
        display: none;
    }

    @media screen and (max-width: 785px) {
        display: none;

        &.mobile {
            display: flex;
            flex-direction: column;
        }
    }

    p {
        line-height: 22.4px;
    }

    span {
        font-size: 14px;
        font-weight: 700;
        line-height: 14px;
    }

}
</style>