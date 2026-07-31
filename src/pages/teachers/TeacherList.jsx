import DashboardLayout from "../../layouts/DashboardLayout";
import "../../assets/student.css";
import { getTeachers } from "../../services/teacherService";
import { Link } from "react-router-dom";
function TeacherList() {
    const teachers = getTeachers();
    return (
        <DashboardLayout>
            <div className="student-header">
                <h2>Teachers</h2>
                <Link to="/teachers/add">
                    <button>Add Teacher</button>
                </Link>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Code</th>
                        <th>Subject</th>
                        <th>Qualification</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>

                    {

                        teachers.map((teacher) => (
                            <tr key={teacher.id}>
                                <td>{teacher.id}</td>
                                <td>
                                    {teacher.firstName} {teacher.lastName}
                                </td>
                                <td>{teacher.teacherCode}</td>
                                <td>{teacher.subject}</td>
                                <td>{teacher.qualification}</td>
                                <td>
                                    <button className="edit-btn">
                                        Edit
                                    </button>
                                    <button className="delete-btn">
                                        Delete
                                    </button>
                                    <button className="view-btn">

                                        View
                                    </button>
                                </td>

                            </tr>

                        ))

                    }
                </tbody>

            </table>

        </DashboardLayout>

    );

}

export default TeacherList;