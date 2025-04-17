import { getCategories, getMasterById, getSubcategories, getSubcategory, getSubcategoryWithQuery, type Category, type Master, getMastersByQueryString } from "~/app/api/categoryApi";

interface SubCategories {
    services_with_prices: any;
    subcategories: Category[];
}

export const useCatalogStore = defineStore("catalog", () => {
    const categories = ref<Category[]>([]);
    const subcategories = ref<SubCategories>({});
    const masters = ref<Master[]>([]);
    const master = ref<Master | null>(null);

    const count = ref(0);
    const next = ref('');
    const previous = ref('');

    async function getAllCategories(): Promise<void> {
        const res = await getCategories();
        
        categories.value = res;
    }

    async function getAllSubcategories(id: string): Promise<void> {
        const res = await getSubcategories(id);

        subcategories.value = res;
    }

    async function getMasters(id: string, subId: string, query?: any): Promise<void> {
        console.log(query, 'query');
        if (!query) {
            const res = await getSubcategory(id, subId);
            masters.value = res.results;
            count.value = res.count;
            next.value = res.next;
            previous.value = res.previous;
        } else {
            const res = await getSubcategoryWithQuery(id, subId, query);
            masters.value = res.results;
            count.value = res.count;
            next.value = res.next;
            previous.value = res.previous;
        }

    }

    async function getMastersByQuery(query: string) {
        const res = await getMastersByQueryString(query);

        masters.value = res.results;
        count.value = res.count;
        next.value = res.next;
        previous.value = res.previous;
    }

    async function getMaster(id: string) {
        const res = await getMasterById(id);
        
        master.value = res;
    }

    return {    
        categories,
        subcategories,
        masters,
        master,
        count,
        next,
        previous,

        getAllCategories,
        getAllSubcategories,
        getMasters,
        getMastersByQuery,
        getMaster,
    }
});