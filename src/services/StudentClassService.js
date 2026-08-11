import api from "../api/axios";

// Get All
export const getStudentClasses = async () => {
    const response = await api.get("/StudentClass/GetAllStudentClasses");
    return response.data;
};

// Get By Id
export const getStudentClassById = async (id) => {
    const response = await api.post("/StudentClass/GetStudentClassByID", {
        enrolledId: Number(id)
    });

    return response.data;
};

// Add
export const addStudentClass = async (data) => {
    const response = await api.post("/StudentClass/AddStudentClass", data);
    return response.data;
};

// Update
export const updateStudentClass = async (data) => {
    const response = await api.post("/StudentClass/UpdateStudentClass", data);
    return response.data;
};

// Delete
export const deleteStudentClass = async (id) => {
    const response = await api.delete("/StudentClass/DeleteStudentClass", {
        data: {
            enrolledId: Number(id)
        }
    });

    return response.data;
};