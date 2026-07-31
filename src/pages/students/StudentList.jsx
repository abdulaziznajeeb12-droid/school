import { useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import "../../assets/student.css";
import { getStudents } from "../../services/studentService";
import { useContext } from "react";
import { StudentContext } from "../../context/StudentContext";

function StudentList() {

const { students, setStudents } = useContext(StudentContext);
    const [search, setSearch] = useState("");

    const handleDelete = (id,name) => {

        if (window.confirm("Are you sure you want to delete this student?")) {

            const updatedStudents = students.filter(
                (student) => student.id !== id || student.firstName === name
            );

            setStudents(updatedStudents);
        }
    };

    return (

        <DashboardLayout>

            <div className="student-header">

                <div>

                    <h2>Students</h2>

                    <h4>Total Students: {students.length}</h4>

                </div>

                <input
                    type="text"
                    placeholder="Search Student..."
                    className="search-box"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <Link to="/students/add">
                    <button>Add Student</button>
                </Link>

            </div>

            <table>

                <thead>

                    <tr>

                        <th>ID</th>
                        <th>Name</th>
                        <th>Roll No</th>
                        <th>Class</th>
                        <th>Gender</th>
                        <th>Action</th>

                    </tr>

                </thead>

                <tbody>

                    {students
                        .filter((student) => {

                            return (

                                student.firstName
                                    .toLowerCase()
                                    .includes(search.toLowerCase())

                                ||

                                student.lastName
                                    .toLowerCase()
                                    .includes(search.toLowerCase())

                                ||

                                student.rollNo.includes(search)

                            );

                        })

                        .map((student) => (

                            <tr key={student.id}>

                                <td>{student.id}</td>

                                <td>
                                    {student.firstName} {student.lastName}
                                </td>

                                <td>{student.rollNo}</td>

                                <td>{student.className}</td>

                                <td>{student.gender}</td>

                                <td>

                                    <Link to={`/students/edit/${student.id}`}>
                                        <button className="edit-btn">
                                            Edit
                                        </button>
                                    </Link>

                                    <button
                                        className="delete-btn"
                                        onClick={() => handleDelete(student.id)}
                                    >
                                        Delete
                                    </button>

                                    <Link to={`/students/details/${student.id}`}>
                                        <button className="view-btn">
                                            View
                                        </button>
                                    </Link>

                                </td>

                            </tr>

                        ))}

                </tbody>

            </table>

        </DashboardLayout>

    );

}

export default StudentList;