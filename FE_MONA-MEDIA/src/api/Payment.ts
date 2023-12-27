import { instance } from "./instance";


export const createPayment = (data: any) => {
    return instance.post(`/create_payment_url`, data);
}
