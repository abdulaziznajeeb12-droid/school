import api from "../api/axios";

// GET ALL
export const getSchools = async () => {
    const response = await api.get("/School/GetAllSchool");
    return response.data;
};

// GET BY ID
export const getSchoolById = async (id) => {
    const response = await api.get(`/School/GetSchoolById?id=${id}`);
    return response.data;
};

// SEARCH
export const searchSchool = async (search) => {
    const response = await api.get(`/School/SearchSchool?search=${search}`);
    return response.data;
};

// ADD
export const addSchool = async (school) => {
    const response = await api.post("/School/AddSchool", school);
    return response.data;
};

// UPDATE
export const updateSchool = async (school) => {
    const response = await api.post("/School/UpdateSchool", school);
    return response.data;
};

// DELETE
export const deleteSchool = async (id) => {
    const response = await api.delete("/School/DeleteSchool", {
        data: { id }
    });
    return response.data;
};