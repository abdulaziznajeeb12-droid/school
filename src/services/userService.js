
import api from "../api/axios";


// ======================================================
// GET ALL USERS
// ======================================================

export const getUsers = async () => {

    const response =
        await api.get("/Users/GetAllUsers");

    return response.data;

};


// ======================================================
// SEARCH USER
// ======================================================

export const searchUser = async (keyword) => {

    const response =
        await api.post(
            "/Users/SearchUser",
            {
                keyword
            }
        );

    return response.data;

};


// ======================================================
// GET USER BY ID
// ======================================================

export const getUserById = async (id) => {

    const response =
        await api.post(
            "/Users/GetIdUsers",
            {
                id: Number(id)
            }
        );

    return response.data;

};


// ======================================================
// ADD USER
// ======================================================
// IMPORTANT:
// AddUser now receives FormData
// because image is being uploaded.
// ======================================================

export const addUser = async (formData) => {

    const response =
        await api.post(
            "/Users/AddUsers",
            formData
        );

    return response.data;

};


// ======================================================
// UPDATE USER
// ======================================================
// IMPORTANT:
// UpdateUser also receives FormData
// because image can be uploaded.
// ======================================================

export const updateUser = async (formData) => {

    const response =
        await api.post(
            "/Users/UpdateUserReq",
            formData
        );

    return response.data;

};


// ======================================================
// DELETE USER
// ======================================================

export const deleteUser = async (id) => {

    const response =
        await api.delete(
            "/Users/DeleteUser",
            {
                data: {
                    id: Number(id)
                }
            }
        );

    return response.data;

};
