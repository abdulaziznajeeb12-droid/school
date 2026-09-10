import api from "../api/axios";

// ===============================
// LOGIN
// ===============================

export const loginUser = async (email, password) => {

    const response = await api.post("/Auth/login", {
        email: email,
        password: password
    });

    return response.data;
};


// ===============================
// LOGOUT
// ===============================

export const logoutUser = async () => {

    try {
        await api.post("/Auth/logout");
    } catch (error) {
        console.log("Logout API error:", error);
    }

    localStorage.removeItem("user");
};