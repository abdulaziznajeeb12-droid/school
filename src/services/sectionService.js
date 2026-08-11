import api from "../api/axios";

// Get All
export const getSections = async () => {
    const response = await api.get("/Section/GetAllSection");
    return response.data;
};

// Get By Id
export const getSectionById = async (id) => {
    const response = await api.post("/Section/GetIdSection", {
        sectionId: Number(id)
    });
    return response.data;
};

export const searchSection = async (search) => {
    const response = await api.get(`/Section/SearchSection?search=${search}`);
    return response.data;
};
// Add
export const addSection = async (section) => {
    const response = await api.post("/Section/AddSection", section);
    return response.data;
};

// Update
export const updateSection = async (section) => {
    const response = await api.post("/Section/UpdateSection", section);
    return response.data;
};

// Delete
export const deleteSection = async (id) => {
    const response = await api.delete("/Section/DeleteSection", {
        data: {
            sectionId: Number(id)
        }
    });

    return response.data;
};  