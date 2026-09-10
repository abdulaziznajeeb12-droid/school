import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import DashboardLayout from "../../layouts/DashboardLayout";
import "../../assets/viewUser.css";

import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import { getUserById } from "../../services/userService";

export const ViewUser = () => {

    const { id } = useParams();
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // =====================================================
    // GET USER BY ID
    // =====================================================

    useEffect(() => {

        const loadUser = async () => {

            try {

                setLoading(true);
                setError("");

                const response =
                    await getUserById(Number(id));

                console.log("User Details:", response);

                // API agar direct object return karti hai
                // to response hi user hai

                // Agar API { data: user } return karti hai
                // to response.data use hoga

                setUser(response?.data ?? response);

            }
            catch (err) {

                console.error(
                    "Get User Error:",
                    err.response?.data || err
                );

                setError(
                    err.response?.data?.message ||
                    "Unable to load user details."
                );
            }
            finally {

                setLoading(false);

            }

        };

        if (id) {
            loadUser();
        }

    }, [id]);


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (
            <DashboardLayout>

                <div className="dashboard-container">

                    <h2>View User</h2>

                    <p>Loading user details...</p>

                </div>

            </DashboardLayout>
        );
    }


    // =====================================================
    // ERROR
    // =====================================================

    if (error) {

        return (
            <DashboardLayout>

                <div className="dashboard-container">

                    <h2>View User</h2>

                    <p style={{ color: "red" }}>
                        {error}
                    </p>

                    <button
                        onClick={() => navigate(-1)}
                    >
                        Back
                    </button>

                </div>

            </DashboardLayout>
        );
    }


    // =====================================================
    // USER NOT FOUND
    // =====================================================

    if (!user) {

        return (
            <DashboardLayout>

                <div className="dashboard-container">

                    <h2>View User</h2>

                    <p>User not found.</p>

                </div>

            </DashboardLayout>
        );
    }


    // =====================================================
    // VIEW
    // =====================================================

    return (

        <DashboardLayout>

            <div className="dashboard-container">

                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "20px"
                    }}
                >

                    <h2>User Details</h2>

                    <button
                        onClick={() => navigate(-1)}
                    >
                        Back
                    </button>

                </div>


                <TableContainer
                    component={Paper}
                    sx={{ maxHeight: 700 }}
                >

                    <Table stickyHeader>

                        <TableHead>

                            <TableRow>

                                <TableCell>
                                    <strong>Field</strong>
                                </TableCell>

                                <TableCell>
                                    <strong>Value</strong>
                                </TableCell>

                            </TableRow>

                        </TableHead>


                        <TableBody>

                            <TableRow>
                                <TableCell>User ID</TableCell>
                                <TableCell>
                                    {user.id}
                                </TableCell>
                            </TableRow>


                            <TableRow>
                                <TableCell>First Name</TableCell>
                                <TableCell>
                                    {user.firstName || "-"}
                                </TableCell>
                            </TableRow>


                            <TableRow>
                                <TableCell>Last Name</TableCell>
                                <TableCell>
                                    {user.lastName || "-"}
                                </TableCell>
                            </TableRow>


                            <TableRow>
                                <TableCell>Mobile</TableCell>
                                <TableCell>
                                    {user.mobile || "-"}
                                </TableCell>
                            </TableRow>


                            <TableRow>
                                <TableCell>CNIC</TableCell>
                                <TableCell>
                                    {user.cnic || "-"}
                                </TableCell>
                            </TableRow>


                            <TableRow>
                                <TableCell>Email</TableCell>
                                <TableCell>
                                    {user.email || "-"}
                                </TableCell>
                            </TableRow>


                            <TableRow>
                                <TableCell>Role</TableCell>
                                <TableCell>
                                    {user.roleName ||
                                     user.role?.name ||
                                     "-"}
                                </TableCell>
                            </TableRow>


                            <TableRow>
                                <TableCell>Date of Birth</TableCell>
                                <TableCell>
                                    {user.dateOfBirth || "-"}
                                </TableCell>
                            </TableRow>


                            <TableRow>
                                <TableCell>Age</TableCell>
                                <TableCell>
                                    {user.age ?? "-"}
                                </TableCell>
                            </TableRow>


                            <TableRow>
                                <TableCell>Father Name</TableCell>
                                <TableCell>
                                    {user.fatherName || "-"}
                                </TableCell>
                            </TableRow>


                            <TableRow>
                                <TableCell>Mother Name</TableCell>
                                <TableCell>
                                    {user.motherName || "-"}
                                </TableCell>
                            </TableRow>


                            <TableRow>
                                <TableCell>Father Mobile</TableCell>
                                <TableCell>
                                    {user.fatherMobileNumber || "-"}
                                </TableCell>
                            </TableRow>


                            <TableRow>
                                <TableCell>Mother Mobile</TableCell>
                                <TableCell>
                                    {user.motherMobileNumber || "-"}
                                </TableCell>
                            </TableRow>


                            <TableRow>
                                <TableCell>Gender</TableCell>
                                <TableCell>
                                    {user.gender || "-"}
                                </TableCell>
                            </TableRow>


                            <TableRow>
                                <TableCell>Place of Birth</TableCell>
                                <TableCell>
                                    {user.placeOfBirth || "-"}
                                </TableCell>
                            </TableRow>


                            <TableRow>
                                <TableCell>Address</TableCell>
                                <TableCell>
                                    {user.address || "-"}
                                </TableCell>
                            </TableRow>


                            <TableRow>
                                <TableCell>Last Qualification</TableCell>
                                <TableCell>
                                    {user.lastQualification || "-"}
                                </TableCell>
                            </TableRow>


                            <TableRow>
                                <TableCell>Skills</TableCell>
                                <TableCell>
                                    {user.skills || "-"}
                                </TableCell>
                            </TableRow>


                            <TableRow>
                                <TableCell>Salary</TableCell>
                                <TableCell>
                                    {user.salary ?? "-"}
                                </TableCell>
                            </TableRow>


                            <TableRow>
                                <TableCell>Branch</TableCell>
                                <TableCell>
                                    {user.branchName ||
                                     user.branch?.branchName ||
                                     "-"}
                                </TableCell>
                            </TableRow>


                            <TableRow>
                                <TableCell>Active</TableCell>
                                <TableCell>
                                    {user.isActive === true
                                        ? "Yes"
                                        : user.isActive === false
                                        ? "No"
                                        : "-"}
                                </TableCell>
                            </TableRow>


                            <TableRow>
                                <TableCell>Created On</TableCell>
                                <TableCell>
                                    {user.createdOn || "-"}
                                </TableCell>
                            </TableRow>


                            <TableRow>
                                <TableCell>Updated On</TableCell>
                                <TableCell>
                                    {user.updatedOn || "-"}
                                </TableCell>
                            </TableRow>

                        </TableBody>

                    </Table>

                </TableContainer>

            </div>

        </DashboardLayout>

    );
};

export default ViewUser;