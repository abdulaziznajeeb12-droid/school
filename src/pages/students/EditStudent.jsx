import { useContext, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import { StudentContext } from "../../context/StudentContext";
import "../../assets/student.css";

function EditStudent() {

    const { id } = useParams();

    const navigate = useNavigate();

    const { students, updateStudent } = useContext(StudentContext);

    const student = students.find(
        (s) => s.id === Number(id)
    );

    const [formData, setFormData] = useState(student);

    const handleChange = (e) => {

        setFormData({

            ...formData,

            [e.target.name]: e.target.value

        });

    };

    const handleSubmit = (e) => {

        e.preventDefault();

        updateStudent(formData);

        alert("Student Updated Successfully");

        navigate("/students");

    };

    return (

        <DashboardLayout>

            <h2>Edit Student</h2>

            <form className="student-form" onSubmit={handleSubmit}>

                <input
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                />

                <input
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                />

                <input
                    name="rollNo"
                    value={formData.rollNo}
                    onChange={handleChange}
                />

                <input
                    name="className"
                    value={formData.className}
                    onChange={handleChange}
                />

                <input
                    name="section"
                    value={formData.section}
                    onChange={handleChange}
                />

                <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                </select>

                <input
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                />

                <input
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                />

                <button type="submit">
                    Update Student
                </button>

            </form>

        </DashboardLayout>

    );

}

export default EditStudent;