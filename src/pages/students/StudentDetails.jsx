import { useContext } from "react";
import { useParams, Link } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import { StudentContext } from "../../context/StudentContext";
import "../../assets/student.css";

function StudentDetails() {

    const { id } = useParams();

    const { students } = useContext(StudentContext);

    const student = students.find(
        (s) => s.id === Number(id)
    );

    if (!student) {
        return (
            <DashboardLayout>
                <h2>Student Not Found</h2>
            </DashboardLayout>
        );
    }

    return (

        <DashboardLayout>

            <div className="student-profile">

                <h2>Student Profile</h2>

                <hr />

                <div className="profile-row">
                    <strong>ID :</strong> {student.id}
                </div>

                <div className="profile-row">
                    <strong>Name :</strong> {student.firstName} {student.lastName}
                </div>

                <div className="profile-row">
                    <strong>Roll No :</strong> {student.rollNo}
                </div>

                <div className="profile-row">
                    <strong>Class :</strong> {student.className}
                </div>

                <div className="profile-row">
                    <strong>Section :</strong> {student.section}
                </div>

                <div className="profile-row">
                    <strong>Gender :</strong> {student.gender}
                </div>

                <div className="profile-row">
                    <strong>Mobile :</strong> {student.mobile}
                </div>

                <div className="profile-row">
                    <strong>Email :</strong> {student.email}
                </div>

                <br />

                <Link to="/students">
                    <button className="view-btn">
                        Back
                    </button>
                </Link>

            </div>

        </DashboardLayout>

    );

}

export default StudentDetails;