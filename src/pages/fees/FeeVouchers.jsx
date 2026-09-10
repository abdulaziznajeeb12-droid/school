import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";

import {
    getFeeVouchers,
    deleteFeeVoucher,
    getFeeVoucherById
} from "../../services/feesService";

import "../../assets/fees.css";

function FeeVouchers() {

    const [vouchers, setVouchers] = useState([]);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [message, setMessage] = useState("");

    const loadVouchers = async () => {

        try {

            const data = await getFeeVouchers();

            setVouchers(data || []);

        }
        catch (error) {

            console.error(error);

            setMessage(
                error.response?.data?.message ||
                "Unable to load vouchers."
            );

        }

    };

    useEffect(() => {

        loadVouchers();

    }, []);

    const handleDelete = async (id) => {

        if (
            !window.confirm(
                "Are you sure you want to delete this voucher?"
            )
        ) {
            return;
        }

        try {

            await deleteFeeVoucher(id);

            setMessage(
                "Voucher deleted successfully."
            );

            loadVouchers();

        }
        catch (error) {

            setMessage(
                error.response?.data?.message ||
                "Unable to delete voucher."
            );

        }

    };

    const printVoucher = async (id) => {

        try {

            const voucher =
                await getFeeVoucherById(id);

            const printWindow =
                window.open("", "_blank");

            printWindow.document.write(`

                <html>

                <head>

                    <title>
                        Fee Voucher
                    </title>

                    <style>

                        body {
                            font-family: Arial;
                            padding: 30px;
                        }

                        .voucher {
                            width: 700px;
                            margin: auto;
                            border: 2px solid #000;
                            padding: 25px;
                        }

                        h1, h2 {
                            text-align: center;
                        }

                        table {
                            width: 100%;
                            border-collapse: collapse;
                            margin-top: 20px;
                        }

                        th, td {
                            border: 1px solid #000;
                            padding: 10px;
                        }

                        .total {
                            font-size: 20px;
                            font-weight: bold;
                        }

                        .status {
                            font-weight: bold;
                            text-transform: uppercase;
                        }

                        .signature {
                            margin-top: 70px;
                            display: flex;
                            justify-content: space-between;
                        }

                    </style>

                </head>

                <body>

                    <div class="voucher">

                        <h1>
                            SCHOOL MANAGEMENT SYSTEM
                        </h1>

                        <h2>
                            FEE CHALLAN
                        </h2>

                        <hr>

                        <p>
                            <b>Voucher No:</b>
                            ${voucher.voucherNo}
                        </p>

                        <p>
                            <b>Student ID:</b>
                            ${voucher.studentId}
                        </p>

                        <p>
                            <b>Student:</b>
                            ${voucher.studentName}
                        </p>

                        <p>
                            <b>Month:</b>
                            ${voucher.month || "-"}
                        </p>

                        <p>
                            <b>Issue Date:</b>
                            ${voucher.issueDate?.substring(0, 10) || "-"}
                        </p>

                        <p>
                            <b>Due Date:</b>
                            ${voucher.dueDate?.substring(0, 10) || "-"}
                        </p>

                        <table>

                            <thead>

                                <tr>

                                    <th>
                                        Description
                                    </th>

                                    <th>
                                        Amount
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                <tr>

                                    <td>
                                        Student Fee
                                    </td>

                                    <td>
                                        Rs.
                                        ${Number(
                                            voucher.totalAmount
                                        ).toLocaleString()}
                                    </td>

                                </tr>

                                <tr>

                                    <td class="total">
                                        Total
                                    </td>

                                    <td class="total">
                                        Rs.
                                        ${Number(
                                            voucher.totalAmount
                                        ).toLocaleString()}
                                    </td>

                                </tr>

                            </tbody>

                        </table>

                        <p>
                            <b>Status:</b>
                            <span class="status">
                                ${voucher.status}
                            </span>
                        </p>

                        <div class="signature">

                            <span>
                                __________________
                                <br>
                                Student Signature
                            </span>

                            <span>
                                __________________
                                <br>
                                Authorized Signature
                            </span>

                        </div>

                    </div>

                </body>

                </html>

            `);

            printWindow.document.close();

            printWindow.print();

        }
        catch (error) {

            console.error(error);

            setMessage(
                "Unable to print voucher."
            );

        }

    };

    const filteredVouchers =
        vouchers.filter(item => {

            const keyword =
                search.toLowerCase().trim();

            const matchesSearch =
                String(item.voucherNo || "")
                    .toLowerCase()
                    .includes(keyword) ||

                String(item.studentId || "")
                    .includes(keyword) ||

                String(item.studentName || "")
                    .toLowerCase()
                    .includes(keyword) ||

                String(item.month || "")
                    .toLowerCase()
                    .includes(keyword);

            const matchesStatus =
                status === "" ||
                item.status === status;

            return (
                matchesSearch &&
                matchesStatus
            );

        });

    return (

        <DashboardLayout>

            <div className="fees-page">

                <div className="fees-header">

                    <div>

                        <h1>
                            Fee Vouchers
                        </h1>

                        <p>
                            Manage student fee challans
                        </p>

                    </div>

                </div>

                {message && (

                    <div className="fees-message">

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

                <div className="fees-table-card">

                    <div className="fees-table-header">

                        <div>

                            <h2>
                                Voucher List
                            </h2>

                            <span>
                                {filteredVouchers.length}
                                {" Records"}
                            </span>

                        </div>

                        <div className="fee-list-filters">

                            <input
                                type="text"
                                className="fee-search"
                                placeholder="Search Voucher, Student..."
                                value={search}
                                onChange={(e) =>
                                    setSearch(
                                        e.target.value
                                    )
                                }
                            />

                            <select
                                className="fee-status-filter"
                                value={status}
                                onChange={(e) =>
                                    setStatus(
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

                            </select>

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
                                        Voucher No
                                    </th>

                                    <th>
                                        Student
                                    </th>

                                    <th>
                                        Month
                                    </th>

                                    <th>
                                        Total
                                    </th>

                                    <th>
                                        Paid
                                    </th>

                                    <th>
                                        Remaining
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

                                {filteredVouchers.map(
                                    (item, index) => (

                                        <tr
                                            key={
                                                item.voucherId
                                            }
                                        >

                                            <td>
                                                {index + 1}
                                            </td>

                                            <td>
                                                <strong>
                                                    {item.voucherNo}
                                                </strong>
                                            </td>

                                            <td>
                                                {item.studentName}
                                            </td>

                                            <td>
                                                {item.month || "-"}
                                            </td>

                                            <td>
                                                Rs.{" "}
                                                {Number(
                                                    item.totalAmount
                                                ).toLocaleString()}
                                            </td>

                                            <td>
                                                Rs.{" "}
                                                {Number(
                                                    item.paidAmount
                                                ).toLocaleString()}
                                            </td>

                                            <td>
                                                Rs.{" "}
                                                {Number(
                                                    item.remainingAmount
                                                ).toLocaleString()}
                                            </td>

                                            <td>

                                                <span
                                                    className={
                                                        item.status === "Paid"
                                                            ? "fee-status paid"
                                                            : item.status === "Partial"
                                                                ? "fee-status partial"
                                                                : "fee-status pending"
                                                    }
                                                >
                                                    {item.status}
                                                </span>

                                            </td>

                                            <td>

                                                <div className="user-action-buttons">

                                                    {item.status !== "Paid" && (

                                                        <button
                                                            className="edit-btn"
                                                            onClick={() =>
                                                                window.location.href =
                                                                `/fees/pay/${item.voucherId}`
                                                            }
                                                        >
                                                            Pay
                                                        </button>

                                                    )}

                                                    <button
                                                        className="view-btn"
                                                        onClick={() =>
                                                            printVoucher(
                                                                item.voucherId
                                                            )
                                                        }
                                                    >
                                                        Print
                                                    </button>

                                                    {item.paidAmount === 0 && (

                                                        <button
                                                            className="delete-btn"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    item.voucherId
                                                                )
                                                            }
                                                        >
                                                            Delete
                                                        </button>

                                                    )}

                                                </div>

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

export default FeeVouchers;