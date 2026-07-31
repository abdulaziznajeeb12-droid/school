import { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import "../../assets/student.css";
import { useContext } from "react";
import { StudentContext } from "../../context/StudentContext";
import { useNavigate } from "react-router-dom";
function AddStudent() {
    const { addStudent } = useContext(StudentContext);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const [student, setStudent] = useState({

        firstName: "",
        lastName: "",
        rollNo: "",
        gender: "",
        className: "",
        section: "",
        mobile: "",
        email: "",
        address: ""

    });

    const handleChange = (e) => {

        setStudent({
            ...student,
            [e.target.name]: e.target.value
        });

    };


    const validate = () => {

        let newErrors = {};

        if (!student.firstName.trim()) {
            newErrors.firstName = "First Name is required";
        }

        if (!student.lastName.trim()) {
            newErrors.lastName = "Last Name is required";
        }

        if (!student.rollNo.trim()) {
            newErrors.rollNo = "Roll Number is required";
        }

        if (!student.gender) {
            newErrors.gender = "Please select gender";
        }

        if (!student.className.trim()) {
            newErrors.className = "Class is required";
        }

        if (!student.mobile.trim()) {
            newErrors.mobile = "Mobile Number is required";
        }
        else if (!/^[0-9]{11}$/.test(student.mobile)) {
            newErrors.mobile = "Mobile must be 11 digits";
        }

        if (!student.email.trim()) {
            newErrors.email = "Email is required";
        }
        else if (!/\S+@\S+\.\S+/.test(student.email)) {
            newErrors.email = "Invalid Email";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;

    };


    const handleSubmit = (e) => {

        e.preventDefault();

        if (!validate()) {
            return;
        }

        const newStudent = {

            id: Date.now(),

            ...student

        };

        addStudent(newStudent);

        alert("Student Added Successfully");

        navigate("/students");

    };


    return (

        <DashboardLayout>

            <h2>Add Student</h2>

            <form className="student-form" onSubmit={handleSubmit}>

                <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    onChange={handleChange}
                />
                <p className="error">
                    {errors.firstName}
                </p>
                <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    onChange={handleChange}
                />
                <p className="error">
                    {errors.lastName}
                </p>
                <input
                    type="text"
                    name="rollNo"
                    placeholder="Roll Number"
                    onChange={handleChange}
                />
                <p className="error">
                    {errors.rollNo}
                </p>

                <select
                    name="gender"
                    onChange={handleChange}
                >
                    <option value="">Select Gender</option>
                    <option>Male</option>
                    <option>Female</option>
                </select>
                <p className="error">
                    {errors.gender}
                </p>

                <input
                    type="text"
                    name="className"
                    placeholder="Class"
                    onChange={handleChange}
                />
                <p className="error">
                    {errors.className}
                </p>
                <input
                    type="text"
                    name="section"
                    placeholder="Section"
                    onChange={handleChange}
                />
                <p className="error">
                    {errors.section}
                </p>
                <input
                    type="text"
                    name="mobile"
                    placeholder="Mobile"
                    onChange={handleChange}
                />
                <p className="error">
                    {errors.mobile}
                </p>

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    onChange={handleChange}
                />
                <p className="error">
                    {errors.email}
                </p>
                <textarea
                    name="address"
                    placeholder="Address"
                    onChange={handleChange}
                ></textarea>

                <p className="error">
                    {errors.Address}
                </p>

                <button type="submit">
                    Save Student
                </button>

            </form>

        </DashboardLayout>

    );

}

export default AddStudent;