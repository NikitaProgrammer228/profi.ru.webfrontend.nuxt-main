const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export function useParseDeadline(time: string) {
    const date = new Date(time);
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();

    const today = new Date();
    const todayYear = today.getFullYear();

    if (year === todayYear) {
        return `Until ${months[month]} ${day}`;
    } else {
        return `Until ${months[month]} ${day} ${year}`;
    }
}