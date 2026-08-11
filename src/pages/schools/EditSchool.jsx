import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import DashboardLayout from "../../layouts/DashboardLayout";

import {
    Paper,
    Typography,
    TextField,
    Button,
    Box,
    FormControlLabel,
    Checkbox,
    Snackbar,
    Alert
} from "@mui/material";

import {
    getSchoolById,
    updateSchool
} from "../../services/schoolService";


function EditSchool() {

    const { id } = useParams();

    const navigate = useNavigate();


    const [schoolName, setSchoolName] = useState("");

    const [isActive, setIsActive] = useState(true);

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
    // LOAD SCHOOL
    // =========================

    useEffect(() => {

        loadSchool();

    }, [id]);


    const loadSchool = async () => {

        try {

            const data = await getSchoolById(id);

            setSchoolName(
                data.schoolName || ""
            );

            setIsActive(
                data.isActive ?? true
            );

        }
        catch (error) {

            console.log(error);

            showSnackbar(
                "Unable To Load School",
                "error"
            );

        }

    };


    // =========================
    // UPDATE SCHOOL
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


            await updateSchool({

                id: Number(id),

                schoolName: schoolName.trim(),

                isActive,

                updatedOn:
                    new Date().toISOString()

            });


            // Success Snackbar

            showSnackbar(
                "School Updated Successfully",
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
                "Unable To Update School",
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

                    Edit School

                </Typography>


                {/* =========================
                    FORM
                ========================= */}

                <Box
                    component="form"
                    onSubmit={saveSchool}
                    className="school-form"
                >


                    {/* SCHOOL NAME */}

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

                    <Box className="form-buttons">


                        {/* UPDATE */}

                        <Button

                            variant="contained"

                            color="primary"

                            type="submit"

                            disabled={loading}

                        >

                            {loading
                                ? "Updating..."
                                : "Update School"
                            }

                        </Button>


                        {/* CANCEL */}

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


export default EditSchool;