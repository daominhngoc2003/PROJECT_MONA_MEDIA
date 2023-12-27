import { ICategory } from "../types/Category";
import { instance } from "./instance";


export const searchCategory = (data: any) => {
    return instance.get(`/categories?_limit=${data._limit}`);
}

export const getCategoriesClient = (data: any) => {
    return instance.get(`/get-all-category-client?_limit=${data._limit}`);
}

export const getProductByCategory = (categoryId: string) => {
    return instance.get(`/categories/${categoryId}/products`);
};

export const getCategoryById = (id: string) => {
    return instance.get(`/categories/${id}`);
}

// export const getCategoryBySlug = (slug: string) => {
//     return instance.get(`/product/${slug}`);
// }


export const deleteCategory = (id: string) => {
    return instance.delete(`/categories/${id}`);
}

export const updateCategory = (category: ICategory) => {
    return instance.put(`/categories/${category._id}`, category);
}

export const addCategory = (category: ICategory) => {
    return instance.post(`/categories`, category);
}

