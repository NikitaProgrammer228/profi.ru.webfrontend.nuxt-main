export function useBirthDate(birthDate: string | undefined | null) {
    if (!birthDate) return 'Not set';
    const date = new Date(birthDate);
    const year = date.getFullYear();

    const today = new Date();
    const todayYear = today.getFullYear();

    const age = year - todayYear;

    return `${age} years old`;
}