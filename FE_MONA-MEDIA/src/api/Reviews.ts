import { instance } from "./instance";


export const postReviews = (data: any) => {
    return instance.post(`/reviews`, data);
}
