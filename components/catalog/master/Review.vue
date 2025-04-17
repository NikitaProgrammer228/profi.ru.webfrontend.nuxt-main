<template>
    <div class="review">
        <div class="review__header">
            <div class="title">
                <div>
                    <img loading="lazy" src="~/assets/icons/star.svg" alt="star" width="13px" height="15px" />
                    <img loading="lazy" src="~/assets/icons/star.svg" alt="star" width="13px" height="15px" />
                    <img loading="lazy" src="~/assets/icons/star.svg" alt="star" width="13px" height="15px" />
                    <img loading="lazy" src="~/assets/icons/star.svg" alt="star" width="13px" height="15px" />
                    <img loading="lazy" src="~/assets/icons/star.svg" alt="star" width="13px" height="15px" />
                </div>
                <p>Oksana left a review</p>
                <span>Service name</span>
            </div>
            <p>January 29, 2024</p>
        </div>
        <div class="review__block">
            <p>Advantages:</p>
            <span>Lorem ipsum dolor sit amet consectetur. Morbi semper amet magna molestie augue. Eu
                dictum nibh vel non est sed felis. Lacus at non dolor hendrerit turpis ultricies
                volutpat ac mauris.</span>
        </div>
        <div class="review__block">
            <p>Flaws:</p>
            <span>Lorem ipsum dolor sit amet consectetur. Morbi semper amet magna molestie augue. Eu
                dictum nibh vel non est sed felis. Lacus at non dolor hendrerit turpis ultricies
                volutpat ac mauris.</span>
        </div>
        <div class="review__block">
            <p>A comment:</p>
            <span>Lorem ipsum dolor sit amet consectetur.</span>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.review {
    display: flex;
    flex-direction: column;
    gap: 8px;

    &__header {
        display: flex;
        justify-content: space-between;

        .title {
            display: flex;
            flex-direction: column;
            gap: 4px;

            p {
                font-size: 14px;
                line-height: 19.6px;
            }

            span {
                font-size: 12px;
                line-height: 15.6px;
                color: #828282;
            }
        }

        &>p {
            font-size: 12px;
            line-height: 15.6px;
            color: #828282;
        }
    }

    &__block {
        p {
            font-size: 14px;
            font-weight: 500;
            line-height: 16.8px;
        }

        span {
            font-size: 14px;
            line-height: 19.6px;
        }
    }
}
</style>