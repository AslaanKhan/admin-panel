import axiosInstance from "@/lib/axios";

export const getAllProducts = async () => {
    try {
        const response = await axiosInstance.get('/products');
        return response;
    } catch (error) {
        console.error(error);
    }
}