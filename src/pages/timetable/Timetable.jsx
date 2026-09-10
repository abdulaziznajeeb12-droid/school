import { useEffect, useState } from "react";

import {
    Box,
    Paper,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CircularProgress,
    Alert
} from "@mui/material";

import DashboardLayout from "../../layouts/DashboardLayout";

import {
    getTeacherSubjects
} from "../../services/teacherSubjectService";

import "../../assets/timetable.css";


const DAYS = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday"
];


function Timetable() {

    const [data, setData] = useState([]);

    const [selectedClass, setSelectedClass] = useState("all");

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    // =====================================================
    // LOAD DATA
    // =====================================================

    useEffect(() => {

        loadTimetable();

    }, []);


    const loadTimetable = async () => {

        try {

            setLoading(true);

            setError("");

            const result =
                await getTeacherSubjects();

            const list =
                Array.isArray(result)
                    ? result
                    : Array.isArray(result?.data)
                        ? result.data
                        : [];

            setData(list);

        }
        catch (error) {

            console.log(
                "Timetable Error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Unable to load timetable."
            );

        }
        finally {

            setLoading(false);

        }

    };


    // =====================================================
    // UNIQUE CLASSES
    // =====================================================

    const classes = [
        ...new Map(
            data.map(item => [
                item.classId,
                {
                    classId: item.classId,
                    className: item.className
                }
            ])
        ).values()
    ];


    // =====================================================
    // FILTER CLASS
    // =====================================================

    const filteredData =
        selectedClass === "all"
            ? data
            : data.filter(
                item =>
                    String(item.classId) ===
                    String(selectedClass)
            );


    // =====================================================
    // GROUP BY CLASS + SECTION
    // =====================================================

    const groupedSections = [
        ...new Map(

            filteredData.map(item => {

                const key =
                    `${item.classId}-${item.sectionId}`;

                return [
                    key,
                    {
                        classId: item.classId,
                        className: item.className,
                        sectionId: item.sectionId,
                        sectionName: item.sectionName
                    }
                ];

            })

        ).values()
    ];


    // =====================================================
    // FORMAT TIME
    // =====================================================

    const formatTime = (time) => {

        if (!time) {
            return "";
        }

        return String(time).substring(0, 5);

    };


    // =====================================================
    // GET UNIQUE TIME PERIODS
    // =====================================================

    const getPeriods = (sectionData) => {

        const periodMap = new Map();

        sectionData.forEach(item => {

            const start =
                formatTime(item.startTime);

            const end =
                formatTime(item.endTime);

            if (!start || !end) {
                return;
            }

            const key =
                `${start}-${end}`;

            if (!periodMap.has(key)) {

                periodMap.set(
                    key,
                    {
                        start,
                        end
                    }
                );

            }

        });


        return Array.from(
            periodMap.values()
        ).sort(
            (a, b) =>
                a.start.localeCompare(b.start)
        );

    };


    // =====================================================
    // GET CELL DATA
    // =====================================================

    const getCellData = (
        sectionData,
        day,
        period
    ) => {

        return sectionData.filter(item => {

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


    // =====================================================
    // LOADING
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

            <div className="timetable-page">


                {/* =========================================
                    PAGE HEADER
                ========================================= */}

                <div className="timetable-header">

                    <div>

                        <h2 className="timetable-title">
                            Weekly Timetable
                        </h2>

                        <p className="timetable-subtitle">
                            Class & Section Wise Teaching Schedule
                        </p>

                    </div>


                    {/* =====================================
                        CLASS FILTER
                    ===================================== */}

                    <FormControl
                        size="small"
                        className="class-filter"
                    >

                        <InputLabel>
                            Select Class
                        </InputLabel>

                        <Select
                            value={selectedClass}
                            label="Select Class"
                            onChange={(e) =>
                                setSelectedClass(
                                    e.target.value
                                )
                            }
                        >

                            <MenuItem value="all">
                                All Classes
                            </MenuItem>

                            {classes.map(item => (

                                <MenuItem
                                    key={item.classId}
                                    value={item.classId}
                                >

                                    {item.className}

                                </MenuItem>

                            ))}

                        </Select>

                    </FormControl>

                </div>


                {/* =========================================
                    ERROR
                ========================================= */}

                {error && (

                    <Alert
                        severity="error"
                        sx={{
                            marginBottom: "20px"
                        }}
                    >

                        {error}

                    </Alert>

                )}


                {/* =========================================
                    NO DATA
                ========================================= */}

                {!error &&
                    groupedSections.length === 0 && (

                        <Paper
                            className="empty-timetable"
                            elevation={4}
                        >

                            <Typography>
                                No timetable records found.
                            </Typography>

                        </Paper>

                    )}


                {/* =========================================
                    CLASS + SECTION TABLES
                ========================================= */}

                {groupedSections.map(
                    group => {

                        const sectionData =
                            filteredData.filter(
                                item =>
                                    item.classId ===
                                    group.classId
                                    &&
                                    item.sectionId ===
                                    group.sectionId
                            );


                        const periods =
                            getPeriods(sectionData);


                        return (

                            <Paper
                                key={
                                    `${group.classId}-${group.sectionId}`
                                }
                                elevation={5}
                                className="class-timetable-card"
                            >


                                {/* =================================
                                    CLASS + SECTION HEADER
                                ================================= */}

                                <div className="class-timetable-header">

                                    <div>

                                        <h3>

                                            {group.className}

                                            {" - "}

                                            Section {group.sectionName}

                                        </h3>

                                        <span>
                                            Weekly Schedule
                                        </span>

                                    </div>


                                    <div className="period-count">

                                        {sectionData.length}

                                        {" "}

                                        Period
                                        {sectionData.length !== 1
                                            ? "s"
                                            : ""}

                                    </div>

                                </div>


                                {/* =================================
                                    TABLE
                                ================================= */}

                                <div className="timetable-scroll">

                                    <table className="weekly-timetable">


                                        {/* =================================
                                            HEADER
                                        ================================= */}

                                        <thead>

                                            <tr>

                                                <th className="day-column">
                                                    Day
                                                </th>


                                                {periods.map(
                                                    period => (

                                                        <th
                                                            key={
                                                                `${period.start}-${period.end}`
                                                            }
                                                            className="time-header"
                                                        >

                                                            <div>
                                                                {period.start}
                                                            </div>

                                                            <span>
                                                                to
                                                            </span>

                                                            <div>
                                                                {period.end}
                                                            </div>

                                                        </th>

                                                    )
                                                )}

                                            </tr>

                                        </thead>


                                        {/* =================================
                                            BODY
                                        ================================= */}

                                        <tbody>

                                            {DAYS.map(
                                                day => (

                                                    <tr
                                                        key={day}
                                                    >


                                                        {/* =================
                                                            DAY
                                                        ================= */}

                                                        <td className="day-cell">

                                                            <strong>
                                                                {day}
                                                            </strong>

                                                        </td>


                                                        {/* =================
                                                            PERIODS
                                                        ================= */}

                                                        {periods.map(
                                                            period => {

                                                                const items =
                                                                    getCellData(
                                                                        sectionData,
                                                                        day,
                                                                        period
                                                                    );


                                                                return (

                                                                    <td
                                                                        key={
                                                                            `${day}-${period.start}-${period.end}`
                                                                        }
                                                                        className={
                                                                            items.length > 0
                                                                                ? "period-cell has-class"
                                                                                : "period-cell"
                                                                        }
                                                                    >


                                                                        {items.length >
                                                                        0 ? (

                                                                            items.map(
                                                                                item => (

                                                                                    <div
                                                                                        key={
                                                                                            item.teacherSubjectId
                                                                                        }
                                                                                        className="subject-card"
                                                                                    >


                                                                                        {/* SUBJECT */}

                                                                                        <div className="subject-name">

                                                                                            {
                                                                                                item.subjectName ||
                                                                                                "-"
                                                                                            }

                                                                                        </div>


                                                                                        {/* TEACHER */}

                                                                                        <div className="teacher-name">

                                                                                            Teacher:

                                                                                            {" "}

                                                                                            {
                                                                                                item.teacherName ||
                                                                                                "-"
                                                                                            }

                                                                                        </div>


                                                                                        {/* SECTION */}

                                                                                        <div className="section-name">

                                                                                            Section:

                                                                                            {" "}

                                                                                            {
                                                                                                item.sectionName ||
                                                                                                "-"
                                                                                            }

                                                                                        </div>


                                                                                        {/* TIME */}

                                                                                        <div className="class-time">

                                                                                            {
                                                                                                formatTime(
                                                                                                    item.startTime
                                                                                                )
                                                                                            }

                                                                                            {" - "}

                                                                                            {
                                                                                                formatTime(
                                                                                                    item.endTime
                                                                                                )
                                                                                            }

                                                                                        </div>


                                                                                    </div>

                                                                                )
                                                                            )

                                                                        ) : (

                                                                            <span className="free-period">
                                                                                Free
                                                                            </span>

                                                                        )}

                                                                    </td>

                                                                );

                                                            }
                                                        )}

                                                    </tr>

                                                )
                                            )}

                                        </tbody>

                                    </table>

                                </div>

                            </Paper>

                        );

                    }
                )}

            </div>

        </DashboardLayout>

    );

}


export default Timetable;