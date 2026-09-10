import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Alert,
    Snackbar,
    CircularProgress
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

import DashboardLayout from "../../layouts/DashboardLayout";

import {
    getTeacherSubjectById,
    
    updateTeacherSubject,
    deleteTeacherSubject,
    getTeachers,
    getTeacherClasses,
    getTeacherSections,
    getTeacherSubjectsList
} from "../../services/teacherSubjectService";

import "../../assets/teacherSubjectForm.css";


const EditTeacherSubject = () => {

    const navigate = useNavigate();
    const { id } = useParams();

    // =====================================================
    // STATES
    // =====================================================

    const [teacherId, setTeacherId] = useState("");
    const [classId, setClassId] = useState("");
    const [sectionId, setSectionId] = useState("");
    const [subjectId, setSubjectId] = useState("");

    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");

    const [teachers, setTeachers] = useState([]);
    const [classes, setClasses] = useState([]);
    const [sections, setSections] = useState([]);
    const [subjects, setSubjects] = useState([]);
const [dayOfWeek, setDayOfWeek] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // =====================================================
    // MESSAGE
    // =====================================================

    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("success");
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const showMessage = (msg, type = "success") => {
        setMessage(msg);
        setMessageType(type);
        setOpenSnackbar(true);
    };

    // =====================================================
    // LOAD INITIAL DATA
    // =====================================================

    useEffect(() => {
        loadInitialData();
    }, [id]);

    const loadInitialData = async () => {

        try {

            setLoading(true);

            // ---------------------------------------------
            // Load teachers
            // ---------------------------------------------

            const teacherData = await getTeachers();

            const teacherList =
                Array.isArray(teacherData)
                    ? teacherData
                    : Array.isArray(teacherData?.data)
                        ? teacherData.data
                        : [];

            setTeachers(teacherList);


            // ---------------------------------------------
            // Load classes
            // ---------------------------------------------

            const classData = await getTeacherClasses();

            const classList =
                Array.isArray(classData)
                    ? classData
                    : Array.isArray(classData?.data)
                        ? classData.data
                        : [];

            setClasses(classList);


            // ---------------------------------------------
            // Load subjects
            // ---------------------------------------------

            const subjectData = await getTeacherSubjectsList();

            const subjectList =
                Array.isArray(subjectData)
                    ? subjectData
                    : Array.isArray(subjectData?.data)
                        ? subjectData.data
                        : [];

            setSubjects(subjectList);


            // ---------------------------------------------
            // Load existing assignment
            // ---------------------------------------------

            const data = await getTeacherSubjectById(Number(id));
            
            console.log("Edit TeacherSubject:", data);


            // ---------------------------------------------
            // Set existing values
            // ---------------------------------------------

            setDayOfWeek(
    data.dayOfWeek ?? ""
);

            setTeacherId(
                data.teacherId ?? ""
            );

            setClassId(
                data.classId ?? ""
            );

            setSubjectId(
                data.subjectId ?? ""
            );

            setStartTime(
                data.startTime
                    ? String(data.startTime).substring(0, 5)
                    : ""
            );

            setEndTime(
                data.endTime
                    ? String(data.endTime).substring(0, 5)
                    : ""
            );


            // ---------------------------------------------
            // Load sections for selected class
            // ---------------------------------------------

            if (data.classId) {

                const sectionData =
                    await getTeacherSections(Number(data.classId));

                const sectionList =
                    Array.isArray(sectionData)
                        ? sectionData
                        : Array.isArray(sectionData?.data)
                            ? sectionData.data
                            : [];

                setSections(sectionList);

                setSectionId(
                    data.sectionId ?? ""
                );
            }

        }
        catch (error) {

            console.log(
                "Edit Loading Error:",
                error.response?.data || error
            );

            showMessage(
                error.response?.data?.message ||
                "Unable to load Teacher Subject.",
                "error"
            );

        }
        finally {

            setLoading(false);

        }
    };


    // =====================================================
    // CLASS CHANGE
    // =====================================================
const handleDelete = async () => {

    const confirmDelete = window.confirm(
        "Are you sure you want to delete this teacher subject assignment?"
    );

    if (!confirmDelete) {
        return;
    }

    try {

        await deleteTeacherSubject(Number(id));

        showMessage(
            "Teacher Subject deleted successfully.",
            "success"
        );

        setTimeout(() => {

            navigate("/teachersubject");

        }, 1000);

    }
    catch (error) {

        console.log(
            "Delete Error:",
            error.response?.data || error
        );

        showMessage(
            error.response?.data?.message ||
            "Unable to delete Teacher Subject.",
            "error"
        );
    }
};


    const handleClassChange = async (e) => {

        const value = e.target.value;

        setClassId(value);

        setSectionId("");
        setSections([]);

        if (!value)
            return;

        try {

            const data =
                await getTeacherSections(
                    Number(value)
                );

            console.log(
                "Sections Response:",
                data
            );

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

            showMessage(
                error.response?.data?.message ||
                "Unable to load sections.",
                "error"
            );

        }
    };


    // =====================================================
    // UPDATE
    // =====================================================

const handleSubmit = async (e) => {
    e.preventDefault();
    if (!teacherId) {
        showMessage(
            "Please select Teacher.",
            "error"
        );
        return;
    }
    if (!classId) {
        showMessage(
            "Please select Class.",
            "error"
        );
        return;
    }
    if (!sectionId) {
        showMessage(
            "Please select Section.",
            "error"
        );
        return;
    }
    if (!subjectId) {
        showMessage(
            "Please select Subject.",
            "error"
        );
        return;
    }
    if (!dayOfWeek) {
        showMessage(
            "Please select Day.",
            "error"
        );
        return;
    }

    if (!startTime) {
        showMessage(
            "Please select Start Time.",
            "error"
        );
        return;
    }

    if (!endTime) {
        showMessage(
            "Please select End Time.",
            "error"
        );
        return;
    }


    // ---------------------------------------------
    // Time validation
    // ---------------------------------------------

    if (endTime <= startTime) {

        showMessage(
            "End Time must be greater than Start Time.",
            "error"
        );

        return;
    }


    try {

        setSaving(true);


        // ---------------------------------------------
        // Update API
        // ---------------------------------------------

        await updateTeacherSubject({

            teacherSubjectId: Number(id),

            teacherId: Number(teacherId),

            classId: Number(classId),

            sectionId: Number(sectionId),

            subjectId: Number(subjectId),

            dayOfWeek: dayOfWeek,

            startTime: `${startTime}:00`,

            endTime: `${endTime}:00`

        });


        showMessage(
            "Teacher Subject updated successfully.",
            "success"
        );


        // ---------------------------------------------
        // Go back after update
        // ---------------------------------------------

        setTimeout(() => {

            navigate("/teachersubject");

        }, 1000);

    }
    catch (error) {

        console.log(
            "Update Error:",
            error.response?.data || error
        );


        const backendMessage =
            error.response?.data?.message ||
            error.response?.data?.title ||
            "Unable to update Teacher Subject.";


        showMessage(
            backendMessage,
            "error"
        );

    }
    finally {

        setSaving(false);

    }
;



            



        // ---------------------------------------------
        // Time validation
        // ---------------------------------------------

        if (endTime <= startTime) {

            showMessage(
                "End Time must be greater than Start Time.",
                "error"
            );

            return;
        }


        try {

            setSaving(true);


            // ---------------------------------------------
            // Update API
            // ---------------------------------------------

            await updateTeacherSubject({

                teacherSubjectId: Number(id),

                teacherId: Number(teacherId),

                classId: Number(classId),

                sectionId: Number(sectionId),

                subjectId: Number(subjectId),

                startTime: `${startTime}:00`,

                endTime: `${endTime}:00`

            });


            showMessage(
                "Teacher Subject updated successfully.",
                "success"
            );


            // ---------------------------------------------
            // Go back after update
            // ---------------------------------------------

            setTimeout(() => {

                navigate("/teachersubject");

            }, 1000);

        }
        catch (error) {

            console.log(
                "Update Error:",
                error.response?.data || error
            );


            const backendMessage =
                error.response?.data?.message ||
                error.response?.data?.title ||
                "Unable to update Teacher Subject.";


            showMessage(
                backendMessage,
                "error"
            );

        }
        finally {

            setSaving(false);

        }
    };


    // =====================================================
    // LOADING SCREEN
    // =====================================================

    if (loading) {

        return (

            <DashboardLayout>

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        minHeight: "400px"
                    }}
                >

                    <CircularProgress />

                </Box>

            </DashboardLayout>
        );
    }


    // =====================================================
    // UI
    // =====================================================

    return (

        <DashboardLayout>

            <div className="teacher-subject-form-container">

                <div className="teacher-subject-form-card">

                    <h2>
                        Edit Teacher Subject
                    </h2>


                    <form onSubmit={handleSubmit}>


                        {/* =================================
                            TEACHER
                        ================================= */}

                        <FormControl
                            fullWidth
                            required
                            margin="normal"
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
                                    <em>
                                        Select Teacher
                                    </em>
                                </MenuItem>


                                {teachers.map((teacher) => (

                                    <MenuItem
                                        key={
                                            teacher.userId ??
                                            teacher.id
                                        }
                                        value={
                                            teacher.userId ??
                                            teacher.id
                                        }
                                    >

                                        {teacher.firstName
                                            ? `${teacher.firstName} ${teacher.lastName ?? ""}`
                                            : teacher.name}

                                    </MenuItem>

                                ))}

                            </Select>

                        </FormControl>



                        {/* =================================
                            CLASS
                        ================================= */}

                        <FormControl
                            fullWidth
                            required
                            margin="normal"
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
                                    <em>
                                        Select Class
                                    </em>
                                </MenuItem>


                                {classes.map((item) => (

                                    <MenuItem
                                        key={
                                            item.classId ??
                                            item.id
                                        }
                                        value={
                                            item.classId ??
                                            item.id
                                        }
                                    >

                                        {item.className}

                                    </MenuItem>

                                ))}

                            </Select>

                        </FormControl>



                        {/* =================================
                            SECTION
                        ================================= */}

                        <FormControl
                            fullWidth
                            required
                            margin="normal"
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
                                    <em>
                                        Select Section
                                    </em>
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



                        {/* =================================
                            SUBJECT
                        ================================= */}

                        <FormControl
                            fullWidth
                            required
                            margin="normal"
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
                                    <em>
                                        Select Subject
                                    </em>
                                </MenuItem>


                                {subjects.map((item) => (

                                    <MenuItem
                                        key={
                                            item.subjectId ??
                                            item.id
                                        }
                                        value={
                                            item.subjectId ??
                                            item.id
                                        }
                                    >

                                        {item.subjectName}

                                    </MenuItem>

                                ))}

                            </Select>

                        </FormControl>


<FormControl
    fullWidth
    required
    margin="normal"
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
                        {/* =================================
                            START + END TIME
                        ================================= */}

                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: {
                                    xs: "1fr",
                                    sm: "1fr 1fr"
                                },
                                gap: 2,
                                mt: 2
                            }}
                        >

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



                        {/* =================================
                            BUTTONS
                        ================================= */}

                        <Box
    sx={{
        display: "flex",
        gap: 2,
        mt: 3,
        flexWrap: "wrap"
    }}
>

    {/* UPDATE */}

    <Button
        type="submit"
        variant="contained"
        disabled={saving}
    >
        {saving
            ? "Updating..."
            : "Update"}
    </Button>


    {/* DELETE */}

    <Button
        type="button"
        variant="contained"
        color="error"
        onClick={handleDelete}
        disabled={saving}
    >
        Delete
    </Button>


    {/* CANCEL */}

    <Button
        type="button"
        variant="outlined"
        onClick={() =>
            navigate("/teachersubject")
        }
        disabled={saving}
    >
        Cancel
    </Button>

</Box>

                    </form>

                </div>

            </div>


            {/* =============================================
                SNACKBAR
            ============================================= */}

            <Snackbar
                open={openSnackbar}
                autoHideDuration={4000}
                onClose={() =>
                    setOpenSnackbar(false)
                }
            >

                <Alert
                    severity={messageType}
                    onClose={() =>
                        setOpenSnackbar(false)
                    }
                    sx={{
                        width: "100%"
                    }}
                >

                    {message}

                </Alert>

            </Snackbar>

        </DashboardLayout>
    );
};


export default EditTeacherSubject;