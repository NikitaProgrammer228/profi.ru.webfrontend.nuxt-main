<template>
    <div class="avatar" :class="small ? 'small' : 'default'" :style="{ width: size, height: size }">
        <img loading="lazy" :src="url || baseUrl" alt="avatar" :style="{ width: size, height: size }" />
    </div>
</template>

<script lang="ts" setup>
import baseUrl from "~/assets/icons/profile-icon.svg";

const props = defineProps({
    small: {
        type: Boolean,
        default: false
    },
    size: {
        type: String,
        required: false
    },
    link: {
        type: String,
        required: false
    }
});

const url = ref<string | null>(null);

watch(props, () => {
    if (props.link) {
        if (props.link.startsWith("http")) {
            url.value = props.link;
            return;
        }
        url.value = "http://45.147.177.69" + props.link;
        return;
    }
    url.value = null;
    return;
}, { deep: true });

onMounted(() => {
    if (props.link) {
        if (props.link.startsWith("http")) {
            url.value = props.link;
            return;
        }
        url.value = "http://45.147.177.69" + props.link;
        return;
    }
    url.value = null;
    return;
})

</script>

<style lang="scss" scoped>
.avatar {

    &.default {
        width: 100px;
        height: 100px;

        img {
            width: 100px;
            height: 100px;
            border-radius: 8px;
        }

        @media screen and (max-width: 650px) {
            width: 80px;
            height: 80px;

            img {
                width: 80px;
                height: 80px;
            }

        }
    }

    &.small {
        cursor: pointer;
        width: 40px;
        height: 40px;

        img {
            width: 40px;
            height: 40px;
            border-radius: 100%;
        }
    }
}
</style>