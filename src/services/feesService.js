import api from "../api/axios";

// =====================================================
// FEE TYPES
// =====================================================

export const getFeeTypes = async () => {
    const response = await api.get(
        "/Fees/GetFeeTypes"
    );

    return response.data;
};


export const getFeeType = async (id) => {
    const response = await api.get(
        `/Fees/GetFeeType/${id}`
    );

    return response.data;
};


export const addFeeType = async (data) => {
    const response = await api.post(
        "/Fees/AddFeeType",
        data
    );

    return response.data;
};


export const updateFeeType = async (data) => {
    const response = await api.put(
        "/Fees/UpdateFeeType",
        data
    );

    return response.data;
};


export const deleteFeeType = async (id) => {
    const response = await api.delete(
        `/Fees/DeleteFeeType/${id}`
    );

    return response.data;
};


// =====================================================
// STUDENTS
// =====================================================

export const getFeeStudents = async () => {
    const response = await api.get(
        "/Fees/GetStudents"
    );

    return response.data;
};


// =====================================================
// STUDENT FEES
// =====================================================

export const getStudentFees = async () => {
    const response = await api.get(
        "/Fees/GetStudentFees"
    );

    return response.data;
};


export const getStudentFee = async (id) => {
    const response = await api.get(
        `/Fees/GetStudentFee/${id}`
    );

    return response.data;
};


export const addStudentFee = async (data) => {
    const response = await api.post(
        "/Fees/AddStudentFee",
        data
    );

    return response.data;
};


export const updateStudentFee = async (data) => {
    const response = await api.put(
        "/Fees/UpdateStudentFee",
        data
    );

    return response.data;
};


export const deleteStudentFee = async (id) => {
    const response = await api.delete(
        `/Fees/DeleteStudentFee/${id}`
    );

    return response.data;
};