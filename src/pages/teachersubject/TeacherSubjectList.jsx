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
    Alert
} from "@mui/material";

import {
    getTeacherSubjects,
    deleteTeacherSubjects
} from "../../services/teacherSubjectService";

import "../../assets/dashboard.css";


function TeacherSubjectList() {

    const [data, setData] = useState([]);

    const [page, setPage] = useState(0);

    const [rowsPerPage, setRowsPerPage] = useState(5);

    const [open, setOpen] = useState(false);


    useEffect(() => {

        loadData();

    }, []);


    const loadData = async () => {

        try {

            const result =
                await getTeacherSubjects();

            setData(result);

        }
        catch (error) {

            console.log(error);

        }

    };


    const handleDelete = async (
        teacherId,
        classId,
        sectionId
    ) => {

        if (
            !window.confirm(
                "Delete this teacher subject assignment?"
            )
        ) {

            return;

        }


        try {

            await deleteTeacherSubjects(
                teacherId,
                classId,
                sectionId
            );


            setOpen(true);

            loadData();

        }
        catch (error) {

            console.log(error);

        }

    };


    const handlePageChange = (
        event,
        newPage
    ) => {

        setPage(newPage);

    };


    const handleRowsPerPageChange = (e) => {

        setRowsPerPage(
            parseInt(e.target.value, 10)
        );

        setPage(0);

    };


    const rows =
        rowsPerPage > 0

            ? data.slice(
                page * rowsPerPage,
                page * rowsPerPage +
                rowsPerPage
            )

            : data;


    return (

        <DashboardLayout>

            <div className="page-header">

                <h2 className="main-heading">
                    Teacher Subject Management
                </h2>


                <div className="toolbar">

                    <Link to="/teachersubject/add">

                        <button className="add-btn">
                            + Assign Subjects
                        </button>

                    </Link>

                </div>

            </div>


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
                                Teacher
                            </TableCell>

                            <TableCell>
                                Class
                            </TableCell>

                            <TableCell>
                                Section
                            </TableCell>

                            <TableCell>
                                Subjects
                            </TableCell>

                            <TableCell align="center">
                                Actions
                            </TableCell>

                        </TableRow>

                    </TableHead>


                    <TableBody>

                        {rows.map((item, index) => (

                            <TableRow
                                key={
                                    `${item.teacherId}-${item.classId}-${item.sectionId}`
                                }
                                hover
                                className="table-body-row"
                            >

                            <TableCell>
                                {item.teacherId}
                            </TableCell>
                                <TableCell>
                                    {item.teacherName}
                                </TableCell>


                                <TableCell>
                                    {item.className}
                                </TableCell>


                                <TableCell>
                                    {item.sectionName}
                                </TableCell>


                                <TableCell>

                                    <div className="subject-chips">

                                        {item.subjects?.map(
                                            subject => (

                                                <span
                                                    key={
                                                        subject.subjectId
                                                    }
                                                    className="subject-chip"
                                                >
                                                    {
                                                        subject.subjectName
                                                    }
                                                </span>

                                            )
                                        )}

                                    </div>

                                </TableCell>


                                <TableCell align="center">

                                    <Link
                                        to={`/teachersubject/edit/${item.teacherId}`}
                                    >

                                        <button className="edit-btn">
                                            Edit
                                        </button>

                                    </Link>


                                    <button
                                        className="delete-btn"
                                        onClick={() =>
                                            handleDelete(
                                                item.teacherId,
                                                item.classId,
                                                item.sectionId
                                            )
                                        }
                                    >
                                        Delete
                                    </button>

                                </TableCell>

                            </TableRow>

                        ))}

                    </TableBody>


                    <TableFooter>

                        <TableRow>

                            <TablePagination

                                rowsPerPageOptions={[
                                    5,
                                    10,
                                    25
                                ]}

                                count={data.length}

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

        </DashboardLayout>

    );

}

export default TeacherSubjectList;