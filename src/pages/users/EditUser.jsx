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
    Alert
} from "@mui/material";

import {
    getUserById,
    updateUser
} from "../../services/userService";

import { getBranches } from "../../services/branchService";
import { getRoles } from "../../services/roleService";

import "../../assets/form.css";

function EditUser() {

    const { id } = useParams();

    const navigate = useNavigate();


    const [branches, setBranches] = useState([]);

    const [roles, setRoles] = useState([]);

    const [loading, setLoading] = useState(false);


    const [snackbar, setSnackbar] = useState({

        open: false,

        message: "",

        severity: "success"

    });


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
        skills: ""

    });


    /* =========================
       LOAD DATA
    ========================= */

    useEffect(() => {

        loadData();

    }, [id]);


    const loadData = async () => {

        try {

            const userData = await getUserById(id);

            const branchData = await getBranches();

            const roleData = await getRoles();


            setBranches(branchData);

            setRoles(roleData);


            setForm({

                firstName:
                    userData.firstName || "",

                lastName:
                    userData.lastName || "",

                email:
                    userData.email || "",

                password:
                    userData.password || "",

                cnic:
                    userData.cnic || "",

                branchId:
                    userData.branchId !== null &&
                    userData.branchId !== undefined
                        ? String(userData.branchId)
                        : "",

                salary:
                    userData.salary ?? "",

                gender:
                    userData.gender || "",

                age:
                    userData.age ?? "",

                address:
                    userData.address || "",

                roleId:
                    userData.roleId !== null &&
                    userData.roleId !== undefined
                        ? String(userData.roleId)
                        : "",

                mobile:
                    userData.mobile || "",

                dateOfBirth:
                    userData.dateOfBirth
                        ? userData.dateOfBirth.substring(0, 10)
                        : "",

                fatherName:
                    userData.fatherName || "",

                motherName:
                    userData.motherName || "",

                fatherMobileNumber:
                    userData.fatherMobileNumber || "",

                motherMobileNumber:
                    userData.motherMobileNumber || "",

                placeOfBirth:
                    userData.placeOfBirth || "",

                remarks:
                    userData.remarks || "",

                skills:
                    userData.skills || ""

            });

        }
        catch (error) {

            console.log(error);

            showSnackbar(
                "Unable To Load User",
                "error"
            );

        }

    };


    /* =========================
       HANDLE CHANGE
    ========================= */

    const handleChange = (e) => {

        const { name, value } = e.target;

        setForm({

            ...form,

            [name]: value

        });

    };


    /* =========================
       SNACKBAR
    ========================= */

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

        if (reason === "clickaway") {

            return;

        }

        setSnackbar({

            ...snackbar,

            open: false

        });

    };


    /* =========================
       UPDATE USER
    ========================= */

    const save = async (e) => {

        e.preventDefault();


        try {

            setLoading(true);


            await updateUser({

                id: Number(id),

                ...form,

                branchId: Number(form.branchId),

                roleId: Number(form.roleId),

                age: form.age
                    ? Number(form.age)
                    : 0,

                salary: form.salary
                    ? Number(form.salary)
                    : 0

            });


            showSnackbar(
                "User Updated Successfully",
                "success"
            );


            setTimeout(() => {

                navigate("/users");

            }, 1000);


        }
        catch (error) {

            console.log(error);

            showSnackbar(
                "Unable To Update User",
                "error"
            );

        }
        finally {

            setLoading(false);

        }

    };


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


                    <form onSubmit={save}>

                        <div className="user-form-grid">


                            {/* =========================
                               FIRST NAME
                            ========================= */}


                            <TextField
                                fullWidth
                                label="First Name"
                                name="firstName"
                                value={form.firstName}
                                onChange={handleChange}
                                required
                            />


                            {/* LAST NAME */}


                            <TextField
                                fullWidth
                                label="Last Name"
                                name="lastName"
                                value={form.lastName}
                                onChange={handleChange}
                                required
                            />


                            {/* EMAIL */}


                            <TextField
                                fullWidth
                                type="email"
                                label="Email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                required
                            />


                            {/* PASSWORD */}


                            <TextField
                                fullWidth
                                type="password"
                                label="Password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                required
                            />


                            {/* CNIC */}


                            <TextField
                                fullWidth
                                label="CNIC"
                                name="cnic"
                                value={form.cnic}
                                onChange={handleChange}
                            />


                            {/* MOBILE */}


                            <TextField
                                fullWidth
                                label="Mobile"
                                name="mobile"
                                value={form.mobile}
                                onChange={handleChange}
                            />


                            {/* BRANCH */}


                            <TextField
                                fullWidth
                                select
                                label="Branch"
                                name="branchId"
                                value={form.branchId}
                                onChange={handleChange}
                                required
                            >

                                <MenuItem value="">
                                    Select Branch
                                </MenuItem>

                                {branches.map((branch) => (

                                    <MenuItem
                                        key={branch.id}
                                        value={branch.id}
                                    >

                                        {branch.branchName}

                                    </MenuItem>

                                ))}

                            </TextField>


                            {/* ROLE */}


                            <TextField
                                fullWidth
                                select
                                label="Role"
                                name="roleId"
                                value={form.roleId}
                                onChange={handleChange}
                                required
                            >

                                <MenuItem value="">
                                    Select Role
                                </MenuItem>

                                {roles.map((role) => (

                                    <MenuItem
                                        key={role.id}
                                        value={role.id}
                                    >

                                        {role.name}

                                    </MenuItem>

                                ))}

                            </TextField>


                            {/* SALARY */}


                            <TextField
                                fullWidth
                                type="number"
                                label="Salary"
                                name="salary"
                                value={form.salary}
                                onChange={handleChange}
                            />


                            {/* GENDER */}


                            <TextField
                                fullWidth
                                select
                                label="Gender"
                                name="gender"
                                value={form.gender}
                                onChange={handleChange}
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
                                value={form.age}
                                onChange={handleChange}
                            />


                            {/* DATE OF BIRTH */}


                            <TextField
                                fullWidth
                                type="date"
                                label="Date Of Birth"
                                name="dateOfBirth"
                                value={form.dateOfBirth}
                                onChange={handleChange}
                                InputLabelProps={{
                                    shrink: true
                                }}
                            />


                            {/* FATHER NAME */}


                            <TextField
                                fullWidth
                                label="Father Name"
                                name="fatherName"
                                value={form.fatherName}
                                onChange={handleChange}
                            />


                            {/* FATHER MOBILE */}


                            <TextField
                                fullWidth
                                label="Father Mobile Number"
                                name="fatherMobileNumber"
                                value={form.fatherMobileNumber}
                                onChange={handleChange}
                            />


                            {/* MOTHER NAME */}


                            <TextField
                                fullWidth
                                label="Mother Name"
                                name="motherName"
                                value={form.motherName}
                                onChange={handleChange}
                            />


                            {/* MOTHER MOBILE */}


                            <TextField
                                fullWidth
                                label="Mother Mobile Number"
                                name="motherMobileNumber"
                                value={form.motherMobileNumber}
                                onChange={handleChange}
                            />


                            {/* PLACE OF BIRTH */}


                            <TextField
                                fullWidth
                                label="Place Of Birth"
                                name="placeOfBirth"
                                value={form.placeOfBirth}
                                onChange={handleChange}
                            />


                            {/* ADDRESS */}


                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                label="Address"
                                name="address"
                                value={form.address}
                                onChange={handleChange}
                                className="full-width-field"
                            />


                            {/* SKILLS */}


                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                label="Skills"
                                name="skills"
                                value={form.skills}
                                onChange={handleChange}
                                className="full-width-field"
                            />


                            {/* REMARKS */}


                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                label="Remarks"
                                name="remarks"
                                value={form.remarks}
                                onChange={handleChange}
                                className="full-width-field"
                            />


                        </div>


                        {/* =========================
                           BUTTONS
                        ========================= */}


                        <Box className="form-buttons">

                            <Button
                                type="button"
                                variant="outlined"
                                className="cancel-btn"
                                onClick={() =>
                                    navigate("/users")
                                }
                            >

                                Cancel

                            </Button>


                            <Button
                                type="submit"
                                variant="contained"
                                className="save-btn"
                                disabled={loading}
                            >

                                {loading
                                    ? "Updating..."
                                    : "Update User"
                                }

                            </Button>

                        </Box>


                    </form>

                </Paper>


                {/* =========================
                   SNACKBAR
                ========================= */}


                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={3000}
                    onClose={handleCloseSnackbar}
                    anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "right"
                    }}
                >

                    <Alert
                        onClose={handleCloseSnackbar}
                        severity={snackbar.severity}
                        variant="filled"
                        className="snackbar-alert"
                    >

                        {snackbar.message}

                    </Alert>

                </Snackbar>


            </div>

        </DashboardLayout>

    );

}

export default EditUser;