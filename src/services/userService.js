import api from "../api/axios";

// Get All Users
export const getUsers = async () => {
    const response = await api.get("/Users/GetAllUsers");
    return response.data;
};

// Search User
export const searchUser = async (keyword) => {
    const response = await api.post("/Users/SearchUser", {
        keyword
    });

    return response.data;
};

// Get User By Id
export const getUserById = async (id) => {
    const response = await api.post("/Users/GetIdSection", {
        id: Number(id)
    });

    return response.data;
};

// Add User
export const addUser = async (user) => {
    const response = await api.post("/Users/AddUsers", user);
    return response.data;
};

// Update User
export const updateUser = async (user) => {
    const response = await api.post("/Users/UpdateUserReq", user);
    return response.data;
};

// Delete User
export const deleteUser = async (id) => {
    const response = await api.delete("/Users/DeleteUser", {
        data: {
            id: Number(id)
        }
    });

    return response.data;
};