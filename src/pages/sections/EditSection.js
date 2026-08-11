import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

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

import {
    getSectionById,
    updateSection
} from "../../services/sectionService";

import {
    getClasses
} from "../../services/classService";

import "../../assets/sectionForm.css";


function EditSection() {

    const { id } = useParams();

    const navigate = useNavigate();


    const [classes, setClasses] = useState([]);

    const [loading, setLoading] = useState(false);


    const [form, setForm] = useState({

        sectionId: id,

        classId: "",

        sectionName: "",

        sectionTeacherId: "",

        roomNo: "",

        capacity: ""

    });


    // =========================
    // SNACKBAR
    // =========================

    const [snackbar, setSnackbar] = useState({

        open: false,

        message: "",

        severity: "success"

    });


    const showSnackbar = (message, severity = "success") => {

        setSnackbar({

            open: true,

            message,

            severity

        });

    };


    const handleCloseSnackbar = (event, reason) => {

        if (reason === "clickaway") {
            return;
        }

        setSnackbar({

            ...snackbar,

            open: false

        });

    };


    // =========================
    // LOAD DATA
    // =========================

    useEffect(() => {

        loadData();

    }, [id]);


    const loadData = async () => {

        try {

            // LOAD CLASSES

            const classData = await getClasses();

            setClasses(classData);


            // LOAD SECTION

            const sectionData = await getSectionById(id);


            console.log("Section Data:", sectionData);


            setForm({

                sectionId: sectionData.sectionId ?? id,

                classId:
                    sectionData.classId !== null &&
                    sectionData.classId !== undefined
                        ? String(sectionData.classId)
                        : "",

                sectionName:
                    sectionData.sectionName || "",

                sectionTeacherId:
                    sectionData.sectionTeacherId ?? "",

                roomNo:
                    sectionData.roomNo || "",

                capacity:
                    sectionData.capacity ?? ""

            });


        }
        catch (error) {

            console.log(error);

            showSnackbar(
                "Unable to load Section",
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
    // UPDATE SECTION
    // =========================

    const save = async (e) => {

        e.preventDefault();


        // CLASS VALIDATION

        if (!form.classId) {

            showSnackbar(
                "Please select Class",
                "warning"
            );

            return;

        }


        // SECTION NAME VALIDATION

        if (!form.sectionName.trim()) {

            showSnackbar(
                "Please enter Section Name",
                "warning"
            );

            return;

        }


        try {

            setLoading(true);


            await updateSection({

                sectionId: Number(id),

                classId: Number(form.classId),

                sectionName:
                    form.sectionName.trim(),

                sectionTeacherId:
                    form.sectionTeacherId
                        ? Number(form.sectionTeacherId)
                        : null,

                roomNo: form.roomNo,

                capacity:
                    form.capacity
                        ? Number(form.capacity)
                        : null

            });


            // SUCCESS MESSAGE

            showSnackbar(
                "Section Updated Successfully",
                "success"
            );


            // Navigate after small delay

            setTimeout(() => {

                navigate("/sections");

            }, 1000);


        }
        catch (error) {

            console.log(error);

            showSnackbar(
                "Unable to Update Section",
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


                    {/* TITLE */}

                    <Typography
                        variant="h5"
                        className="section-form-title"
                    >

                        Edit Section

                    </Typography>


                    <Typography
                        className="section-form-subtitle"
                    >

                        Update section information

                    </Typography>


                    {/* FORM */}

                    <Box
                        component="form"
                        onSubmit={save}
                        className="section-form-content"
                    >


                        {/* CLASS */}

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


                                {classes.map((item) => (

                                    <MenuItem
                                        key={item.id}
                                        value={item.id}
                                    >

                                        {item.className}

                                    </MenuItem>

                                ))}

                            </Select>

                        </FormControl>


                        {/* SECTION NAME */}

                        <TextField

                            fullWidth

                            label="Section Name"

                            name="sectionName"

                            value={form.sectionName}

                            onChange={handleChange}

                            required

                        />


                        {/* TEACHER */}

                        <TextField

                            fullWidth

                            type="number"

                            label="Teacher ID"

                            name="sectionTeacherId"

                            value={form.sectionTeacherId}

                            onChange={handleChange}

                        />


                        {/* ROOM */}

                        <TextField

                            fullWidth

                            label="Room No"

                            name="roomNo"

                            value={form.roomNo}

                            onChange={handleChange}

                        />


                        {/* CAPACITY */}

                        <TextField

                            fullWidth

                            type="number"

                            label="Capacity"

                            name="capacity"

                            value={form.capacity}

                            onChange={handleChange}

                        />


                        {/* BUTTONS */}

                        <Box className="section-form-buttons">


                            <Button

                                type="button"

                                variant="outlined"

                                startIcon={
                                    <ArrowBackIcon />
                                }

                                onClick={() =>
                                    navigate("/sections")
                                }

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
                                    ? "Updating..."
                                    : "Update Section"
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

                open={snackbar.open}

                autoHideDuration={4000}

                onClose={handleCloseSnackbar}

                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right"
                }}

            >

                <Alert

                    onClose={handleCloseSnackbar}

                    severity={snackbar.severity}

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

export default EditSection;