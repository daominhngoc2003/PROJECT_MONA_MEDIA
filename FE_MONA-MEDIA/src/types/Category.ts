export interface ICategory {
    _id?: string,
    category_name: string,
    category_images: string,
    products?: [],
    updatedAt?: Date,
    createAt?: Date,
    slug?: string
}