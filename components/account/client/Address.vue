<template>
    <div class="address">
        <div class="address__header">
            <p>Do you recieve master at home?</p>
            <span>Mira street, 1, Tolyatti, Samara region</span>
        </div>
        <div class="address__actions">
            <div class="address__action">
                    <img loading="lazy" src="~/assets/icons/cross.svg" alt="delete" />
                    Cancel the address
                </div>
                <div class="address__action">
                    <img loading="lazy" src="~/assets/icons/edit.svg" alt="delete" />
                    Edit address
                </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.address {
    display: flex;
    flex-direction: column;
    gap: 12px;

    &__header {
        display: flex;
        flex-direction: column;
        gap: 4px;

        p {
            font-size: 16px;
            font-weight: 500;
            line-height: 22.4px;
            letter-spacing: -0.02em;
        }

        span {
            font-size: 14px;
            line-height: 19.6px;
        }
    }

    .address__actions {
            width: -webkit-fill-available;
            width: -moz-available;
            display: flex;
            justify-content: space-between;

            .address__action {
                display: flex;
                flex-direction: row;
                gap: 4px;
                align-items: center;

                font-size: 12px;
                font-weight: 500;
                line-height: 14.4px;
                letter-spacing: -0.02em;
                color: rgba(156, 156, 156, 1);

                cursor: pointer;
                user-select: none;
            }
        }
}
</style>