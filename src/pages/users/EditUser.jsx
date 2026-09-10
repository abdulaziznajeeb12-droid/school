
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import DashboardLayout from "../../layouts/DashboardLayout";

import {
    TextField,
    Button,
    MenuItem,
    Paper,
    Box,
    Snackbar,
    Alert,
    FormControlLabel,
    Checkbox,
    Visibility,
    VisibilityOff
} from "@mui/material";

import {
    getUserById,
    updateUser
} from "../../services/userService";

import { getRoles } from "../../services/roleService";
import { getBranches } from "../../services/branchService";

import "../../assets/form.css";


function EditUser() {

    const { id } = useParams();
    const navigate = useNavigate();


    // =====================================================
    // DROPDOWNS
    // =====================================================

    const [roles, setRoles] = useState([]);
    const [branches, setBranches] = useState([]);


    // =====================================================
    // IMAGE
    // =====================================================

    const [image, setImage] = useState(null);


    // =====================================================
    // LOADING
    // =====================================================

    const [loading, setLoading] = useState(false);
    const [loadingUser, setLoadingUser] = useState(true);


    // =====================================================
    // FORM
    // =====================================================

    const [form, setForm] = useState({

        firstName: "",
        lastName: "",
        email: "",
        password: "",
        cnic: "",

        branchId: "",

        salary: "",
        gender: "",
        age: "",
        address: "",

        roleId: "",

        mobile: "",
        dateOfBirth: "",

        fatherName: "",
        motherName: "",

        fatherMobileNumber: "",
        motherMobileNumber: "",

        placeOfBirth: "",
        remarks: "",
        skills: "",

        rfid: "",

        isActive: true,

        // Existing image
        imagePath: ""

    });


    // =====================================================
    // SNACKBAR
    // =====================================================

    const [snackbar, setSnackbar] = useState({

        open: false,
        message: "",
        severity: "success"

    });


    const showSnackbar = (
        message,
        severity = "success"
    ) => {

        setSnackbar({

            open: true,
            message,
            severity

        });

    };


    const handleCloseSnackbar = (
        event,
        reason
    ) => {

        if (reason === "clickaway")
            return;


        setSnackbar(prev => ({

            ...prev,
            open: false

        }));

    };


    // =====================================================
    // LOAD DATA
    // =====================================================

    useEffect(() => {

        loadData();

    }, [id]);


   const loadData = async () => {
    try {
        setLoadingUser(true);

        const roleData = await getRoles();
        setRoles(Array.isArray(roleData) ? roleData : []);

        const branchData = await getBranches();
        setBranches(Array.isArray(branchData) ? branchData : []);

        const data = await getUserById(id);
        console.log("User Data:", data);  // MUST show the user object

        if (!data) {
            showSnackbar("User not found", "error");
            return;
        }

        setForm({
            firstName: data.firstName ?? "",
            lastName: data.lastName ?? "",
            email: data.email ?? "",
            password: "",
            cnic: data.cnic ?? "",
            branchId: data.branchId ?? "",
            salary: data.salary ?? "",
            gender: data.gender ?? "",
            age: data.age ?? "",
            address: data.address ?? "",
            roleId: data.roleId ?? "",
            mobile: data.mobile ?? "",
            dateOfBirth: formatDate(data.dateOfBirth),
            fatherName: data.fatherName ?? "",
            motherName: data.motherName ?? "",
            fatherMobileNumber: data.fatherMobileNumber ?? "",
            motherMobileNumber: data.motherMobileNumber ?? "",
            placeOfBirth: data.placeOfBirth ?? "",
            remarks: data.remarks ?? "",
            skills: data.skills ?? "",
            rfid: data.RFID ?? "",   // ← FIXED: RFID instead of rfid
            isActive: data.isActive ?? true,
            imagePath: data.imagePath ?? ""
        });
    } catch (error) {
        console.error("Load User Error:", error);
        showSnackbar("Unable To Load User", "error");
    } finally {
        setLoadingUser(false);
    }
};

    // =====================================================
    // DATE FORMAT
    // =====================================================

    const formatDate = (date) => {

        if (!date)
            return "";

        return String(date).substring(
            0,
            10
        );

    };


    // =====================================================
    // HANDLE TEXT CHANGE
    // =====================================================

    const handleChange = (e) => {

        const {
            name,
            value
        } = e.target;


        setForm(prev => ({

            ...prev,

            [name]: value

        }));

    };


    // =====================================================
    // HANDLE IMAGE
    // =====================================================

    const handleImageChange = (e) => {

        const file =
            e.target.files?.[0];


        if (!file)
            return;


        // =================================================
        // FILE TYPE
        // =================================================

        const allowedTypes = [

            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp"

        ];


        if (!allowedTypes.includes(
            file.type
        )) {

            showSnackbar(
                "Only JPG, JPEG, PNG and WEBP images are allowed.",
                "error"
            );

            e.target.value = "";

            return;

        }


        // =================================================
        // FILE SIZE
        // =================================================

        if (
            file.size >
            5 * 1024 * 1024
        ) {

            showSnackbar(
                "Image size cannot exceed 5 MB.",
                "error"
            );

            e.target.value = "";

            return;

        }


        setImage(file);

    };


    // =====================================================
    // UPDATE USER
    // =====================================================

    const saveUser = async (e) => {
    e.preventDefault();

    // Validation ...

    try {
        setLoading(true);

        const formData = new FormData();

        formData.append("id", String(Number(id)));        // required for update
        formData.append("firstName", form.firstName.trim());
        formData.append("lastName", form.lastName.trim());
        formData.append("email", form.email.trim());
        // password only if changed
        if (form.password && form.password.trim()) {
            formData.append("password", form.password.trim());
        }
        formData.append("cnic", form.cnic || "");
        formData.append("branchId", String(Number(form.branchId)));
        formData.append("salary", form.salary ? String(Number(form.salary)) : "0");
        formData.append("gender", form.gender || "");
        formData.append("age", form.age ? String(Number(form.age)) : "0");
        formData.append("address", form.address || "");
        formData.append("roleId", String(Number(form.roleId)));
        formData.append("mobile", form.mobile || "");
        formData.append("dateOfBirth", form.dateOfBirth || "");
        formData.append("fatherName", form.fatherName || "");
        formData.append("motherName", form.motherName || "");
        formData.append("fatherMobileNumber", form.fatherMobileNumber || "");
        formData.append("motherMobileNumber", form.motherMobileNumber || "");
        formData.append("placeOfBirth", form.placeOfBirth || "");
        formData.append("remarks", form.remarks || "");
        formData.append("skills", form.skills || "");
        formData.append("rfid", form.rfid?.trim()?.toUpperCase() || "");
        formData.append("isActive", form.isActive ? "true" : "false");

        if (image) {
            formData.append("image", image);
        }

        await updateUser(formData);   // ✅ correct call

        showSnackbar("User Updated Successfully", "success");
        setTimeout(() => navigate("/users"), 1000);
    } catch (error) {
        // handle error...
    } finally {
        setLoading(false);
    }
};


    // =====================================================
    // LOADING SCREEN
    // =====================================================

    if (loadingUser) {

        return (

            <DashboardLayout>

                <div className="form-page">

                    <Paper
                        elevation={4}
                        className="user-form-card"
                    >

                        <h2 className="form-title">

                            Loading User...

                        </h2>

                    </Paper>

                </div>

            </DashboardLayout>

        );

    }


    // =====================================================
    // CURRENT IMAGE URL
    // =====================================================

    const currentImageUrl =
        form.imagePath
            ? `http://localhost:5250${form.imagePath}`
            : null;


    // =====================================================
    // UI
    // =====================================================

    return (

        <DashboardLayout>

            <div className="form-page">

                <Paper
                    elevation={4}
                    className="user-form-card"
                >

                    <h2 className="form-title">
                        Edit User
                    </h2>


                    <form
                        onSubmit={saveUser}
                    >


                        <div className="user-form-grid">


                            {/* =================================================
                               IMAGE
                            ================================================= */}

                            <div
                                style={{
                                    gridColumn:
                                        "1 / -1"
                                }}
                            >

                                <label
                                    style={{
                                        display:
                                            "block",
                                        marginBottom:
                                            "10px",
                                        fontWeight:
                                            "600"
                                    }}
                                >
                                    User Image
                                </label>


                                {/* CURRENT / NEW IMAGE */}

                                {(image ||
                                    currentImageUrl) && (

                                    <img
                                        src={
                                            image
                                                ? URL.createObjectURL(image)
                                                : currentImageUrl
                                        }
                                        alt="User"
                                        style={{
                                            width:
                                                "120px",
                                            height:
                                                "120px",
                                            objectFit:
                                                "cover",
                                            borderRadius:
                                                "50%",
                                            display:
                                                "block",
                                            marginBottom:
                                                "15px"
                                        }}
                                    />

                                )}


                                <input
                                    type="file"
                                    accept="image/png,image/jpeg,image/jpg,image/webp"
                                    onChange={
                                        handleImageChange
                                    }
                                />

                            </div>


                            {/* FIRST NAME */}

                            <TextField
                                fullWidth
                                label="First Name"
                                name="firstName"
                                value={
                                    form.firstName
                                }
                                onChange={
                                    handleChange
                                }
                                required
                            />


                            {/* LAST NAME */}

                            <TextField
                                fullWidth
                                label="Last Name"
                                name="lastName"
                                value={
                                    form.lastName
                                }
                                onChange={
                                    handleChange
                                }
                                required
                            />


                            {/* EMAIL */}

                            <TextField
                                fullWidth
                                type="email"
                                label="Email"
                                name="email"
                                value={
                                    form.email
                                }
                                onChange={
                                    handleChange
                                }
                                required
                            />


                            {/* PASSWORD */}

                            <TextField
                                fullWidth
                                type="password"
                                label="New Password"
                                name="password"
                                value={
                                    form.password
                                }
                                onChange={
                                    handleChange
                                }
                                helperText="Leave blank if you don't want to change password."
                            />


                            {/* CNIC */}

                            <TextField
                                fullWidth
                                label="CNIC"
                                name="cnic"
                                placeholder="42101-1234567-1"
                                value={
                                    form.cnic
                                }
                                onChange={
                                    handleChange
                                }
                            />


                            {/* MOBILE */}

                            <TextField
                                fullWidth
                                label="Mobile"
                                name="mobile"
                                value={
                                    form.mobile
                                }
                                onChange={
                                    handleChange
                                }
                            />


                            {/* RFID */}

                            <TextField
                                fullWidth
                                label="RFID Card"
                                name="rfid"
                                value={
                                    form.rfid
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="e.g. 233C9203"
                                helperText={
                                    form.rfid
                                        ? "Current RFID card assigned to this user"
                                        : "No RFID card assigned"
                                }
                                inputProps={{
                                    style: {
                                        textTransform:
                                            "uppercase"
                                    }
                                }}
                            />


                            {/* BRANCH */}

                            <TextField
                                fullWidth
                                select
                                label="Branch"
                                name="branchId"
                                value={
                                    form.branchId
                                }
                                onChange={
                                    handleChange
                                }
                                required
                            >

                                <MenuItem value="">
                                    Select Branch
                                </MenuItem>


                                {branches.map(
                                    (branch) => (

                                        <MenuItem
                                            key={
                                                branch.id
                                            }
                                            value={
                                                branch.id
                                            }
                                        >

                                            {
                                                branch.branchName
                                            }

                                        </MenuItem>

                                    )
                                )}

                            </TextField>


                            {/* ROLE */}

                            <TextField
                                fullWidth
                                select
                                label="Role"
                                name="roleId"
                                value={
                                    form.roleId
                                }
                                onChange={
                                    handleChange
                                }
                                required
                            >

                                <MenuItem value="">
                                    Select Role
                                </MenuItem>


                                {roles.map(
                                    (role) => (

                                        <MenuItem
                                            key={
                                                role.id
                                            }
                                            value={
                                                role.id
                                            }
                                        >

                                            {role.name}

                                        </MenuItem>

                                    )
                                )}

                            </TextField>


                            {/* SALARY */}

                            <TextField
                                fullWidth
                                type="number"
                                label="Salary"
                                name="salary"
                                value={
                                    form.salary
                                }
                                onChange={
                                    handleChange
                                }
                            />


                            {/* GENDER */}

                            <TextField
                                fullWidth
                                select
                                label="Gender"
                                name="gender"
                                value={
                                    form.gender
                                }
                                onChange={
                                    handleChange
                                }
                            >

                                <MenuItem value="">
                                    Select Gender
                                </MenuItem>

                                <MenuItem value="Male">
                                    Male
                                </MenuItem>

                                <MenuItem value="Female">
                                    Female
                                </MenuItem>

                            </TextField>


                            {/* AGE */}

                            <TextField
                                fullWidth
                                type="number"
                                label="Age"
                                name="age"
                                value={
                                    form.age
                                }
                                onChange={
                                    handleChange
                                }
                            />


                            {/* DOB */}

                            <TextField
                                fullWidth
                                type="date"
                                label="Date Of Birth"
                                name="dateOfBirth"
                                value={
                                    form.dateOfBirth
                                }
                                onChange={
                                    handleChange
                                }
                                InputLabelProps={{
                                    shrink: true
                                }}
                            />


                            {/* FATHER NAME */}

                            <TextField
                                fullWidth
                                label="Father Name"
                                name="fatherName"
                                value={
                                    form.fatherName
                                }
                                onChange={
                                    handleChange
                                }
                            />


                            {/* FATHER MOBILE */}

                            <TextField
                                fullWidth
                                label="Father Mobile Number"
                                name="fatherMobileNumber"
                                value={
                                    form.fatherMobileNumber
                                }
                                onChange={
                                    handleChange
                                }
                            />


                            {/* MOTHER NAME */}

                            <TextField
                                fullWidth
                                label="Mother Name"
                                name="motherName"
                                value={
                                    form.motherName
                                }
                                onChange={
                                    handleChange
                                }
                            />


                            {/* MOTHER MOBILE */}

                            <TextField
                                fullWidth
                                label="Mother Mobile Number"
                                name="motherMobileNumber"
                                value={
                                    form.motherMobileNumber
                                }
                                onChange={
                                    handleChange
                                }
                            />


                            {/* PLACE OF BIRTH */}

                            <TextField
                                fullWidth
                                label="Place Of Birth"
                                name="placeOfBirth"
                                value={
                                    form.placeOfBirth
                                }
                                onChange={
                                    handleChange
                                }
                            />


                            {/* ADDRESS */}

                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                label="Address"
                                name="address"
                                value={
                                    form.address
                                }
                                onChange={
                                    handleChange
                                }
                                className="full-width-field"
                            />


                            {/* SKILLS */}

                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                label="Skills"
                                name="skills"
                                value={
                                    form.skills
                                }
                                onChange={
                                    handleChange
                                }
                                className="full-width-field"
                            />


                            {/* REMARKS */}

                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                label="Remarks"
                                name="remarks"
                                value={
                                    form.remarks
                                }
                                onChange={
                                    handleChange
                                }
                                className="full-width-field"
                            />

                        </div>


                        {/* =================================================
                           STATUS
                        ================================================= */}

                        <FormControlLabel
                            control={

                                <Checkbox
                                    checked={
                                        form.isActive
                                    }
                                    onChange={(e) =>
                                        setForm(
                                            prev => ({
                                                ...prev,
                                                isActive:
                                                    e.target.checked
                                            })
                                        )
                                    }
                                />

                            }
                            label={
                                form.isActive
                                    ? "Active"
                                    : "Inactive"
                            }
                        />


                        {/* =================================================
                           BUTTONS
                        ================================================= */}

                        <Box className="form-buttons">

                            <Button
                                type="button"
                                variant="outlined"
                                className="cancel-btn"
                                onClick={() =>
                                    navigate("/users")
                                }
                                disabled={
                                    loading
                                }
                            >
                                Cancel
                            </Button>


                            <Button
                                type="submit"
                                variant="contained"
                                className="save-btn"
                                disabled={
                                    loading
                                }
                            >

                                {loading
                                    ? "Updating..."
                                    : "Update User"}

                            </Button>

                        </Box>


                    </form>

                </Paper>


                {/* =================================================
                   SNACKBAR
                ================================================= */}

                <Snackbar
                    open={
                        snackbar.open
                    }
                    autoHideDuration={3000}
                    onClose={
                        handleCloseSnackbar
                    }
                    anchorOrigin={{
                        vertical:
                            "top",
                        horizontal:
                            "right"
                    }}
                >

                    <Alert
                        onClose={
                            handleCloseSnackbar
                        }
                        severity={
                            snackbar.severity
                        }
                        variant="filled"
                        className="snackbar-alert"
                    >

                        {
                            snackbar.message
                        }

                    </Alert>

                </Snackbar>

            </div>

        </DashboardLayout>

    );

}


export default EditUser;
