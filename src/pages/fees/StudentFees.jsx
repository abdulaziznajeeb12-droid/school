
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";

import {
    getFeeStudents,
    getFeeTypes,
    getStudentFees,
    generateFeeVoucher,
    deleteStudentFee
} from "../../services/feesService";

import "../../assets/fees.css";

import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Checkbox,
    ListItemText
} from "@mui/material";

function StudentFees() {

    const navigate = useNavigate();

    const [students, setStudents] = useState([]);
    const [feeTypes, setFeeTypes] = useState([]);
    const [studentFees, setStudentFees] = useState([]);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    const [step, setStep] = useState(1);

    const [form, setForm] = useState({
        studentId: "",
        feeTypeId: "",
        amount: "",
        dueDate: "",
        months: []
    });

    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("success");
    const [loading, setLoading] = useState(false);

    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];

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

            setStudents(
                Array.isArray(studentsData)
                    ? studentsData
                    : []
            );

            setFeeTypes(
                Array.isArray(feeTypesData)
                    ? feeTypesData
                    : []
            );

            setStudentFees(
                Array.isArray(feesData?.records)
                    ? feesData.records
                    : Array.isArray(feesData)
                        ? feesData
                        : []
            );

        }
        catch (error) {

            console.error(
                "Load fee data error:",
                error
            );

            showMessage(
                "Unable to load fee data.",
                "error"
            );

        }

    };

    const showMessage = (
        text,
        type = "success"
    ) => {

        setMessage(text);
        setMessageType(type);

    };

    const handleChange = (e) => {

        const {
            name,
            value
        } = e.target;

        if (name === "feeTypeId") {

            const selectedFeeType =
                feeTypes.find(
                    x =>
                        String(x.id) ===
                        String(value)
                );

            setForm(previous => ({
                ...previous,
                feeTypeId: value,
                amount:
                    selectedFeeType?.amount || ""
            }));

            return;
        }

        setForm(previous => ({
            ...previous,
            [name]: value
        }));

    };

    const handleMonthChange = (event) => {

        const value = event.target.value;

        setForm(previous => ({
            ...previous,
            months:
                typeof value === "string"
                    ? value.split(",")
                    : value
        }));

    };

    const selectedStudent =
        students.find(
            student =>
                String(student.id) ===
                String(form.studentId)
        );

    const selectedFeeType =
        feeTypes.find(
            fee =>
                String(fee.id) ===
                String(form.feeTypeId)
        );

    const monthlyAmount =
        Number(form.amount || 0);

    const totalAmount =
        monthlyAmount *
        form.months.length;

    const handleContinue = () => {

        if (!form.studentId) {

            showMessage(
                "Please select a student.",
                "error"
            );

            return;
        }

        if (!form.feeTypeId) {

            showMessage(
                "Please select fee type.",
                "error"
            );

            return;
        }

        if (!form.amount || Number(form.amount) <= 0) {

            showMessage(
                "Please enter a valid amount.",
                "error"
            );

            return;
        }

        if (form.months.length === 0) {

            showMessage(
                "Please select at least one month.",
                "error"
            );

            return;
        }

        setMessage("");
        setStep(2);

    };

    const handleBack = () => {

        setMessage("");
        setStep(1);

    };

    const handleSave = async () => {

        try {

            setLoading(true);
            setMessage("");

            /*
             * IMPORTANT:
             *
             * ONE API REQUEST
             *
             * All selected months are sent together.
             *
             * Backend should create ONE voucher
             * containing all selected months.
             */

            const payload = {

                studentId:
                    Number(form.studentId),

                feeTypeId:
                    Number(form.feeTypeId),

                amount:
                    Number(form.amount),

                dueDate:
                    form.dueDate || null,

                months:
                    form.months,

                status:
                    "Pending"

            };

            console.log(
                "Generate multi-month voucher:",
                payload
            );

            await generateFeeVoucher(payload);

            showMessage(
                `Voucher generated successfully for ${form.months.length} month(s).`,
                "success"
            );

            setForm({
                studentId: "",
                feeTypeId: "",
                amount: "",
                dueDate: "",
                months: []
            });

            setStep(1);

            await loadData();

        }
        catch (error) {

            console.error(
                "Generate voucher error:",
                error.response?.data ||
                error
            );

            showMessage(

                error.response?.data?.message ||

                error.response?.data?.error ||

                "Unable to generate voucher.",

                "error"

            );

        }
        finally {

            setLoading(false);

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

            showMessage(
                "Student fee deleted successfully.",
                "success"
            );

            await loadData();

        }
        catch (error) {

            console.error(error);

            showMessage(
                error.response?.data?.message ||
                "Unable to delete student fee.",
                "error"
            );

        }

    };

    const filteredFees =
        studentFees.filter(item => {

            const keyword =
                search
                    .toLowerCase()
                    .trim();

            const studentId =
                String(
                    item.studentId || ""
                );

            const studentName =
                String(
                    item.studentName || ""
                ).toLowerCase();

            const month =
                String(
                    item.month || ""
                ).toLowerCase();

            const status =
                String(
                    item.status || ""
                ).toLowerCase();

            const matchesSearch =
                studentId.includes(keyword) ||
                studentName.includes(keyword) ||
                month.includes(keyword);

            const matchesStatus =
                statusFilter === "" ||
                status ===
                statusFilter.toLowerCase();

            return (
                matchesSearch &&
                matchesStatus
            );

        });

    const listTotalAmount =
        filteredFees.reduce(
            (total, item) =>
                total +
                Number(
                    item.amount || 0
                ),
            0
        );

    return (

        <DashboardLayout>

            <div className="fees-page">

                <div className="fees-header">

                    <div>

                        <h1>
                            Student Fees
                        </h1>

                        <p>
                            Generate and manage student fee vouchers
                        </p>

                    </div>

                </div>

                {message && (

                    <div
                        className={
                            messageType === "error"
                                ? "fees-message error"
                                : "fees-message"
                        }
                    >

                        {message}

                        <button
                            onClick={() =>
                                setMessage("")
                            }
                        >
                            ×
                        </button>

                    </div>

                )}

                {step === 1 && (

                    <div className="fees-form-card">

                        <h2>
                            Fee Details
                        </h2>

                        <form
                            className="fees-form"
                            onSubmit={(e) => {

                                e.preventDefault();
                                handleContinue();

                            }}
                        >

                            <div className="fee-field">

                                <label>
                                    Student *
                                </label>

                                <select
                                    name="studentId"
                                    value={
                                        form.studentId
                                    }
                                    onChange={
                                        handleChange
                                    }
                                >

                                    <option value="">
                                        Select Student
                                    </option>

                                    {students.map(
                                        student => (

                                            <option
                                                key={
                                                    student.id
                                                }
                                                value={
                                                    student.id
                                                }
                                            >

                                                {student.id}
                                                {" - "}
                                                {
                                                    student.studentName
                                                }

                                            </option>

                                        )
                                    )}

                                </select>

                            </div>

                            <div className="fee-field">

                                <label>
                                    Fee Type *
                                </label>

                                <select
                                    name="feeTypeId"
                                    value={
                                        form.feeTypeId
                                    }
                                    onChange={
                                        handleChange
                                    }
                                >

                                    <option value="">
                                        Select Fee Type
                                    </option>

                                    {feeTypes.map(
                                        fee => (

                                            <option
                                                key={
                                                    fee.id
                                                }
                                                value={
                                                    fee.id
                                                }
                                            >

                                                {
                                                    fee.feeName
                                                }

                                                {" - Rs. "}

                                                {
                                                    Number(
                                                        fee.amount
                                                    ).toLocaleString()
                                                }

                                            </option>

                                        )
                                    )}

                                </select>

                            </div>

                            <div className="fee-field">

                                <label>
                                    Monthly Amount *
                                </label>

                                <input
                                    type="number"
                                    name="amount"
                                    value={
                                        form.amount
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    min="1"
                                />

                            </div>

                            <div className="fee-field">

                                <label>
                                    Month *
                                </label>

                                <FormControl fullWidth>

                                    <InputLabel>
                                        Select Month(s)
                                    </InputLabel>

                                    <Select
                                        multiple
                                        value={
                                            form.months
                                        }
                                        label="Select Month(s)"
                                        onChange={
                                            handleMonthChange
                                        }
                                        renderValue={
                                            selected =>
                                                selected.join(
                                                    ", "
                                                )
                                        }
                                    >

                                        {months.map(
                                            month => (

                                                <MenuItem
                                                    key={
                                                        month
                                                    }
                                                    value={
                                                        month
                                                    }
                                                >

                                                    <Checkbox
                                                        checked={
                                                            form.months.indexOf(
                                                                month
                                                            ) > -1
                                                        }
                                                    />

                                                    <ListItemText
                                                        primary={
                                                            month
                                                        }
                                                    />

                                                </MenuItem>

                                            )
                                        )}

                                    </Select>

                                </FormControl>

                            </div>

                            <div className="fee-field">

                                <label>
                                    Due Date
                                </label>

                                <input
                                    type="date"
                                    name="dueDate"
                                    value={
                                        form.dueDate
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />

                            </div>

                            <div className="fee-total-box">

                                <span>
                                    Selected Months
                                </span>

                                <strong>
                                    {
                                        form.months.length
                                    }
                                </strong>

                                <span>
                                    Monthly Amount
                                </span>

                                <strong>
                                    Rs.{" "}
                                    {
                                        monthlyAmount.toLocaleString()
                                    }
                                </strong>

                                <span>
                                    Total Amount
                                </span>

                                <strong>
                                    Rs.{" "}
                                    {
                                        totalAmount.toLocaleString()
                                    }
                                </strong>

                            </div>

                            <div className="fee-form-buttons">

                                <button
                                    type="submit"
                                    className="fee-save-btn"
                                >
                                    Continue →
                                </button>

                            </div>

                        </form>

                    </div>

                )}

                {step === 2 && (

                    <div className="fees-form-card">

                        <h2>
                            Review Fee Details
                        </h2>

                        <div className="fee-review-box">

                            <div className="fee-review-row">

                                <span>
                                    Student
                                </span>

                                <strong>
                                    {
                                        selectedStudent?.studentName ||
                                        "-"
                                    }
                                </strong>

                            </div>

                            <div className="fee-review-row">

                                <span>
                                    Student ID
                                </span>

                                <strong>
                                    {
                                        form.studentId ||
                                        "-"
                                    }
                                </strong>

                            </div>

                            <div className="fee-review-row">

                                <span>
                                    Fee Type
                                </span>

                                <strong>
                                    {
                                        selectedFeeType?.feeName ||
                                        "-"
                                    }
                                </strong>

                            </div>

                            <div className="fee-review-row">

                                <span>
                                    Monthly Amount
                                </span>

                                <strong>
                                    Rs.{" "}
                                    {
                                        monthlyAmount.toLocaleString()
                                    }
                                </strong>

                            </div>

                            <div className="fee-review-row">

                                <span>
                                    Selected Months
                                </span>

                                <strong>
                                    {
                                        form.months.join(
                                            ", "
                                        )
                                    }
                                </strong>

                            </div>

                            <div className="fee-review-row">

                                <span>
                                    Number of Months
                                </span>

                                <strong>
                                    {
                                        form.months.length
                                    }
                                </strong>

                            </div>

                            <div className="fee-review-row">

                                <span>
                                    Due Date
                                </span>

                                <strong>
                                    {
                                        form.dueDate ||
                                        "-"
                                    }
                                </strong>

                            </div>

                            <div className="fee-review-total">

                                <span>
                                    Total Amount
                                </span>

                                <strong>
                                    Rs.{" "}
                                    {
                                        totalAmount.toLocaleString()
                                    }
                                </strong>

                            </div>

                        </div>

                        <div className="fee-form-buttons">

                            <button
                                type="button"
                                className="delete-btn"
                                onClick={
                                    handleBack
                                }
                                disabled={loading}
                            >
                                ← Back
                            </button>

                            <button
                                type="button"
                                className="fee-save-btn"
                                onClick={
                                    handleSave
                                }
                                disabled={loading}
                            >

                                {loading
                                    ? "Saving..."
                                    : "Save & Generate Voucher"
                                }

                            </button>

                        </div>

                    </div>

                )}

                <div className="fees-table-card">

                    <div className="fees-table-header">

                        <div>

                            <h2>
                                Student Fee List
                            </h2>

                            <span>
                                {
                                    filteredFees.length
                                }
                                {" Records"}
                            </span>

                        </div>

                        <div className="fee-list-filters">

                            <input
                                type="text"
                                className="fee-search"
                                placeholder="Search Student ID, Name or Month..."
                                value={search}
                                onChange={
                                    e =>
                                        setSearch(
                                            e.target.value
                                        )
                                }
                            />

                            <select
                                className="fee-status-filter"
                                value={
                                    statusFilter
                                }
                                onChange={
                                    e =>
                                        setStatusFilter(
                                            e.target.value
                                        )
                                }
                            >

                                <option value="">
                                    All Status
                                </option>

                                <option value="Pending">
                                    Pending
                                </option>

                                <option value="Partial">
                                    Partial
                                </option>

                                <option value="Paid">
                                    Paid
                                </option>

                                <option value="Overdue">
                                    Overdue
                                </option>

                            </select>

                        </div>

                    </div>

                    <div className="fee-list-summary">

                        <div>

                            <span>
                                Total Records
                            </span>

                            <strong>
                                {
                                    filteredFees.length
                                }
                            </strong>

                        </div>

                        <div>

                            <span>
                                Total Amount
                            </span>

                            <strong>
                                Rs.{" "}
                                {
                                    listTotalAmount.toLocaleString()
                                }
                            </strong>

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
                                        Student ID
                                    </th>

                                    <th>
                                        Student
                                    </th>

                                    <th>
                                        Fee Type
                                    </th>

                                    <th>
                                        Month
                                    </th>

                                    <th>
                                        Amount
                                    </th>

                                    <th>
                                        Remaining
                                    </th>

                                    <th>
                                        Due Date
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

                                {filteredFees.length === 0 ? (

                                    <tr>

                                        <td
                                            colSpan="10"
                                            className="no-fees"
                                        >

                                            No fee records found.

                                        </td>

                                    </tr>

                                ) : (

                                    filteredFees.map(
                                        (
                                            item,
                                            index
                                        ) => (

                                            <tr
                                                key={
                                                    item.studentFees ||
                                                    `${item.studentId}-${item.month}-${index}`
                                                }
                                            >

                                                <td>
                                                    {
                                                        index + 1
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        item.studentId
                                                    }
                                                </td>

                                                <td className="fee-name">
                                                    {
                                                        item.studentName
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        item.feeName
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        item.month ||
                                                        "-"
                                                    }
                                                </td>

                                                <td>

                                                    <strong>
                                                        Rs.{" "}
                                                        {
                                                            Number(
                                                                item.amount || 0
                                                            ).toLocaleString()
                                                        }
                                                    </strong>

                                                </td>

                                                <td>

                                                    <strong>
                                                        Rs.{" "}
                                                        {
                                                            Number(
                                                                item.remainingAmount || 0
                                                            ).toLocaleString()
                                                        }
                                                    </strong>

                                                </td>

                                                <td>

                                                    {
                                                        item.dueDate
                                                            ? item.dueDate.substring(
                                                                0,
                                                                10
                                                            )
                                                            : "-"
                                                    }

                                                </td>

                                                <td>

                                                    <span
                                                        className={
                                                            String(
                                                                item.status || "Pending"
                                                            ).toLowerCase() === "paid"

                                                                ? "fee-status paid"

                                                                : String(
                                                                    item.status || ""
                                                                ).toLowerCase() === "overdue"

                                                                    ? "fee-status overdue"

                                                                    : String(
                                                                        item.status || ""
                                                                    ).toLowerCase() === "partial"

                                                                        ? "fee-status partial"

                                                                        : "fee-status pending"
                                                        }
                                                    >

                                                        {
                                                            item.status ||
                                                            "Pending"
                                                        }

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
                                    )

                                )}

                            </tbody>

                        </table>

                    </div>

                </div>

                <div className="fee-voucher-navigation">

                    <button
                        type="button"
                        className="fee-save-btn"
                        onClick={() =>
                            navigate(
                                "/fees/vouchers"
                            )
                        }
                    >
                        View Fee Vouchers →
                    </button>

                </div>

            </div>

        </DashboardLayout>

    );

}

export default StudentFees;
