import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";

import {
    getBranchById,
    updateBranch
} from "../../services/branchService";

import { getSchools } from "../../services/schoolService";

import {
    Alert,
    Paper,
    Typography,
    TextField,
    Button,
    Checkbox,
    FormControlLabel,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box,
    Snackbar
} from "@mui/material";

function EditBranch() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [branchName, setBranchName] = useState("");
    const [schoolId, setSchoolId] = useState("");
    const [isActive, setIsActive] = useState(true);

    const [schools, setSchools] = useState([]);

    // Snackbar states
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");


    // =========================
    // LOAD DATA
    // =========================

    useEffect(() => {

        loadSchools();
        loadBranch();

    }, []);


    const loadSchools = async () => {

        try {

            const data = await getSchools();

            setSchools(data);

        }
        catch (error) {

            console.log(error);

            setSnackbarMessage("Unable to load schools");
            setSnackbarSeverity("error");
            setOpenSnackbar(true);

        }

    };


    const loadBranch = async () => {

        try {

            const data = await getBranchById(id);

            setBranchName(data.branchName || "");

            setSchoolId(data.schoolId || "");

            setIsActive(data.isActive ?? true);

        }
        catch (error) {

            console.log(error);

            setSnackbarMessage("Unable to load branch");
            setSnackbarSeverity("error");
            setOpenSnackbar(true);

        }

    };


    // =========================
    // SNACKBAR CLOSE
    // =========================

    const handleClose = (event, reason) => {

        if (reason === "clickaway") {
            return;
        }

        setOpenSnackbar(false);

    };


    // =========================
    // UPDATE BRANCH
    // =========================

    const updateData = async (e) => {

        e.preventDefault();

        try {

            await updateBranch({

                id: Number(id),

                branchName: branchName.trim(),

                schoolId: Number(schoolId),

                isActive

            });


            // Show success Snackbar

            setSnackbarMessage("Branch Updated Successfully");

            setSnackbarSeverity("success");

            setOpenSnackbar(true);


            // Navigate after Snackbar starts showing

            setTimeout(() => {

                navigate("/branches");

            }, 1000);


        }
        catch (error) {

            console.log(error);

            setSnackbarMessage("Unable to Update Branch");

            setSnackbarSeverity("error");

            setOpenSnackbar(true);

        }

    };


    return (

        <DashboardLayout>

            <Paper className="form-card">

                <Typography
                    variant="h4"
                    className="form-title"
                >
                    Edit Branch
                </Typography>


                <Box
                    component="form"
                    className="form-container"
                    onSubmit={updateData}
                >


                    {/* =========================
                        BRANCH NAME
                    ========================= */}

                    <TextField

                        fullWidth

                        label="Branch Name"

                        value={branchName}

                        onChange={(e) =>
                            setBranchName(e.target.value)
                        }

                        required

                    />


                    {/* =========================
                        SCHOOL
                    ========================= */}

                    <FormControl
                        fullWidth
                        required
                    >

                        <InputLabel>
                            School
                        </InputLabel>


                        <Select

                            value={schoolId}

                            label="School"

                            onChange={(e) =>
                                setSchoolId(e.target.value)
                            }

                        >

                            <MenuItem value="">
                                Select School
                            </MenuItem>


                            {

                                schools.filter((school) =>school.isActive === true ).map((school) =>(

                                    <MenuItem
                                        key={school.id}
                                        value={school.id}
                                    >

                                        {school.schoolName}

                                    </MenuItem>

                                ))

                            }

                        </Select>

                    </FormControl>


                    {/* =========================
                        ACTIVE
                    ========================= */}

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


                    {/* =========================
                        UPDATE BUTTON
                    ========================= */}

                    <Button

                        variant="contained"

                        type="submit"

                        size="large"

                    >

                        Update Branch

                    </Button>


                </Box>

            </Paper>


            {/* =========================
                SNACKBAR
            ========================= */}

            <Snackbar

                open={openSnackbar}

                autoHideDuration={3000}

                onClose={handleClose}

                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right"
                }}

            >

                <Alert

                    onClose={handleClose}

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

export default EditBranch;