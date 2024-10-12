import axiosInstance from "@/lib/axios"

export const createOffer = async (Offer:any) => {
try {
        const res = await axiosInstance.post('/offers', Offer)
        return res.data
} catch (error) {
    console.log(error)
} 
}

export const getAllOffers = async () => {
try {
        const res = await axiosInstance.get('/offers')
        return res.data
} catch (error) {
    console.log(error)
} 
}

export const getOfferById = async (Id:string) => {
try {
        const res = await axiosInstance.get(`/offers/${Id}`)
        return res.data
} catch (error) {
    console.log(error)
} 
}

export const updateOfferById = async (Id:string, Offer:any) => {
try {
        const res = await axiosInstance.post(`/offers/${Id}`, Offer)
        return res.data
} catch (error) {
    console.log(error)
} 
}

export const toggleOffer = async (Id:string, Offer:any) => {
try {
        const res = await axiosInstance.post(`/offer/${Id}`, Offer)
        return res.data
} catch (error) {
    console.log(error)
} 
}