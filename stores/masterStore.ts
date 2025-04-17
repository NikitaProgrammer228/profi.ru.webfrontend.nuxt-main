import type { Master } from "~/app/api/categoryApi";

export interface ProfileMaster extends Master {
    is_social_account: boolean;
    education: any[];
    completed_orders: any[];
    date_of_birth: string;
    passport_front: string;
    passport_back: string;
    is_organization: boolean;
    gender: 'male' | 'female' | '';
}

export const useMasterStore = defineStore("master", () => {
    const masters = ref<Master[]>([]);

    const master = ref<Master | null>(null);

    const profile = ref<ProfileMaster>({
        id: "",
        first_name: "",
        last_name: "",
        avatar: "",
        email: "",
        user: 0,
        gender: "",
        name_organization: "",
        description: "",
        address: "",
        average_rating_value: 0,
        reviews_count: 0,
        reviews: [],
        specializations: [],
        special_offers: [],
        education: [],
        completed_orders: [],
        created: "",
        modified: "",
        date_of_birth: "",
        passport_front: "",
        passport_back: "",
        is_social_account: false,
        is_organization: false,
        is_verify: false,
        is_publish: false,
    });

    return {
        masters,
        master,
        profile,
    };
});