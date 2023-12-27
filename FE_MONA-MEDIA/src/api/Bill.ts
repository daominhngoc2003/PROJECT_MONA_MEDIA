import { instance } from "./instance";

export const UpdateBillById = (bill: any) => {
    return instance.put(`/bills/update/${bill._id}`, bill);
};

export const GetAllBillAdmin = (data: any) => {
    return instance.get(`/bills?_limit=${data._limit}`);
};
export const getBillByIdUserReviews = (data: any) => {
    return instance.get(`/bills/user/${data.userId}/reviews?_page=${data.currentPages}&_search=${data.bill_code}`);
};

export const GetBillById = (id: string) => {
    return instance.get(`/bills/${id}`);
};

export const AbortBill = (_id: string) => {
    return instance.delete(`/bills/delete/${_id}`);
};
export const GetBillByUser = ({ user_id }: any) => {
    return instance.get(`/bills/user/${user_id}`);
};
export const getBillByDStatus = (data: any) => {
    return instance.get(`/bills/dStatus/${data.id}?_search=${data.bill_code}&_page=${data.currentPages}`);
};
export const getBillByIdUser = (userId: string) => {
    return instance.get(`/bills/user/${userId}`);
};
export const getBillByIdUserStatus = (data: any) => {
    return instance.get(`/bills/user/${data.userId}/status/${data.status_id}?_page=${data.currentPages}`);
};
export const updateBillStatus = (data: any) => {
    return instance.put(`/bills/update/${data._id as string}`, data);
};
export const CheckOut = (bill: any) => {
    return instance.post(`/checkout`, bill);
};
