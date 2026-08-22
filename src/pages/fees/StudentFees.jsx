import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";

import {
    getFeeStudents,
    getFeeTypes,
    getStudentFees,
    addStudentFee,
    deleteStudentFee
} from "../../services/feesService";

import "../../assets/fees.css";

function StudentFees() {

    const [students, setStudents] = useState([]);

    const [feeTypes, setFeeTypes] = useState([]);

    const [studentFees, setStudentFees] = useState([]);

    const [form, setForm] = useState({

        studentId: "",

        feeTypeId: "",

        amount: "",

        dueDate: "",

        month: "",

        status: "Pending"

    });

    const [message, setMessage] = useState("");


    useEffect(() => {

        loadData();

    }, []);


    const loadData = async () => {

        try {

            const [
                studentsData,
                feeTypesData,
                feesData
            ] = await Promise.all([

                getFeeStudents(),

                getFeeTypes(),

                getStudentFees()

            ]);

            setStudents(studentsData || []);

            setFeeTypes(feeTypesData || []);

            setStudentFees(feesData || []);

        } catch (error) {

            console.error(error);

            setMessage(
                "Unable to load fee data."
            );
        }
    };


    const handleChange = (e) => {

        const {
            name,
            value
        } = e.target;


        setForm({

            ...form,

            [name]: value

        });


        // Fee type select karne par
        // default amount automatically fill
        if (name === "feeTypeId") {

            const selectedFeeType =
                feeTypes.find(
                    x => String(x.id) === String(value)
                );

            if (selectedFeeType) {

                setForm(previous => ({

                    ...previous,

                    feeTypeId: value,

                    amount: selectedFeeType.amount

                }));

            }

        }
    };


    const handleSubmit = async (e) => {

        e.preventDefault();


        if (
            !form.studentId ||
            !form.feeTypeId ||
            !form.amount
        ) {

            setMessage(
                "Student, Fee Type and Amount are required."
            );

            return;
        }


        try {

            await addStudentFee({

                studentId: Number(form.studentId),

                feeTypeId: Number(form.feeTypeId),

                amount: Number(form.amount),

                dueDate:
                    form.dueDate || null,

                status:
                    form.status || "Pending",

                month:
                    form.month || null

            });


            setMessage(
                "Student fee added successfully."
            );


            setForm({

                studentId: "",

                feeTypeId: "",

                amount: "",

                dueDate: "",

                month: "",

                status: "Pending"

            });


            loadData();

        } catch (error) {

            console.error(error);

            setMessage(
                error.response?.data?.message ||
                error.response?.data ||
                "Unable to add student fee."
            );
        }
    };


    const handleDelete = async (id) => {

        if (
            !window.confirm(
                "Are you sure you want to delete this fee?"
            )
        ) {
            return;
        }


        try {

            await deleteStudentFee(id);

            setMessage(
                "Student fee deleted successfully."
            );

            loadData();

        } catch (error) {

            console.error(error);

            setMessage(
                "Unable to delete student fee."
            );
        }
    };


    return (

        <DashboardLayout>

            <div className="fees-page">

                <div className="fees-header">

                    <div>

                        <h1>Student Fees</h1>

                        <p>
                            Assign and manage student fees
                        </p>

                    </div>

                </div>


                {message && (

                    <div className="fees-message">

                        {message}

                    </div>

                )}


                {/* FORM */}

                <div className="fees-form-card">

                    <h2>
                        Assign Fee
                    </h2>


                    <form
                        className="fees-form"
                        onSubmit={handleSubmit}
                    >

                        {/* STUDENT */}

                        <div className="fee-field">

                            <label>
                                Student *
                            </label>

                            <select
                                name="studentId"
                                value={form.studentId}
                                onChange={handleChange}
                            >

                                <option value="">
                                    Select Student
                                </option>

                                {students.map(
                                    student => (

                                        <option
                                            key={student.id}
                                            value={student.id}
                                        >
                                            {student.studentName}
                                        </option>

                                    )
                                )}

                            </select>

                        </div>


                        {/* FEE TYPE */}

                        <div className="fee-field">

                            <label>
                                Fee Type *
                            </label>

                            <select
                                name="feeTypeId"
                                value={form.feeTypeId}
                                onChange={handleChange}
                            >

                                <option value="">
                                    Select Fee Type
                                </option>

                                {feeTypes.map(
                                    fee => (

                                        <option
                                            key={fee.id}
                                            value={fee.id}
                                        >
                                            {fee.feeName}
                                            {" - Rs. "}
                                            {fee.amount}
                                        </option>

                                    )
                                )}

                            </select>

                        </div>


                        {/* AMOUNT */}

                        <div className="fee-field">

                            <label>
                                Amount *
                            </label>

                            <input
                                type="number"
                                name="amount"
                                value={form.amount}
                                onChange={handleChange}
                            />

                        </div>


                        {/* DUE DATE */}

                        <div className="fee-field">

                            <label>
                                Due Date
                            </label>

                            <input
                                type="date"
                                name="dueDate"
                                value={form.dueDate}
                                onChange={handleChange}
                            />

                        </div>


                        {/* MONTH */}

                        <div className="fee-field">

                            <label>
                                Month
                            </label>

                            <input
                                type="text"
                                name="month"
                                value={form.month}
                                onChange={handleChange}
                                placeholder="e.g. August 2026"
                            />

                        </div>


                        {/* STATUS */}

                        <div className="fee-field">

                            <label>
                                Status
                            </label>

                            <select
                                name="status"
                                value={form.status}
                                onChange={handleChange}
                            >

                                <option value="Pending">
                                    Pending
                                </option>

                                <option value="Paid">
                                    Paid
                                </option>

                                <option value="Partial">
                                    Partial
                                </option>

                                <option value="Overdue">
                                    Overdue
                                </option>

                            </select>

                        </div>


                        <div className="fee-form-buttons">

                            <button
                                type="submit"
                                className="fee-save-btn"
                            >

                                Assign Fee

                            </button>

                        </div>

                    </form>

                </div>


                {/* TABLE */}

                <div className="fees-table-card">

                    <div className="fees-table-header">

                        <div>

                            <h2>
                                Student Fee List
                            </h2>

                            <span>
                                {studentFees.length} Records
                            </span>

                        </div>

                    </div>


                    <div className="fees-table-wrapper">

                        <table className="fees-table">

                            <thead>

                                <tr>

                                    <th>
                                        #
                                    </th>

                                    <th>
                                        Student
                                    </th>

                                    <th>
                                        Fee Type
                                    </th>

                                    <th>
                                        Amount
                                    </th>

                                    <th>
                                        Due Date
                                    </th>

                                    <th>
                                        Month
                                    </th>

                                    <th>
                                        Status
                                    </th>

                                    <th>
                                        Action
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {studentFees.map(
                                    (item, index) => (

                                        <tr
                                            key={item.studentFees}
                                        >

                                            <td>
                                                {index + 1}
                                            </td>

                                            <td className="fee-name">
                                                {item.studentName}
                                            </td>

                                            <td>
                                                {item.feeName}
                                            </td>

                                            <td>
                                                Rs. {item.amount}
                                            </td>

                                            <td>
                                                {item.dueDate
                                                    ? item.dueDate.substring(0, 10)
                                                    : "-"
                                                }
                                            </td>

                                            <td>
                                                {item.month || "-"}
                                            </td>

                                            <td>

                                                <span
                                                    className={
                                                        item.status === "Paid"
                                                            ? "fee-status paid"
                                                            : item.status === "Overdue"
                                                                ? "fee-status overdue"
                                                                : item.status === "Partial"
                                                                    ? "fee-status partial"
                                                                    : "fee-status pending"
                                                    }
                                                >

                                                    {item.status}

                                                </span>

                                            </td>

                                            <td>

                                                <button
                                                    className="delete-btn"
                                                    onClick={() =>
                                                        handleDelete(
                                                            item.studentFees
                                                        )
                                                    }
                                                >
                                                    Delete
                                                </button>

                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                </div>

            </div>

        </DashboardLayout>
    );
}

export default StudentFees;