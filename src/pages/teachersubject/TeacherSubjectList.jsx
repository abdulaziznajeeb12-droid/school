import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import DashboardLayout from "../../layouts/DashboardLayout";

import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableFooter,
    TablePagination,
    Snackbar,
    Alert,
    TextField,
    Box
} from "@mui/material";

import {
    getTeacherSubjects,
    deleteTeacherSubject
} from "../../services/teacherSubjectService";

import "../../assets/dashboard.css";

function TeacherSubjectList() {

    const [data, setData] = useState([]);

    const [search, setSearch] = useState("");

    const [page, setPage] = useState(0);

    const [rowsPerPage, setRowsPerPage] = useState(5);

    const [open, setOpen] = useState(false);

    const [errorOpen, setErrorOpen] = useState(false);

    const [errorMessage, setErrorMessage] = useState("");


    // =====================================================
    // LOAD DATA
    // =====================================================

    useEffect(() => {

        loadData();

    }, []);


    const loadData = async () => {

        try {

            const result =
                await getTeacherSubjects();

            setData(
                Array.isArray(result)
                    ? result
                    : result?.data || []
            );

        }
        catch (error) {

            console.log(error);

            setErrorMessage(
                error.response?.data?.message ||
                "Unable to load teacher subjects."
            );

            setErrorOpen(true);

        }

    };


    // =====================================================
    // SEARCH
    // =====================================================

    const filteredData = data.filter((item) => {

        const keyword =
            search.toLowerCase().trim();

        if (!keyword) {
            return true;
        }

        return [

            item.teacherName,

            item.className,

            item.sectionName,

            item.subjectName,

            item.startTime,

            item.endTime,

            item.teacherId,

            item.classId,

            item.sectionId,

            item.subjectId,

            item.teacherSubjectId

        ].some(value =>
            String(value ?? "")
                .toLowerCase()
                .includes(keyword)
        );

    });


    // =====================================================
    // DELETE
    // =====================================================

    const handleDelete = async (id) => {

        if (
            !window.confirm(
                "Delete this teacher subject assignment?"
            )
        ) {
            return;
        }

        try {

            await deleteTeacherSubject(id);

            setOpen(true);

            loadData();

        }
        catch (error) {

            console.log(error);

            setErrorMessage(
                error.response?.data?.message ||
                error.response?.data ||
                "Unable to delete assignment."
            );

            setErrorOpen(true);

        }

    };


    // =====================================================
    // PAGINATION
    // =====================================================

    const handlePageChange =
        (event, newPage) => {

            setPage(newPage);

        };


    const handleRowsPerPageChange =
        (e) => {

            setRowsPerPage(
                parseInt(
                    e.target.value,
                    10
                )
            );

            setPage(0);

        };


    const rows =
        rowsPerPage > 0
            ? filteredData.slice(
                page * rowsPerPage,
                page * rowsPerPage +
                rowsPerPage
            )
            : filteredData;


    // =====================================================
    // TIME FORMAT
    // =====================================================

    const formatTime = (time) => {

        if (!time) {
            return "-";
        }

        return String(time).substring(0, 5);

    };


    // =====================================================
    // UI
    // =====================================================

    return (

        <DashboardLayout>

            <div className="page-header">

                <h2 className="main-heading">
                    Teacher Subject Management
                </h2>

                <div className="toolbar">

                    <Link
                        to="/teachersubject/add"
                    >

                        <button
                            className="add-btn"
                        >
                            + Assign Subject
                        </button>

                    </Link>

                </div>

            </div>


            {/* =================================================
                SEARCH
            ================================================= */}

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginBottom: "20px"
                }}
            >

                <TextField

                    label="Search Teacher / Subject / Class / Section / Time"

                    value={search}

                    onChange={(e) => {

                        setSearch(
                            e.target.value
                        );

                        setPage(0);

                    }}

                    size="small"

                    sx={{
                        width: {
                            xs: "100%",
                            sm: "450px"
                        }
                    }}

                />

            </Box>


            {/* =================================================
                TABLE
            ================================================= */}

            <TableContainer
                component={Paper}
                className="school-table-container"
                elevation={5}
            >

                <Table
                    className="school-table"
                >

                    <TableHead>

                        <TableRow
                            className="table-header"
                        >

                            <TableCell>
                                ID
                            </TableCell>
                            <TableCell>
                                Day
                            </TableCell>

                            <TableCell>
                                Teacher
                            </TableCell>

                            <TableCell>
                                Class
                            </TableCell>

                            <TableCell>
                                Section
                            </TableCell>

                            <TableCell>
                                Subject
                            </TableCell>

                            <TableCell>
                                Start Time
                            </TableCell>

                            <TableCell>
                                End Time
                            </TableCell>

                            <TableCell
                                align="center"
                            >
                                Actions
                            </TableCell>

                        </TableRow>

                    </TableHead>


                    <TableBody>

                        {rows.length > 0 ? (

                            rows.map((item) => (
                                
                                <TableRow
                                    key={
                                        item.teacherSubjectId
                                    }
                                    hover
                                    className="table-body-row"
                                >
                                    

                                    {/* ID */}

                                    <TableCell>
                                        {
                                            item.teacherSubjectId
                                        }
                                    </TableCell>
<TableCell>
                                        {
                                            item.dayOfWeek
                                        }
                                    </TableCell>

                                    {/* TEACHER */}

                                    <TableCell>
                                        {
                                            item.teacherName
                                        }
                                    </TableCell>


                                    {/* CLASS */}

                                    <TableCell>
                                        {
                                            item.className
                                        }
                                    </TableCell>


                                    {/* SECTION */}

                                    <TableCell>
                                        {
                                            item.sectionName
                                        }
                                    </TableCell>


                                    {/* SUBJECT */}

                                    <TableCell>
                                        {
                                            item.subjectName
                                        }
                                    </TableCell>


                                    {/* START TIME */}

                                    <TableCell>

                                        {formatTime(
                                            item.startTime
                                        )}

                                    </TableCell>


                                    {/* END TIME */}

                                    <TableCell>

                                        {formatTime(
                                            item.endTime
                                        )}

                                    </TableCell>


                                    {/* ACTIONS */}

                                    <TableCell
                                        align="center"
                                    >

                                        <Link
                                            to={`/teachersubject/edit/${item.teacherSubjectId}`}
                                        >

                                            <button
                                                className="edit-btn"
                                            >
                                                Edit
                                            </button>

                                        </Link>


                                        <button
                                            className="delete-btn"
                                            onClick={() =>
                                                handleDelete(
                                                    item.teacherSubjectId
                                                )
                                            }
                                        >
                                            Delete
                                        </button>

                                    </TableCell>

                                </TableRow>

                            ))

                        ) : (

                            <TableRow>

                                <TableCell
                                    colSpan={8}
                                    align="center"
                                >

                                    No teacher subject
                                    assignment found.

                                </TableCell>

                            </TableRow>

                        )}

                    </TableBody>


                    {/* =================================================
                        FOOTER
                    ================================================= */}

                    <TableFooter>

                        <TableRow>

                            <TablePagination

                                rowsPerPageOptions={[
                                    5,
                                    10,
                                    25
                                ]}

                                count={
                                    filteredData.length
                                }

                                rowsPerPage={
                                    rowsPerPage
                                }

                                page={page}

                                onPageChange={
                                    handlePageChange
                                }

                                onRowsPerPageChange={
                                    handleRowsPerPageChange
                                }

                            />

                        </TableRow>

                    </TableFooter>

                </Table>

            </TableContainer>


            {/* =====================================================
                SUCCESS
            ===================================================== */}

            <Snackbar
                open={open}
                autoHideDuration={3000}
                onClose={() =>
                    setOpen(false)
                }
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right"
                }}
            >

                <Alert
                    severity="success"
                    variant="filled"
                >
                    Assignment Deleted Successfully!
                </Alert>

            </Snackbar>


            {/* =====================================================
                ERROR
            ===================================================== */}

            <Snackbar
                open={errorOpen}
                autoHideDuration={4000}
                onClose={() =>
                    setErrorOpen(false)
                }
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

export default TeacherSubjectList;