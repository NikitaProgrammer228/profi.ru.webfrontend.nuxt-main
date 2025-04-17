<script setup lang="ts">
import Avatar from '~/components/shared/Avatar.vue';

const textareaRef = ref<HTMLTextAreaElement | null>(null);

onMounted(() => {
    textareaRef.value?.addEventListener('input', (e) => {
        textareaRef.value.style.height = 'auto'; // Сбрасываем высоту
        textareaRef.value.style.height = textareaRef.value?.scrollHeight + 'px'; // Устанавливаем высоту равную scrollHeight 
    })
})
</script>

<template>
    <div class="chat__wrapper">
        <div class="chat__header">
            <svg width="24" height="24" viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 1.33317L1.68689 5.64628C1.49163 5.84155 1.49163 6.15813 1.68689 6.35339L6 10.6665"
                    stroke="#3D3D3D" stroke-width="1.5" stroke-linecap="round" />
            </svg>
            <div class="chat__avatar">
                <Avatar size="80px"></Avatar>
                <div class="online"></div>
            </div>
            <div class="chat__user">
                <p>John Doe</p>
                <span>Online</span>
            </div>
        </div>
        <div class="chat">
            <div class="dayline">
                <div class="line"></div>
                <span>12-th of September</span>
                <div class="line"></div>
            </div>
            <div class="message message__left">
                <div class="message__text">
                    How to recover material and moral damage from the culprit of an accident at the same time? The
                    amount of damage is 800 tr.
                </div>
                <p>10:00</p>
            </div>
            <div class="message message__right">
                <div class="message__text">
                    How to recover material and moral damage from the culprit of an accident at the same time? The
                    amount of damage is 800 tr.
                </div>
                <p>10:00</p>
            </div>
        </div>
        <div class="chat__input">
            <div class="input">
                <textarea ref="textareaRef" placeholder="Enter a message"></textarea>
                <svg width="30" height="30" viewBox="0 0 11 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M10 4.49516V13.8332C10 16.3185 7.98528 18.3332 5.5 18.3332V18.3332C3.01472 18.3332 1 16.3185 1 13.8332L1 4.66651C1 3.00965 2.34315 1.6665 4 1.6665V1.6665C5.65685 1.6665 7 3.00965 7 4.6665L7 14.6964C7 15.5248 6.32843 16.1964 5.5 16.1964V16.1964C4.67157 16.1964 4 15.5248 4 14.6964L4 4.49516"
                        stroke="#1C1C1C" stroke-width="1.5" stroke-linecap="round" />
                </svg>
            </div>
            <button>
                <img src="~/assets/icons/send.svg" alt="send">
            </button>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.chat__wrapper {
    display: flex;
    flex-direction: column;
    gap: 32px;

    .chat__header {
        display: flex;
        align-items: center;
        gap: 8px;

        .chat__avatar {
            position: relative;

            .online {
                position: absolute;
                bottom: 0;
                right: 0;
                width: 20px;
                height: 20px;
                border-radius: 100%;
                background: #FFC700;
                border: 3.5px solid white;
            }
        }

        .chat__user {
            p {
                font-size: 36px;
                font-weight: 500;
                line-height: 36px;
                color: #242631;
            }

            span {
                font-size: 16px;
                font-weight: 400;
                line-height: 22.4px;
                color: #9C9C9C;
            }
        }
    }

    .chat {
        display: flex;
        flex-direction: column;
        gap: 32px;
        width: 100%;

        .message {
            width: 100%;
            display: flex;
            flex-direction: column;
            gap: 12px;

            p {
                font-size: 16px;
                font-weight: 400;
                line-height: 22.4px;
                color: #9C9C9C;
            }

            &.message__left {
                max-width: 371px;
                width: fit-content;

                .message__text {
                    background: #F4F4F4;
                    border-top-left-radius: 0px;
                    border-top-right-radius: 20px;
                    border-bottom-right-radius: 20px;
                    border-bottom-left-radius: 20px;
                }
            }

            &.message__right {
                align-self: flex-end;
                max-width: 371px;
                width: fit-content;
                align-items: end;

                .message__text {
                    background: #FFF5D5;
                    border-top-left-radius: 20px;
                    border-top-right-radius: 0px;
                    border-bottom-right-radius: 20px;
                    border-bottom-left-radius: 20px;
                }
            }

            .message__text {
                padding: 20px;
                font-size: 16px;
                font-weight: 400;
                line-height: 22.4px;
                color: #3D3D3D;
            }
        }

        .dayline {
            display: flex;
            align-items: center;
            gap: 6px;
            width: 100%;

            .line {
                width: 100%;
                height: 1px;
                background: #F4F4F4;
            }

            span {
                font-size: 16px;
                font-weight: 400;
                line-height: 22.4px;
                color: #9C9C9C;
                white-space: nowrap;
            }
        }
    }

    .chat__input {
        display: flex;
        align-items: end;
        gap: 16px;

        .input {
            display: flex;
            align-items: end;
            justify-content: space-between;
            gap: 8px;
            width: 100%;
            border-radius: 10px;
            padding: 13px 16px;
            background: #F4F4F4;

            svg {
                cursor: pointer;
            }

            textarea {
                width: 100%;
                height: 24px;
                min-height: 24px;
                resize: none;
                border: none;
                outline: none;
                background: transparent;

                font-size: 14px;
                font-weight: 400;
                line-height: 19.6px;
                color: #3D3D3D;
            }
        }

        button {
            border-radius: 8px;
            background: #9C9C9C;
            outline: none;
            border: none;
            min-width: 58px;
            min-height: 58px;
            width: 58px;
            height: 58px;
            cursor: pointer;
        }
    }
}
</style>