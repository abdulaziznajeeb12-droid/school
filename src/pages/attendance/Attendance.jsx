import { useEffect, useState } from "react";

import DashboardLayout from "../../layouts/DashboardLayout";

import {
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
    Snackbar,
    Alert,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from "@mui/material";

import {
    getAttendanceClasses,
    getAttendanceSections,
    getAttendanceStudents,
    saveAttendance
} from "../../services/attendanceService";

import "../../assets/markAttendance.css";

const Attendance = () => {
    const [classes, setClasses] = useState([]);
    const [sections, setSections] = useState([]);

    const [classId, setClassId] = useState("");
    const [sectionId, setSectionId] = useState("");

    const [date, setDate] = useState(
        new Date().toISOString().split("T")[0]
    );

    const [students, setStudents] = useState([]);
    const [attendance, setAttendance] = useState({});

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("success");

    useEffect(() => {
        loadClasses();
    }, []);

    const loadClasses = async () => {
        try {
            const data = await getAttendanceClasses();

            setClasses(
                Array.isArray(data)
                    ? data
                    : data?.records || []
            );
        } catch (error) {
            console.error("Error loading classes:", error);

            setMessage("Failed to load classes");
            setMessageType("error");
        }
    };

    const handleClassChange = async (e) => {
        const selectedClassId = e.target.value;

        setClassId(selectedClassId);
        setSectionId("");
        setSections([]);
        setStudents([]);
        setAttendance({});

        if (!selectedClassId) {
            return;
        }

        try {
            const data = await getAttendanceSections(
                Number(selectedClassId)
            );

            setSections(
                Array.isArray(data)
                    ? data
                    : data?.records || []
            );
        } catch (error) {
            console.error("Error loading sections:", error);

            setMessage("Failed to load sections");
            setMessageType("error");
        }
    };

    const handleSectionChange = (e) => {
        setSectionId(e.target.value);

        setStudents([]);
        setAttendance({});
    };

    const handleSearch = async () => {
        if (!classId) {
            setMessage("Please select class");
            setMessageType("warning");
            return;
        }

        if (!sectionId) {
            setMessage("Please select section");
            setMessageType("warning");
            return;
        }

        if (!date) {
            setMessage("Please select date");
            setMessageType("warning");
            return;
        }

        setLoading(true);

        try {
            const data = await getAttendanceStudents({
                classId: Number(classId),
                sectionId: Number(sectionId),
                date: date
            });

            const studentList = Array.isArray(data)
                ? data
                : data?.records || [];

            setStudents(studentList);

            const existingAttendance = {};

            studentList.forEach((student) => {
                const studentId =
                    student.userId ??
                    student.studentId ??
                    student.id;

                if (
                    student.attendance &&
                    student.attendance.status
                ) {
                    existingAttendance[studentId] =
                        student.attendance.status;
                }
            });

            setAttendance(existingAttendance);
        } catch (error) {
            console.error("Error loading students:", error);

            setStudents([]);
            setAttendance({});

            setMessage(
                error?.response?.data?.message ||
                "Failed to load students"
            );

            setMessageType("error");
        } finally {
            setLoading(false);
        }
    };

    const handleAttendanceChange = (
        studentId,
        status
    ) => {
        setAttendance((prev) => ({
            ...prev,
            [studentId]: status
        }));
    };

    const handleSelectAllPresent = () => {
        const allPresent = {};

        students.forEach((student) => {
            const studentId =
                student.userId ??
                student.studentId ??
                student.id;

            allPresent[studentId] = "Present";
        });

        setAttendance(allPresent);
    };

    const handleSave = async () => {
        if (!classId) {
            setMessage("Please select class");
            setMessageType("warning");
            return;
        }

        if (!sectionId) {
            setMessage("Please select section");
            setMessageType("warning");
            return;
        }

        if (!date) {
            setMessage("Please select date");
            setMessageType("warning");
            return;
        }

        if (students.length === 0) {
            setMessage("Please search students first");
            setMessageType("warning");
            return;
        }

        const selectedStudents = students.filter((student) => {
            const studentId =
                student.userId ??
                student.studentId ??
                student.id;

            return attendance[studentId];
        });

        if (selectedStudents.length === 0) {
            setMessage("Please mark attendance first");
            setMessageType("warning");
            return;
        }

        setSaving(true);

        try {
            const payload = {
                classId: Number(classId),
                sectionId: Number(sectionId),
                date: date,

                students: selectedStudents.map((student) => {
                    const studentId =
                        student.userId ??
                        student.studentId ??
                        student.id;

                    return {
                        userId: Number(studentId),
                        status: attendance[studentId]
                    };
                })
            };

            await saveAttendance(payload);

            setMessage(
                "Attendance submitted successfully"
            );

            setMessageType("success");
        } catch (error) {
            console.error(
                "Error saving attendance:",
                error
            );

            setMessage(
                error?.response?.data?.message ||
                "Failed to submit attendance"
            );

            setMessageType("error");
        } finally {
            setSaving(false);
        }
    };

    const getStudentId = (student) => {
        return (
            student.userId ??
            student.studentId ??
            student.id
        );
    };

    const getStudentName = (student) => {
        if (student.studentName) {
            return student.studentName;
        }

        if (student.name) {
            return student.name;
        }

        const firstName =
            student.firstName || "";

        const lastName =
            student.lastName || "";

        return `${firstName} ${lastName}`.trim();
    };

    return (
        <DashboardLayout>
            <Box sx={{ p: 3 }}>

                <Typography
                    variant="h4"
                    sx={{
                        mb: 3,
                        fontWeight: 600
                    }}
                >
                    Mark Attendance
                </Typography>

                <Paper
                    elevation={2}
                    sx={{
                        p: 3,
                        mb: 3
                    }}
                >
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(3, 1fr)",
                            gap: 2
                        }}
                    >

                        <FormControl fullWidth>
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
                                    Select Class
                                </MenuItem>

                                {classes.map((item) => (
                                    <MenuItem
                                        key={
                                            item.id ??
                                            item.classId
                                        }
                                        value={
                                            item.id ??
                                            item.classId
                                        }
                                    >
                                        {item.name ??
                                            item.className}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth>
                            <InputLabel>
                                Section
                            </InputLabel>

                            <Select
                                value={sectionId}
                                label="Section"
                                onChange={
                                    handleSectionChange
                                }
                                disabled={!classId}
                            >
                                <MenuItem value="">
                                    Select Section
                                </MenuItem>

                                {sections.map((item) => (
                                    <MenuItem
                                        key={
                                            item.id ??
                                            item.sectionId
                                        }
                                        value={
                                            item.id ??
                                            item.sectionId
                                        }
                                    >
                                        {item.name ??
                                            item.sectionName}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <TextField
                            fullWidth
                            type="date"
                            label="Date"
                            value={date}
                            onChange={(e) =>
                                setDate(e.target.value)
                            }
                            InputLabelProps={{
                                shrink: true
                            }}
                        />

                    </Box>

                    <Box
                        sx={{
                            mt: 3,
                            display: "flex",
                            gap: 2
                        }}
                    >
                        <Button
                            variant="contained"
                            onClick={handleSearch}
                            disabled={
                                loading ||
                                !classId ||
                                !sectionId
                            }
                        >
                            {loading
                                ? "Loading..."
                                : "Search Students"}
                        </Button>

                        {students.length > 0 && (
                            <Button
                                variant="outlined"
                                onClick={
                                    handleSelectAllPresent
                                }
                            >
                                Select All Present
                            </Button>
                        )}
                    </Box>
                </Paper>

                {students.length > 0 && (
                    <Paper elevation={2}>

                        <TableContainer>
                            <Table>

                                <TableHead>
                                    <TableRow>
                                        <TableCell>
                                            #
                                        </TableCell>

                                        <TableCell>
                                            Student ID
                                        </TableCell>

                                        <TableCell>
                                            Student Name
                                        </TableCell>

                                        <TableCell align="center">
                                            Attendance
                                        </TableCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody>

                                    {students.map(
                                        (
                                            student,
                                            index
                                        ) => {
                                            const studentId =
                                                getStudentId(
                                                    student
                                                );

                                            const currentStatus =
                                                attendance[
                                                    studentId
                                                ];

                                            return (
                                                <TableRow
                                                    key={
                                                        studentId
                                                    }
                                                >

                                                    <TableCell>
                                                        {index +
                                                            1}
                                                    </TableCell>

                                                    <TableCell>
                                                        {studentId}
                                                    </TableCell>

                                                    <TableCell>
                                                        {getStudentName(
                                                            student
                                                        )}
                                                    </TableCell>

                                                    <TableCell align="center">

                                                        <Box
                                                            sx={{
                                                                display:
                                                                    "flex",
                                                                justifyContent:
                                                                    "center",
                                                                gap: 1
                                                            }}
                                                        >

                                                            <Button
                                                                size="small"
                                                                variant={
                                                                    currentStatus ===
                                                                    "Present"
                                                                        ? "contained"
                                                                        : "outlined"
                                                                }
                                                                onClick={() =>
                                                                    handleAttendanceChange(
                                                                        studentId,
                                                                        "Present"
                                                                    )
                                                                }
                                                            >
                                                                Present
                                                            </Button>

                                                            <Button
                                                                size="small"
                                                                variant={
                                                                    currentStatus ===
                                                                    "Absent"
                                                                        ? "contained"
                                                                        : "outlined"
                                                                }
                                                                onClick={() =>
                                                                    handleAttendanceChange(
                                                                        studentId,
                                                                        "Absent"
                                                                    )
                                                                }
                                                            >
                                                                Absent
                                                            </Button>

                                                            <Button
                                                                size="small"
                                                                variant={
                                                                    currentStatus ===
                                                                    "Half Day"
                                                                        ? "contained"
                                                                        : "outlined"
                                                                }
                                                                onClick={() =>
                                                                    handleAttendanceChange(
                                                                        studentId,
                                                                        "Half Day"
                                                                    )
                                                                }
                                                            >
                                                                Half Day
                                                            </Button>

                                                            <Button
                                                                size="small"
                                                                variant={
                                                                    currentStatus ===
                                                                    "Late"
                                                                        ? "contained"
                                                                        : "outlined"
                                                                }
                                                                onClick={() =>
                                                                    handleAttendanceChange(
                                                                        studentId,
                                                                        "Late"
                                                                    )
                                                                }
                                                            >
                                                                Late
                                                            </Button>

                                                        </Box>

                                                    </TableCell>

                                                </TableRow>
                                            );
                                        }
                                    )}

                                </TableBody>

                            </Table>
                        </TableContainer>

                        <Box
                            sx={{
                                p: 3,
                                display: "flex",
                                justifyContent:
                                    "flex-end"
                            }}
                        >
                            <Button
                                variant="contained"
                                size="large"
                                onClick={handleSave}
                                disabled={saving}
                            >
                                {saving
                                    ? "Submitting..."
                                    : "Submit Attendance"}
                            </Button>
                        </Box>

                    </Paper>
                )}

                <Snackbar
                    open={Boolean(message)}
                    autoHideDuration={3000}
                    onClose={() =>
                        setMessage("")
                    }
                    anchorOrigin={{
                        vertical: "top",
                        horizontal: "right"
                    }}
                >
                    <Alert
                        onClose={() =>
                            setMessage("")
                        }
                        severity={messageType}
                        variant="filled"
                        sx={{
                            width: "100%"
                        }}
                    >
                        {message}
                    </Alert>
                </Snackbar>

            </Box>
        </DashboardLayout>
    );
};

export default Attendance;
