import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import DashboardLayout from "../../layouts/DashboardLayout";

import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableFooter,
    TableHead,
    TablePagination,
    TableRow,
    Snackbar,
    Alert
} from "@mui/material";

import {
    getSubjects,
    deleteSubject,
    searchSubject
} from "../../services/subjectService";

import "../../assets/dashboard.css";
import "../../assets/subject.css";


function SubjectList() {

    const [subjects, setSubjects] = useState([]);

    const [search, setSearch] = useState("");

    const [page, setPage] = useState(0);

    const [rowsPerPage, setRowsPerPage] = useState(5);


    // Snackbar

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success"
    });


    // =========================
    // LOAD SUBJECTS
    // =========================

    const loadSubjects = async () => {

        try {

            const data = await getSubjects();

            setSubjects(data);

        }
        catch (error) {

            console.log(error);

            showSnackbar(
                "Unable to load subjects",
                "error"
            );

        }

    };


    useEffect(() => {

        loadSubjects();

    }, []);


    // =========================
    // SEARCH
    // =========================

    useEffect(() => {

        const delay = setTimeout(async () => {

            try {

                if (search.trim() === "") {

                    await loadSubjects();

                    return;

                }


                const data = await searchSubject(
                    search.trim()
                );

                setSubjects(data);

                setPage(0);

            }
            catch (error) {

                console.log(error);

            }

        }, 300);


        return () => clearTimeout(delay);

    }, [search]);


    // =========================
    // DELETE
    // =========================

    const handleDelete = async (id) => {

        if (!window.confirm(
            "Are you sure you want to delete this subject?"
        )) {
            return;
        }


        try {

            await deleteSubject(id);

            showSnackbar(
                "Subject deleted successfully!",
                "success"
            );

            loadSubjects();

        }
        catch (error) {

            console.log(error);

            showSnackbar(
                "Unable to delete subject",
                "error"
            );

        }

    };


    // =========================
    // SNACKBAR
    // =========================

    const showSnackbar = (
        message,
        severity = "success"
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


    // =========================
    // PAGINATION
    // =========================

    const handleChangePage = (
        event,
        newPage
    ) => {

        setPage(newPage);

    };


    const handleChangeRowsPerPage = (
        event
    ) => {

        setRowsPerPage(
            parseInt(
                event.target.value,
                10
            )
        );

        setPage(0);

    };


    return (

        <DashboardLayout>

            {/* HEADER */}

            <div className="page-header">

                <h2 className="main-heading">
                    Subject Management
                </h2>


                <div className="toolbar">

                    <input
                        className="searchbox"
                        type="text"
                        placeholder="Search Subject..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                    />


                    <Link to="/subjects/add">

                        <button className="add-btn">
                            + Add Subject
                        </button>

                    </Link>

                </div>

            </div>


            {/* TABLE */}

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
                                Subject Name
                            </TableCell>

                            <TableCell>
                                Marks
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

                        {(rowsPerPage > 0
                            ? subjects.slice(
                                page * rowsPerPage,
                                page * rowsPerPage +
                                rowsPerPage
                            )
                            : subjects
                        ).map((subject) => (

                            <TableRow
                                key={subject.id}
                                hover
                                className="table-body-row"
                            >

                                <TableCell>
                                    {subject.id}
                                </TableCell>


                                <TableCell>
                                    {subject.subjectName}
                                </TableCell>


                                <TableCell>
                                    {subject.marks ?? "-"}
                                </TableCell>


                                <TableCell>

                                    <span
                                        className={
                                            subject.isActive
                                                ? "status-active"
                                                : "status-inactive"
                                        }
                                    >

                                        {subject.isActive
                                            ? "Active"
                                            : "Inactive"
                                        }

                                    </span>

                                </TableCell>


                                <TableCell align="center">

                                    <Link
                                        to={`/subjects/edit/${subject.id}`}
                                    >

                                        <button className="edit-btn">
                                            Edit
                                        </button>

                                    </Link>


                                    <button
                                        className="delete-btn"
                                        onClick={() =>
                                            handleDelete(
                                                subject.id
                                            )
                                        }
                                    >
                                        Delete
                                    </button>

                                </TableCell>

                            </TableRow>

                        ))}


                        {subjects.length === 0 && (

                            <TableRow>

                                <TableCell
                                    colSpan={5}
                                    align="center"
                                >
                                    No subjects found
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

                                count={subjects.length}

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
                    severity={snackbar.severity}
                    variant="filled"
                    sx={{ width: "100%" }}
                >

                    {snackbar.message}

                </Alert>

            </Snackbar>

        </DashboardLayout>

    );

}

export default SubjectList;