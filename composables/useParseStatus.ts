import type { Status } from "~/app/api/orderApi";

export const useParseStatus = (status: Status) => {
    switch (status) {
        case 'search_for_performers':
            return 'Search for performers';
        case 'completed':
            return 'Completed';
        case 'in_progress':
            return 'In progress';
        case 'pending':
            return 'Pending';
            case "cancelled":
                return 'Cancelled';
            case "archived":
                return 'Archived';
            case "deleted":
                return 'Deleted';
        default:
            return 'Search for performers';
    }
}