import { useState } from "react";
import { useNavigate } from "react-router-dom";

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

import { addSubject } from "../../services/subjectService";

import "../../assets/subject.css";


function AddSubject() {

    const navigate = useNavigate();


    const [form, setForm] = useState({

        subjectName: "",

        marks: "",

        isActive: true

    });


    const [snackbar, setSnackbar] = useState({

        open: false,

        message: "",

        severity: "success"

    });


    const handleChange = (e) => {

        const {
            name,
            value
        } = e.target;


        setForm({

            ...form,

            [name]: value

        });

    };


    const handleClose = (
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


    const saveSubject = async (e) => {

        e.preventDefault();


        try {

            await addSubject({

                subjectName:
                    form.subjectName.trim(),

                marks:
                    form.marks
                        ? Number(form.marks)
                        : null,

                isActive:
                    form.isActive

            });


            setSnackbar({

                open: true,

                message:
                    "Subject Added Successfully!",

                severity:
                    "success"

            });


            setTimeout(() => {

                navigate("/subjects");

            }, 1200);

        }
        catch (error) {

            console.log(error);


            setSnackbar({

                open: true,

                message:
                    error.response?.data ||
                    "Unable to Add Subject",

                severity:
                    "error"

            });

        }

    };


    return (

        <DashboardLayout>

            <Paper
                className="form-card"
                elevation={4}
            >

                <Typography
                    variant="h4"
                    className="form-title"
                >

                    Add Subject

                </Typography>


                <Box
                    component="form"
                    onSubmit={saveSubject}
                    className="form-container"
                >

                    <TextField
                        fullWidth
                        label="Subject Name"
                        name="subjectName"
                        value={form.subjectName}
                        onChange={handleChange}
                        required
                    />


                    <TextField
                        fullWidth
                        type="number"
                        label="Marks"
                        name="marks"
                        value={form.marks}
                        onChange={handleChange}
                    />


                    <FormControlLabel

                        control={

                            <Checkbox
                                checked={form.isActive}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        isActive:
                                            e.target.checked
                                    })
                                }
                            />

                        }

                        label="Active"

                    />


                    <Box className="form-buttons">

                        <Button
                            type="submit"
                            variant="contained"
                        >
                            Save Subject
                        </Button>


                        <Button
                            type="button"
                            variant="outlined"
                            onClick={() =>
                                navigate("/subjects")
                            }
                        >
                            Cancel
                        </Button>

                    </Box>

                </Box>

            </Paper>


            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right"
                }}
            >

                <Alert
                    onClose={handleClose}
                    severity={snackbar.severity}
                    variant="filled"
                    sx={{ width: "100%" }}
                >

                    {snackbar.message}

                </Alert>

            </Snackbar>

        </DashboardLayout>

    );

}

export default AddSubject;