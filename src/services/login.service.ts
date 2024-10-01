import axiosInstance from "@/lib/axios";

export const adminLogin = async (number: number) => {
    try {
        const response = await axiosInstance.get(`/admin/${number}`);
        return response.data
    } catch (error) {
        console.error(error);
    }
}