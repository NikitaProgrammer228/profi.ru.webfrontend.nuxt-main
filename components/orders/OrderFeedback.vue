<script setup lang="ts">
import type { PropType } from 'vue';
import BaseBlock from '../UI/BaseBlock.vue';
import BaseButton from '../UI/BaseButton.vue';
import BaseTextarea from '../UI/BaseTextarea.vue';
import type { Order } from '~/app/api/orderApi';
import { postReview } from '~/app/api/reviewApi';

import filledStar from '~/assets/icons/filled-star.svg';
import unfilledStar from '~/assets/icons/unfilled-star.svg';

const props = defineProps({
    order: {
        type: Object as PropType<Order>,
        required: true
    }
});

const star = ref(0);
const stars = ref({
    1: {
        index: 1,
        filled: false
    },
    2: {
        index: 2,
        filled: false
    },
    3: {
        index: 3,
        filled: false
    },
    4: {
        index: 4,
        filled: false
    },
    5: {
        index: 5,
        filled: false
    }
})
const comment = ref('');
const photos = ref([]);

const isValid = computed(() => {
    return star.value > 0 && comment.value.length > 0;
});

function unfill(val: any) {
    val.filled = !val.filled;
    for (let i = 1; i <= 5; i++) {
        if (i > val.index) {
            stars.value[i].filled = false;
        }
    }
    for (let i = 1; i <= 5; i++) {
        if (i <= val.index) {
            star.value = i;
            stars.value[i].filled = true;
        }
    }

}

function onFileChange(event: { target: { files: any; }; }) {
    const files = event.target.files;
    const newImages: File[] = [];

    for (let i = 0; i < files.length; i++) {
        const file = files[i];

        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                newImages.push(e.target.result);
                if (newImages.length === files.length) {
                    photos.value = [...photos.value, ...newImages];
                }
            };
            reader.readAsDataURL(file);
        }
    }
};

function deleteFile(index: number) {
    photos.value.splice(index, 1);
}

async function post() {
    await postReview({
        order: props.order.id,
        rating: star.value,
        comment: comment.value,
        photos: photos.value
    });
}
</script>

<template>
    <BaseBlock :flat="true" :padding="'0px'">
        <div class="feedback__header">
            <p>Rate the master</p>
            <div class="stars">
                <img loading="lazy" v-for="n in stars" :src="n.filled ? filledStar : unfilledStar" alt="star" @click="unfill(n)">
            </div>
        </div>
        <BaseBlock :center="false">
            <p>Your feedback</p>
            <BaseTextarea v-model="comment" placeholder="Tell us about your experience"></BaseTextarea>
            <div class="photos__block">
                <div class="photo__button" v-if="!photos.length">
                    <div class="photo__button_text">
                        <img loading="lazy" src="~/assets/icons/gallery-add.svg" alt="photo" />
                        Click to attach a photo
                    </div>
                    <img loading="lazy" src="~/assets/icons/arrow-right.svg" alt="arrow-right">
                    <input type="file" accept="image/*" multiple @change="onFileChange" />
                </div>
                <div v-if="photos.length" class="image-list">
                    <div class="image" v-for="(image, index) in photos" :key="index">
                        <div class="delete" @click="deleteFile(index)">
                            <img loading="lazy" src="~/assets/icons/delete.svg" alt="delete" />
                        </div>
                        <img loading="lazy" :src="image" alt="Uploaded Image" />
                    </div>
                    <div class="add-image">
                        <input type="file" accept="image/*" multiple @change="onFileChange" />
                        <img loading="lazy" src="~/assets/icons/plus.svg" alt="plus" />
                    </div>
                </div>
            </div>
        </BaseBlock>
        <div style="display: flex; gap: 10px;">
            <BaseButton type="cancel">Support service</BaseButton>
            <BaseButton type="base" @click="post" :disabled="!isValid">The order is completed</BaseButton>
        </div>
    </BaseBlock>
</template>

<style lang="scss" scoped>
.photos__block {
    display: flex;

    .photo__button {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        cursor: pointer;
        width: 100%;

        &_text {
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 8px;

            img {
                padding: 8px;
                border-radius: 8px;
                background: #F4F4F4;
            }
        }
    }
}

.feedback__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;

    .stars {
        display: flex;
        gap: 16px;
        align-items: center;

        img {
            cursor: pointer;
        }
    }
}

p {
    font-size: 26px;
    font-weight: 500;
    line-height: 26px;
    letter-spacing: -0.02em;
}

.photo__button>input {
    opacity: 0;
    position: absolute;
    width: 100%;
    cursor: pointer;
}

.image-list {
    display: flex;
    gap: 8px;
    align-items: center;


    img {
        width: 60px;
        height: 60px;
        object-fit: cover;
        border-radius: 6px;
    }

    .image {
        position: relative;

        .delete {
            position: absolute;
            top: 4px;
            right: 4px;
            display: flex;
            cursor: pointer;
            padding: 4px;
            background: white;
            border-radius: 100%;

            img {
                width: 10px;
                height: 10px;
            }
        }
    }
}

.add-image {
    width: 60px;
    height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid rgba(255, 199, 0, 1);
    border-radius: 6px;
    cursor: pointer;
    position: relative;

    &>input {
        opacity: 0;
        position: absolute;
        width: 100%;
        height: 100%;
        cursor: pointer;
    }

    img {
        width: 24px;
        height: 24px;
    }
}
</style>