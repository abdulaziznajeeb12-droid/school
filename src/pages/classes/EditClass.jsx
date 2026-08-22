import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import DashboardLayout from "../../layouts/DashboardLayout";

import {
    Box,
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    TextField,
    Typography,
    Snackbar,
    Alert
} from "@mui/material";

import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import {
    getClassById,
    updateClass
} from "../../services/classService";

import {
    getBranches
} from "../../services/branchService";

import "../../assets/classForm.css";


function EditClass() {

    const { id } = useParams();

    const navigate = useNavigate();


    const [className, setClassName] = useState("");

    const [branchId, setBranchId] = useState("");

    const [isActive, setIsActive] = useState(true);

    const [branches, setBranches] = useState([]);

    const [loading, setLoading] = useState(false);


    // =========================
    // SNACKBAR STATES
    // =========================

    const [openSnackbar, setOpenSnackbar] = useState(false);

    const [snackbarMessage, setSnackbarMessage] = useState("");

    const [snackbarSeverity, setSnackbarSeverity] = useState("success");


    // =========================
    // LOAD DATA
    // =========================

    useEffect(() => {

        loadData();

    }, [id]);


    const loadData = async () => {

        try {

            // Load branches

            const branchData = await getBranches();

            setBranches(branchData);


            // Load class

            const classData = await getClassById(id);

            console.log("Class Data:", classData);


            setClassName(
                classData.className || ""
            );


            setBranchId(
                classData.branchId
                    ? String(classData.branchId)
                    : ""
            );


            setIsActive(
                classData.isActive ?? true
            );

        }
        catch (error) {

            console.log(error);

            showSnackbar(
                "Unable to load class",
                "error"
            );

        }

    };


    // =========================
    // SHOW SNACKBAR
    // =========================

    const showSnackbar = (message, severity = "success") => {

        setSnackbarMessage(message);

        setSnackbarSeverity(severity);

        setOpenSnackbar(true);

    };


    // =========================
    // CLOSE SNACKBAR
    // =========================

    const handleCloseSnackbar = (event, reason) => {

        if (reason === "clickaway") {
            return;
        }

        setOpenSnackbar(false);

    };


    // =========================
    // UPDATE CLASS
    // =========================

    const save = async (e) => {

        e.preventDefault();


        // Validation

        if (!className.trim()) {

            showSnackbar(
                "Please enter Class Name",
                "error"
            );

            return;

        }


        if (!branchId) {

            showSnackbar(
                "Please select Branch",
                "error"
            );

            return;

        }


        try {

            setLoading(true);


            // Find selected branch

            const selectedBranch = branches.find(
                branch =>
                    branch.id === Number(branchId)
            );


            await updateClass({

                id: Number(id),

                className: className.trim(),

                branchName: selectedBranch
                    ? selectedBranch.branchName
                    : "",

                branchId: Number(branchId),

                isActive: isActive

            });


            // Success Snackbar

            showSnackbar(
                "Class Updated Successfully",
                "success"
            );


            // Navigate after Snackbar appears

            setTimeout(() => {

                navigate("/classes");

            }, 1000);


        }
        catch (error) {

            console.log(error);

            showSnackbar(
                "Unable to Update Class",
                "error"
            );

        }
        finally {

            setLoading(false);

        }

    };


    return (

        <DashboardLayout>

            <Box className="class-form-page">

                <Paper
                    elevation={3}
                    className="class-form-card"
                >

                    {/* =========================
                        HEADER
                    ========================= */}

                    <Typography
                        variant="h5"
                        className="class-form-title"
                    >
                        Edit Class
                    </Typography>


                    <Typography
                        className="class-form-subtitle"
                    >
                        Update class information
                    </Typography>


                    {/* =========================
                        FORM
                    ========================= */}

                    <Box
                        component="form"
                        onSubmit={save}
                        className="class-form-content"
                    >


                        {/* CLASS NAME */}

                        <TextField

                            fullWidth

                            label="Class Name"

                            placeholder="Enter class name"

                            value={className}

                            onChange={(e) =>
                                setClassName(
                                    e.target.value
                                )
                            }

                            required

                        />


                        {/* BRANCH */}

                        <FormControl
                            fullWidth
                            required
                        >

                            <InputLabel>
                                Branch
                            </InputLabel>


                            <Select

                                value={branchId}

                                label="Branch"

                                onChange={(e) =>
                                    setBranchId(
                                        e.target.value
                                    )
                                }

                            >

                                <MenuItem value="">
                                    Select Branch
                                </MenuItem>


                                 {branches.filter((branch) =>branch.isActive===true ).map((branch) => (

                                    <MenuItem
                                        key={branch.id}
                                        value={branch.id}
                                    >

                                        {branch.branchName}

                                    </MenuItem>

                                 ))}

                            </Select>

                        </FormControl>


                        {/* ACTIVE */}

                        <FormControlLabel

                            control={

                                <Checkbox

                                    checked={isActive}

                                    onChange={(e) =>
                                        setIsActive(
                                            e.target.checked
                                        )
                                    }

                                />

                            }

                            label="Active"

                        />


                        {/* BUTTONS */}

                        <Box className="class-form-buttons">


                            {/* CANCEL */}

                            <Button

                                type="button"

                                variant="outlined"

                                startIcon={
                                    <ArrowBackIcon />
                                }

                                onClick={() =>
                                    navigate("/classes")
                                }

                            >

                                Cancel

                            </Button>


                            {/* UPDATE */}

                            <Button

                                type="submit"

                                variant="contained"

                                startIcon={
                                    <SaveIcon />
                                }

                                disabled={loading}

                            >

                                {loading
                                    ? "Updating..."
                                    : "Update Class"
                                }

                            </Button>


                        </Box>


                    </Box>

                </Paper>

            </Box>


            {/* =========================
                SNACKBAR
            ========================= */}

            <Snackbar

                open={openSnackbar}

                autoHideDuration={3000}

                onClose={handleCloseSnackbar}

                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right"
                }}

            >

                <Alert

                    onClose={handleCloseSnackbar}

                    severity={snackbarSeverity}

                    variant="filled"

                    sx={{
                        width: "100%"
                    }}

                >

                    {snackbarMessage}

                </Alert>

            </Snackbar>


        </DashboardLayout>

    );

}

export default EditClass;