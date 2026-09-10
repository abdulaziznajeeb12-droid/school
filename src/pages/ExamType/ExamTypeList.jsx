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
    getExamTypes,
    deleteExamType
} from "../../services/examService";

function ExamTypeList() {

    const [examTypes, setExamTypes] = useState([]);
    const [search, setSearch] = useState("");

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    useEffect(() => {
        loadExamTypes();
    }, []);

    const loadExamTypes = async () => {

        try {

            const data = await getExamTypes();

            setExamTypes(
                Array.isArray(data) ? data : []
            );

        } catch (error) {

            console.log(error);

        }

    };

    const filteredExamTypes = examTypes.filter((item) => {

        const value = search.toLowerCase();

        return (
            String(item.examTypeId || "")
                .toLowerCase()
                .includes(value) ||

            String(item.examName || "")
                .toLowerCase()
                .includes(value) ||

            String(item.weightAge ?? "")
                .toLowerCase()
                .includes(value)
        );

    });

    useEffect(() => {
        setPage(0);
    }, [search]);

    const handleDelete = async (id) => {

        if (!window.confirm("Delete this Exam Type?"))
            return;

        try {

            await deleteExamType(id);

            loadExamTypes();

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
                    Exam Type Management
                </h2>

                <div className="toolbar">

                    <input
                        className="searchbox"
                        type="text"
                        placeholder="Search Exam Type..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                    />

                    <Link to="/examtypes/add">

                        <button className="add-btn">
                            + Add Exam Type
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
                                Exam Name
                            </TableCell>

                            <TableCell>
                                Weightage
                            </TableCell>

                            <TableCell align="center">
                                Actions
                            </TableCell>

                        </TableRow>

                    </TableHead>

                    <TableBody>

                        {(rowsPerPage > 0
                            ? filteredExamTypes.slice(
                                page * rowsPerPage,
                                page * rowsPerPage + rowsPerPage
                            )
                            : filteredExamTypes
                        ).map((item) => (

                            <TableRow
                                key={item.examTypeId}
                                hover
                                className="table-body-row"
                            >

                                <TableCell>
                                    {item.examTypeId}
                                </TableCell>

                                <TableCell>
                                    {item.examName}
                                </TableCell>

                                <TableCell>
                                    {item.weightAge ?? "-"}%
                                </TableCell>

                                <TableCell align="center">

                                    <Link
                                        to={`/examtypes/edit/${item.examTypeId}`}
                                    >

                                        <button className="edit-btn">
                                            Edit
                                        </button>

                                    </Link>

                                    <button
                                        className="delete-btn"
                                        onClick={() =>
                                            handleDelete(
                                                item.examTypeId
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
                                rowsPerPageOptions={[5, 10, 25]}
                                count={filteredExamTypes.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
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

export default ExamTypeList;