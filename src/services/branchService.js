import api from "../api/axios";

// Get All
export const getBranches = async () => {
    const response = await api.get("/Branche/GetAllBranches");
    return response.data;
};

// Get By Id
export const getBranchById = async (id) => {
    const response = await api.post("/Branche/GetIdBranches", {
        id: Number(id)
    });
    return response.data;
};

export const searchBranch = async (search) => {
    const response = await api.get(`/Branche/SearchBranch?search=${search}`);
    return response.data;
};
// Add
export const addBranch = async (branch) => {
    const response = await api.post("/Branche/AddBranches", branch);
    return response.data;
};

// Update
export const updateBranch = async (branch) => {
    const response = await api.post("/Branche/UpdateBranch", branch);
    return response.data;
};

// Delete
export const deleteBranch = async (id) => {
    const response = await api.delete("/Branche/DeleteBrach", {
        data: {
            id: Number(id)
        }
    });

    return response.data;
};