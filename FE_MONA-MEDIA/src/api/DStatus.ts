import { instance } from "./instance";

export const GetAllDStatus = () => {
    return instance.get(`/pStatus`);
};