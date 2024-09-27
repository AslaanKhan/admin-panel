import axiosInstance from "@/lib/axios";

export const getAllUsers = async () => {
    try {
        const response = await axiosInstance.get('/users');
        return response;
    } catch (error) {
        console.error(error);
    }
}

export const getUserById = async (id: string) => {
    try {
        const response = await axiosInstance.get(`/users/${id}`);
        return response;
    } catch (error) {
        console.error(error);
    }
}