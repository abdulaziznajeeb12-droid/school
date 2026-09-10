import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../layouts/DashboardLayout";

import {
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    TextField,
    Typography,
    Snackbar,
    Alert
} from "@mui/material";

import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import {
    addTeacherSubject,
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
    const [dayOfWeek, setDayOfWeek] = useState("");
    const [teacherId, setTeacherId] = useState("");
    const [classId, setClassId] = useState("");
    const [sectionId, setSectionId] = useState("");
    const [subjectId, setSubjectId] = useState("");

    // NEW
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");

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

            setTeachers(
                Array.isArray(teacherData)
                    ? teacherData
                    : teacherData?.data || []
            );

            setClasses(
                Array.isArray(classData)
                    ? classData
                    : classData?.data || []
            );

            setSubjects(
                Array.isArray(subjectData)
                    ? subjectData
                    : subjectData?.data || []
            );

        }
        catch (error) {

            console.log(error);

            showError(
                error.response?.data?.message ||
                "Unable to load dropdown data."
            );

        }

    };

    // =====================================================
    // CLASS CHANGE
    // =====================================================

    const handleClassChange = async (e) => {

        const value = e.target.value;

        setClassId(value);

        // Class change hone par section reset
        setSectionId("");
        setSections([]);

        if (!value) {
            return;
        }

        try {

            const data =
                await getTeacherSections(Number(value));

            console.log("Sections Response:", data);

            const sectionData =
                Array.isArray(data)
                    ? data
                    : Array.isArray(data?.data)
                        ? data.data
                        : [];

            setSections(sectionData);

        }
        catch (error) {

            console.log(
                "Section Loading Error:",
                error.response?.data || error
            );

            showError(
                error.response?.data?.message ||
                "Unable to load sections."
            );

        }

    };

    // =====================================================
    // ERROR
    // =====================================================

    const showError = (message) => {

        if (typeof message === "object") {

            message =
                message?.message ||
                "Something went wrong.";

        }

        setErrorMessage(message);
        setErrorOpen(true);

    };

    // =====================================================
    // SAVE
    // =====================================================

    const save = async (e) => {

        e.preventDefault();

        // =================================================
        // VALIDATION
        // =================================================
        if (!dayOfWeek) {
    showError("Please select Day.");
    return;
} 

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

        if (!subjectId) {
            showError("Please select Subject.");
            return;
        }

        if (!startTime) {
            showError("Please select Start Time.");
            return;
        }

        if (!endTime) {
            showError("Please select End Time.");
            return;
        }

        // End time must be greater than start time
        if (endTime <= startTime) {
            showError(
                "End Time must be greater than Start Time."
            );
            return;
        }

        try {

            setLoading(true);

            // =================================================
            // API CALL
            // =================================================

            await addTeacherSubject({

                teacherId: Number(teacherId),

                classId: Number(classId),

                sectionId: Number(sectionId),

                subjectId: Number(subjectId),

                    dayOfWeek: dayOfWeek,

                // IMPORTANT:
                // TimeOnly ke liye HH:mm:ss bhej rahe hain
                startTime: `${startTime}:00`,

                endTime: `${endTime}:00`

            });

            // =================================================
            // SUCCESS
            // =================================================

            setOpen(true);

            setTimeout(() => {

                navigate("/teachersubject");

            }, 1200);

        }
        catch (error) {

            console.log(
                "Add Teacher Subject Error:",
                error
            );

            const message =
                error.response?.data?.message ||
                error.response?.data?.errors?.startTime?.[0] ||
                error.response?.data?.errors?.endTime?.[0] ||
                error.response?.data ||
                "Unable to assign subject.";

            showError(message);

        }
        finally {

            setLoading(false);

        }

    };

    // =====================================================
    // UI
    // =====================================================

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
                    Assign Subject
                </Typography>

                <Typography
                    className="teacher-subject-form-subtitle"
                >
