import { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";

import {
    getAttendanceBySection,
    getStudentAttendanceHistory
} from "../../services/attendanceService";

import "../../assets/attendance-list.css";

function AttendanceList() {

    const [sectionId, setSectionId] = useState("");
    const [studentId, setStudentId] = useState("");

    const [records, setRecords] = useState([]);

    const [loading, setLoading] = useState(false);

    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");

    const [studentInfo, setStudentInfo] = useState(null);

    // ============================================
    // SEARCH
    // ============================================

    const handleSearch = async () => {

        setMessage("");
        setRecords([]);
        setStudentInfo(null);

        if (!sectionId && !studentId) {

            setMessage(
                "Please enter Section ID or Student ID."
            );

            setMessageType("error");

            return;
        }

        try {

            setLoading(true);

            // ========================================
            // STUDENT ID SEARCH
            // ========================================

            if (studentId) {

                const data =
                    await getStudentAttendanceHistory(
                        Number(studentId)
                    );

                console.log(
                    "Student Attendance:",
                    data
                );

                setRecords(
                    data?.records ||
                    data ||
                    []
                );

                setStudentInfo(
                    data?.student ||
                    null
                );

            }

            // ========================================
            // SECTION ID SEARCH
            // ========================================

            else if (sectionId) {

                const data =
                    await getAttendanceBySection(
                        Number(sectionId)
                    );

                console.log(
                    "Section Attendance:",
                    data
                );

                setRecords(data || []);
            }

        } catch (error) {

            console.error(
                "Attendance search error:",
                error.response?.data || error
            );

            const errorData =
                error.response?.data;

            setMessage(
                typeof errorData === "string"
                    ? errorData
                    : errorData?.message ||
                      "Attendance records load nahi ho sake."
            );

            setMessageType("error");

            setRecords([]);

        } finally {

            setLoading(false);
        }
    };

    // ============================================
    // RESET
    // ============================================

    const handleReset = () => {

        setSectionId("");
        setStudentId("");

        setRecords([]);
        setStudentInfo(null);

        setMessage("");
    };

    // ============================================
    // STATUS CLASS
    // ============================================

    const getStatusClass = (status) => {

        switch (status) {

            case "Present":
                return "history-present";

            case "Absent":
                return "history-absent";

            case "Half Day":
                return "history-half";

            case "Late":
                return "history-late";

            default:
                return "";
        }
    };

    return (

        <DashboardLayout>

            <div className="attendance-list-page">

                {/* =====================================
                    HEADER
                ===================================== */}

                <div className="attendance-list-header">

                    <div>

                        <h1>
                            Attendance Records
                        </h1>

                        <p>
                            Search attendance by Section ID or Student ID
                        </p>

                    </div>

                </div>


                {/* =====================================
                    FILTER
                ===================================== */}

                <div className="attendance-list-filter">

                    {/* SECTION ID */}

                    <div className="attendance-list-field">

                        <label>
                            Section ID
                        </label>

                        <input
                            type="number"
                            placeholder="Enter Section ID"
                            value={sectionId}
                            onChange={(e) => {
                                setSectionId(e.target.value);

                                // Student ID clear
                                if (e.target.value) {
                                    setStudentId("");
                                }
                            }}
                        />

                    </div>


                    {/* STUDENT ID */}

                    <div className="attendance-list-field">

                        <label>
                            Student ID
                        </label>

                        <input
                            type="number"
                            placeholder="Enter Student ID"
                            value={studentId}
                            onChange={(e) => {
                                setStudentId(e.target.value);

                                // Section ID clear
                                if (e.target.value) {
                                    setSectionId("");
                                }
                            }}
                        />

                    </div>


                    {/* SEARCH */}

                    <button
                        className="attendance-history-search"
                        onClick={handleSearch}
                        disabled={loading}
                    >

                        {loading
                            ? "Searching..."
                            : "Search"
                        }

                    </button>


                    {/* RESET */}

                    <button
                        className="attendance-history-reset"
                        onClick={handleReset}
                    >
                        Reset
                    </button>

                </div>


                {/* =====================================
                    MESSAGE
                ===================================== */}

                {message && (

                    <div
                        className={`attendance-history-message ${messageType}`}
                    >
                        {message}
                    </div>

                )}


                {/* =====================================
                    STUDENT INFO
                ===================================== */}

                {studentInfo && (

                    <div className="student-attendance-summary">

                        <div>

                            <span>
                                Student
                            </span>

                            <strong>
                                {studentInfo.studentName}
                            </strong>

                        </div>

                        <div>

                            <span>
                                Student ID
                            </span>

                            <strong>
                                {studentInfo.studentId}
                            </strong>

                        </div>

                        <div>

                            <span>
                                Total Days
                            </span>

                            <strong>
                                {studentInfo.totalDays}
                            </strong>

                        </div>

                        <div>

                            <span>
                                Present
                            </span>

                            <strong>
                                {studentInfo.present}
                            </strong>

                        </div>

                        <div>

                            <span>
                                Absent
                            </span>

                            <strong>
                                {studentInfo.absent}
                            </strong>

                        </div>

                        <div>

                            <span>
                                Half Day
                            </span>

                            <strong>
                                {studentInfo.halfDay}
                            </strong>

                        </div>

                        <div>

                            <span>
                                Late
                            </span>

                            <strong>
                                {studentInfo.late}
                            </strong>

                        </div>

                        <div>

                            <span>
                                Attendance %
                            </span>

                            <strong>
                                {studentInfo.percentage}%
                            </strong>

                        </div>

                    </div>

                )}


                {/* =====================================
                    RECORDS
                ===================================== */}

                {records.length > 0 && (

                    <div className="attendance-history-card">

                        <div className="attendance-history-title">

                            <div>

                                <h2>
                                    Attendance History
                                </h2>

                                <span>
                                    {records.length} Records
                                </span>

                            </div>

                        </div>


                        <div className="attendance-history-wrapper">

                            <table className="attendance-history-table">

                                <thead>

                                    <tr>

                                        <th>
                                            #
                                        </th>

                                        <th>
                                            Student ID
                                        </th>

                                        <th>
                                            Student Name
                                        </th>

                                        <th>
                                            Class
                                        </th>

                                        <th>
                                            Section
                                        </th>

                                        

                                        <th>
                                            Date
                                        </th>

                                        <th>
                                            Status
                                        </th>

                                        <th>
                                            Remarks
                                        </th>

                                    </tr>

                                </thead>


                               <tbody>
    {records.map((record, index) => (
        <tr
            key={
                record.attendanceId ??
                record.id ??
                `${record.userId}-${record.dated ?? record.date}-${index}`
            }
        >
            <td>
                {index + 1}
            </td>

            <td className="history-student-id">
                {record.userId ??
                    record.studentId ??
                    "-"}
            </td>

            <td className="history-student-name">
                {record.studentName ??
                    record.name ??
                    "-"}
            </td>

            <td>
    {record.className ?? "-"}
</td>

<td>
    {record.sectionName ?? "-"}
</td>

<td>
    {record.date ?? "-"}
</td>

            <td>
                <span
                    className={`attendance-status ${getStatusClass(
                        record.status
                    )}`}
                >
                    {record.status ?? "-"}
                </span>
            </td>

            <td>
                {record.remarks ?? "-"}
            </td>
        </tr>
    ))}
</tbody>

                            </table>

                        </div>

                    </div>

                )}


                {/* =====================================
                    NO RECORDS
                ===================================== */}

                {!loading &&
                    records.length === 0 &&
                    !message &&
                    (sectionId || studentId) && (

                        <div className="attendance-no-records">

                            No attendance records found.

                        </div>

                    )}

            </div>

        </DashboardLayout>
    );
}

export default AttendanceList;