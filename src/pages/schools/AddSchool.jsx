import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import { addSchool } from "../../services/schoolService";

import {
    Paper,
    Typography,
    TextField,
    Button,
    Box,
    Snackbar,
    Alert
} from "@mui/material";


function AddSchool() {

    const navigate = useNavigate();


    const [schoolName, setSchoolName] = useState("");

    const [loading, setLoading] = useState(false);


    // =========================
    // SNACKBAR STATES
    // =========================

    const [openSnackbar, setOpenSnackbar] = useState(false);

    const [snackbarMessage, setSnackbarMessage] = useState("");

    const [snackbarSeverity, setSnackbarSeverity] =
        useState("success");


    // =========================
    // SHOW SNACKBAR
    // =========================

    const showSnackbar = (
        message,
        severity = "success"
    ) => {

        setSnackbarMessage(message);

        setSnackbarSeverity(severity);

        setOpenSnackbar(true);

    };


    // =========================
    // CLOSE SNACKBAR
    // =========================

    const handleCloseSnackbar = (
        event,
        reason
    ) => {

        if (reason === "clickaway") {
            return;
        }

        setOpenSnackbar(false);

    };


    // =========================
    // SAVE SCHOOL
    // =========================

    const saveSchool = async (e) => {

        e.preventDefault();


        // Validation

        if (!schoolName.trim()) {

            showSnackbar(
                "Please enter School Name",
                "error"
            );

            return;

        }


        try {

            setLoading(true);


            await addSchool({

                schoolName: schoolName.trim(),

                isActive: true

            });


            // Success Snackbar

            showSnackbar(
                "School Added Successfully",
                "success"
            );


            // Navigate after Snackbar

            setTimeout(() => {

                navigate("/schools");

            }, 1000);


        }
        catch (error) {

            console.log(error);

            showSnackbar(
                "Unable To Add School",
                "error"
            );

        }
        finally {

            setLoading(false);

        }

    };


    return (

        <DashboardLayout>

            <Paper
                elevation={6}
                className="form-container"
            >

                {/* =========================
                    TITLE
                ========================= */}

                <Typography
                    variant="h4"
                    className="form-title"
                >

                    Add School

                </Typography>


                {/* =========================
                    FORM
                ========================= */}

                <Box
                    component="form"
                    onSubmit={saveSchool}
                    className="school-form"
                >

                    <TextField

                        fullWidth

                        label="School Name"

                        variant="outlined"

                        value={schoolName}

                        onChange={(e) =>
                            setSchoolName(
                                e.target.value
                            )
                        }

                        required

                    />


                    {/* =========================
                        BUTTONS
                    ========================= */}

                    <Box className="form-buttons">

                        <Button

                            variant="contained"

                            color="primary"

                            type="submit"

                            disabled={loading}

                        >

                            {loading
                                ? "Saving..."
                                : "Save School"
                            }

                        </Button>


                        <Button

                            variant="outlined"

                            color="secondary"

                            type="button"

                            onClick={() =>
                                navigate("/schools")
                            }

                            disabled={loading}

                        >

                            Cancel

                        </Button>

                    </Box>

                </Box>

            </Paper>


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


export default AddSchool;