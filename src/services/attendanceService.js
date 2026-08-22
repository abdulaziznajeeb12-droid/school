import api from "../api/axios";

// ===============================
// GET CLASSES
// ===============================
export const getAttendanceClasses = async () => {
    const response = await api.get(
        "/Attendance/GetClasses"
    );

    console.log("Classes:", response.data);

    return response.data;
};


// ===============================
// GET SECTIONS
// ===============================
export const getAttendanceSections = async (classId) => {

    const response = await api.get(
        `/Attendance/GetSectionsByClass?classId=${classId}`
    );

    console.log("Sections:", response.data);

    return response.data;
};


// ===============================
// GET SUBJECTS
// ===============================
export const getAttendanceSubjects = async () => {

    const response = await api.get(
        "/Attendance/GetSubjects"
    );

    console.log("Subjects:", response.data);

    return response.data;
};


// ===============================
// GET STUDENTS
// ===============================
export const getAttendanceStudents = async (data) => {

    console.log("Students request:", data);

    const response = await api.post(
        "/Attendance/GetAttendanceStudents",
        data
    );

    console.log("Students response:", response.data);

    return response.data;
};


// ===============================
// SAVE ATTENDANCE
// ===============================
export const saveAttendance = async (data) => {

    const response = await api.post(
        "/Attendance/SaveAttendance",
        data
    );

    return response.data;
};


// ===============================
// UPDATE
// ===============================
export const updateAttendance = async (data) => {

    const response = await api.put(
        "/Attendance/UpdateAttendance",
        data
    );

    return response.data;
};


// ===============================
// DELETE
// ===============================
export const deleteAttendance = async (id) => {

    const response = await api.delete(
        `/Attendance/DeleteAttendance/${id}`
    );

    return response.data;
};