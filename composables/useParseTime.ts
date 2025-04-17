export function useParseTime(time: string) {
    const date = new Date(time);
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();

    const today = new Date();
    const todayDay = today.getDate();
    const todayHours = today.getHours();
    const todayMinutes = today.getMinutes();

    if (day === todayDay) {
        if (hours === todayHours) {
            if ((todayMinutes - minutes) < 2) {
                return 'Just now';
            } else {
                return `${todayMinutes - minutes} minutes ago`;
            }
        } else {
            return (todayHours - hours) === 1 ? `${todayHours - hours} hour ago` : `${todayHours - hours} hours ago`;
        }
    } else {
        return (todayDay - day) === 1 ? `${todayDay - day} day ago` : `${todayDay - day} days ago`;
    }
}