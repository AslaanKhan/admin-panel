import axiosInstance from "@/lib/axios"

export const getAllOrders = async() => {
    try {
        const res = await axiosInstance.get(`/order`)
        return res.data
    } catch (error) {
        return error
    }
}

export const updateOrder = async(orderId:string, data:any) => {
    try {
        const res = await axiosInstance.post(`/order/${orderId}`, data)
        return res.data
    } catch (error) {
        return error
    }
}

export const getUserOrders = async(uId:string) => {
    try {
        const res = await axiosInstance.get(`/order/${uId}`)
        return res.data
    } catch (error) {
        return error
    }
}

export const getOrderDetails = async(orderId:string) => {
    try {
        const res = await axiosInstance.get(`/orders/${orderId}`)
        return res.data
    } catch (error) {
        return error
    }
}