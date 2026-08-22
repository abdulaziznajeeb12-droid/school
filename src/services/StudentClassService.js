import api from "../api/axios";


// ==========================================
// GET ALL
// ==========================================

export const getStudentClasses = async () => {

    const response = await api.get(
        "/StudentClass/GetAllStudentClasses"
    );

    return response.data;
};


// ==========================================
// GET CLASSES BY BRANCH
// ==========================================

export const getClassesByBranchId = async (branchId) => {

    const response = await api.get(
        `/StudentClass/GetClassesByBranchId/${branchId}`
    );

    return response.data;
};


// ==========================================
// GET BRANCH BY CLASS
// ==========================================

export const getBranchByClassId = async (classId) => {

    const response = await api.get(
        `/StudentClass/GetBranchByClassId/${classId}`
    );

    return response.data;
};


// ==========================================
// GET SECTIONS BY CLASS
// ==========================================

export const getSectionsByClassId = async (classId) => {

    const response = await api.get(
        `/StudentClass/GetSectionsByClassId/${classId}`
    );

    return response.data;
};


// ==========================================
// GET AVAILABLE STUDENTS
// ==========================================

export const getAvailableStudents = async (
    classId,
    sectionId
) => {

    const response = await api.get(
        `/StudentClass/GetAvailableStudents?classId=${classId}&sectionId=${sectionId}`
    );

    return response.data;
};


// ==========================================
// ADD MULTIPLE STUDENTS
// ==========================================

export const addStudentClass = async (studentClass) => {

    const response = await api.post(
        "/StudentClass/AddStudentClass",
        studentClass
    );

    return response.data;
};


// ==========================================
// GET BY ID
// ==========================================

export const getStudentClassById = async (id) => {

    const response = await api.get(
        `/StudentClass/GetStudentClassById/${id}`
    );

    return response.data;
};


// ==========================================
// UPDATE
// ==========================================

export const updateStudentClass = async (studentClass) => {

    const response = await api.put(
        "/StudentClass/UpdateStudentClass",
        studentClass
    );

    return response.data;
};


// ==========================================
// DELETE
// ==========================================

export const deleteStudentClass = async (id) => {

    const response = await api.delete(
        `/StudentClass/DeleteStudentClass/${id}`
    );

    return response.data;
};