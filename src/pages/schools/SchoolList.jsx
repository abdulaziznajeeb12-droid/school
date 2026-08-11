import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import "../../assets/table.css";
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
    getSchools,
    deleteSchool,
    searchSchool
} from "../../services/schoolService";
import { backgroundColor } from "@mui/system";

function SchoolList() {

    const [schools, setSchools] = useState([]);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(0);
const [rowsPerPage, setRowsPerPage] = useState(5);

const handleChangePage = (event, newPage) => {
    setPage(newPage);
};

const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
};

const emptyRows =
    rowsPerPage > 0
        ? Math.max(
              0,
              (1 + page) * rowsPerPage - schools.length
          )
        : 0;

    useEffect(() => {
        loadSchools();
    }, []);

    const loadSchools = async () => {
        try {

            const data = await getSchools();
            setSchools(data);

        } catch (error) {
            console.log(error);
        }
    };

    const handleSearch = async () => {

        try {

            const data = await searchSchool(search);
            setSchools(data);

        } catch (error) {

            console.log(error);

        }

    };

    useEffect(() => {

        const delay = setTimeout(() => {

            if (search.trim() === "") {
                loadSchools();
                return;
            }

            handleSearch();

        }, 300);

        return () => clearTimeout(delay);

    }, [search]);

    const handleDelete = async (id) => {

        if (!window.confirm("Delete this School?"))
            return;

        try {

            await deleteSchool(id);
            loadSchools();

        } catch (error) {

            console.log(error);
            alert("Delete Failed");

        }

    };

    return (

        <DashboardLayout>

           

            <div className="page-header">

    <h2 className="main-heading">

        School Management

    </h2>

    <div className="toolbar">

        <input
            className="searchbox"
            type="text"
            placeholder="Search School..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
        />

        <Link to="/schools/add">

            <button className="add-btn">

                + Add School

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
        <TableCell>School Name</TableCell>
        <TableCell>Status</TableCell>
        <TableCell align="center">Actions</TableCell>

    </TableRow>

</TableHead>
<TableBody>

{(rowsPerPage > 0
    ? schools.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      )
    : schools
).map((school) => (

<TableRow
    key={school.id}
    hover
    className="table-body-row"
>

    <TableCell>{school.id}</TableCell>

    <TableCell>{school.schoolName}</TableCell>

    <TableCell>

        <span
            className={
                school.isActive
                    ? "status-active"
                    : "status-inactive"
            }
        >
            {school.isActive ? "Active" : "Inactive"}
        </span>

    </TableCell>

    <TableCell align="center">

        <Link to={`/schools/edit/${school.id}`}>

            <button className="edit-btn">
                Edit
            </button>

        </Link>

        {/* <button
            className="delete-btn"
            onClick={() => handleDelete(school.id)}
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
rowsPerPageOptions={[5,10,25]}
count={schools.length}
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

export default SchoolList;