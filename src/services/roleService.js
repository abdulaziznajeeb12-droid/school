import api from "../api/axios";

// Get All Roles
export const getRoles = async () => {
    const response = await api.get("/Role/GetAllRoles");
    return response.data;
};

// Get Role By Id
export const getRoleById = async (id) => {
    const response = await api.post("/Role/GetRoleByID", {
        id: Number(id)
    });
    return response.data;
};

// Add Role
export const addRole = async (role) => {
    const response = await api.post("/Role/AddRole", role);
    return response.data;
};

// Update Role
export const updateRole = async (role) => {
    const response = await api.post("/Role/UpdateRole", role);
    return response.data;
};
    export const searchRole = async (search) => {
    const response = await api.get(`/Role/SearchRole?search=${search}`);
    return response.data;
};
// Delete Role
export const deleteRole = async (id) => {
    const response = await api.delete("/Role/DeleteRole", {
        data: {
            id: Number(id)
        }
    });


    return response.data;
};

// Search Role
