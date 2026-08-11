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
    getBranches,
    deleteBranch,
    searchBranch
} from "../../services/branchService";

function BranchList() {

    const [branches, setBranches] = useState([]);
    const [search, setSearch] = useState("");

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    useEffect(() => {

        loadBranches();

    }, []);

    const loadBranches = async () => {

        const data = await getBranches();

        setBranches(data);

    };

    const handleSearch = async () => {

        try {

            const data = await searchBranch(search);

            setBranches(data);

        } catch (error) {

            console.log(error);

        }

    };

    useEffect(() => {

        const delay = setTimeout(() => {

            if (search.trim() === "") {

                loadBranches();

                return;

            }

            handleSearch();

        }, 300);

        return () => clearTimeout(delay);

    }, [search]);

    const handleDelete = async (id) => {

        if (!window.confirm("Delete this Branch?"))
            return;

        try {

            await deleteBranch(id);

            loadBranches();

        } catch (error) {

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

                    Branch Management

                </h2>

                <div className="toolbar">

                    <input
                        className="searchbox"
                        type="text"
                        placeholder="Search Branch..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <Link to="/branches/add">

                        <button className="add-btn">

                            + Add Branch

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

                            <TableCell>Branch Name</TableCell>

                            <TableCell>School Name</TableCell>

                            <TableCell>Status</TableCell>

                            <TableCell align="center">

                                Actions

                            </TableCell>

                        </TableRow>

                    </TableHead>

                    <TableBody>

                        {(rowsPerPage > 0

                            ? branches.slice(

                                page * rowsPerPage,

                                page * rowsPerPage + rowsPerPage

                            )

                            : branches

                        ).map((branch) => (

                            <TableRow
                                key={branch.id}
                                hover
                                className="table-body-row"
                            >

                                <TableCell>

                                    {branch.id}

                                </TableCell>

                                <TableCell>

                                    {branch.branchName}

                                </TableCell>

                                <TableCell>

                                    {branch.schoolName}

                                </TableCell>

                                <TableCell>

                                    <span
                                        className={
                                            branch.isActive
                                                ? "status-active"
                                                : "status-inactive"
                                        }
                                    >

                                        {branch.isActive ? "Active" : "Inactive"}

                                    </span>

                                </TableCell>

                                <TableCell align="center">

                                    <Link to={`/branches/edit/${branch.id}`}>

                                        <button className="edit-btn">

                                            Edit

                                        </button>

                                    </Link>

                                    {/* <button
                                        className="delete-btn"
                                        onClick={() => handleDelete(branch.id)}
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

                                count={branches.length}

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

export default BranchList;