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
import Avatar from "@mui/material/Avatar";
import ViewIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";

import {
    getUsers,
    searchUser
} from "../../services/userService";


function UserList() {

    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);


    // =====================================================
    // LOAD USERS
    // =====================================================

    const loadUsers = async () => {

        try {

            const data = await getUsers();

            setUsers(
                Array.isArray(data)
                    ? data
                    : []
            );

        } catch (error) {

            console.log(
                "Load Users Error:",
                error
            );

        }

    };


    useEffect(() => {

        loadUsers();

    }, []);


    // =====================================================
    // SEARCH
    // =====================================================

    useEffect(() => {

        const delay = setTimeout(async () => {

            try {

                if (search.trim() === "") {

                    await loadUsers();

                    return;
                }


                const data =
                    await searchUser(
                        search.trim()
                    );


                setUsers(
                    Array.isArray(data)
                        ? data
                        : []
                );


                setPage(0);

            } catch (error) {

                console.log(
                    "Search User Error:",
                    error
                );

            }

        }, 300);


        return () =>
            clearTimeout(delay);

    }, [search]);


    // =====================================================
    // PAGE CHANGE
    // =====================================================

    const handleChangePage = (
        event,
        newPage
    ) => {

        setPage(newPage);

    };


    // =====================================================
    // ROWS PER PAGE
    // =====================================================

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


    // =====================================================
    // CURRENT USERS
    // =====================================================

    const displayedUsers =
        rowsPerPage > 0
            ? users.slice(
                page * rowsPerPage,
                page * rowsPerPage +
                rowsPerPage
            )
            : users;


    // =====================================================
    // IMAGE URL
    // =====================================================

    const getImageUrl = (imagePath) => {

        if (!imagePath) {
            return undefined;
        }

        return `http://localhost:5250${imagePath}`;

    };


    // =====================================================
    // UI
    // =====================================================

    return (

        <DashboardLayout>

            {/* =================================================
                HEADER
            ================================================= */}

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
                        onChange={(e) =>
                            setSearch(
                                e.target.value
                            )
                        }
                    />


                    <Link to="/users/add">

                        <button className="add-btn">
                            + Add User
                        </button>

                    </Link>

                </div>

            </div>


            {/* =================================================
                TABLE
            ================================================= */}

            <TableContainer
                component={Paper}
                className="school-table-container"
                elevation={5}
            >

                <Table
                    className="school-table"
                    size="small"
                >

                    <TableHead>

                        <TableRow className="table-header">

                            <TableCell>
                                Image
                            </TableCell>

                            <TableCell>
                                Name
                            </TableCell>

                            <TableCell>
                                Email
                            </TableCell>

                            <TableCell>
                                Role
                            </TableCell>

                            <TableCell>
                                Mobile No
                            </TableCell>

                            <TableCell>
                                Branch
                            </TableCell>

                            <TableCell>
                                Card No
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

                        {displayedUsers.length > 0 ? (

                            displayedUsers.map(
                                (user) => (

                                    <TableRow
                                        key={user.id}
                                        hover
                                        className="table-body-row"
                                    >

                                        {/* IMAGE */}

                                        <TableCell>

                                            <Avatar
                                                src={
                                                    getImageUrl(
                                                        user.imagePath
                                                    )
                                                }
                                                alt={
                                                    `${user.firstName || ""} ${user.lastName || ""}`
                                                }
                                                sx={{
                                                    width: 38,
                                                    height: 38,
                                                    fontSize: "16px"
                                                }}
                                            >

                                                {user.firstName
                                                    ?.charAt(0)
                                                    ?.toUpperCase()}

                                            </Avatar>

                                        </TableCell>


                                        {/* NAME */}

                                        <TableCell>

                                            {user.firstName}{" "}
                                            {user.lastName}

                                        </TableCell>


                                        {/* EMAIL */}

                                        <TableCell>
                                            {user.email}
                                        </TableCell>


                                        {/* ROLE */}

                                        <TableCell>
                                            {user.roleName}
                                        </TableCell>


                                        {/* MOBILE */}

                                        <TableCell>
                                            {user.mobile}
                                        </TableCell>


                                        {/* BRANCH */}

                                        <TableCell>
                                            {user.branchName}
                                        </TableCell>


                                        {/* RFID */}

                                        <TableCell>
                                            {user.rfid || "-"}
                                        </TableCell>


                                        {/* STATUS */}

                                        <TableCell>

                                            <span
                                                className={
                                                    user.isActive
                                                        ? "user-status active"
                                                        : "user-status inactive"
                                                }
                                            >
                                                {user.isActive
                                                    ? "Active"
                                                    : "Inactive"}
                                            </span>

                                        </TableCell>


                                        {/* ACTIONS */}

                                        <TableCell
                                            align="center"
                                            sx={{
                                                whiteSpace: "nowrap",
                                                padding: "4px 8px"
                                            }}
                                        >

                                            <div
                                                className="user-action-buttons"
                                            >

                                                <Link
                                                    to={`/users/view/${user.id}`}
                                                >

                                                    <button
                                                        type="button"
                                                        className="view-btn"
                                                    >
                                                        <ViewIcon />
                                                    </button>

                                                </Link>


                                                <Link
                                                    to={`/users/edit/${user.id}`}
                                                >

                                                    <button
                                                        type="button"
                                                        className="edit-btn"
                                                    >
                                                        <EditIcon />
                                                    </button>

                                                </Link>

                                            </div>

                                        </TableCell>

                                    </TableRow>

                                )

                            )

                        ) : (

                            <TableRow>

                                <TableCell
                                    colSpan={9}
                                    align="center"
                                >
                                    No users found.
                                </TableCell>

                            </TableRow>

                        )}

                    </TableBody>


                    {/* =================================================
                        FOOTER
                    ================================================= */}

                    <TableFooter>

                        <TableRow>

                            <TablePagination
                                rowsPerPageOptions={[
                                    5,
                                    10,
                                    25
                                ]}
                                count={users.length}
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


export default UserList;