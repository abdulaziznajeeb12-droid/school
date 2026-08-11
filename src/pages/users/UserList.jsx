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
    getUsers,
    deleteUser,
    searchUser
} from "../../services/userService";

function UserList() {

    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const data = await getUsers();
            setUsers(data);
        }
        catch (error) {
            console.log(error);
        }
    };

    const handleSearch = async () => {
        try {
            const data = await searchUser(search);
            setUsers(data);
        }
        catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {

        const delay = setTimeout(() => {

            if (search.trim() === "") {
                loadUsers();
                return;
            }

            handleSearch();

        }, 300);

        return () => clearTimeout(delay);

    }, [search]);

    const handleDelete = async (id) => {

        if (!window.confirm("Delete this User?"))
            return;

        try {

            await deleteUser(id);
            loadUsers();

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

            {/* Header */}

            <div className="page-header">

                <h2 className="main-heading">
                    User Management
                </h2>

                <div className="toolbar">

                    <input
                        className="searchbox"
                        type="text"
                        placeholder="Search User..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <Link to="/users/add">

                        <button className="add-btn">
                            + Add User
                        </button>

                    </Link>

                </div>

            </div>

            {/* Table */}

            <TableContainer
                component={Paper}
                className="school-table-container"
                elevation={5}
            >

                <Table className="school-table">

                    <TableHead>

                        <TableRow className="table-header">

                            <TableCell>ID</TableCell>
                            <TableCell>First Name</TableCell>
                            <TableCell>Last Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Role</TableCell>
                            <TableCell>Branch</TableCell>
                            <TableCell align="center">Actions</TableCell>

                        </TableRow>

                    </TableHead>

                    <TableBody>

                        {(rowsPerPage > 0
                            ? users.slice(
                                page * rowsPerPage,
                                page * rowsPerPage + rowsPerPage
                            )
                            : users
                        ).map((user) => (

                            <TableRow
                                key={user.id}
                                hover
                                className="table-body-row"
                            >

                                <TableCell>{user.id}</TableCell>

                                <TableCell>{user.firstName}</TableCell>

                                <TableCell>{user.lastName}</TableCell>

                                <TableCell>{user.email}</TableCell>

                                <TableCell>{user.roleName}</TableCell>

                                <TableCell>{user.branchName}</TableCell>

                                <TableCell align="center">

                                    <Link to={`/users/edit/${user.id}`}>

                                        <button className="edit-btn">
                                            Edit
                                        </button>

                                    </Link>

                                    {/* <button
                                        className="delete-btn"
                                        onClick={() => handleDelete(user.id)}
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
                                count={users.length}
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

export default UserList;