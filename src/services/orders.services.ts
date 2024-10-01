import axiosInstance from "@/lib/axios"

export const getAllOrders = async() => {
    try {
        const res = await axiosInstance.get(`/order`)
        return res.data
    } catch (error) {
        return error
    }
}