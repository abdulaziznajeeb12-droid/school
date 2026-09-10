import api from "../api/axios";

export const getMarks = async () => {
    const response = await api.get("/Marks/GetAllMarks");
    return response.data;
};

export const getMarkById = async (id) => {
    const response = await api.get(`/Marks/GetMarkById/${id}`);
    return response.data;
};

export const addMark = async (data) => {
    const response = await api.post("/Marks/AddMark", data);
    return response.data;
};

export const updateMark = async (id, data) => {
    const response = await api.put(`/Marks/UpdateMark/${id}`, data);
    return response.data;
};

export const deleteMark = async (id) => {
    const response = await api.delete(`/Marks/DeleteMark/${id}`);
    return response.data;
};

export const getMarkExams = async () => {
    const response = await api.get("/Marks/GetExams");
    return response.data;
};

export const getMarkSubjects = async () => {
    const response = await api.get("/Marks/GetSubjects");
    return response.data;
};

export const getMarkStudents = async () => {
    const response = await api.get("/Marks/GetStudents");
    return response.data;
};