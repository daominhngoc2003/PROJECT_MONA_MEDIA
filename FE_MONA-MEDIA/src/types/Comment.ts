export interface IComment {
    _id?: string;
    user_fullName?: string;
    user_avatar?: string;
    rating: number;
    review: string;
    productId: string;
    categoryId: string;
    createdAt?: string;
    updatedAt?: Date;
}
export interface IPostComment {
    userId: string;
    rating: number;
    review: string;
    productId: string;
}
