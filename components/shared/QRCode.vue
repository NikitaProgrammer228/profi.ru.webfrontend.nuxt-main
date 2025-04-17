<template>
    <div class="sidebar__download" :class="{ 'footer-qr': footer }">
        <p>Open in the app</p>
        <img loading="lazy" class="main" src="~/assets/icons/download-app.svg" alt="download-app" />
        <img loading="lazy" class="small" src="~/assets/icons/qr.svg" alt="qr" />
        <span>Point your phone's camera at the QR code to download the application or follow the link</span>
    </div>
</template>

<script setup lang="ts">
defineProps({
    footer: {
        type: Boolean,
        default: false
    }
})
</script>

<style lang="scss" scoped>
.sidebar__download {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-top: 24px;
    max-width: 370px;
    white-space: wrap;

    p {
        font-weight: 500;
        font-size: 18px;
    }

    span {
        font-size: 16px;
        
        line-height: 22.4px;
        color: #7B92A4;
    }

    .small {
        display: none;
    }

    @media screen and (max-width: 1024px) {
        display: none;
    }


    &.footer-qr {
        display: none;

        @media screen and (width < 1024px) {
            display: flex;
            margin-top: 0px;

            p {
                font-weight: 500;
                font-size: 14px;
            }

            img {
                width: 200px;
            }


            span {
                display: none;
            }
        }

        @media screen and (max-width: 725px) {

            .main {
                display: none;
            }

            .small {
                display: block;
            }

            p {
                
                font-size: 14px;
            }

            img {
                width: 100px;
            }
        }
    }
}
</style>