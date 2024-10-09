import axiosInstance from "@/lib/axios"

export const getDashboardData = async (startDate?: Date, endDate?: Date) => {
    console.log('first')
    try {
        // Create a query string based on the provided dates
        const stDate = startDate?.toISOString()?.split('T')[0];
        const edDate = endDate?.toISOString()?.split('T')[0];
        const params = {
            ...(startDate && { stDate }),
            ...(endDate && { edDate }),
        };

        const res = await axiosInstance.get('/metrics', { params });
        return res?.data?.metrics;
    } catch (error) {
        console.error(error);
        throw error;
    }
};