<template>
    <BaseBlock :center="false" class="response">
        <div class="info">
            <p>Your response</p>
            <span v-if="type === 'not-viewed'">Not viewed</span>
            <span v-if="type === 'viewed'" style="color: rgba(255, 199, 0, 1);">Viewed</span>
            <span v-else>Viewed • 7 days ago</span>
        </div>
        <p>The offered price {{ response.type }}: {{ response.price }} {{ values[response.currency].value }}</p>
        <span>{{ response.description }}</span>
        <div class="images" v-if="response.images.length">
                <div class="image" v-for="(image, index) in response.images" :key="index">
                    <img loading="lazy" :src="image" alt="Uploaded Image" />
                </div>
        </div>
        <div class="buttons" v-if="type === 'not-viewed' || type === 'viewed'">
            <div class="delete">
                <img loading="lazy" src="~/assets/icons/trash.svg" alt="delete" />
                Delete response
            </div>
            <span>7 days ago</span>
        </div>
    </BaseBlock>
</template>

<script setup lang="ts">
import BaseBlock from '../UI/BaseBlock.vue';

type Type = 'not-viewed' | 'viewed' | 'active' | 'archive';

defineProps({
    response: {
        type: Object,
        required: true
    },
    type: {
        type: String as () => Type,
        required: true
    }
});

const values = ref({
    'USD': {
        title: 'USD',
        value: '$',
    },
    'EUR': {
        title: 'EUR',
        value: '€',
    },
    'RUB': {
        title: 'RUB',
        value: '₽',
    }
});
</script>

<style lang="scss" scoped>
.response {
    display: flex;
    flex-direction: column;
    gap: 10px;

    .info {
        display: flex;
        justify-content: space-between;
        border-bottom: 1.5px solid rgba(244, 244, 244, 1);
        padding-bottom: 10px;

        p {
            font-size: 18px;
            font-weight: 500;
            line-height: 18px;
            letter-spacing: -0.02em;
        }

        span {
            font-size: 14px;
            
            line-height: 19.6px;
            color: rgba(156, 156, 156, 1);
        }
    }

    &>p {
        font-size: 14px;
        font-weight: 700;
        line-height: 19.6px;
    }

    .images {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;

        img {
            width: 60px;
            height: 60px;
            object-fit: cover;
            border-radius: 6px;
        }
    }

    .buttons {
        display: flex;
        justify-content: space-between;

        .delete {
            display: flex;
            align-items: center;
            color: rgba(156, 156, 156, 1);
            gap: 8px;
        }

        span {
            font-size: 14px;
            
            line-height: 19.6px;
            color: rgba(156, 156, 156, 1);
        }
    }
}
</style>