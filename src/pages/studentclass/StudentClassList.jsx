import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import DashboardLayout from "../../layouts/DashboardLayout";
import "../../assets/dashboard.css";

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
    Alert
} from "@mui/material";

import {
    getStudentClasses,
    deleteStudentClass
} from "../../services/studentClassService";


function StudentClassList() {

    const [studentClasses, setStudentClasses] = useState([]);

    const [search, setSearch] = useState("");

    const [page, setPage] = useState(0);

    const [rowsPerPage, setRowsPerPage] = useState(5);

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success"
    });


    // ==========================================
    // LOAD DATA
    // ==========================================

    useEffect(() => {

        loadStudentClasses();

    }, []);


    const loadStudentClasses = async () => {

        try {

            const data = await getStudentClasses();

            setStudentClasses(data);

        } catch (error) {

            console.log(error);

            showSnackbar(
                "Failed to load student classes",
                "error"
            );

        }

    };


    // ==========================================
    // SEARCH
    // ==========================================

    const filteredData = studentClasses.filter((item) => {

        const searchText = search.toLowerCase();

        return (

            String(item.studentName || "")
                .toLowerCase()
                .includes(searchText)

            ||

            String(item.className || "")
                .toLowerCase()
                .includes(searchText)

            ||

            String(item.sectionName || "")
                .toLowerCase()
                .includes(searchText)

            ||

            String(item.rollNo || "")
                .includes(searchText)

        );

    });


    // ==========================================
    // DELETE
    // ==========================================

    const handleDelete = async (id) => {

        if (!window.confirm(
            "Delete this student assignment?"
        )) {
            return;
        }


        try {

            await deleteStudentClass(id);

            showSnackbar(
                "Student assignment deleted successfully!",
                "success"
            );

            loadStudentClasses();

        } catch (error) {

            console.log(error);

            showSnackbar(
                "Delete failed!",
                "error"
            );

        }

    };


    // ==========================================
    // PAGINATION
    // ==========================================

    const handleChangePage = (
        event,
        newPage
    ) => {

        setPage(newPage);

    };


    const handleChangeRowsPerPage = (event) => {

        setRowsPerPage(
            parseInt(event.target.value, 10)
        );

        setPage(0);

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


    const handleSnackbarClose = (
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

            {/* ================================= */}
            {/* HEADER */}
            {/* ================================= */}

            <div className="page-header">

                <h2 className="main-heading">
                    Student Class Management
                </h2>


                <div className="toolbar">

                    <input
                        className="searchbox"
                        type="text"
                        placeholder="Search Student..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(0);
                        }}
                    />


                    <Link to="/student-class/add">

                        <button className="add-btn">

                            + Assign Students

                        </button>

                    </Link>

                </div>

            </div>


            {/* ================================= */}
            {/* TABLE */}
            {/* ================================= */}

            <TableContainer
                component={Paper}
                className="school-table-container"
                elevation={5}
            >

                <Table className="school-table">


                    <TableHead>

                        <TableRow className="table-header">

                            <TableCell>
                                ID
                            </TableCell>

                            <TableCell>
                                Student
                            </TableCell>

                            <TableCell>
                                Class
                            </TableCell>

                            <TableCell>
                                Section
                            </TableCell>

                            <TableCell>
                                Roll No
                            </TableCell>

                            <TableCell>
                                Admission Date
                            </TableCell>

                            <TableCell>
                                Status
                            </TableCell>

                            <TableCell align="center">
                                Actions
                            </TableCell>

                        </TableRow>

                    </TableHead>


                    <TableBody>

                        {(
                            rowsPerPage > 0
                                ? filteredData.slice(
                                    page * rowsPerPage,
                                    page * rowsPerPage + rowsPerPage
                                )
                                : filteredData
                        ).map((item) => (

                            <TableRow
                                key={item.enrolledId}
                                hover
                                className="table-body-row"
                            >

                                <TableCell>
                                    {item.enrolledId}
                                </TableCell>


                                <TableCell>
                                    {item.studentName}
                                </TableCell>


                                <TableCell>
                                    {item.className}
                                </TableCell>


                                <TableCell>
                                    {item.sectionName}
                                </TableCell>


                                <TableCell>
                                    {item.rollNo}
                                </TableCell>


                                <TableCell>

                                    {item.admissionDate
                                        ? item.admissionDate
                                        : "-"
                                    }

                                </TableCell>


                                <TableCell>

                                    <span
                                        className={
                                            item.isActive
                                                ? "status-active"
                                                : "status-inactive"
                                        }
                                    >

                                        {item.isActive
                                            ? "Active"
                                            : "Inactive"
                                        }

                                    </span>

                                </TableCell>


                                <TableCell align="center">

                                    <Link
                                        to={`/student-class/edit/${item.enrolledId}`}
                                    >

                                        <button className="edit-btn">

                                            Edit

                                        </button>

                                    </Link>


                                    <button
                                        className="delete-btn"
                                        onClick={() =>
                                            handleDelete(
                                                item.enrolledId
                                            )
                                        }
                                    >

                                        Delete

                                    </button>

                                </TableCell>

                            </TableRow>

                        ))}


                        {filteredData.length === 0 && (

                            <TableRow>

                                <TableCell
                                    colSpan={8}
                                    align="center"
                                >

                                    No student assignments found.

                                </TableCell>

                            </TableRow>

                        )}

                    </TableBody>


                    <TableFooter>

                        <TableRow>

                            <TablePagination
                                rowsPerPageOptions={[
                                    5,
                                    10,
                                    25
                                ]}
                                count={filteredData.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={
                                    handleChangePage
                                }
                                onRowsPerPageChange={
                                    handleChangeRowsPerPage
                                }
                            />

                        </TableRow>

                    </TableFooter>

                </Table>

            </TableContainer>


            {/* ================================= */}
            {/* SNACKBAR */}
            {/* ================================= */}

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={handleSnackbarClose}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right"
                }}
            >

                <Alert
                    onClose={handleSnackbarClose}
                    severity={snackbar.severity}
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


export default StudentClassList;