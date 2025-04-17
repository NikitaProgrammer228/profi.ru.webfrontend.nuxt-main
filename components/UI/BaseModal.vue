<template>
    <Teleport to="body">
        <div class="modal">
            <div class="modal__wrapper" ref="modalRef">
                <slot></slot>
            </div>
        </div>
    </Teleport>
</template>

<script lang="ts" setup>

const emit = defineEmits(['close']);

const modalRef = ref(null);
let mounted = false;

useClickOutside(modalRef, () => {
    if (!mounted) {
        mounted = true;
        return;
    }
    emit('close');
});

onMounted(() => {
    document.body.style.overflow = 'hidden';
});

onUnmounted(() => {
    document.body.style.overflow = 'auto';
});
</script>

<style lang="scss" scoped>
.modal {
    position: fixed;
    z-index: 10000;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.2);
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;

    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 30px 0;

    &__wrapper {
        background: white;
        border-radius: 10px;
        padding: 24px;
        max-width: 100%;
        margin: auto;
        display: flex;
        flex-direction: column;
        gap: 25px;
        flex-shrink: 0;
    }
}
</style>