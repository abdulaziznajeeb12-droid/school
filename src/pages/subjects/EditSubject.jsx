import {
    useEffect,
    useState
} from "react";

import {
    useNavigate,
    useParams
} from "react-router-dom";

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
    getSubjectById,
    updateSubject
} from "../../services/subjectService";

import "../../assets/subject.css";


function EditSubject() {

    const { id } = useParams();

    const navigate = useNavigate();


    const [form, setForm] = useState({

        subjectName: "",

        marks: "",

        isActive: true

    });


    const [loading, setLoading] =
        useState(true);


    const [snackbar, setSnackbar] =
        useState({

            open: false,

            message: "",

            severity: "success"

        });


    // =========================
    // LOAD SUBJECT
    // =========================

    useEffect(() => {

        loadSubject();

    }, [id]);


    const loadSubject = async () => {

        try {

            const data =
                await getSubjectById(id);


            setForm({

                subjectName:
                    data.subjectName || "",

                marks:
                    data.marks ?? "",

                isActive:
                    data.isActive ?? true

            });

        }
        catch (error) {

            console.log(error);

            showSnackbar(
                "Unable to load subject",
                "error"
            );

        }
        finally {

            setLoading(false);

        }

    };


    // =========================
    // SNACKBAR
    // =========================

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


    // =========================
    // CHANGE
    // =========================

    const handleChange = (e) => {

        setForm({

            ...form,

            [e.target.name]:
                e.target.value

        });

    };


    // =========================
    // UPDATE
    // =========================

    const saveSubject = async (e) => {

        e.preventDefault();


        try {

            await updateSubject({

                id: Number(id),

                subjectName:
                    form.subjectName.trim(),

                marks:
                    form.marks
                        ? Number(form.marks)
                        : null,

                isActive:
                    form.isActive

            });


            showSnackbar(
                "Subject Updated Successfully!",
                "success"
            );


            setTimeout(() => {

                navigate("/subjects");

            }, 1200);

        }
        catch (error) {

            console.log(error);


            showSnackbar(

                error.response?.data ||
                "Unable to Update Subject",

                "error"

            );

        }

    };


    if (loading) {

        return (

            <DashboardLayout>

                <div
                    style={{
                        textAlign: "center",
                        marginTop: "50px"
                    }}
                >

                    Loading Subject...

                </div>

            </DashboardLayout>

        );

    }


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

                    Edit Subject

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
                                checked={
                                    form.isActive
                                }
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

                            Update Subject

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
                    severity={
                        snackbar.severity
                    }
                    variant="filled"
                    sx={{
                        width: "100%"
                    }}
                >

                    {snackbar.message}

                </Alert>

            </Snackbar>

        </DashboardLayout>

    );

}

export default EditSubject;