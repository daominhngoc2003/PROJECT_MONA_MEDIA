import { IImagesProduct } from "../types/Product";
import { instance } from "./instance";


export const UpdateImage = (url: IImagesProduct) => {
    return instance.put(`/images/update/${url.publicId}`, url);
}

export const UploadImages = (url: any) => {
    return instance.post(`/images/upload`, url);
}
export const RemoveImages = (urlId: any) => {
    return instance.delete(`/images/delete/${urlId}`);
}

