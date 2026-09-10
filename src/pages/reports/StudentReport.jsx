import { useEffect, useMemo, useState } from "react";

import {
    Alert,
    Box,
    Button,
    CircularProgress,
    FormControl,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Snackbar,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";

import PrintIcon from "@mui/icons-material/Print";
import AssessmentIcon from "@mui/icons-material/Assessment";

import DashboardLayout from "../../layouts/DashboardLayout";

import {
    getReportStudents,
    getStudentReport
} from "../../services/studentReportService";

import {
    getTeacherSubjects
} from "../../services/teacherSubjectService";

import "../../assets/studentReport.css";


const DAYS = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday"
];


function StudentReport() {

    const [students, setStudents] = useState([]);

    const [selectedStudent, setSelectedStudent] = useState("");

    const [report, setReport] = useState(null);

    const [timetable, setTimetable] = useState([]);

    const [loadingStudents, setLoadingStudents] = useState(true);

    const [loadingReport, setLoadingReport] = useState(false);

    const [error, setError] = useState("");

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success"
    });


    useEffect(() => {
        loadStudents();
        loadTimetable();
    }, []);


    const loadStudents = async () => {

        try {

            setLoadingStudents(true);

            const result = await getReportStudents();

            const list =
                Array.isArray(result)
                    ? result
                    : Array.isArray(result?.data)
                        ? result.data
                        : [];

            setStudents(list);

        }
        catch (error) {

            setError(
                error.response?.data?.message ||
                "Unable to load students."
            );

        }
        finally {

            setLoadingStudents(false);

        }

    };


    const loadTimetable = async () => {

        try {

            const result = await getTeacherSubjects();

            const list =
                Array.isArray(result)
                    ? result
                    : Array.isArray(result?.data)
                        ? result.data
                        : [];

            setTimetable(list);

        }
        catch (error) {

            console.log(
                "Timetable Error:",
                error
            );

        }

    };


    const generateReport = async () => {

        if (!selectedStudent) {

            setSnackbar({
                open: true,
                message: "Please select a student.",
                severity: "warning"
            });

            return;

        }


        try {

            setLoadingReport(true);

            setError("");

            const result =
                await getStudentReport(
                    Number(selectedStudent)
                );

            setReport(result);

        }
        catch (error) {

            setReport(null);

            setError(
                error.response?.data?.message ||
                "Unable to generate student report."
            );

        }
        finally {

            setLoadingReport(false);

        }

    };


    const studentTimetable = useMemo(() => {

        if (!report?.student) {
            return [];
        }

        return timetable.filter(item =>
            String(item.classId) ===
            String(report.student.classId)
            &&
            String(item.sectionId) ===
            String(report.student.sectionId)
        );

    }, [timetable, report]);


    const formatTime = (time) => {

        if (!time) {
            return "";
        }

        return String(time).substring(0, 5);

    };


    const getPeriods = () => {

        const map = new Map();

        studentTimetable.forEach(item => {

            const start =
                formatTime(item.startTime);

            const end =
                formatTime(item.endTime);

            if (!start || !end) {
                return;
            }

            const key =
                `${start}-${end}`;

            if (!map.has(key)) {

                map.set(key, {
                    start,
                    end
                });

            }

        });

        return Array.from(map.values())
            .sort((a, b) =>
                a.start.localeCompare(b.start)
            );

    };


    const getCellData = (
        day,
        period
    ) => {

        return studentTimetable.filter(item => {

            const itemStart =
                formatTime(item.startTime);

            const itemEnd =
                formatTime(item.endTime);

            return (
                String(item.dayOfWeek).toLowerCase() ===
                day.toLowerCase()
                &&
                itemStart === period.start
                &&
                itemEnd === period.end
            );

        });

    };


    const getMonthlyAttendance = () => {

        if (!report?.attendance?.records) {
            return [];
        }

        const months = {};

        report.attendance.records.forEach(item => {

            if (!item.dated) {
                return;
            }

            const date =
                new Date(`${item.dated}T00:00:00`);

            const key =
                `${date.getFullYear()}-${String(
                    date.getMonth() + 1
                ).padStart(2, "0")}`;

            if (!months[key]) {

                months[key] = {
                    month: date.toLocaleString(
                        "default",
                        {
                            month: "long",
                            year: "numeric"
                        }
                    ),
                    present: 0,
                    absent: 0,
                    halfDay: 0,
                    late: 0,
                    total: 0
                };

            }

            months[key].total++;

            if (item.status === "Present") {
                months[key].present++;
            }

            if (item.status === "Absent") {
                months[key].absent++;
            }

            if (item.status === "Half Day") {
                months[key].halfDay++;
            }

            if (item.status === "Late") {
                months[key].late++;
            }

        });

        return Object.values(months)
            .sort((a, b) =>
                a.month.localeCompare(b.month)
            );

    };


    const getResultsSummary = () => {

        const results =
            report?.results || [];

        let totalMarks = 0;

        let obtainedMarks = 0;

        let failed = false;

        results.forEach(item => {

            totalMarks +=
                Number(item.totalMarks || 0);

            obtainedMarks +=
                Number(item.obtainedMarks || 0);

            if (
                item.passingMarks != null &&
                Number(item.obtainedMarks || 0) <
                Number(item.passingMarks)
            ) {

                failed = true;

            }

        });

        const percentage =
            totalMarks > 0
                ? (obtainedMarks / totalMarks) * 100
                : 0;

        let grade = "N/A";

        if (percentage >= 90) {
            grade = "A+";
        }
        else if (percentage >= 80) {
            grade = "A";
        }
        else if (percentage >= 70) {
            grade = "B+";
        }
        else if (percentage >= 60) {
            grade = "B";
        }
        else if (percentage >= 50) {
            grade = "C";
        }
        else if (percentage >= 40) {
            grade = "D";
        }
        else if (totalMarks > 0) {
            grade = "F";
        }

        return {
            totalMarks,
            obtainedMarks,
            percentage,
            grade,
            result:
                results.length === 0
                    ? "N/A"
                    : failed || percentage < 40
                        ? "FAIL"
                        : "PASS"
        };

    };


    const resultSummary =
        getResultsSummary();


    const monthlyAttendance =
        getMonthlyAttendance();


    const periods =
        getPeriods();


    const money = (value) => {

        return `Rs. ${Number(
            value || 0
        ).toLocaleString()}`;

    };


    const printReport = () => {

        window.print();

    };


    return (

        <DashboardLayout>

            <div className="student-report-page">

                <div className="student-report-header no-print">

                    <div>

                        <Typography
                            variant="h4"
                            fontWeight="700"
                        >
                            Student Report
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Complete student academic record
                        </Typography>

                    </div>

                    <AssessmentIcon
                        sx={{
                            fontSize: 42
                        }}
                    />

                </div>


                <Paper
                    className="report-filter no-print"
                    elevation={3}
                >

                    <FormControl
                        fullWidth
                        size="small"
                    >

                        <InputLabel>
                            Select Student
                        </InputLabel>

                        <Select
                            value={selectedStudent}
                            label="Select Student"
                            onChange={(e) =>
                                setSelectedStudent(
                                    e.target.value
                                )
                            }
                        >

                            {loadingStudents ? (

                                <MenuItem disabled>
                                    Loading students...
                                </MenuItem>

                            ) : (

                                students.map(student => (

                                    <MenuItem
                                        key={student.id}
                                        value={student.id}
                                    >
                                        {student.studentName ||
                                            `${student.firstName || ""} ${student.lastName || ""}`
                                        }
                                    </MenuItem>

                                ))

                            )}

                        </Select>

                    </FormControl>


                    <Button
                        variant="contained"
                        onClick={generateReport}
                        disabled={
                            loadingReport ||
                            !selectedStudent
                        }
                        sx={{
                            minWidth: "180px",
                            height: "40px"
                        }}
                    >

                        {loadingReport ? (
                            <CircularProgress
                                size={22}
                                color="inherit"
                            />
                        ) : (
                            "Generate Report"
                        )}

                    </Button>

                </Paper>


                {error && (

                    <Alert
                        severity="error"
                        className="no-print"
                        sx={{
                            marginBottom: "20px"
                        }}
                    >
                        {error}
                    </Alert>

                )}


                {report && (

                    <div className="student-report-print">


                        <div className="print-top-header">

                            <div>

                                <Typography
                                    variant="h4"
                                    fontWeight="700"
                                >
                                    STUDENT REPORT
                                </Typography>

                                <Typography>
                                    Complete Academic Record
                                </Typography>

                            </div>

                            <Button
                                className="no-print"
                                variant="contained"
                                startIcon={<PrintIcon />}
                                onClick={printReport}
                            >
                                Print Report
                            </Button>

                        </div>


                        <Paper
                            className="report-section"
                            elevation={3}
                        >

                            <Typography
                                className="section-title"
                                variant="h6"
                            >
                                Student Information
                            </Typography>


                            <div className="student-info-grid">

                                <div>
                                    <strong>Student ID</strong>
                                    <span>
                                        {report.student.studentId}
                                    </span>
                                </div>

                                <div>
                                    <strong>Student Name</strong>
                                    <span>
                                        {report.student.studentName}
                                    </span>
                                </div>

                                <div>
                                    <strong>Roll No</strong>
                                    <span>
                                        {report.student.rollNo || "-"}
                                    </span>
                                </div>

                                <div>
                                    <strong>Class</strong>
                                    <span>
                                        {report.student.className || "-"}
                                    </span>
                                </div>

                                <div>
                                    <strong>Section</strong>
                                    <span>
                                        {report.student.sectionName || "-"}
                                    </span>
                                </div>

                                <div>
                                    <strong>Gender</strong>
                                    <span>
                                        {report.student.gender || "-"}
                                    </span>
                                </div>

                                <div>
                                    <strong>Mobile</strong>
                                    <span>
                                        {report.student.mobile || "-"}
                                    </span>
                                </div>

                                <div>
                                    <strong>Email</strong>
                                    <span>
                                        {report.student.email || "-"}
                                    </span>
                                </div>

                                <div>
                                    <strong>Father Name</strong>
                                    <span>
                                        {report.student.fatherName || "-"}
                                    </span>
                                </div>

                                <div>
                                    <strong>Father Mobile</strong>
                                    <span>
                                        {report.student.fatherMobileNumber || "-"}
                                    </span>
                                </div>

                            </div>

                        </Paper>


                        <Paper
                            className="report-section"
                            elevation={3}
                        >

                            <Typography
                                className="section-title"
                                variant="h6"
                            >
                                Attendance Summary
                            </Typography>


                            <div className="summary-grid">

                                <div className="summary-card">
                                    <strong>Total Days</strong>
                                    <span>
                                        {report.attendance.totalDays}
                                    </span>
                                </div>

                                <div className="summary-card">
                                    <strong>Present</strong>
                                    <span>
                                        {report.attendance.present}
                                    </span>
                                </div>

                                <div className="summary-card">
                                    <strong>Absent</strong>
                                    <span>
                                        {report.attendance.absent}
                                    </span>
                                </div>

                                <div className="summary-card">
                                    <strong>Half Day</strong>
                                    <span>
                                        {report.attendance.halfDay}
                                    </span>
                                </div>

                                <div className="summary-card">
                                    <strong>Late</strong>
                                    <span>
                                        {report.attendance.late}
                                    </span>
                                </div>

                                <div className="summary-card">
                                    <strong>Percentage</strong>
                                    <span>
                                        {report.attendance.percentage}%
                                    </span>
                                </div>

                            </div>

                        </Paper>


                        <Paper
                            className="report-section"
                            elevation={3}
                        >

                            <Typography
                                className="section-title"
                                variant="h6"
                            >
                                Monthly Attendance
                            </Typography>


                            <TableContainer>

                                <Table>

                                    <TableHead>

                                        <TableRow>

                                            <TableCell>
                                                Month
                                            </TableCell>

                                            <TableCell>
                                                Total
                                            </TableCell>

                                            <TableCell>
                                                Present
                                            </TableCell>

                                            <TableCell>
                                                Absent
                                            </TableCell>

                                            <TableCell>
                                                Half Day
                                            </TableCell>

                                            <TableCell>
                                                Late
                                            </TableCell>

                                        </TableRow>

                                    </TableHead>


                                    <TableBody>

                                        {monthlyAttendance.map(
                                            item => (

                                                <TableRow
                                                    key={item.month}
                                                >

                                                    <TableCell>
                                                        {item.month}
                                                    </TableCell>

                                                    <TableCell>
                                                        {item.total}
                                                    </TableCell>

                                                    <TableCell>
                                                        {item.present}
                                                    </TableCell>

                                                    <TableCell>
                                                        {item.absent}
                                                    </TableCell>

                                                    <TableCell>
                                                        {item.halfDay}
                                                    </TableCell>

                                                    <TableCell>
                                                        {item.late}
                                                    </TableCell>

                                                </TableRow>

                                            )
                                        )}

                                    </TableBody>

                                </Table>

                            </TableContainer>

                        </Paper>


                        <Paper
                            className="report-section"
                            elevation={3}
                        >

                            <Typography
                                className="section-title"
                                variant="h6"
                            >
                                Weekly Timetable
                            </Typography>


                            {studentTimetable.length === 0 ? (

                                <Typography>
                                    No timetable found for this student's class and section.
                                </Typography>

                            ) : (

                                <div className="report-timetable-scroll">

                                    <table className="report-timetable">

                                        <thead>

                                            <tr>

                                                <th>
                                                    Day
                                                </th>

                                                {periods.map(
                                                    period => (

                                                        <th
                                                            key={`${period.start}-${period.end}`}
                                                        >

                                                            {period.start}
                                                            {" - "}
                                                            {period.end}

                                                        </th>

                                                    )
                                                )}

                                            </tr>

                                        </thead>


                                        <tbody>

                                            {DAYS.map(day => (

                                                <tr key={day}>

                                                    <td className="report-day">
                                                        {day}
                                                    </td>


                                                    {periods.map(
                                                        period => {

                                                            const items =
                                                                getCellData(
                                                                    day,
                                                                    period
                                                                );

                                                            return (

                                                                <td
                                                                    key={`${day}-${period.start}`}
                                                                >

                                                                    {items.length === 0 ? (

                                                                        <span className="free-cell">
                                                                            Free
                                                                        </span>

                                                                    ) : (

                                                                        items.map(
                                                                            item => (

                                                                                <div
                                                                                    key={
                                                                                        item.teacherSubjectId
                                                                                    }
                                                                                    className="report-subject-card"
                                                                                >

                                                                                    <strong>
                                                                                        {item.subjectName || "-"}
                                                                                    </strong>

                                                                                    <span>
                                                                                        Teacher: {item.teacherName || "-"}
                                                                                    </span>

                                                                                </div>

                                                                            )
                                                                        )

                                                                    )}

                                                                </td>

                                                            );

                                                        }
                                                    )}

                                                </tr>

                                            ))}

                                        </tbody>

                                    </table>

                                </div>

                            )}

                        </Paper>


                        <Paper
                            className="report-section"
                            elevation={3}
                        >

                            <Typography
                                className="section-title"
                                variant="h6"
                            >
                                Results / Marks
                            </Typography>


                            <TableContainer>

                                <Table>

                                    <TableHead>

                                        <TableRow>

                                            <TableCell>
                                                Exam
                                            </TableCell>

                                            <TableCell>
                                                Subject
                                            </TableCell>

                                            <TableCell>
                                                Total Marks
                                            </TableCell>

                                            <TableCell>
                                                Obtained
                                            </TableCell>

                                            <TableCell>
                                                Percentage
                                            </TableCell>

                                            <TableCell>
                                                Grade
                                            </TableCell>

                                            <TableCell>
                                                Remarks
                                            </TableCell>

                                        </TableRow>

                                    </TableHead>


                                    <TableBody>

                                        {report.results.map(item => {

                                            const percentage =
                                                Number(item.totalMarks || 0) > 0
                                                    ? (
                                                        Number(item.obtainedMarks || 0) /
                                                        Number(item.totalMarks)
                                                    ) * 100
                                                    : 0;

                                            return (

                                                <TableRow
                                                    key={item.marksId}
                                                >

                                                    <TableCell>
                                                        {item.examName || "-"}
                                                    </TableCell>

                                                    <TableCell>
                                                        {item.subjectName || "-"}
                                                    </TableCell>

                                                    <TableCell>
                                                        {item.totalMarks}
                                                    </TableCell>

                                                    <TableCell>
                                                        {item.obtainedMarks}
                                                    </TableCell>

                                                    <TableCell>
                                                        {percentage.toFixed(2)}%
                                                    </TableCell>

                                                    <TableCell>
                                                        {item.grade || "-"}
                                                    </TableCell>

                                                    <TableCell>
                                                        {item.remarks || "-"}
                                                    </TableCell>

                                                </TableRow>

                                            );

                                        })}

                                    </TableBody>

                                </Table>

                            </TableContainer>


                            <div className="result-summary">

                                <div>
                                    <strong>Total Marks</strong>
                                    <span>
                                        {resultSummary.totalMarks}
                                    </span>
                                </div>

                                <div>
                                    <strong>Obtained Marks</strong>
                                    <span>
                                        {resultSummary.obtainedMarks}
                                    </span>
                                </div>

                                <div>
                                    <strong>Percentage</strong>
                                    <span>
                                        {resultSummary.percentage.toFixed(2)}%
                                    </span>
                                </div>

                                <div>
                                    <strong>Grade</strong>
                                    <span>
                                        {resultSummary.grade}
                                    </span>
                                </div>

                                <div>
                                    <strong>Result</strong>
                                    <span>
                                        {resultSummary.result}
                                    </span>
                                </div>

                            </div>

                        </Paper>


                        <Paper
                            className="report-section"
                            elevation={3}
                        >

                            <Typography
                                className="section-title"
                                variant="h6"
                            >
                                Fees Status
                            </Typography>


                            <TableContainer>

                                <Table>

                                    <TableHead>

                                        <TableRow>

                                            <TableCell>
                                                Voucher
                                            </TableCell>

                                            <TableCell>
                                                Fee Type
                                            </TableCell>

                                            <TableCell>
                                                Month
                                            </TableCell>

                                            <TableCell>
                                                Amount
                                            </TableCell>

                                            <TableCell>
                                                Paid
                                            </TableCell>

                                            <TableCell>
                                                Remaining
                                            </TableCell>

                                            <TableCell>
                                                Due Date
                                            </TableCell>

                                            <TableCell>
                                                Status
                                            </TableCell>

                                        </TableRow>

                                    </TableHead>


                                    <TableBody>

                                        {report.fees.records.map(
                                            item => (

                                                <TableRow
                                                    key={item.studentFees}
                                                >

                                                    <TableCell>
                                                        {item.voucherNo || "-"}
                                                    </TableCell>

                                                    <TableCell>
                                                        {item.feeName || "-"}
                                                    </TableCell>

                                                    <TableCell>
                                                        {item.month || "-"}
                                                    </TableCell>

                                                    <TableCell>
                                                        {money(item.amount)}
                                                    </TableCell>

                                                    <TableCell>
                                                        {money(item.paidAmount)}
                                                    </TableCell>

                                                    <TableCell>
                                                        {money(item.remainingAmount)}
                                                    </TableCell>

                                                    <TableCell>
                                                        {item.dueDate || "-"}
                                                    </TableCell>

                                                    <TableCell>
                                                        {item.voucherStatus ||
                                                            item.status ||
                                                            "Pending"}
                                                    </TableCell>

                                                </TableRow>

                                            )
                                        )}

                                    </TableBody>

                                </Table>

                            </TableContainer>


                            <div className="fee-summary">

                                <div>
                                    <strong>
                                        Total Fees
                                    </strong>

                                    <span>
                                        {money(
                                            report.fees.totalAmount
                                        )}
                                    </span>
                                </div>

                                <div>
                                    <strong>
                                        Paid
                                    </strong>

                                    <span>
                                        {money(
                                            report.fees.paidAmount
                                        )}
                                    </span>
                                </div>

                                <div>
                                    <strong>
                                        Remaining
                                    </strong>

                                    <span>
                                        {money(
                                            report.fees.remainingAmount
                                        )}
                                    </span>
                                </div>

                            </div>

                        </Paper>


                        <Paper
                            className="report-section"
                            elevation={3}
                        >

                            <Typography
                                className="section-title"
                                variant="h6"
                            >
                                Payment History
                            </Typography>


                            <TableContainer>

                                <Table>

                                    <TableHead>

                                        <TableRow>

                                            <TableCell>
                                                Voucher
                                            </TableCell>

                                            <TableCell>
                                                Paid Amount
                                            </TableCell>

                                            <TableCell>
                                                Payment Date
                                            </TableCell>

                                            <TableCell>
                                                Method
                                            </TableCell>

                                            <TableCell>
                                                Reference No
                                            </TableCell>

                                        </TableRow>

                                    </TableHead>


                                    <TableBody>

                                        {report.payments.map(
                                            payment => (

                                                <TableRow
                                                    key={
                                                        payment.paymentId
                                                    }
                                                >

                                                    <TableCell>
                                                        {payment.voucherNo || "-"}
                                                    </TableCell>

                                                    <TableCell>
                                                        {money(
                                                            payment.paidAmount
                                                        )}
                                                    </TableCell>

                                                    <TableCell>
                                                        {payment.paymentDate || "-"}
                                                    </TableCell>

                                                    <TableCell>
                                                        {payment.paymentMethod || "-"}
                                                    </TableCell>

                                                    <TableCell>
                                                        {payment.referenceNo || "-"}
                                                    </TableCell>

                                                </TableRow>

                                            )
                                        )}

                                    </TableBody>

                                </Table>

                            </TableContainer>

                        </Paper>


                        <div className="report-footer">

                            <span>
                                Generated on:{" "}
                                {new Date().toLocaleDateString()}
                            </span>

                            <span>
                                Student Report
                            </span>

                        </div>

                    </div>

                )}


                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={3000}
                    onClose={() =>
                        setSnackbar({
                            ...snackbar,
                            open: false
                        })
                    }
                >

                    <Alert
                        severity={snackbar.severity}
                        onClose={() =>
                            setSnackbar({
                                ...snackbar,
                                open: false
                            })
                        }
                    >
                        {snackbar.message}
                    </Alert>

                </Snackbar>

            </div>

        </DashboardLayout>

    );

}


export default StudentReport;