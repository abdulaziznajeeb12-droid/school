import api from "../api/axios";

export const getReportStudents = async () => {
    const response = await api.get("/Fees/GetStudents");
    return response.data;
};

export const getStudentReport = async (studentId) => {
    const response = await api.get(
        `/StudentReport/GetStudentReport/${studentId}`
    );

    return response.data;
};