import {
    useEffect,
    useState
} from "react";

import {
    useNavigate
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
    Alert,
    Autocomplete
} from "@mui/material";

import {
    addStudentClass,
    getBranchByClassId,
    getSectionsByClassId,
    getAvailableStudents
} from "../../services/studentClassService";

import { getClasses } from "../../services/classService";


function AddStudentClass() {

    const navigate = useNavigate();


    // ==========================================
    // FORM
    // ==========================================

    const [classId, setClassId] = useState("");

    const [branchId, setBranchId] = useState("");

    const [branchName, setBranchName] = useState("");

    const [sectionId, setSectionId] = useState("");

    const [studentIds, setStudentIds] = useState([]);

    const [admissionDate, setAdmissionDate] =
        useState("");

    const [isActive, setIsActive] =
        useState(true);


    // ==========================================
    // DROPDOWN DATA
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
    // LOAD CLASSES
    // ==========================================

    useEffect(() => {

        loadClasses();

    }, []);


    const loadClasses = async () => {

        try {

            const data = await getClasses();

            setClasses(data);

        } catch (error) {

            console.log(error);

            showSnackbar(
                "Failed to load classes",
                "error"
            );

        }

    };


    // ==========================================
    // CLASS CHANGE
    // ==========================================

    const handleClassChange = async (e) => {

        const selectedClassId =
            e.target.value;

        setClassId(selectedClassId);

        // reset dependent fields

        setBranchId("");
        setBranchName("");

        setSectionId("");

        setSections([]);

        setStudents([]);

        setStudentIds([]);


        if (!selectedClassId) {
            return;
        }


        try {

            // Fetch Branch

            const branch =
                await getBranchByClassId(
                    selectedClassId
                );


            setBranchId(
                branch.branchId
            );

            setBranchName(
                branch.branchName
            );


            // Fetch Sections

            const sectionData =
                await getSectionsByClassId(
                    selectedClassId
                );


            setSections(sectionData);

        } catch (error) {

            console.log(error);

            showSnackbar(
                "Failed to load class information",
                "error"
            );

        }

    };


    // ==========================================
    // SECTION CHANGE
    // ==========================================

    const handleSectionChange = async (e) => {

        const selectedSectionId =
            e.target.value;

        setSectionId(
            selectedSectionId
        );

        setStudents([]);

        setStudentIds([]);


        if (!selectedSectionId || !classId) {
            return;
        }


        try {

            const data =
                await getAvailableStudents(
                    classId,
                    selectedSectionId
                );


            setStudents(data);

        } catch (error) {

            console.log(error);

            showSnackbar(
                "Failed to load students",
                "error"
            );

        }

    };


    // ==========================================
    // SAVE
    // ==========================================

    const saveStudentClass = async (e) => {

        e.preventDefault();


        if (!classId) {

            showSnackbar(
                "Please select a class",
                "error"
            );

            return;

        }


        if (!sectionId) {

            showSnackbar(
                "Please select a section",
                "error"
            );

            return;

        }


        if (studentIds.length === 0) {

            showSnackbar(
                "Please select at least one student",
                "error"
            );

            return;

        }


        try {

            await addStudentClass({

                classId: Number(classId),

                sectionId: Number(sectionId),

                studentIds: studentIds.map(
                    (id) => Number(id)
                ),

                admissionDate:
                    admissionDate || null,

                isActive

            });


            showSnackbar(
                "Students assigned successfully!",
                "success"
            );


            setTimeout(() => {

                navigate("/studentclasses");

            }, 1500);


        } catch (error) {

            console.log(error);

            const message =
                error.response?.data?.message ||
                "Failed to assign students.";

            showSnackbar(
                message,
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


    // ==========================================
    // SELECTED STUDENT OBJECTS
    // ==========================================

    const selectedStudents =
        students.filter(
            (student) =>
                studentIds.includes(
                    student.id
                )
        );


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

                    Assign Students

                </Typography>


                <Typography
                    align="center"
                    sx={{
                        marginBottom: 3,
                        color: "#666"
                    }}
                >

                    Assign multiple students to a class

                </Typography>


                <Box
                    component="form"
                    onSubmit={saveStudentClass}
                    className="form-container"
                >


                    {/* ================================= */}
                    {/* CLASS */}
                    {/* ================================= */}

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

                            <MenuItem value="">
                                <em>
                                    Select Class
                                </em>
                            </MenuItem>


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


                    {/* ================================= */}
                    {/* BRANCH */}
                    {/* ================================= */}

                    <TextField
                        fullWidth
                        label="Branch"
                        value={branchName}
                        InputProps={{
                            readOnly: true
                        }}
                        helperText={
                            branchName
                                ? "Branch automatically loaded from selected class"
                                : "Select a class first"
                        }
                    />


                    {/* ================================= */}
                    {/* SECTION */}
                    {/* ================================= */}

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
                            onChange={
                                handleSectionChange
                            }
                        >

                            <MenuItem value="">
                                <em>
                                    Select Section
                                </em>
                            </MenuItem>


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


                    {/* ================================= */}
                    {/* MULTIPLE STUDENTS */}
                    {/* ================================= */}

                    <Autocomplete
                        multiple
                        fullWidth
                        disabled={
                            !classId ||
                            !sectionId
                        }
                        options={students}
                        value={selectedStudents}
                        onChange={(
                            event,
                            newValue
                        ) => {

                            setStudentIds(
                                newValue.map(
                                    (student) =>
                                        student.id
                                )
                            );

                        }}
                        getOptionLabel={(
                            option
                        ) =>
                            option.studentName
                        }
                        isOptionEqualToValue={(
                            option,
                            value
                        ) =>
                            option.id === value.id
                        }
                        renderInput={(
                            params
                        ) => (

                            <TextField
                                {...params}
                                label="Students"
                                placeholder={
                                    sectionId
                                        ? "Select students..."
                                        : "Select section first"
                                }
                                required={
                                    studentIds.length === 0
                                }
                            />

                        )}
                    />


                    {/* ================================= */}
                    {/* ADMISSION DATE */}
                    {/* ================================= */}

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


                    {/* ================================= */}
                    {/* ACTIVE */}
                    {/* ================================= */}

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


                    {/* ================================= */}
                    {/* BUTTON */}
                    {/* ================================= */}

                    <Button
                        type="submit"
                        variant="contained"
                        size="large"
                    >

                        Assign Students

                    </Button>


                    <Button
                        type="button"
                        variant="outlined"
                        size="large"
                        onClick={() =>
                            navigate(
                                "/student-class"
                            )
                        }
                    >

                        Cancel

                    </Button>

                </Box>

            </Paper>


            {/* ================================= */}
            {/* SNACKBAR */}
            {/* ================================= */}

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


export default AddStudentClass;