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
    getRoles,
    deleteRole,
    searchRole
} from "../../services/roleService";

function RoleList() {

    const [roles, setRoles] = useState([]);
    const [search, setSearch] = useState("");

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    useEffect(() => {
        loadRoles();
    }, []);

    const loadRoles = async () => {
        try {
            const data = await getRoles();
            setRoles(data);
        } catch (error) {
            console.log(error);
        }
    };

    const handleSearch = async () => {
        try {
            const data = await searchRole(search);
            setRoles(data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {

        const delay = setTimeout(() => {

            if (search.trim() === "") {
                loadRoles();
                return;
            }

            handleSearch();

        }, 300);

        return () => clearTimeout(delay);

    }, [search]);

    const handleDelete = async (id) => {

        if (!window.confirm("Delete this Role?"))
            return;

        try {

            await deleteRole(id);
            loadRoles();

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
                    Role Management
                </h2>

                <div className="toolbar">

                    <input
                        className="searchbox"
                        type="text"
                        placeholder="Search Role..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <Link to="/roles/add">

                        <button className="add-btn">
                            + Add Role
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
                            <TableCell>Name</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell align="center">Actions</TableCell>

                        </TableRow>

                    </TableHead>

                    <TableBody>

                        {(rowsPerPage > 0
                            ? roles.slice(
                                page * rowsPerPage,
                                page * rowsPerPage + rowsPerPage
                            )
                            : roles
                        ).map((role) => (

                            <TableRow
                                key={role.id}
                                hover
                                className="table-body-row"
                            >

                                <TableCell>{role.id}</TableCell>

                                <TableCell>{role.name}</TableCell>

                                <TableCell>{role.decsribtion}</TableCell>

                                <TableCell>

                                    <span
                                        className={
                                            role.isActive
                                                ? "status-active"
                                                : "status-inactive"
                                        }
                                    >
                                        {role.isActive ? "Active" : "Inactive"}
                                    </span>

                                </TableCell>

                                <TableCell align="center">

                                    <Link to={`/roles/edit/${role.id}`}>

                                        <button className="edit-btn">
                                            Edit
                                        </button>

                                    </Link>

                                    {/* <button
                                        className="delete-btn"
                                        onClick={() => handleDelete(role.id)}
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
                                count={roles.length}
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

export default RoleList;