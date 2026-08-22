import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../layouts/DashboardLayout";

import {
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Paper,
    Select,
    Checkbox,
    ListItemText,
    Typography,
    Snackbar,
    Alert
} from "@mui/material";

import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import {
    addTeacherSubjects,
    getTeacherUsers,
    getTeacherClasses,
    getTeacherSections,
    getTeacherSubjectsDropdown
} from "../../services/teacherSubjectService";

import "../../assets/teacherSubjectForm.css";


function AddTeacherSubject() {

    const navigate = useNavigate();


    const [teachers, setTeachers] = useState([]);

    const [classes, setClasses] = useState([]);

    const [sections, setSections] = useState([]);

    const [subjects, setSubjects] = useState([]);


    const [teacherId, setTeacherId] = useState("");

    const [classId, setClassId] = useState("");

    const [sectionId, setSectionId] = useState("");

    const [subjectIds, setSubjectIds] = useState([]);


    const [loading, setLoading] = useState(false);

    const [open, setOpen] = useState(false);

    const [errorOpen, setErrorOpen] = useState(false);

    const [errorMessage, setErrorMessage] = useState("");


    // =====================================================
    // LOAD DROPDOWNS
    // =====================================================

    useEffect(() => {

        loadDropdowns();

    }, []);


    const loadDropdowns = async () => {

        try {

            const [
                teacherData,
                classData,
                subjectData
            ] = await Promise.all([

                getTeacherUsers(),

                getTeacherClasses(),

                getTeacherSubjectsDropdown()

            ]);


            setTeachers(teacherData);

            setClasses(classData);

            setSubjects(subjectData);

        }
        catch (error) {

            console.log(error);

            showError("Unable to load dropdown data.");

        }

    };


    // =====================================================
    // CLASS CHANGE
    // =====================================================

    const handleClassChange = async (e) => {

        const value = e.target.value;

        setClassId(value);

        setSectionId("");

        setSections([]);


        if (!value) {

            return;

        }


        try {

            const data = await getTeacherSections(value);

            setSections(data);

        }
        catch (error) {

            console.log(error);

            showError("Unable to load sections.");

        }

    };


    // =====================================================
    // SUBJECT MULTI SELECT
    // =====================================================

    const handleSubjectsChange = (e) => {

        const value = e.target.value;

        setSubjectIds(

            typeof value === "string"

                ? value.split(",")

                : value

        );

    };


    // =====================================================
    // SNACKBAR
    // =====================================================

    const showError = (message) => {

        setErrorMessage(message);

        setErrorOpen(true);

    };


    const handleClose = () => {

        setOpen(false);

        setErrorOpen(false);

    };


    // =====================================================
    // SAVE
    // =====================================================

    const save = async (e) => {

        e.preventDefault();


        if (!teacherId) {

            showError("Please select Teacher.");

            return;

        }


        if (!classId) {

            showError("Please select Class.");

            return;

        }


        if (!sectionId) {

            showError("Please select Section.");

            return;

        }


        if (subjectIds.length === 0) {

            showError("Please select at least one Subject.");

            return;

        }


        try {

            setLoading(true);


            await addTeacherSubjects({

                teacherId: Number(teacherId),

                classId: Number(classId),

                sectionId: Number(sectionId),

                subjectIds: subjectIds.map(
                    id => Number(id)
                )

            });


            setOpen(true);


            setTimeout(() => {

                navigate("/teacher-subjects");

            }, 1500);

        }
        catch (error) {

            console.log(error);

            showError(

                error.response?.data ||
                "Unable to assign subjects."

            );

        }
        finally {

            setLoading(false);

        }

    };


    return (

        <DashboardLayout>

            <Paper
                className="teacher-subject-form-card"
                elevation={4}
            >

                <Typography
                    variant="h4"
                    className="teacher-subject-form-title"
                >
                    Assign Subjects
                </Typography>


                <Typography
                    className="teacher-subject-form-subtitle"
                >
                    Assign multiple subjects to a teacher
                </Typography>


                <Box
                    component="form"
                    onSubmit={save}
                    className="teacher-subject-form-container"
                >


                    {/* TEACHER */}

                    <FormControl fullWidth required>

                        <InputLabel>
                            Teacher
                        </InputLabel>

                        <Select
                            value={teacherId}
                            label="Teacher"
                            onChange={(e) =>
                                setTeacherId(e.target.value)
                            }
                        >

                            <MenuItem value="">
                                <em>Select Teacher</em>
                            </MenuItem>

                            {teachers.map((teacher) => (

                                <MenuItem
                                    key={teacher.id}
                                    value={teacher.id}
                                >
                                    {teacher.teacherName}
                                </MenuItem>

                            ))}

                        </Select>

                    </FormControl>


                    {/* CLASS */}

                    <FormControl fullWidth required>

                        <InputLabel>
                            Class
                        </InputLabel>

                        <Select
                            value={classId}
                            label="Class"
                            onChange={handleClassChange}
                        >

                            <MenuItem value="">
                                <em>Select Class</em>
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


                    {/* SECTION */}

                    <FormControl
                        fullWidth
                        required
                        disabled={!classId}
                    >

                        <InputLabel>
                            Section
                        </InputLabel>

                        <Select
                            value={sectionId}
                            label="Section"
                            onChange={(e) =>
                                setSectionId(e.target.value)
                            }
                        >

                            <MenuItem value="">
                                <em>Select Section</em>
                            </MenuItem>

                            {sections.map((item) => (

                                <MenuItem
                                    key={item.sectionId}
                                    value={item.sectionId}
                                >
                                    {item.sectionName}
                                </MenuItem>

                            ))}

                        </Select>

                    </FormControl>


                    {/* SUBJECT MULTI SELECT */}

                    <FormControl fullWidth required>

                        <InputLabel>
                            Subjects
                        </InputLabel>

                        <Select

                            multiple

                            value={subjectIds}

                            onChange={handleSubjectsChange}

                            input={
                                <OutlinedInput
                                    label="Subjects"
                                />
                            }

                            renderValue={(selected) => {

                                const names = subjects

                                    .filter(subject =>
                                        selected.includes(
                                            String(subject.id)
                                        )
                                    )

                                    .map(
                                        subject =>
                                            subject.subjectName
                                    );

                                return names.join(", ");

                            }}

                        >

                            {subjects.map((subject) => (

                                <MenuItem
                                    key={subject.id}
                                    value={String(subject.id)}
                                >

                                    <Checkbox
                                        checked={
                                            subjectIds.indexOf(
                                                String(subject.id)
                                            ) > -1
                                        }
                                    />

                                    <ListItemText
                                        primary={
                                            subject.subjectName
                                        }
                                    />

                                </MenuItem>

                            ))}

                        </Select>

                    </FormControl>


                    {/* BUTTONS */}

                    <Box className="teacher-subject-form-buttons">

                        <Button
                            type="button"
                            variant="outlined"
                            startIcon={<ArrowBackIcon />}
                            onClick={() =>
                                navigate("/teachersubject")
                            }
                        >
                            Cancel
                        </Button>


                        <Button
                            type="submit"
                            variant="contained"
                            startIcon={<SaveIcon />}
                            disabled={loading}
                        >

                            {loading
                                ? "Saving..."
                                : "Assign Subjects"
                            }

                        </Button>

                    </Box>

                </Box>

            </Paper>


            {/* SUCCESS */}

            <Snackbar
                open={open}
                autoHideDuration={3000}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right"
                }}
            >

                <Alert
                    onClose={handleClose}
                    severity="success"
                    variant="filled"
                >
                    Subjects Assigned Successfully!
                </Alert>

            </Snackbar>


            {/* ERROR */}

            <Snackbar
                open={errorOpen}
                autoHideDuration={4000}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right"
                }}
            >

                <Alert
                    onClose={handleClose}
                    severity="error"
                    variant="filled"
                >
                    {errorMessage}
                </Alert>

            </Snackbar>

        </DashboardLayout>

    );
}

export default AddTeacherSubject;