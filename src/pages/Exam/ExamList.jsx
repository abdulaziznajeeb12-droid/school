import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import "../../assets/dashboard.css";

import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";

import {
    getExams,
    deleteExam
} from "../../services/examService";

function ExamList() {

    const [exams, setExams] = useState([]);
    const [search, setSearch] = useState("");

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    useEffect(() => {

        loadExams();

    }, []);

    const loadExams = async () => {

        try {

            const data = await getExams();

            setExams(
                Array.isArray(data) ? data : []
            );

        } catch (error) {

            console.log(error);

        }

    };

    const filteredExams = exams.filter((item) => {

        const value = search.toLowerCase();

        return (

            String(item.examId || "")
                .toLowerCase()
                .includes(value) ||

            String(item.examName || "")
                .toLowerCase()
                .includes(value) ||

            String(item.subjectName || "")
                .toLowerCase()
                .includes(value) ||

            String(item.className || "")
                .toLowerCase()
                .includes(value) ||

            String(item.sectionName || "")
                .toLowerCase()
                .includes(value) ||

            String(item.examDate || "")
                .toLowerCase()
                .includes(value) ||

            String(item.obtainMarks ?? "")
                .toLowerCase()
                .includes(value)

        );

    });

    useEffect(() => {

        setPage(0);

    }, [search]);

    const handleDelete = async (id) => {

        if (!window.confirm("Delete this Exam?"))
            return;

        try {

            await deleteExam(id);

            loadExams();

        } catch (error) {

            console.log(error);

            alert(
                error.response?.data?.message ||
                "Delete Failed"
            );

        }

    };

    const handleChangePage = (event, newPage) => {

        setPage(newPage);

    };

    const handleChangeRowsPerPage = (event) => {

        setRowsPerPage(
            parseInt(event.target.value, 10)
        );

        setPage(0);

    };

    return (

        <DashboardLayout>

            <div className="page-header">

                <h2 className="main-heading">
                    Exam Management
                </h2>

                <div className="toolbar">

                    <input
                        className="searchbox"
                        type="text"
                        placeholder="Search Exam..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                    />

                    <Link to="/exam/add">

                        <button className="add-btn">
                            + Add Exam
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
                                Exam Type
                            </TableCell>

                            <TableCell>
                                Subject
                            </TableCell>

                            <TableCell>
                                Class
                            </TableCell>

                            <TableCell>
                                Section
                            </TableCell>

                            <TableCell>
                                Exam Date
                            </TableCell>

                            <TableCell>
                                Obtain
                            </TableCell>

                            <TableCell>
                                Total
                            </TableCell>

                            <TableCell>
                                Passing
                            </TableCell>

                            <TableCell align="center">
                                Actions
                            </TableCell>

                        </TableRow>

                    </TableHead>

                    <TableBody>

                        {(rowsPerPage > 0
                            ? filteredExams.slice(
                                page * rowsPerPage,
                                page * rowsPerPage + rowsPerPage
                            )
                            : filteredExams
                        ).map((item) => (

                            <TableRow
                                key={item.examId}
                                hover
                                className="table-body-row"
                            >

                                <TableCell>
                                    {item.examId}
                                </TableCell>

                                <TableCell>
                                    {item.examName || "-"}
                                </TableCell>

                                <TableCell>
                                    {item.subjectName || "-"}
                                </TableCell>

                                <TableCell>
                                    {item.className || "-"}
                                </TableCell>

                                <TableCell>
                                    {item.sectionName || "-"}
                                </TableCell>

                                <TableCell>
                                    {item.examDate
                                        ? String(item.examDate).substring(0, 10)
                                        : "-"}
                                </TableCell>

                                <TableCell>
                                    {item.obtainMarks ?? "-"}
                                </TableCell>

                                <TableCell>
                                    {item.totalMarks ?? "-"}
                                </TableCell>

                                <TableCell>
                                    {item.passingMarks ?? "-"}
                                </TableCell>

                                <TableCell align="center">

                                    <Link
                                        to={`/exam/edit/${item.examId}`}
                                    >

                                        <button className="edit-btn">
                                            Edit
                                        </button>

                                    </Link>

                                    <button
                                        className="delete-btn"
                                        onClick={() =>
                                            handleDelete(
                                                item.examId
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
                                count={filteredExams.length}
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

        </DashboardLayout>

    );

}

export default ExamList;    