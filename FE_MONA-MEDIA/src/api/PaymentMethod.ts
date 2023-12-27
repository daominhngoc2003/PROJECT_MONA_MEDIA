import { instance } from "./instance";

export const getPaymentMethodClient = () => {
    return instance.get(`/payment-methods`);
}
