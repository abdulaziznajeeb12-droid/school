import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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

import { addUser } from "../../services/userService";
import { getRoles } from "../../services/roleService";
import { getBranches } from "../../services/branchService";

import "../../assets/form.css";

function AddUser() {

    const navigate = useNavigate();

    const [roles, setRoles] = useState([]);
    const [branches, setBranches] = useState([]);

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

    }, []);


    const loadData = async () => {

        try {

            const roleData = await getRoles();

            const branchData = await getBranches();

            setRoles(roleData);

            setBranches(branchData);

        }
        catch (error) {

            console.log(error);

            showSnackbar(
                "Unable To Load Roles or Branches",
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
       SAVE USER
    ========================= */

    const saveUser = async (e) => {

        e.preventDefault();


        try {

            setLoading(true);


            await addUser({

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
                "User Added Successfully",
                "success"
            );


            setTimeout(() => {

                navigate("/users");

            }, 1000);


        }
        catch (error) {

            console.log(error);

            showSnackbar(
                "Unable To Add User",
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
                        Add User
                    </h2>


                    <form onSubmit={saveUser}>

                        <div className="user-form-grid">


                            {/* =========================
                               PERSONAL INFORMATION
                            ========================= */}


                            <TextField
                                fullWidth
                                label="First Name"
                                name="firstName"
                                value={form.firstName}
                                onChange={handleChange}
                                required
                            />


                            <TextField
                                fullWidth
                                label="Last Name"
                                name="lastName"
                                value={form.lastName}
                                onChange={handleChange}
                                required
                            />


                            <TextField
                                fullWidth
                                type="email"
                                label="Email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                required
                            />


                            <TextField
                                fullWidth
                                type="password"
                                label="Password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                required
                            />


                            <TextField
                                fullWidth
                                label="CNIC"
                                name="cnic"
                                placeholder="42101-1234567-1"
                                value={form.cnic}
                                onChange={handleChange}
                            />


                            <TextField
                                fullWidth
                                label="Mobile"
                                name="mobile"
                                value={form.mobile}
                                onChange={handleChange}
                            />


                            {/* =========================
                               BRANCH
                            ========================= */}


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


                            {/* =========================
                               ROLE
                            ========================= */}


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


                            {/* =========================
                               SALARY
                            ========================= */}


                            <TextField
                                fullWidth
                                type="number"
                                label="Salary"
                                name="salary"
                                value={form.salary}
                                onChange={handleChange}
                            />


                            {/* =========================
                               GENDER
                            ========================= */}


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


                            {/* =========================
                               AGE
                            ========================= */}


                            <TextField
                                fullWidth
                                type="number"
                                label="Age"
                                name="age"
                                value={form.age}
                                onChange={handleChange}
                            />


                            {/* =========================
                               DATE OF BIRTH
                            ========================= */}


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


                            {/* =========================
                               FATHER
                            ========================= */}


                            <TextField
                                fullWidth
                                label="Father Name"
                                name="fatherName"
                                value={form.fatherName}
                                onChange={handleChange}
                            />


                            <TextField
                                fullWidth
                                label="Father Mobile Number"
                                name="fatherMobileNumber"
                                value={form.fatherMobileNumber}
                                onChange={handleChange}
                            />


                            {/* =========================
                               MOTHER
                            ========================= */}


                            <TextField
                                fullWidth
                                label="Mother Name"
                                name="motherName"
                                value={form.motherName}
                                onChange={handleChange}
                            />


                            <TextField
                                fullWidth
                                label="Mother Mobile Number"
                                name="motherMobileNumber"
                                value={form.motherMobileNumber}
                                onChange={handleChange}
                            />


                            {/* =========================
                               PLACE OF BIRTH
                            ========================= */}


                            <TextField
                                fullWidth
                                label="Place Of Birth"
                                name="placeOfBirth"
                                value={form.placeOfBirth}
                                onChange={handleChange}
                            />


                            {/* =========================
                               ADDRESS
                            ========================= */}


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


                            {/* =========================
                               SKILLS
                            ========================= */}


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


                            {/* =========================
                               REMARKS
                            ========================= */}


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
                                    ? "Saving..."
                                    : "Save User"
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
                        vertical: "top",
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

export default AddUser;