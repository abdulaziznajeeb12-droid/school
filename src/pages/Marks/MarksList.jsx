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
    getMarks,
    deleteMark
} from "../../services/marksService";

function MarksList() {

    const [marks, setMarks] = useState([]);
    const [search, setSearch] = useState("");

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    useEffect(() => {
        loadMarks();
    }, []);

    const loadMarks = async () => {

        try {

            const data = await getMarks();

            setMarks(
                Array.isArray(data)
                    ? data
                    : []
            );

        } catch (error) {

            console.log(error);

        }

    };

    const filteredMarks = marks.filter((item) => {

        const value = search.toLowerCase();

        return (
            String(item.marksId || "")
                .toLowerCase()
                .includes(value) ||

            String(item.examName || "")
                .toLowerCase()
                .includes(value) ||

            String(item.subjectName || "")
                .toLowerCase()
                .includes(value) ||

            String(item.studentName || "")
                .toLowerCase()
                .includes(value) ||

            String(item.obtainedMarks ?? "")
                .toLowerCase()
                .includes(value) ||

            String(item.grade || "")
                .toLowerCase()
                .includes(value)
        );

    });

    useEffect(() => {
        setPage(0);
    }, [search]);

    const handleDelete = async (id) => {

        if (!window.confirm("Delete these marks?"))
            return;

        try {

            await deleteMark(id);

            loadMarks();

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
                    Marks Management
                </h2>

                <div className="toolbar">

                    <input
                        className="searchbox"
                        type="text"
                        placeholder="Search Marks..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                    />

                    <Link to="/marks/add">

                        <button className="add-btn">
                            + Add Marks
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
                                Exam
                            </TableCell>

                            <TableCell>
                                Subject
                            </TableCell>

                            <TableCell>
                                Student
                            </TableCell>

                            <TableCell>
                                Obtained
                            </TableCell>

                            <TableCell>
                                Grade
                            </TableCell>

                            <TableCell>
                                Remarks
                            </TableCell>

                            <TableCell align="center">
                                Actions
                            </TableCell>

                        </TableRow>

                    </TableHead>

                    <TableBody>

                        {(rowsPerPage > 0
                            ? filteredMarks.slice(
                                page * rowsPerPage,
                                page * rowsPerPage + rowsPerPage
                            )
                            : filteredMarks
                        ).map((item) => (

                            <TableRow
                                key={item.marksId}
                                hover
                                className="table-body-row"
                            >

                                <TableCell>
                                    {item.marksId}
                                </TableCell>

                                <TableCell>
                                    {item.examName || "-"}
                                </TableCell>

                                <TableCell>
                                    {item.subjectName || "-"}
                                </TableCell>

                                <TableCell>
                                    {item.studentName || "-"}
                                </TableCell>

                                <TableCell>
                                    {item.obtainedMarks ?? "-"}
                                </TableCell>

                                <TableCell>
                                    {item.grade || "-"}
                                </TableCell>

                                <TableCell>
                                    {item.remarks || "-"}
                                </TableCell>

                                <TableCell align="center">

                                    <Link
                                        to={`/marks/edit/${item.marksId}`}
                                    >

                                        <button className="edit-btn">
                                            Edit
                                        </button>

                                    </Link>

                                    <button
                                        className="delete-btn"
                                        onClick={() =>
                                            handleDelete(
                                                item.marksId
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
                                count={filteredMarks.length}
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

export default MarksList;