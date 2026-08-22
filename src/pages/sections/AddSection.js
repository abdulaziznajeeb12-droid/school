import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../layouts/DashboardLayout";

import {
    Alert,
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Snackbar,
    TextField,
    Typography
} from "@mui/material";

import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { addSection } from "../../services/sectionService";
import { getClasses } from "../../services/classService";

import "../../assets/sectionForm.css";


function AddSection() {

    const navigate = useNavigate();


    const [classes, setClasses] = useState([]);

    const [loading, setLoading] = useState(false);


    const [form, setForm] = useState({

        classId: "",
        sectionName: "",
        sectionTeacherId: "",
        roomNo: "",
        capacity: ""

    });


    // =========================
    // SNACKBAR STATES
    // =========================

    const [openSnackbar, setOpenSnackbar] = useState(false);

    const [snackbarMessage, setSnackbarMessage] =
        useState("");

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
    // LOAD CLASSES
    // =========================

    useEffect(() => {

        loadClasses();

    }, []);


    const loadClasses = async () => {

        try {

            const data = await getClasses();

            setClasses(data);

        }
        catch (error) {

            console.log(error);

            showSnackbar(
                "Unable to load classes",
                "error"
            );

        }

    };


    // =========================
    // HANDLE CHANGE
    // =========================

    const handleChange = (e) => {

        setForm({

            ...form,

            [e.target.name]: e.target.value

        });

    };


    // =========================
    // SAVE SECTION
    // =========================

    const save = async (e) => {

        e.preventDefault();


        // Class validation

        if (!form.classId) {

            showSnackbar(
                "Please select Class",
                "error"
            );

            return;

        }


        // Section name validation

        if (!form.sectionName.trim()) {

            showSnackbar(
                "Please enter Section Name",
                "error"
            );

            return;

        }


        try {

            setLoading(true);


            await addSection({

                classId: Number(
                    form.classId
                ),

                sectionName:
                    form.sectionName.trim(),

                sectionTeacherId:
                    form.sectionTeacherId
                        ? Number(
                            form.sectionTeacherId
                        )
                        : null,

                roomNo: form.roomNo,

                capacity:
                    form.capacity
                        ? Number(form.capacity)
                        : null

            });


            // Success Snackbar

            showSnackbar(
                "Section Added Successfully",
                "success"
            );


            // Navigate after Snackbar

            setTimeout(() => {

                navigate("/sections");

            }, 1000);

        }
        catch (error) {

            console.log(error);

            showSnackbar(
                "Unable to Add Section",
                "error"
            );

        }
        finally {

            setLoading(false);

        }

    };


    return (

        <DashboardLayout>

            <Box className="section-form-page">

                <Paper
                    elevation={3}
                    className="section-form-card"
                >

                    {/* =========================
                        TITLE
                    ========================= */}

                    <Typography
                        variant="h5"
                        className="section-form-title"
                    >

                        Add Section

                    </Typography>


                    <Typography
                        className="section-form-subtitle"
                    >

                        Add a new section to a class

                    </Typography>


                    {/* =========================
                        FORM
                    ========================= */}

                    <Box
                        component="form"
                        onSubmit={save}
                        className="section-form-content"
                    >


                        {/* =========================
                            CLASS
                        ========================= */}

                        <FormControl
                            fullWidth
                            required
                        >

                            <InputLabel>
                                Class
                            </InputLabel>


                            <Select

                                name="classId"

                                value={form.classId}

                                label="Class"

                                onChange={handleChange}

                            >

                                <MenuItem value="">

                                    Select Class

                                </MenuItem>


                                {classes.filter((classes) => classes.isActive ===true ).map((item) => (

                                    <MenuItem
                                        key={item.id}
                                        value={item.id}
                                    >

                                        {item.className}

                                    </MenuItem>

                                ))}

                            </Select>

                        </FormControl>


                        {/* =========================
                            SECTION NAME
                        ========================= */}

                        <TextField

                            fullWidth

                            label="Section Name"

                            placeholder="e.g. A"

                            name="sectionName"

                            value={form.sectionName}

                            onChange={handleChange}

                            required

                        />


                        {/* =========================
                            TEACHER ID
                        ========================= */}

                        <TextField

                            fullWidth

                            type="number"

                            label="Teacher ID"

                            placeholder="Enter Teacher ID"

                            name="sectionTeacherId"

                            value={form.sectionTeacherId}

                            onChange={handleChange}

                        />


                        {/* =========================
                            ROOM
                        ========================= */}

                        <TextField

                            fullWidth

                            label="Room No"

                            placeholder="e.g. Room 101"

                            name="roomNo"

                            value={form.roomNo}

                            onChange={handleChange}

                        />


                        {/* =========================
                            CAPACITY
                        ========================= */}

                        <TextField

                            fullWidth

                            type="number"

                            label="Capacity"

                            placeholder="Enter student capacity"

                            name="capacity"

                            value={form.capacity}

                            onChange={handleChange}

                        />


                        {/* =========================
                            BUTTONS
                        ========================= */}

                        <Box
                            className="section-form-buttons"
                        >

                            <Button

                                type="button"

                                variant="outlined"

                                startIcon={
                                    <ArrowBackIcon />
                                }

                                onClick={() =>
                                    navigate("/sections")
                                }

                                disabled={loading}

                            >

                                Cancel

                            </Button>


                            <Button

                                type="submit"

                                variant="contained"

                                startIcon={
                                    <SaveIcon />
                                }

                                disabled={loading}

                            >

                                {loading
                                    ? "Saving..."
                                    : "Save Section"
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


export default AddSection;