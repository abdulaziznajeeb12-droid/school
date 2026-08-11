import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

import { addRole } from "../../services/roleService";

import "../../assets/form.css";

function AddRole() {

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
    // SAVE ROLE
    // =========================

    const saveRole = async (e) => {

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


            await addRole({

                name: name.trim(),

                decsribtion,

                isActive

            });


            // Success Snackbar

            showSnackbar(
                "Role Added Successfully",
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
                "Unable To Add Role",
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
                        Add Role
                    </h2>


                    <form onSubmit={saveRole}>


                        {/* =========================
                            ROLE NAME
                        ========================= */}

                        <TextField

                            fullWidth

                            label="Role Name"

                            variant="outlined"

                            value={name}

                            onChange={(e) =>
                                setName(e.target.value)
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


                            {/* SAVE */}

                            <Button

                                type="submit"

                                variant="contained"

                                className="save-btn"

                                disabled={loading}

                            >

                                {loading
                                    ? "Saving..."
                                    : "Save Role"
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

export default AddRole;