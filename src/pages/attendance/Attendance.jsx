import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";

import {
    getAttendanceClasses,
    getAttendanceSections,
    getAttendanceSubjects,
    getAttendanceStudents,
    saveAttendance
} from "../../services/attendanceService";

import "../../assets/attendance.css";

function Attendance() {

    // =====================================================
    // DROPDOWN DATA
    // =====================================================

    const [classes, setClasses] = useState([]);
    const [sections, setSections] = useState([]);
    const [subjects, setSubjects] = useState([]);


    // =====================================================
    // SELECTED FILTERS
    // =====================================================

    const [classId, setClassId] = useState("");
    const [sectionId, setSectionId] = useState("");
    const [subjectId, setSubjectId] = useState("");

    const [date, setDate] = useState(
        new Date().toISOString().split("T")[0]
    );


    // =====================================================
    // STUDENTS
    // =====================================================

    const [students, setStudents] = useState([]);


    // =====================================================
    // ATTENDANCE
    //
    // Example:
    //
    // {
    //     10: "Present",
    //     11: "Absent",
    //     12: "Half Day"
    // }
    // =====================================================

    const [attendance, setAttendance] = useState({});


    // =====================================================
    // LOADING
    // =====================================================

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);


    // =====================================================
    // MESSAGE
    // =====================================================

    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("error");


    // =====================================================
    // LOAD INITIAL DATA
    // =====================================================

    useEffect(() => {

        loadClasses();
        loadSubjects();

    }, []);


    // =====================================================
    // ERROR MESSAGE HELPER
    // =====================================================

    const showMessage = (text, type = "error") => {

        if (typeof text === "object") {

            if (text?.message) {
                text = text.message;
            }
            else if (text?.title) {
                text = text.title;
            }
            else {
                text = "Something went wrong.";
            }

        }

        setMessage(String(text));
        setMessageType(type);

    };


    // =====================================================
    // LOAD CLASSES
    // =====================================================

    const loadClasses = async () => {

        try {

            const data = await getAttendanceClasses();

            console.log("Classes API:", data);

            setClasses(
                Array.isArray(data)
                    ? data
                    : []
            );

        }
        catch (error) {

            console.error(
                "Classes Error:",
                error.response?.data || error
            );

            showMessage(
                error.response?.data ||
                "Unable to load classes."
            );

        }

    };


    // =====================================================
    // LOAD SUBJECTS
    // =====================================================

    const loadSubjects = async () => {

        try {

            const data = await getAttendanceSubjects();

            console.log("Subjects API:", data);

            setSubjects(
                Array.isArray(data)
                    ? data
                    : []
            );

        }
        catch (error) {

            console.error(
                "Subjects Error:",
                error.response?.data || error
            );

            showMessage(
                error.response?.data ||
                "Unable to load subjects."
            );

        }

    };


    // =====================================================
    // CLASS CHANGE
    // =====================================================

    const handleClassChange = async (e) => {

        const selectedClassId = e.target.value;

        setClassId(selectedClassId);

        // Reset section
        setSectionId("");
        setSections([]);

        // Reset students
        setStudents([]);

        // Reset attendance
        setAttendance({});

        setMessage("");


        if (!selectedClassId) {
            return;
        }


        try {

            const data = await getAttendanceSections(
                Number(selectedClassId)
            );

            console.log(
                "Sections API:",
                data
            );

            setSections(
                Array.isArray(data)
                    ? data
                    : []
            );

        }
        catch (error) {

            console.error(
                "Sections Error:",
                error.response?.data || error
            );

            showMessage(
                error.response?.data ||
                "Unable to load sections."
            );

        }

    };


    // =====================================================
    // SECTION CHANGE
    // =====================================================

    const handleSectionChange = (e) => {

        setSectionId(e.target.value);

        setStudents([]);

        setAttendance({});

        setMessage("");

    };


    // =====================================================
    // SUBJECT CHANGE
    // =====================================================

    const handleSubjectChange = (e) => {

        setSubjectId(e.target.value);

        setStudents([]);

        setAttendance({});

        setMessage("");

    };


    // =====================================================
    // DATE CHANGE
    // =====================================================

    const handleDateChange = (e) => {

        setDate(e.target.value);

        setStudents([]);

        setAttendance({});

        setMessage("");

    };


    // =====================================================
    // SEARCH STUDENTS
    // =====================================================

    const handleSearch = async () => {

        setMessage("");


        // Validation
        if (!classId) {

            showMessage("Please select Class.");

            return;

        }

        if (!sectionId) {

            showMessage("Please select Section.");

            return;

        }

        if (!subjectId) {

            showMessage("Please select Subject.");

            return;

        }

        if (!date) {

            showMessage("Please select Date.");

            return;

        }


        try {

            setLoading(true);

            setStudents([]);

            setAttendance({});


            const requestData = {

                classId: Number(classId),

                sectionId: Number(sectionId),

                subjectId: Number(subjectId),

                date: date

            };


            console.log(
                "Attendance Search Request:",
                requestData
            );


            const data =
                await getAttendanceStudents(
                    requestData
                );


            console.log(
                "Attendance Students Response:",
                data
            );


            const studentList =
                Array.isArray(data)
                    ? data
                    : [];


            setStudents(studentList);


            // =================================================
            // LOAD EXISTING ATTENDANCE
            // =================================================

            const existingAttendance = {};


            studentList.forEach((student) => {

                const id =
                    student.userId ??
                    student.studentId ??
                    student.id;


                const existing =
                    student.attendance;


                if (
                    id !== undefined &&
                    existing &&
                    existing.status
                ) {

                    existingAttendance[id] =
                        existing.status;

                }

            });


            setAttendance(
                existingAttendance
            );


            if (studentList.length === 0) {

                showMessage(
                    "No students found for this Class and Section.",
                    "warning"
                );

            }

        }
        catch (error) {

            console.error(
                "Student Search Error:",
                error.response?.data || error
            );


            const errorData =
                error.response?.data;


            if (
                errorData &&
                typeof errorData === "object"
            ) {

                showMessage(
                    errorData.message ||
                    errorData.title ||
                    "Unable to load students."
                );

            }
            else {

                showMessage(
                    errorData ||
                    "Unable to load students."
                );

            }


            setStudents([]);

        }
        finally {

            setLoading(false);

        }

    };


    // =====================================================
    // GET STUDENT ID
    // =====================================================

    const getStudentId = (student) => {

        return (
            student.userId ??
            student.studentId ??
            student.id
        );

    };


    // =====================================================
    // GET STUDENT NAME
    // =====================================================

    const getStudentName = (student) => {

        if (student.studentName) {

            return student.studentName;

        }

        if (student.userName) {

            return student.userName;

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


    // =====================================================
    // ATTENDANCE CHANGE
    //
    // ONLY SELECTED STUDENT CHANGES
    // =====================================================

    const handleAttendanceChange = (
        studentId,
        status
    ) => {

        setAttendance((previous) => ({

            ...previous,

            [studentId]: status

        }));

    };


    // =====================================================
    // MARK ALL PRESENT
    // =====================================================

    const handleSelectAllPresent = () => {

        const newAttendance = {};


        students.forEach((student) => {

            const id =
                getStudentId(student);


            if (id !== undefined) {

                newAttendance[id] =
                    "Present";

            }

        });


        setAttendance(
            newAttendance
        );

    };


    // =====================================================
    // MARK ALL ABSENT
    // =====================================================

    const handleSelectAllAbsent = () => {

        const newAttendance = {};


        students.forEach((student) => {

            const id =
                getStudentId(student);


            if (id !== undefined) {

                newAttendance[id] =
                    "Absent";

            }

        });


        setAttendance(
            newAttendance
        );

    };


    // =====================================================
    // CLEAR ALL
    // =====================================================

    const handleClearAll = () => {

        setAttendance({});

    };


    // =====================================================
    // SAVE ATTENDANCE
    // =====================================================

    const handleSave = async () => {

        setMessage("");


        if (students.length === 0) {

            showMessage(
                "No students available."
            );

            return;

        }


        // =================================================
        // CHECK SELECTED STUDENTS
        // =================================================

        const selectedStudents =
            students.filter((student) => {

                const id =
                    getStudentId(student);

                return (
                    id !== undefined &&
                    attendance[id]
                );

            });


        if (selectedStudents.length === 0) {

            showMessage(
                "Please select at least 1 student attendance."
            );

            return;

        }


        try {

            setSaving(true);


            // =================================================
            // CREATE PAYLOAD
            // =================================================

            const payload =
                selectedStudents.map(
                    (student) => {

                        const studentId =
                            getStudentId(student);


                        return {

                            userId:
                                Number(studentId),

                            subjectId:
                                Number(subjectId),

                            classId:
                                Number(classId),

                            sectionId:
                                Number(sectionId),

                            dated:
                                date,

                            status:
                                attendance[studentId],

                            remarks:
                                null

                        };

                    }
                );


            console.log(
                "SAVE ATTENDANCE PAYLOAD:",
                payload
            );


            // =================================================
            // IMPORTANT
            // =================================================
            // Tumhara backend agar SaveAttendanceDto
            // expect karta hai to payload ko us DTO ke
            // according bhejna hoga.
            //
            // Agar backend directly List expect karta hai:
            // saveAttendance(payload)
            //
            // Agar wrapper expect karta hai:
            // saveAttendance({
            //   classId,
            //   sectionId,
            //   subjectId,
            //   date,
            //   students: payload
            // })
            // =================================================


            await saveAttendance({

                classId:
                    Number(classId),

                sectionId:
                    Number(sectionId),

                subjectId:
                    Number(subjectId),

                date:
                    date,

                students:
                    payload

            });


            showMessage(
                "Attendance saved successfully.",
                "success"
            );


            // Reload attendance
            await handleSearch();

        }
        catch (error) {

            console.error(
                "Save Attendance Error:",
                error.response?.data || error
            );


            const errorData =
                error.response?.data;


            if (
                errorData &&
                typeof errorData === "object"
            ) {

                showMessage(
                    errorData.message ||
                    errorData.title ||
                    "Unable to save attendance."
                );

            }
            else {

                showMessage(
                    errorData ||
                    "Unable to save attendance."
                );

            }

        }
        finally {

            setSaving(false);

        }

    };


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <DashboardLayout>

            <div className="attendance-page">


                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="attendance-header">

                    <div>

                        <h1>
                            Attendance
                        </h1>

                        <p>
                            Mark student attendance
                        </p>

                    </div>

                </div>


                {/* =================================================
                    FILTER CARD
                ================================================= */}

                <div className="attendance-filter-card">


                    {/* CLASS */}

                    <div className="attendance-field">

                        <label>
                            Class *
                        </label>

                        <select
                            value={classId}
                            onChange={
                                handleClassChange
                            }
                        >

                            <option value="">
                                Select Class
                            </option>


                            {classes.map((item) => (

                                <option
                                    key={item.id}
                                    value={item.id}
                                >

                                    {
                                        item.className ??
                                        item.name ??
                                        `Class ${item.id}`
                                    }

                                </option>

                            ))}

                        </select>

                    </div>


                    {/* SECTION */}

                    <div className="attendance-field">

                        <label>
                            Section *
                        </label>

                        <select
                            value={sectionId}
                            onChange={
                                handleSectionChange
                            }
                            disabled={!classId}
                        >

                            <option value="">
                                Select Section
                            </option>


                            {sections.map((item) => (

                                <option
                                    key={
                                        item.sectionId ??
                                        item.id
                                    }
                                    value={
                                        item.sectionId ??
                                        item.id
                                    }
                                >

                                    {
                                        item.sectionName ??
                                        item.name ??
                                        `Section ${
                                            item.sectionId ??
                                            item.id
                                        }`
                                    }

                                </option>

                            ))}

                        </select>

                    </div>


                    {/* SUBJECT */}

                    <div className="attendance-field">

                        <label>
                            Subject *
                        </label>

                        <select
                            value={subjectId}
                            onChange={
                                handleSubjectChange
                            }
                        >

                            <option value="">
                                Select Subject
                            </option>


                            {subjects.map((item) => (

                                <option
                                    key={item.id}
                                    value={item.id}
                                >

                                    {
                                        item.subjectName ??
                                        item.name ??
                                        `Subject ${item.id}`
                                    }

                                </option>

                            ))}

                        </select>

                    </div>


                    {/* DATE */}

                    <div className="attendance-field">

                        <label>
                            Date *
                        </label>

                        <input
                            type="date"
                            value={date}
                            onChange={
                                handleDateChange
                            }
                        />

                    </div>


                    {/* SEARCH */}

                    <button
                        type="button"
                        className="attendance-search-btn"
                        onClick={handleSearch}
                        disabled={loading}
                    >

                        {loading
                            ? "Loading..."
                            : "Search"
                        }

                    </button>

                </div>


                {/* =================================================
                    MESSAGE
                ================================================= */}

                {message && (

                    <div
                        className={
                            messageType === "success"
                                ? "attendance-message success"
                                : messageType === "warning"
                                    ? "attendance-message warning"
                                    : "attendance-message"
                        }
                    >

                        {message}

                    </div>

                )}


                {/* =================================================
                    STUDENTS TABLE
                ================================================= */}

                {students.length > 0 && (

                    <div className="attendance-table-card">


                        {/* TABLE HEADER */}

                        <div className="attendance-table-header">

                            <div>

                                <h2>
                                    Student Attendance
                                </h2>

                                <span>
                                    {students.length} Students
                                </span>

                            </div>


                            <div className="attendance-actions">


                                <button
                                    type="button"
                                    className="select-all-btn"
                                    onClick={
                                        handleSelectAllPresent
                                    }
                                >

                                    Mark All Present

                                </button>


                                <button
                                    type="button"
                                    className="absent-all-btn"
                                    onClick={
                                        handleSelectAllAbsent
                                    }
                                >

                                    Mark All Absent

                                </button>


                                <button
                                    type="button"
                                    className="clear-btn"
                                    onClick={
                                        handleClearAll
                                    }
                                >

                                    Clear

                                </button>

                            </div>

                        </div>


                        {/* TABLE */}

                        <div className="attendance-table-wrapper">

                            <table className="attendance-table">

                                <thead>

                                    <tr>

                                        <th>
                                            #
                                        </th>

                                        <th>
                                            Student ID
                                        </th>

                                        <th>
                                            Roll No
                                        </th>

                                        <th>
                                            Student Name
                                        </th>

                                        <th>
                                            Attendance
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {students.map(
                                        (student, index) => {

                                            const studentId =
                                                getStudentId(
                                                    student
                                                );


                                            const studentName =
                                                getStudentName(
                                                    student
                                                );


                                            const rollNo =
                                                student.rollNo ??
                                                student.rollNumber ??
                                                "-";


                                            const currentStatus =
                                                attendance[
                                                    studentId
                                                ];


                                            return (

                                                <tr
                                                    key={
                                                        studentId ??
                                                        index
                                                    }
                                                >


                                                    {/* NUMBER */}

                                                    <td>

                                                        {index + 1}

                                                    </td>


                                                    {/* STUDENT ID */}

                                                    <td className="student-id">

                                                        {
                                                            studentId ??
                                                            "-"
                                                        }

                                                    </td>


                                                    {/* ROLL NO */}

                                                    <td>

                                                        {rollNo}

                                                    </td>


                                                    {/* NAME */}

                                                    <td className="student-name">

                                                        {
                                                            studentName ||
                                                            "Unknown Student"
                                                        }

                                                    </td>


                                                    {/* ATTENDANCE */}

                                                    <td>

                                                        <div className="attendance-options">


                                                            {/* PRESENT */}

                                                            <button
                                                                type="button"
                                                                className={
                                                                    currentStatus === "Present"
                                                                        ? "status-btn present active"
                                                                        : "status-btn present"
                                                                }
                                                                onClick={() =>
                                                                    handleAttendanceChange(
                                                                        studentId,
                                                                        "Present"
                                                                    )
                                                                }
                                                            >

                                                                Present

                                                            </button>


                                                            {/* ABSENT */}

                                                            <button
                                                                type="button"
                                                                className={
                                                                    currentStatus === "Absent"
                                                                        ? "status-btn absent active"
                                                                        : "status-btn absent"
                                                                }
                                                                onClick={() =>
                                                                    handleAttendanceChange(
                                                                        studentId,
                                                                        "Absent"
                                                                    )
                                                                }
                                                            >

                                                                Absent

                                                            </button>


                                                            {/* HALF DAY */}

                                                            <button
                                                                type="button"
                                                                className={
                                                                    currentStatus === "Half Day"
                                                                        ? "status-btn half active"
                                                                        : "status-btn half"
                                                                }
                                                                onClick={() =>
                                                                    handleAttendanceChange(
                                                                        studentId,
                                                                        "Half Day"
                                                                    )
                                                                }
                                                            >

                                                                Half Day

                                                            </button>


                                                            {/* LATE */}

                                                            <button
                                                                type="button"
                                                                className={
                                                                    currentStatus === "Late"
                                                                        ? "status-btn late active"
                                                                        : "status-btn late"
                                                                }
                                                                onClick={() =>
                                                                    handleAttendanceChange(
                                                                        studentId,
                                                                        "Late"
                                                                    )
                                                                }
                                                            >

                                                                Late

                                                            </button>

                                                        </div>

                                                    </td>

                                                </tr>

                                            );

                                        }
                                    )}

                                </tbody>

                            </table>

                        </div>


                        {/* =================================================
                            SAVE
                        ================================================= */}

                        <div className="attendance-save-container">

                            <button
                                type="button"
                                className="save-attendance-btn"
                                onClick={handleSave}
                                disabled={saving}
                            >

                                {saving
                                    ? "Saving..."
                                    : "Save Attendance"
                                }

                            </button>

                        </div>

                    </div>

                )}


                {/* =================================================
                    NO STUDENTS
                ================================================= */}

                {!loading &&
                    students.length === 0 &&
                    classId &&
                    sectionId &&
                    subjectId && (

                        <div className="no-students">

                            Search students to mark attendance.

                        </div>

                    )}


                {/* =================================================
                    LOADING
                ================================================= */}

                {loading && (

                    <div className="loading">

                        Loading students...

                    </div>

                )}

            </div>

        </DashboardLayout>

    );

}

export default Attendance;