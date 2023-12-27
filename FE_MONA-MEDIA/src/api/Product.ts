import { IProduct } from "../types/Product";
import { instance } from "./instance";

export const SearchProduct = (data: any) => {
    return instance.get(`/products?_limit=${data._limit}`);
}

export const getProductClient = (data: any) => {
    return instance.get(`/get-all-product-client?_search=${data.product_name || ''
        }&_page=${data.currentPages}&_product_code=${data.product_code || ''}&${data.PriceFilter || ''}&_category_id=${data.category_id || ''}&_limit=${data.limit ? data.limit : 10}`);
}

// Xóa mềm
export const getProductBin = (data: any) => {
    return instance.get(`/product/getAllDeleted?_page=${data.currentPages}&_search=${data._keywords}`);
}

export const deleteProductForce = (_id: any) => {
    return instance.delete(`products/force/` + _id);
}

export const restoreProduct = (_id: any) => {
    return instance.patch(`/products/restore/` + _id);
}

export const getProductById = (id: string) => {
    return instance.get(`/products/${id}`);
}

// export const getProductBySlug = (slug: string) => {
//     return instance.get(`/product/${slug}`);
// }

export const getProductByCategoryId = (_id: string) => {
    return instance.get("/products/categoryId/" + _id);
};

export const getProductByCategoryIdSearch = (_id: string) => {
    return instance.get("/products/categoryId/search/" + _id);
};


export const deleteProductSoft = (id: string) => {
    return instance.delete(`/products/${id}`);
}

export const patchProduct = (product: IProduct) => {
    const { _id, ...data } = product;
    return instance.patch(`/products/patch/${product._id}`, data);
}

export const updateProduct = (product: IProduct) => {
    const { _id, ...data } = product;

    return instance.put(`/products/${product._id}`, data);
}

export const addProduct = (product: IProduct) => {
    return instance.post(`/products`, product);
}

// export const searchProduct = (_keywords: string) => {
//     return instance.get(`/products/search?_keywords=${_keywords}&_limit=5`);
// }