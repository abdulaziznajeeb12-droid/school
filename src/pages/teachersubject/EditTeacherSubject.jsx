import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

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
    getTeacherUsers,
    getTeacherClasses,
    getTeacherSections,
    getTeacherSubjectsDropdown,
    getAssignedSubjects,
    updateTeacherSubjects
} from "../../services/teacherSubjectService";

import "../../assets/teacherSubjectForm.css";


function EditTeacherSubject() {

    const { teacherId: routeTeacherId, classId: routeClassId, sectionId: routeSectionId } = useParams();

    const navigate = useNavigate();


    const [teachers, setTeachers] = useState([]);

    const [classes, setClasses] = useState([]);

    const [sections, setSections] = useState([]);

    const [subjects, setSubjects] = useState([]);


    const [teacherId, setTeacherId] = useState(
        routeTeacherId || ""
    );

    const [classId, setClassId] = useState(
        routeClassId || ""
    );

    const [sectionId, setSectionId] = useState(
        routeSectionId || ""
    );

    const [subjectIds, setSubjectIds] = useState([]);


    const [loading, setLoading] = useState(false);

    const [open, setOpen] = useState(false);

    const [errorOpen, setErrorOpen] = useState(false);

    const [errorMessage, setErrorMessage] = useState("");


    // =====================================================
    // LOAD
    // =====================================================

    useEffect(() => {

        loadData();

    }, []);


    const loadData = async () => {

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


            if (routeClassId) {

                const sectionData =
                    await getTeacherSections(routeClassId);

                setSections(sectionData);

            }


            if (
                routeTeacherId &&
                routeClassId &&
                routeSectionId
            ) {

                const assigned =
                    await getAssignedSubjects(
                        routeTeacherId,
                        routeClassId,
                        routeSectionId
                    );


                setSubjectIds(
                    assigned.map(id => String(id))
                );

            }

        }
        catch (error) {

            console.log(error);

            showError("Unable to load assignment.");

        }

    };


    // =====================================================
    // CLASS
    // =====================================================

    const handleClassChange = async (e) => {

        const value = e.target.value;

        setClassId(value);

        setSectionId("");

        setSections([]);

        setSubjectIds([]);


        if (!value)
            return;


        try {

            const data =
                await getTeacherSections(value);

            setSections(data);

        }
        catch (error) {

            console.log(error);

        }

    };


    // =====================================================
    // SUBJECT
    // =====================================================

    const handleSubjectsChange = (e) => {

        const value = e.target.value;

        setSubjectIds(

            typeof value === "string"
                ? value.split(",")
                : value

        );

    };


    const showError = (message) => {

        setErrorMessage(message);

        setErrorOpen(true);

    };


    const closeSnackbars = () => {

        setOpen(false);

        setErrorOpen(false);

    };


    // =====================================================
    // UPDATE
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

            showError("Please select Subjects.");

            return;

        }


        try {

            setLoading(true);


            await updateTeacherSubjects({

                teacherId: Number(teacherId),

                classId: Number(classId),

                sectionId: Number(sectionId),

                subjectIds:
                    subjectIds.map(
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
                "Unable to update assignment."
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
                    Edit Teacher Subjects
                </Typography>


                <Typography
                    className="teacher-subject-form-subtitle"
                >
                    Update teacher subject assignment
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


                    {/* SUBJECTS */}

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

                                return subjects

                                    .filter(subject =>
                                        selected.includes(
                                            String(subject.id)
                                        )
                                    )

                                    .map(
                                        subject =>
                                            subject.subjectName
                                    )

                                    .join(", ");

                            }}

                        >

                            {subjects.map((subject) => (

                                <MenuItem
                                    key={subject.id}
                                    value={String(subject.id)}
                                >

                                    <Checkbox
                                        checked={
                                            subjectIds.includes(
                                                String(subject.id)
                                            )
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
                                ? "Updating..."
                                : "Update Assignment"
                            }

                        </Button>

                    </Box>

                </Box>

            </Paper>


            <Snackbar
                open={open}
                autoHideDuration={3000}
                onClose={closeSnackbars}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right"
                }}
            >

                <Alert
                    severity="success"
                    variant="filled"
                >
                    Assignment Updated Successfully!
                </Alert>

            </Snackbar>


            <Snackbar
                open={errorOpen}
                autoHideDuration={4000}
                onClose={closeSnackbars}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right"
                }}
            >

                <Alert
                    severity="error"
                    variant="filled"
                >
                    {errorMessage}
                </Alert>

            </Snackbar>

        </DashboardLayout>

    );
}

export default EditTeacherSubject;