Assign a subject to a teacher with day and time                </Typography>


                <Box
                    component="form"
                    onSubmit={save}
                    className="teacher-subject-form-container"
                >

                    {/* =====================================
                        TEACHER
                    ===================================== */}

                    <FormControl
                        fullWidth
                        required
                    >

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


                    {/* =====================================
                        CLASS
                    ===================================== */}

                    <FormControl
                        fullWidth
                        required
                    >

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


                    {/* =====================================
                        SECTION
                    ===================================== */}

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
                                    key={
                                        item.sectionId ??
                                        item.id
                                    }
                                    value={
                                        item.sectionId ??
                                        item.id
                                    }
                                >

                                    {item.sectionName}

                                </MenuItem>

                            ))}

                        </Select>

                    </FormControl>


                    {/* =====================================
                        SUBJECT
                    ===================================== */}

                    <FormControl
                        fullWidth
                        required
                    >

                        <InputLabel>
                            Subject
                        </InputLabel>

                        <Select
                            value={subjectId}
                            label="Subject"
                            onChange={(e) =>
                                setSubjectId(e.target.value)
                            }
                        >

                            <MenuItem value="">
                                <em>Select Subject</em>
                            </MenuItem>

                            {subjects.map((subject) => (

                                <MenuItem
                                    key={subject.id}
                                    value={subject.id}
                                >

                                    {subject.subjectName}

                                </MenuItem>

                            ))}

                        </Select>

                    </FormControl>

                            <FormControl
    fullWidth
    required
>
    <InputLabel>
        Day
    </InputLabel>

    <Select
        value={dayOfWeek}
        label="Day"
        onChange={(e) =>
            setDayOfWeek(e.target.value)
        }
    >
        <MenuItem value="">
            <em>Select Day</em>
        </MenuItem>

        <MenuItem value="Monday">
            Monday
        </MenuItem>

        <MenuItem value="Tuesday">
            Tuesday
        </MenuItem>

        <MenuItem value="Wednesday">
            Wednesday
        </MenuItem>

        <MenuItem value="Thursday">
            Thursday
        </MenuItem>

        <MenuItem value="Friday">
            Friday
        </MenuItem>

        <MenuItem value="Saturday">
            Saturday
        </MenuItem>

        <MenuItem value="Sunday">
            Sunday
        </MenuItem>
    </Select>
</FormControl>
                    {/* =====================================
                        START + END TIME
                    ===================================== */}

                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: {
                                xs: "1fr",
                                sm: "1fr 1fr"
                            },
                            gap: 2
                        }}
                    >

                        {/* START TIME */}

                        <TextField
                            fullWidth
                            required
                            label="Start Time"
                            type="time"
                            value={startTime}
                            onChange={(e) =>
                                setStartTime(e.target.value)
                            }
                            InputLabelProps={{
                                shrink: true
                            }}
                        />


                        {/* END TIME */}

                        <TextField
                            fullWidth
                            required
                            label="End Time"
                            type="time"
                            value={endTime}
                            onChange={(e) =>
                                setEndTime(e.target.value)
                            }
                            InputLabelProps={{
                                shrink: true
                            }}
                        />

                    </Box>


                    {/* =====================================
                        BUTTONS
                    ===================================== */}

                    <Box
                        className="teacher-subject-form-buttons"
                    >

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
                                : "Assign Subject"
                            }

                        </Button>

                    </Box>

                </Box>

            </Paper>


            {/* ==========================================
                SUCCESS
            ========================================== */}

            <Snackbar
                open={open}
                autoHideDuration={3000}
                onClose={() => setOpen(false)}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right"
                }}
            >

                <Alert
                    severity="success"
                    variant="filled"
                >
                    Subject Assigned Successfully!
                </Alert>

            </Snackbar>


            {/* ==========================================
                ERROR
            ========================================== */}

            <Snackbar
                open={errorOpen}
                autoHideDuration={5000}
                onClose={() => setErrorOpen(false)}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right"
                }}
            >

                <Alert
                    severity="error"
                    variant="filled"
                    onClose={() =>
                        setErrorOpen(false)
                    }
                >
                    {errorMessage}
                </Alert>

            </Snackbar>

        </DashboardLayout>

    );

}

export default AddTeacherSubject;