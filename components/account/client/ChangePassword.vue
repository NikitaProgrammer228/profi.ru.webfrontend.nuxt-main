<template>
    <div class="password">
        <div class="password__action">
            <div class="icon">
                <img loading="lazy" src="~/assets/icons/key.svg" alt="key" />
            </div>
            Change password
        </div>
        <img loading="lazy" src="~/assets/icons/arrow-right.svg" alt="arrow" />
    </div>
</template>

<style lang="scss" scoped>
.password {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    cursor: pointer;
    user-select: none;

    &__action {
        display: flex;
        flex-direction: row;
        gap: 12px;
        align-items: center;

        font-size: 14px;
        font-weight: 500;
        line-height: 14px;

        .icon {
            width: 36px;
            height: 36px;
            border-radius: 8px;
            padding: 8px;
            background: rgba(244, 244, 244, 1);
        }
    }

    &>img {
        width: 8px;
    }
}
</style>