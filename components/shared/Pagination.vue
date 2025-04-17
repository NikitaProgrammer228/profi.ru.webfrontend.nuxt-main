<template>
    <div class="pagination" v-if="count > 6">
        <div class="pagination__buttons" v-for="n in buttonsCount" @click="nextPage(n)" :class="{ 'active': n === currentPage }">
            {{ n }}
        </div>
        <div class="pagination__button__next" @click="nextPage(currentPage + 1)">
            Next
        </div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps({
    count: Number,
    next: String,
    previous: String
});

const emit = defineEmits(['next']);

const buttonsCount = computed(() => {
    return Math.ceil((props.count || 1) / 6);
});
const currentPage = ref(1);

function nextPage(page: number) {
    if (page === currentPage.value) return;
    currentPage.value = page;

    let pageString = '';

    if (props.next) {
        pageString = props.next.slice(0, -1) + page;
    } else if (props.previous) {
        pageString = props.previous.slice(0, -1) + page;
    }
    if (page == 1) {
        pageString = props.previous.split('?page')[0];
    }

    emit('next', pageString);
}
</script>

<style lang="scss" scoped>
.pagination {
    display: flex;
    align-items: center;
    gap: 4px;

    &__buttons {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        border-radius: 100%;
        color: #9C9C9C;
        font-size: 14px;
        font-weight: 500;
        line-height: 16.8px;
        letter-spacing: -0.02em;
        cursor: pointer;

        &.active {
            background: #FFC405;
            color: #1C1C1C;
        }
    }

    &__button__next {
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 100%;
        color: #9C9C9C;
        font-size: 14px;
        font-weight: 500;
        line-height: 16.8px;
        letter-spacing: -0.02em;
        cursor: pointer;
    }
}
</style>