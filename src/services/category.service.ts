import axiosInstance from "@/lib/axios"

export const getCategories = async() => {
    try {
        const res = await axiosInstance.get('/categories')
        return res.data
    } catch (error) {
        return error
    }
}

export const createCategory = async(data:any) => {
    try {
        const res = await axiosInstance.post('/categories',data)
        return res.data
    } catch (error) {
        return error
    }
}

export const deleteCategoryById = async(categoryId:any) => {
    try {
        const res = await axiosInstance.delete(`/categories/${categoryId}`)
        return res.data
    } catch (error) {
        return error
    }
}

export const updateCategoryById = async(categoryId:string, data:any) => {
    try {
        const res = await axiosInstance.post(`/categories/${categoryId}`, data)
        return res.data
    } catch (error) {
        return error
    }
}