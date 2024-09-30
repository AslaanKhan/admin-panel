import axiosInstance from "@/lib/axios";

export const getAllProducts = async () => {
    try {
        const response = await axiosInstance.get('/products');
        return response;
    } catch (error) {
        console.error(error);
    }
}

export const getProductById = async (productId:string) => {
    try {
        const response = await axiosInstance.get(`/products/${productId}`);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export const getProductByCategory = async (categoryId:string) => {
    try {
        const response = await axiosInstance.get(`/productsByCategory/${categoryId}`);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export const updateProduct = async (productId:string, data:any) => {
    try {
        const response = await axiosInstance.post(`/products/${productId}`, data);
        return response;
    } catch (error) {
        console.error(error);
    }
}

export const updateStock = async (productId:string, data:any) => {
    try {
        const response = await axiosInstance.post(`/product/${productId}`, data);
        return response;
    } catch (error) {
        console.error(error);
    }
}

export const createProduct = async (data:any) => {
    try {
        const response = await axiosInstance.post('/products', data);
        return response;
    } catch (error) {
        console.error(error);
    }
}

export const deleteProductById = async (productId:any) => {
    try {
        const response = await axiosInstance.delete(`/products/${productId}`);
        return response;
    } catch (error) {
        console.error(error);
    }
}