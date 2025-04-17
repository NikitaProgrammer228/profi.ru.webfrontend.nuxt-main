import { getMyOrders, getArchiveOrders, type Order, type OrderResponse } from "~/app/api/orderApi";

export const useOrderStore = defineStore("order", () => {
    const masterOrders = ref<Order[]>([]);
    const activeOrders = ref<Order[]>([]);
    const archiveOrders = ref<Order[]>([]);
    const currentOrder = ref<Order | null>(null);
    const orderResponses = ref<OrderResponse[]>([]);
    const currentResponse = ref<OrderResponse | null>(null);
    const currentFeedback = ref<any | null>(null);

    async function getClientOrders() {
        activeOrders.value = await getMyOrders();
        archiveOrders.value = await getArchiveOrders();
    }

    return { 
        masterOrders, 
        activeOrders,
        archiveOrders,
        currentOrder,
        orderResponses,
        currentResponse,
        currentFeedback,
        
        getClientOrders,
    };
});