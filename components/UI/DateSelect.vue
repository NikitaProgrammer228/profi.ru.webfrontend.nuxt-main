<template>
    <div class="date-wrapper" ref="dateRef" @click="show = true">
        <div @click="show = !show" class="date-info">
            <template v-if="selectedDate">
                {{ `${selectedDate} ${currentMonthName}` }} {{ showYear ? currentYear : '' }}
            </template>
            <template v-else>
                {{ placeholder }}
            </template>
        </div>
        <div v-if="show" class="date-picker" :style="{ width: '300px', height: '350px' }">
            <div class="calendar-header">
                <p>Date selector</p>
                <div class="calendar-title">
                    <span>{{ currentMonthName }} {{ currentYear }}</span>
                    <div class="calendar-buttons">
                        <img loading="lazy" src="~/assets/icons/left.svg" alt="left" @click="changeMonth(-1)">
                        <img loading="lazy" src="~/assets/icons/left.svg" alt="left" @click="changeMonth(1)"
                            style="transform: rotate(180deg);">
                    </div>
                </div>
            </div>
            <div class="calendar-body">
                <div class="weekdays">
                    <div v-for="(day, index) in weekdays" :key="index" class="weekday"
                        :class="{ last: index === 5 || index === 6 }">
                        {{ day }}
                    </div>
                </div>
                <div class="dates">
                    <div v-for="date in daysInMonth" :key="date"
                        :class="['date', { selected: date === selectedDate, disabled: date > daysInMonth || date < 1 }]"
                        @click="selectDate(date)">
                        {{ date }}
                    </div>
                </div>
            </div>
            <button class="select-date-btn" @click="confirmDate">Select date</button>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps({
    modelValue: [String, Number],
    showYear: {
        type: Boolean,
        default: false
    },
    placeholder: {
        type: String,
        default: 'Select date'
    },
});

const emit = defineEmits(['update:modelValue']);

const show = ref(false);
const dateRef = ref(null);
const currentDate = new Date();
const selectedDate = ref<number | null>(null);
const currentMonth = ref(currentDate.getMonth());
const currentYear = ref(currentDate.getFullYear());
const currentMonthName = computed(() => ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][currentMonth.value]);

const weekdays = ref(['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']);

const daysInMonth = computed(() => {
    const date = new Date(currentYear.value, currentMonth.value + 1, 0);
    return date.getDate();
});

const selectDate = (date: number) => {
    if (date != null) {
        selectedDate.value = date;
    }
};

const changeMonth = (direction: number) => {
    const newMonth = currentMonth.value + direction;
    if (newMonth < 0) {
        currentMonth.value = 11;
        currentYear.value -= 1;
    } else if (newMonth > 11) {
        currentMonth.value = 0;
        currentYear.value += 1;
    } else {
        currentMonth.value = newMonth;
    }
};

const confirmDate = () => {
    if (selectedDate.value != null) {
        emit('update:modelValue', `${currentYear.value}-${currentMonth.value + 1}-${selectedDate.value}`);
    }
    show.value = false;
};

useClickOutside(dateRef, () => {
    show.value = false;
});
</script>

<style scoped lang="scss">
.date-wrapper {
    position: relative;
    display: flex;
    border-radius: 6px;
    align-items: center;
    justify-content: space-between;
    padding: 12px 14px;
    background: white;
    border: 1px solid rgba(156, 156, 156, 1);
    box-shadow: 0px 1px 2px 0px rgba(16, 24, 40, 0.05);
    cursor: pointer;
    max-width: 400px;
    width: 100%;
    white-space: nowrap;

    .date-info {
        width: 100%;
        height: 100%;
    }
}
.date-picker {
    user-select: none;
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 1000;
    border: 1px solid #ccc;
    border-radius: 16px;
    padding: 24px;
    background-color: white;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border: 1px solid #F4F4F4;
    box-shadow: 0px 2px 20px 2px #2B210014;
    box-shadow: 4px 4px 8px 4px #2B21000A;
    box-shadow: -4px 0px 8px 2px #2B21000A;
}

.calendar-header {
    display: flex;
    flex-direction: column;
    gap: 16px;
    align-items: start;

    p {
        font-size: 18px;
        font-weight: 500;
        line-height: 18px;
        letter-spacing: -0.02em;
        white-space: nowrap;
    }

    .calendar-title {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;

        font-size: 14px;
        font-weight: 400;
        line-height: 19.6px;

        .calendar-buttons {
            display: flex;
            align-items: center;
            gap: 10px;

            img {
                padding: 4px;
                cursor: pointer;
            }
        }
    }
}

.calendar-body {
    overflow-y: auto;
}

.weekdays {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    text-align: center;
    color: #9C9C9C;
    font-size: 14px;
    line-height: 19.6px;
}

.weekdays .last {
    color: #D51111;
}

.weekday {
    padding: 10px 0;
}

.dates {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    text-align: center;
}

.date {
    width: 30px;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 4px 8px;
    cursor: pointer;
    font-size: 14px;
    line-height: 19.6px;
}

.date.selected {
    background-color: #FFC700;
    color: white;
    padding: 4px 8px;
    border-radius: 8px;
}

.date.disabled {
    color: #ccc;
    cursor: not-allowed;
}

.select-date-btn {
    background-color: #FFC405;
    padding: 14px 16px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    width: 100%;

    font-size: 14px;
    font-weight: 500;
    line-height: 14px;
}
</style>