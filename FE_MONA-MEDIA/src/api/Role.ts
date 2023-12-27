import { instance } from "./instance";

export const getaAllRole = (data: any) => {
    return instance.get(`/roles?_page=${data.currentPages}&_search=${data._keywords}&_limit=${data._limit}`);
}

export const getRoleById = (id: string) => {
    return instance.get(`/roles/${id}`);
}

export const deleteRole = (id: string) => {
    return instance.delete(`/roles/${id}`);
}

export const udpateRole = (role: any) => {
    const { _id, ...data } = role;
    console.log(_id);

    return instance.put(`/roles/${role._id}`, data);
}

export const addRole = (role: any) => {
    return instance.post(`/roles`, role);
}
