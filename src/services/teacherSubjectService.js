import api from "../api/axios";


// =====================================================
// GET ALL
// =====================================================

export const getTeacherSubjects = async () => {

    const response = await api.get(
        "/TeacherSubject/GetAllTeacherSubjects"
    );

    return response.data;
};


// =====================================================
// GET SELECTED SUBJECT IDS
// =====================================================

export const getAssignedSubjects = async (
    teacherId,
    classId,
    sectionId
) => {

    const response = await api.get(
        `/TeacherSubject/GetTeacherSubjects?teacherId=${teacherId}&classId=${classId}&sectionId=${sectionId}`
    );

    return response.data;
};


// =====================================================
// ADD
// =====================================================

export const addTeacherSubjects = async (data) => {

    const response = await api.post(
        "/TeacherSubject/AddTeacherSubjects",
        data
    );

    return response.data;
};


// =====================================================
// UPDATE
// =====================================================

export const updateTeacherSubjects = async (data) => {

    const response = await api.put(
        "/TeacherSubject/UpdateTeacherSubjects",
        data
    );

    return response.data;
};


// =====================================================
// DELETE
// =====================================================

export const deleteTeacherSubjects = async (
    teacherId,
    classId,
    sectionId
) => {

    const response = await api.delete(
        `/TeacherSubject/DeleteTeacherSubjects?teacherId=${teacherId}&classId=${classId}&sectionId=${sectionId}`
    );

    return response.data;
};


// =====================================================
// TEACHERS
// =====================================================

export const getTeacherUsers = async () => {

    const response = await api.get(
        "/TeacherSubject/GetTeachers"
    );

    return response.data;
};


// =====================================================
// CLASSES
// =====================================================

export const getTeacherClasses = async () => {

    const response = await api.get(
        "/TeacherSubject/GetClasses"
    );

    return response.data;
};


// =====================================================
// SECTIONS
// =====================================================

export const getTeacherSections = async (classId) => {

    const response = await api.get(
        `/TeacherSubject/GetSectionsByClass?classId=${classId}`
    );

    return response.data;
};


// =====================================================
// SUBJECTS
// =====================================================

export const getTeacherSubjectsDropdown = async () => {

    const response = await api.get(
        "/TeacherSubject/GetSubjects"
    );

    return response.data;
};