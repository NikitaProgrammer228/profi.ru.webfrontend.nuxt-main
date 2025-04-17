<template>
    <div class="examples__list">
        <div v-for="n in 5" class="example" :key="n" @click="$router.push(`/client/master/${$route.params.id}/example/1`)">
            <img loading="lazy" src="~/assets/images/example.png" alt="example">
            <p>Description</p>
            <p style="font-weight: 500;">100 $</p>
        </div>
    </div>
</template>

<script setup lang="ts">

</script>

<style lang="scss" scoped>
.example {
    display: flex;
    flex-direction: column;
    gap: 6px;
    min-width: 210px;
    cursor: pointer;

    p {
        font-size: 14px;
        line-height: 19.6px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    img {
        width: 100%;
        max-width: 210px;
        object-fit: cover;
    }
}

.examples__list {
    position: relative;
    display: flex;
    gap: 24px;
    flex-wrap: no-wrap;
    overflow-x: scroll;

    &::-webkit-scrollbar {
        display: none;
    }
}

.scroll-left {
    transform: rotate(180deg);
    left: -16px;
}

.scroll-right {
    right: -16px;
}

.scroll-left, .scroll-right {
    position: absolute;
    top: 54px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    background: white;
    border-radius: 100%;
    cursor: pointer;
}
</style>