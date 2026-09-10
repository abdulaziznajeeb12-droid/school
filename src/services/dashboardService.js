import api from "../api/axios";

export const getDashboardData = async () => {
    const response = await api.get("/Dashboard/GetDashboardData");
    return response.data;
};