import api from "../api/axios";

// Get All
export const getClasses = async () => {
    const response = await api.get("/Class/GetAllClasses");
    return response.data;
};

// Get By Id
export const getClassById = async (id) => {
    const response = await api.post("/Class/GetIdClass", {
        id: Number(id)
    });
    return response.data;
};

// Add
export const addClass = async (data) => {
    const response = await api.post("/Class/AddClass", data);
    return response.data;
};

// Update
export const updateClass = async (data) => {
    const response = await api.post("/Class/UpdateClass", data);
    return response.data;
};

// Delete
export const deleteClass = async (id) => {
    const response = await api.delete("/Class/DeleteClass", {
        data: {
            id: Number(id)
        }
    });

    return response.data;
};