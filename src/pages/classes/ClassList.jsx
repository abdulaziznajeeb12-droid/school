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
    getClasses,
    searchClass,
    deleteClass
} from "../../services/classService";

function ClassList() {

    const [classes, setClasses] = useState([]);
    const [search, setSearch] = useState("");

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    useEffect(() => {

        loadClasses();

    }, []);

    const loadClasses = async () => {

        const data = await getClasses();

        setClasses(data);

    };

    const handleSearch = async () => {

        try {

            const data = await searchClass(search);

            setClasses(data);

        }

        catch (error) {

            console.log(error);

        }

    };

    useEffect(() => {

        const delay = setTimeout(() => {

            if (search.trim() === "") {

                loadClasses();

                return;

            }

            handleSearch();

        }, 300);

        return () => clearTimeout(delay);

    }, [search]);

    const handleDelete = async (id) => {

        if (!window.confirm("Delete this Class?"))
            return;

        try {

            await deleteClass(id);

            loadClasses();

        }

        catch (error) {

            console.log(error);

            alert("Delete Failed");

        }

    };

    const handleChangePage = (event, newPage) => {

        setPage(newPage);

    };

    const handleChangeRowsPerPage = (event) => {

        setRowsPerPage(parseInt(event.target.value, 10));

        setPage(0);

    };

    return (

        <DashboardLayout>

            <div className="page-header">

                <h2 className="main-heading">

                    Class Management

                </h2>

                <div className="toolbar">

                    <input
                        className="searchbox"
                        type="text"
                        placeholder="Search Class..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <Link to="/classes/add">

                        <button className="add-btn">

                            + Add Class

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

                            <TableCell>ID</TableCell>

                            <TableCell>Class Name</TableCell>

                            <TableCell>Branch Name</TableCell>

                            <TableCell>Status</TableCell>

                            <TableCell align="center">

                                Actions

                            </TableCell>

                        </TableRow>

                    </TableHead>

                    <TableBody>

                        {(rowsPerPage > 0

                            ? classes.slice(

                                page * rowsPerPage,

                                page * rowsPerPage + rowsPerPage

                            )

                            : classes

                        ).map((item) => (

                            <TableRow
                                key={item.id}
                                hover
                                className="table-body-row"
                            >

                                <TableCell>

                                    {item.id}

                                </TableCell>

                                <TableCell>

                                    {item.className}

                                </TableCell>

                                <TableCell>

                                    {item.branchName}

                                </TableCell>

                                <TableCell>

                                    <span
                                        className={
                                            item.isActive
                                                ? "status-active"
                                                : "status-inactive"
                                        }
                                    >

                                        {item.isActive ? "Active" : "Inactive"}

                                    </span>

                                </TableCell>

                                <TableCell align="center">

                                    <Link to={`/classes/edit/${item.id}`}>

                                        <button className="edit-btn">

                                            Edit

                                        </button>

                                    </Link>

                                    {/* <button
                                        className="delete-btn"
                                        onClick={() => handleDelete(item.id)}
                                    >

                                        Delete

                                    </button> */}

                                </TableCell>

                            </TableRow>

                        ))}

                    </TableBody>

                    <TableFooter>

                        <TableRow>

                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25]}
                                count={classes.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />

                        </TableRow>

                    </TableFooter>

                </Table>

            </TableContainer>

        </DashboardLayout>

    );

}

export default ClassList;