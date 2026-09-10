import api from "../api/axios";

export const getExamTypes = async () => {
    const response = await api.get("/ExamType/GetAllExamTypes");
    return response.data;
};

export const getExamTypeById = async (id) => {
    const response = await api.get(`/ExamType/GetExamTypeById/${id}`);
    return response.data;
};

export const addExamType = async (data) => {
    const response = await api.post("/ExamType/AddExamType", data);
    return response.data;
};

export const updateExamType = async (id, data) => {
    const response = await api.put(`/ExamType/UpdateExamType/${id}`, data);
    return response.data;
};

export const deleteExamType = async (id) => {
    const response = await api.delete(`/ExamType/DeleteExamType/${id}`);
    return response.data;
};

export const getExams = async () => {
    const response = await api.get("/Exam/GetAllExams");
    return response.data;
};

export const getExamById = async (id) => {
    const response = await api.get(`/Exam/GetExamById/${id}`);
    return response.data;
};

export const addExam = async (data) => {
    const response = await api.post("/Exam/AddExam", data);
    return response.data;
};

export const updateExam = async (id, data) => {
    const response = await api.put(`/Exam/UpdateExam/${id}`, data);
    return response.data;
};

export const deleteExam = async (id) => {
    const response = await api.delete(`/Exam/DeleteExam/${id}`);
    return response.data;
};

export const getExamTypesDropdown = async () => {
    const response = await api.get("/Exam/GetExamTypes");
    return response.data;
};

export const getExamSubjects = async () => {
    const response = await api.get("/Exam/GetSubjects");
    return response.data;
};

export const getExamClasses = async () => {
    const response = await api.get("/Exam/GetClasses");
    return response.data;
};

export const getExamSections = async (classId) => {
    const response = await api.get(`/Exam/GetSections/${classId}`);
    return response.data;
};