import { instance } from "./instance";

//add, update
export const AddToCart = (cart: any) => {
    return instance.post("/carts", cart);
};
export const UpdateCart = (cart: any) => {
    return instance.post(`/carts/update`, cart);
};

//delete
export const DeleteProductCart = (cart: any) => {
    return instance.post(`/carts/delete`, cart);
};
export const DeleteAllProductCart = (userId: string) => {
    return instance.delete(`/carts/deleteall/${userId}`);
};

// get
export const GetALlCart = () => {
    return instance.get("/carts");
};
export const GetCartById = (_id: any) => {
    return instance.get(`/carts/${_id}`);
};
export const GetCartByUser = (_id: any) => {
    return instance.get(`/carts/user/${_id}`);
};

