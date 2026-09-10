import api from "../api/axios";

export const getRFIDStudents = async () => {
    const response = await api.get(
        "/RFIDCard/GetStudents"
    );

    return response.data;
};

export const getRFIDCards = async () => {
    const response = await api.get(
        "/RFIDCard/GetAll"
    );

    return response.data;
};

export const assignRFIDCard = async (data) => {
    const response = await api.post(
        "/RFIDCard/Assign",
        data
    );

    return response.data;
};

export const updateRFIDCard = async (oldRfid, data) => {
    const response = await api.put(
        `/RFIDCard/Update/${encodeURIComponent(oldRfid)}`,
        data
    );

    return response.data;
};

export const deactivateRFIDCard = async (rfid) => {
    const response = await api.put(
        `/RFIDCard/Deactivate/${encodeURIComponent(rfid)}`
    );

    return response.data;
};

export const activateRFIDCard = async (rfid) => {
    const response = await api.put(
        `/RFIDCard/Activate/${encodeURIComponent(rfid)}`
    );

    return response.data;
};

export const deleteRFIDCard = async (rfid) => {
    const response = await api.delete(
        `/RFIDCard/Delete/${encodeURIComponent(rfid)}`
    );

    return response.data;
};