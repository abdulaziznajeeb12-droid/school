import {
    useEffect,
    useState
} from "react";

import {
    useNavigate,
    useParams
} from "react-router-dom";

import DashboardLayout
    from "../../layouts/DashboardLayout";

import {
    Paper,
    Typography,
    TextField,
    Button,
    Checkbox,
    FormControlLabel,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box,
    Snackbar,
    Alert
} from "@mui/material";

import {
    getStudentClassById,
    updateStudentClass,
    getBranchByClassId,
    getSectionsByClassId,
    getAvailableStudents
} from "../../services/studentClassService";

import { getClasses } from "../../services/classService";


function EditStudentClass() {

    const navigate = useNavigate();

    const { id } = useParams();


    // ==========================================
    // FORM
    // ==========================================

    const [studentId, setStudentId] =
        useState("");

    const [classId, setClassId] =
        useState("");

    const [sectionId, setSectionId] =
        useState("");

    const [branchName, setBranchName] =
        useState("");

    const [rollNo, setRollNo] =
        useState("");

    const [admissionDate, setAdmissionDate] =
        useState("");

    const [isActive, setIsActive] =
        useState(true);


    // ==========================================
    // DROPDOWNS
    // ==========================================

    const [classes, setClasses] =
        useState([]);

    const [sections, setSections] =
        useState([]);

    const [students, setStudents] =
        useState([]);


    // ==========================================
    // SNACKBAR
    // ==========================================

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success"
    });


    // ==========================================
    // INITIAL LOAD
    // ==========================================

    useEffect(() => {

        loadData();

    }, [id]);


    const loadData = async () => {

        try {

            const classData =
                await getClasses();

            setClasses(classData);


            const data =
                await getStudentClassById(id);


            setStudentId(
                data.studentId
            );

            setClassId(
                data.classId
            );

            setSectionId(
                data.sectionId
            );

            setRollNo(
                data.rollNo ?? ""
            );

            setAdmissionDate(
                data.admissionDate
                    ? data.admissionDate.substring(
                        0,
                        10
                    )
                    : ""
            );

            setIsActive(
                data.isActive ?? true
            );


            // Branch

            const branch =
                await getBranchByClassId(
                    data.classId
                );

            setBranchName(
                branch.branchName
            );


            // Sections

            const sectionData =
                await getSectionsByClassId(
                    data.classId
                );

            setSections(
                sectionData
            );


            // Students

            const studentData =
                await getAvailableStudents(
                    data.classId,
                    data.sectionId
                );


            // Existing student may not be in
            // available students because already assigned.
            // Add it manually.

            const existingStudent = {
                id: data.studentId,
                studentName: data.studentName
            };


            const exists =
                studentData.some(
                    x =>
                        x.id ===
                        data.studentId
                );


            if (!exists) {

                studentData.unshift(
                    existingStudent
                );

            }


            setStudents(
                studentData
            );

        } catch (error) {

            console.log(error);

            showSnackbar(
                "Failed to load assignment",
                "error"
            );

        }

    };


    // ==========================================
    // CLASS CHANGE
    // ==========================================

    const handleClassChange = async (e) => {

        const newClassId =
            e.target.value;

        setClassId(newClassId);

        setBranchName("");

        setSections([]);

        setSectionId("");

        setStudents([]);

        setStudentId("");


        if (!newClassId) {
            return;
        }


        try {

            const branch =
                await getBranchByClassId(
                    newClassId
                );

            setBranchName(
                branch.branchName
            );


            const sectionData =
                await getSectionsByClassId(
                    newClassId
                );

            setSections(
                sectionData
            );

        } catch (error) {

            console.log(error);

        }

    };


    // ==========================================
    // SECTION CHANGE
    // ==========================================

    const handleSectionChange = async (e) => {

        const newSectionId =
            e.target.value;

        setSectionId(
            newSectionId
        );

        setStudents([]);

        setStudentId("");


        if (!newSectionId || !classId) {
            return;
        }


        try {

            const data =
                await getAvailableStudents(
                    classId,
                    newSectionId
                );

            setStudents(data);

        } catch (error) {

            console.log(error);

        }

    };


    // ==========================================
    // UPDATE
    // ==========================================

    const handleUpdate = async (e) => {

        e.preventDefault();


        if (!studentId ||
            !classId ||
            !sectionId) {

            showSnackbar(
                "Please fill all required fields",
                "error"
            );

            return;

        }


        try {

            await updateStudentClass({

                enrolledId: Number(id),

                studentId: Number(
                    studentId
                ),

                classId: Number(
                    classId
                ),

                sectionId: Number(
                    sectionId
                ),

                rollNo: Number(
                    rollNo
                ),

                admissionDate:
                    admissionDate || null,

                isActive

            });


            showSnackbar(
                "Student assignment updated successfully!",
                "success"
            );


            setTimeout(() => {

                navigate(
                    "/studentclasses"
                );

            }, 1500);


        } catch (error) {

            console.log(error);

            showSnackbar(
                "Update failed!",
                "error"
            );

        }

    };


    // ==========================================
    // SNACKBAR
    // ==========================================

    const showSnackbar = (
        message,
        severity
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

                    Edit Student Assignment

                </Typography>


                <Typography
                    align="center"
                    sx={{
                        marginBottom: 3,
                        color: "#666"
                    }}
                >

                    Update student class assignment

                </Typography>


                <Box
                    component="form"
                    onSubmit={handleUpdate}
                    className="form-container"
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
                            value={classId}
                            label="Class"
                            onChange={
                                handleClassChange
                            }
                        >

                            {classes.map(
                                (item) => (

                                    <MenuItem
                                        key={item.id}
                                        value={item.id}
                                    >

                                        {item.className}

                                    </MenuItem>

                                )
                            )}

                        </Select>

                    </FormControl>


                    {/* BRANCH */}

                    <TextField
                        fullWidth
                        label="Branch"
                        value={branchName}
                        InputProps={{
                            readOnly: true
                        }}
                    />


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
                            onChange={
                                handleSectionChange
                            }
                        >

                            {sections.map(
                                (section) => (

                                    <MenuItem
                                        key={
                                            section.sectionId
                                        }
                                        value={
                                            section.sectionId
                                        }
                                    >

                                        {
                                            section.sectionName
                                        }

                                    </MenuItem>

                                )
                            )}

                        </Select>

                    </FormControl>


                    {/* STUDENT */}

                    <FormControl
                        fullWidth
                        required
                    >

                        <InputLabel>
                            Student
                        </InputLabel>

                        <Select
                            value={studentId}
                            label="Student"
                            onChange={(e) =>
                                setStudentId(
                                    e.target.value
                                )
                            }
                        >

                            {students.map(
                                (student) => (

                                    <MenuItem
                                        key={
                                            student.id
                                        }
                                        value={
                                            student.id
                                        }
                                    >

                                        {
                                            student.studentName
                                        }

                                    </MenuItem>

                                )
                            )}

                        </Select>

                    </FormControl>


                    {/* ROLL NO */}

                    <TextField
                        fullWidth
                        label="Roll No"
                        type="number"
                        value={rollNo}
                        onChange={(e) =>
                            setRollNo(
                                e.target.value
                            )
                        }
                        required
                    />


                    {/* ADMISSION DATE */}

                    <TextField
                        fullWidth
                        label="Admission Date"
                        type="date"
                        value={admissionDate}
                        onChange={(e) =>
                            setAdmissionDate(
                                e.target.value
                            )
                        }
                        InputLabelProps={{
                            shrink: true
                        }}
                    />


                    {/* ACTIVE */}

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
                    />


                    {/* UPDATE */}

                    <Button
                        type="submit"
                        variant="contained"
                        size="large"
                    >

                        Update Student

                    </Button>


                    <Button
                        type="button"
                        variant="outlined"
                        size="large"
                        onClick={() =>
                            navigate(
                                "/studentclasses"
                            )
                        }
                    >

                        Cancel

                    </Button>

                </Box>

            </Paper>


            {/* SNACKBAR */}

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


export default EditStudentClass;