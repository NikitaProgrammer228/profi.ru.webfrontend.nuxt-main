import type { TypePrice } from "~/app/api/orderApi";

const priceTypes = {
    'per_price': 'per price',
    'in_a_hour': 'per hour',
    'for_the_service': 'for all'
};


export function useParsePriceType(type: TypePrice) {
    return priceTypes[type];
}