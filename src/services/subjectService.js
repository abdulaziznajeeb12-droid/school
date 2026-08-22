import api from "../api/axios";


// =========================
// GET ALL
// =========================

export const getSubjects = async () => {

    const response = await api.get(
        "/Subject/GetAllSubjects"
    );

    return response.data;
};


// =========================
// GET BY ID
// =========================

export const getSubjectById = async (id) => {

    const response = await api.get(
        `/Subject/GetSubjectById?id=${id}`
    );

    return response.data;
};


// =========================
// SEARCH
// =========================

export const searchSubject = async (search) => {

    const response = await api.get(
        `/Subject/SearchSubject?search=${encodeURIComponent(search)}`
    );

    return response.data;
};


// =========================
// ADD
// =========================

export const addSubject = async (subject) => {

    const response = await api.post(
        "/Subject/AddSubject",
        subject
    );

    return response.data;
};


// =========================
// UPDATE
// =========================

export const updateSubject = async (subject) => {

    const response = await api.post(
        "/Subject/UpdateSubject",
        subject
    );

    return response.data;
};


// =========================
// DELETE
// =========================

export const deleteSubject = async (id) => {

    const response = await api.delete(
        "/Subject/DeleteSubject",
        {
            data: {
                id: Number(id)
            }
        }
    );

    return response.data;
};