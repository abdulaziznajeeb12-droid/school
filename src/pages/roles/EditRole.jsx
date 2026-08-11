import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import DashboardLayout from "../../layouts/DashboardLayout";

import {
    TextField,
    Button,
    Checkbox,
    FormControlLabel,
    Paper,
    Snackbar,
    Alert
} from "@mui/material";

import {
    getRoleById,
    updateRole
} from "../../services/roleService";

import "../../assets/form.css";


function EditRole() {

    const { id } = useParams();

    const navigate = useNavigate();


    const [name, setName] = useState("");

    const [decsribtion, setDescription] = useState("");

    const [isActive, setIsActive] = useState(true);

    const [loading, setLoading] = useState(false);


    // =========================
    // SNACKBAR STATES
    // =========================

    const [openSnackbar, setOpenSnackbar] = useState(false);

    const [snackbarMessage, setSnackbarMessage] = useState("");

    const [snackbarSeverity, setSnackbarSeverity] = useState("success");


    // =========================
    // LOAD ROLE
    // =========================

    useEffect(() => {

        loadRole();

    }, [id]);


    const loadRole = async () => {

        try {

            const data = await getRoleById(id);

            setName(data.name || "");

            setDescription(
                data.decsribtion || ""
            );

            setIsActive(
                data.isActive ?? true
            );

        }
        catch (error) {

            console.log(error);

            showSnackbar(
                "Unable To Load Role",
                "error"
            );

        }

    };


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
    // UPDATE ROLE
    // =========================

    const updateData = async (e) => {

        e.preventDefault();


        // Validation

        if (!name.trim()) {

            showSnackbar(
                "Please enter Role Name",
                "error"
            );

            return;

        }


        try {

            setLoading(true);


            await updateRole({

                id: Number(id),

                name: name.trim(),

                decsribtion,

                isActive

            });


            // Success

            showSnackbar(
                "Role Updated Successfully",
                "success"
            );


            // Navigate after Snackbar

            setTimeout(() => {

                navigate("/roles");

            }, 1000);

        }
        catch (error) {

            console.log(error);

            showSnackbar(
                "Unable To Update Role",
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
                    className="form-card"
                >

                    {/* =========================
                        TITLE
                    ========================= */}

                    <h2 className="form-title">
                        Edit Role
                    </h2>


                    <form onSubmit={updateData}>


                        {/* =========================
                            ROLE NAME
                        ========================= */}

                        <TextField

                            fullWidth

                            label="Role Name"

                            variant="outlined"

                            value={name}

                            onChange={(e) =>
                                setName(
                                    e.target.value
                                )
                            }

                            required

                            className="form-field"

                        />


                        {/* =========================
                            DESCRIPTION
                        ========================= */}

                        <TextField

                            fullWidth

                            multiline

                            rows={4}

                            label="Description"

                            variant="outlined"

                            value={decsribtion}

                            onChange={(e) =>
                                setDescription(
                                    e.target.value
                                )
                            }

                            className="form-field"

                        />


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

                            className="form-checkbox"

                        />


                        {/* =========================
                            BUTTONS
                        ========================= */}

                        <div className="form-buttons">


                            {/* UPDATE */}

                            <Button

                                type="submit"

                                variant="contained"

                                className="save-btn"

                                disabled={loading}

                            >

                                {loading
                                    ? "Updating..."
                                    : "Update Role"
                                }

                            </Button>


                            {/* CANCEL */}

                            <Button

                                type="button"

                                variant="outlined"

                                className="cancel-btn"

                                onClick={() =>
                                    navigate("/roles")
                                }

                                disabled={loading}

                            >

                                Cancel

                            </Button>


                        </div>


                    </form>

                </Paper>

            </div>


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


export default EditRole;