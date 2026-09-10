import api from "../api/axios";


// ======================================================
// GET ALL
// ======================================================

export const getTeacherSubjects = async () => {

    const response = await api.get(
        "/TeacherSubject/GetAllTeacherSubjects"
    );

    return response.data;
};


// ======================================================
// GET BY ID
// ======================================================

export const getTeacherSubjectById = async (id) => {

    const response = await api.get(
        `/TeacherSubject/GetTeacherSubjectById/${Number(id)}`
    );

    return response.data;
};


// ======================================================
// ADD
// ======================================================

export const addTeacherSubject = async (data) => {

    const response = await api.post(
        "/TeacherSubject/AddTeacherSubject",
        data
    );

    return response.data;
};



// ======================================================
// UPDATE
// ======================================================

export const updateTeacherSubject = async (data) => {

    const response = await api.put(
        `/TeacherSubject/UpdateTeacherSubject/${data.teacherSubjectId}`,
        data
    );

    return response.data;
};


// ======================================================
// DELETE
// ======================================================

export const deleteTeacherSubject = async (id) => {

    const response = await api.delete(
        `/TeacherSubject/DeleteTeacherSubject/${Number(id)}`
    );

    return response.data;
};


// ======================================================
// GET TEACHERS
// ======================================================

export const getTeachers = async () => {

    const response = await api.get(
        "/TeacherSubject/GetTeachers"
    );

    return response.data;
};


// ======================================================
// GET TEACHER USERS
// ======================================================

export const getTeacherUsers = async () => {

    const response = await api.get(
        "/TeacherSubject/GetTeachers"
    );

    return response.data;
};


// ======================================================
// GET CLASSES
// ======================================================

export const getTeacherClasses = async () => {

    const response = await api.get(
        "/TeacherSubject/GetClasses"
    );

    return response.data;
};


// ======================================================
// GET SECTIONS
// ======================================================

export const getTeacherSections = async (classId) => {

    const response = await api.get(
        `/TeacherSubject/GetSections/${Number(classId)}`
    );

    return response.data;
};


// ======================================================
// GET SUBJECTS
// ======================================================

export const getTeacherSubjectsList = async () => {

    const response = await api.get(
        "/TeacherSubject/GetSubjects"
    );

    return response.data;
};


// ======================================================
// SUBJECT DROPDOWN
// ======================================================

export const getTeacherSubjectsDropdown = async () => {

    const response = await api.get(
        "/TeacherSubject/GetSubjects"
    );

    return response.data;
};