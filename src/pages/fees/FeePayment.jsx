
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import DashboardLayout from "../../layouts/DashboardLayout";

import {
    getFeeVoucherById,
    payFeeVoucher,
    getPaymentReceipt
} from "../../services/feesService";

import "../../assets/fees.css";

function FeePayment() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [voucher, setVoucher] = useState(null);

    const [receipt, setReceipt] = useState(null);

    const [form, setForm] = useState({
        paidAmount: "",
        paymentDate:
            new Date().toISOString().substring(0, 10),
        paymentMethod: "Cash",
        referenceNo: "",
        remarks: ""
    });

    const [message, setMessage] = useState("");

    const [loading, setLoading] = useState(false);

    const [printing, setPrinting] = useState(false);


    // =====================================================
    // LOAD VOUCHER
    // =====================================================

    const loadVoucher = async () => {

        try {

            const data =
                await getFeeVoucherById(id);

            setVoucher(data);

        }
        catch (error) {

            console.error(
                "Load voucher error:",
                error
            );

            setMessage(
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Unable to load voucher."
            );

        }

    };


    useEffect(() => {

        loadVoucher();

    }, [id]);


    // =====================================================
    // INPUT CHANGE
    // =====================================================

    const handleChange = (e) => {

        const {
            name,
            value
        } = e.target;

        setForm(previous => ({
            ...previous,
            [name]: value
        }));

    };


    // =====================================================
    // PRINT RECEIPT
    // =====================================================

    const handlePrint = async () => {

        if (!receipt) {

            setMessage(
                "Receipt data not available."
            );

            return;

        }

        try {

            setPrinting(true);

            const printWindow =
                window.open(
                    "",
                    "_blank",
                    "width=800,height=900"
                );

            if (!printWindow) {

                setMessage(
                    "Please allow pop-ups to print the receipt."
                );

                return;

            }


            const months =
                Array.isArray(receipt.months)
                    ? receipt.months
                    : [];


            const monthsHtml =
                months.length > 0

                    ? months
                        .map(
                            month =>
                                `<span class="month">${month}</span>`
                        )
                        .join("")

                    : `<span class="month">-</span>`;


            const totalAmount =
                Number(
                    receipt.totalAmount || 0
                );


            const thisPayment =
                Number(
                    receipt.paymentAmount || 0
                );


            const totalPaid =
                Number(
                    receipt.paidAmount || 0
                );


            const remainingAmount =
                Number(
                    receipt.remainingAmount || 0
                );


            const status =
                String(
                    receipt.status || "Pending"
                );


            const paymentDate =
                receipt.paymentDate
                    ? String(
                        receipt.paymentDate
                    ).substring(0, 10)
                    : "-";


            printWindow.document.write(`

                <!DOCTYPE html>

                <html>

                <head>

                    <title>
                        Fee Receipt - ${receipt.voucherNo || ""}
                    </title>

                    <style>

                        * {
                            box-sizing: border-box;
                        }

                        body {
                            margin: 0;
                            padding: 30px;
                            font-family: Arial, Helvetica, sans-serif;
                            background: white;
                            color: #111;
                        }

                        .receipt {
                            width: 100%;
                            max-width: 700px;
                            margin: 0 auto;
                            border: 2px solid #111;
                            padding: 30px;
                        }

                        .header {
                            text-align: center;
                            border-bottom: 2px solid #111;
                            padding-bottom: 18px;
                            margin-bottom: 20px;
                        }

                        .header h1 {
                            margin: 0;
                            font-size: 28px;
                            text-transform: uppercase;
                        }

                        .header p {
                            margin: 6px 0 0;
                            font-size: 14px;
                        }

                        .receipt-title {
                            text-align: center;
                            margin: 15px 0 25px;
                        }

                        .receipt-title h2 {
                            margin: 0;
                            font-size: 22px;
                            text-transform: uppercase;
                        }

                        .info-grid {
                            display: grid;
                            grid-template-columns: 1fr 1fr;
                            gap: 12px 25px;
                            margin-bottom: 25px;
                        }

                        .info-item {
                            border-bottom: 1px solid #ddd;
                            padding-bottom: 8px;
                        }

                        .label {
                            display: block;
                            font-size: 12px;
                            color: #666;
                            margin-bottom: 4px;
                        }

                        .value {
                            display: block;
                            font-size: 15px;
                            font-weight: bold;
                        }

                        .months-section {
                            margin: 20px 0;
                        }

                        .months-section h3 {
                            margin: 0 0 10px;
                            font-size: 15px;
                        }

                        .months {
                            display: flex;
                            flex-wrap: wrap;
                            gap: 8px;
                        }

                        .month {
                            border: 1px solid #333;
                            padding: 7px 12px;
                            font-size: 13px;
                        }

                        .amount-table {
                            width: 100%;
                            border-collapse: collapse;
                            margin-top: 20px;
                        }

                        .amount-table td {
                            border: 1px solid #ccc;
                            padding: 12px;
                            font-size: 15px;
                        }

                        .amount-table td:first-child {
                            font-weight: bold;
                        }

                        .amount-table td:last-child {
                            text-align: right;
                            font-weight: bold;
                        }

                        .status {
                            text-align: center;
                            margin: 20px 0;
                            padding: 12px;
                            border: 2px solid #111;
                            font-size: 18px;
                            font-weight: bold;
                            text-transform: uppercase;
                        }

                        .remarks {
                            margin-top: 20px;
                            padding: 12px;
                            border: 1px solid #ccc;
                            font-size: 13px;
                        }

                        .footer {
                            margin-top: 35px;
                            padding-top: 15px;
                            border-top: 1px solid #aaa;
                            text-align: center;
                            font-size: 12px;
                            color: #666;
                        }

                        @media print {

                            body {
                                padding: 0;
                            }

                            .receipt {
                                border: 2px solid #111;
                            }

                        }

                    </style>

                </head>

                <body>

                    <div class="receipt">

                        <div class="header">

                            <h1>
                                School Management System
                            </h1>

                            <p>
                                Official Fee Payment Receipt
                            </p>

                        </div>


                        <div class="receipt-title">

                            <h2>
                                Fee Receipt
                            </h2>

                        </div>


                        <div class="info-grid">

                            <div class="info-item">

                                <span class="label">
                                    Voucher No
                                </span>

                                <span class="value">
                                    ${receipt.voucherNo || "-"}
                                </span>

                            </div>


                            <div class="info-item">

                                <span class="label">
                                    Student ID
                                </span>

                                <span class="value">
                                    ${receipt.studentId || "-"}
                                </span>

                            </div>


                            <div class="info-item">

                                <span class="label">
                                    Student Name
                                </span>

                                <span class="value">
                                    ${receipt.studentName || "-"}
                                </span>

                            </div>


                            <div class="info-item">

                                <span class="label">
                                    Payment Date
                                </span>

                                <span class="value">
                                    ${paymentDate}
                                </span>

                            </div>


                            <div class="info-item">

                                <span class="label">
                                    Payment Method
                                </span>

                                <span class="value">
                                    ${receipt.paymentMethod || "-"}
                                </span>

                            </div>


                            <div class="info-item">

                                <span class="label">
                                    Reference No
                                </span>

                                <span class="value">
                                    ${receipt.referenceNo || "-"}
                                </span>

                            </div>

                        </div>


                        <div class="months-section">

                            <h3>
                                Fee Months
                            </h3>

                            <div class="months">

                                ${monthsHtml}

                            </div>

                        </div>


                        <table class="amount-table">

                            <tbody>

                                <tr>

                                    <td>
                                        Total Amount
                                    </td>

                                    <td>
                                        Rs. ${totalAmount.toLocaleString()}
                                    </td>

                                </tr>


                                <tr>

                                    <td>
                                        This Payment
                                    </td>

                                    <td>
                                        Rs. ${thisPayment.toLocaleString()}
                                    </td>

                                </tr>


                                <tr>

                                    <td>
                                        Total Paid
                                    </td>

                                    <td>
                                        Rs. ${totalPaid.toLocaleString()}
                                    </td>

                                </tr>


                                <tr>

                                    <td>
                                        Remaining
                                    </td>

                                    <td>
                                        Rs. ${remainingAmount.toLocaleString()}
                                    </td>

                                </tr>

                            </tbody>

                        </table>


                        <div class="status">

                            Status:
                            ${status}

                        </div>


                        ${
                            receipt.remarks
                                ? `
                                    <div class="remarks">

                                        <strong>
                                            Remarks:
                                        </strong>

                                        ${receipt.remarks}

                                    </div>
                                `
                                : ""
                        }


                        <div class="footer">

                            <p>
                                This is a computer generated receipt.
                            </p>

                            <p>
                                Thank you.

                            </p>

                        </div>

                    </div>


                    <script>

                        window.onload = function () {

                            window.print();

                        };

                        window.onafterprint = function () {

                            window.close();

                        };

                    </script>

                </body>

                </html>

            `);

            printWindow.document.close();

        }
        catch (error) {

            console.error(
                "Print error:",
                error
            );

            setMessage(
                "Unable to print receipt."
            );

        }
        finally {

            setPrinting(false);

        }

    };


    // =====================================================
    // LOAD RECEIPT
    // =====================================================

    const loadReceipt = async (paymentId) => {

        try {

            const data =
                await getPaymentReceipt(
                    paymentId
                );

            setReceipt(data);

            return data;

        }
        catch (error) {

            console.error(
                "Load receipt error:",
                error
            );

            setMessage(
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Unable to load payment receipt."
            );

            return null;

        }

    };


    // =====================================================
    // PAYMENT SUBMIT
    // =====================================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!voucher) {
            return;
        }


        const amount =
            Number(
                form.paidAmount
            );


        const remaining =
            Number(
                voucher.remainingAmount || 0
            );


        if (!form.paidAmount) {

            setMessage(
                "Please enter payment amount."
            );

            return;

        }


        if (amount <= 0) {

            setMessage(
                "Payment amount must be greater than zero."
            );

            return;

        }


        if (amount > remaining) {

            setMessage(
                `Payment cannot be greater than remaining amount of Rs. ${remaining.toLocaleString()}.`
            );

            return;

        }


        try {

            setLoading(true);

            setMessage("");


            const response =
                await payFeeVoucher({

                    voucherId:
                        Number(id),

                    paidAmount:
                        amount,

                    paymentDate:
                        form.paymentDate,

                    paymentMethod:
                        form.paymentMethod,

                    referenceNo:
                        form.referenceNo,

                    remarks:
                        form.remarks

                });


            const paymentId =
                response?.paymentId;


            await loadVoucher();


            setForm(previous => ({

                ...previous,

                paidAmount: "",

                referenceNo: "",

                remarks: ""

            }));


            if (paymentId) {

                const receiptData =
                    await loadReceipt(
                        paymentId
                    );


                if (receiptData) {

                    setMessage(
                        "Payment recorded successfully. Receipt is ready to print."
                    );

                }

            }
            else {

                setMessage(
                    "Payment recorded successfully."
                );

            }

        }
        catch (error) {

            console.error(
                "Payment error:",
                error.response?.data ||
                error
            );

            setMessage(
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Unable to record payment."
            );

        }
        finally {

            setLoading(false);

        }

    };


    // =====================================================
    // LOADING
    // =====================================================

    if (!voucher) {

        return (

            <DashboardLayout>

                <div className="fees-page">

                    <h2>
                        Loading voucher...
                    </h2>

                </div>

            </DashboardLayout>

        );

    }


    // =====================================================
    // VALUES
    // =====================================================

    const totalAmount =
        Number(
            voucher.totalAmount || 0
        );


    const paidAmount =
        Number(
            voucher.paidAmount || 0
        );


    const remainingAmount =
        Number(
            voucher.remainingAmount || 0
        );


    const isPaid =
        String(
            voucher.status || ""
        ).toLowerCase() === "paid";


    const voucherMonths =
        Array.isArray(voucher.months)
            ? voucher.months
            : [];


    return (

        <DashboardLayout>

            <div className="fees-page">

                <div className="fees-header">

                    <div>

                        <h1>
                            Fee Payment
                        </h1>

                        <p>
                            Record student fee payment
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


                <div className="fees-form-card">

                    <h2>
                        Voucher Information
                    </h2>


                    <div className="fee-list-summary">

                        <div>

                            <span>
                                Voucher
                            </span>

                            <strong>
                                {
                                    voucher.voucherNo ||
                                    "-"
                                }
                            </strong>

                        </div>


                        <div>

                            <span>
                                Student
                            </span>

                            <strong>
                                {
                                    voucher.studentName ||
                                    "-"
                                }
                            </strong>

                        </div>


                        <div>

                            <span>
                                Total
                            </span>

                            <strong>
                                Rs.{" "}
                                {
                                    totalAmount.toLocaleString()
                                }
                            </strong>

                        </div>


                        <div>

                            <span>
                                Already Paid
                            </span>

                            <strong>
                                Rs.{" "}
                                {
                                    paidAmount.toLocaleString()
                                }
                            </strong>

                        </div>


                        <div>

                            <span>
                                Remaining
                            </span>

                            <strong>
                                Rs.{" "}
                                {
                                    remainingAmount.toLocaleString()
                                }
                            </strong>

                        </div>


                        <div>

                            <span>
                                Status
                            </span>

                            <strong>
                                {
                                    voucher.status ||
                                    "Pending"
                                }
                            </strong>

                        </div>

                    </div>


                    <div className="fee-review-box">

                        <div className="fee-review-row">

                            <span>
                                Months
                            </span>

                            <strong>

                                {
                                    voucherMonths.length > 0
                                        ? voucherMonths.join(", ")
                                        : voucher.month || "-"
                                }

                            </strong>

                        </div>

                    </div>


                    {isPaid ? (

                        <div className="fee-review-box">

                            <div className="fee-review-total">

                                <span>
                                    Payment Complete
                                </span>

                                <strong>
                                    Rs.{" "}
                                    {
                                        paidAmount.toLocaleString()
                                    }
                                </strong>

                            </div>

                        </div>

                    ) : (

                        <form
                            className="fees-form"
                            onSubmit={
                                handleSubmit
                            }
                        >

                            <div className="fee-field">

                                <label>
                                    Pay Amount *
                                </label>

                                <input
                                    type="number"
                                    name="paidAmount"
                                    value={
                                        form.paidAmount
                                    }
                                    min="1"
                                    max={
                                        remainingAmount
                                    }
                                    step="1"
                                    onChange={
                                        handleChange
                                    }
                                    placeholder={
                                        `Maximum Rs. ${remainingAmount.toLocaleString()}`
                                    }
                                />

                            </div>


                            <div className="fee-field">

                                <label>
                                    Payment Date *
                                </label>

                                <input
                                    type="date"
                                    name="paymentDate"
                                    value={
                                        form.paymentDate
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />

                            </div>


                            <div className="fee-field">

                                <label>
                                    Payment Method
                                </label>

                                <select
                                    name="paymentMethod"
                                    value={
                                        form.paymentMethod
                                    }
                                    onChange={
                                        handleChange
                                    }
                                >

                                    <option value="Cash">
                                        Cash
                                    </option>

                                    <option value="Bank">
                                        Bank
                                    </option>

                                    <option value="Online">
                                        Online
                                    </option>

                                    <option value="Cheque">
                                        Cheque
                                    </option>

                                </select>

                            </div>


                            <div className="fee-field">

                                <label>
                                    Reference No
                                </label>

                                <input
                                    type="text"
                                    name="referenceNo"
                                    value={
                                        form.referenceNo
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />

                            </div>


                            <div className="fee-field">

                                <label>
                                    Remarks
                                </label>

                                <input
                                    type="text"
                                    name="remarks"
                                    value={
                                        form.remarks
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />

                            </div>


                            <div className="fee-form-buttons">

                                <button
                                    type="button"
                                    className="delete-btn"
                                    onClick={() =>
                                        navigate(
                                            "/fees/vouchers"
                                        )
                                    }
                                >
                                    Back
                                </button>


                                <button
                                    type="submit"
                                    className="fee-save-btn"
                                    disabled={
                                        loading ||
                                        remainingAmount <= 0
                                    }
                                >

                                    {
                                        loading
                                            ? "Processing..."
                                            : "Confirm Payment"
                                    }

                                </button>

                            </div>

                        </form>

                    )}


                    {receipt && (

                        <div
                            className="fee-review-box"
                            style={{
                                marginTop: "25px"
                            }}
                        >

                            <h2>
                                Payment Receipt
                            </h2>


                            <div className="fee-review-row">

                                <span>
                                    Voucher No
                                </span>

                                <strong>
                                    {
                                        receipt.voucherNo ||
                                        "-"
                                    }
                                </strong>

                            </div>


                            <div className="fee-review-row">

                                <span>
                                    Student
                                </span>

                                <strong>
                                    {
                                        receipt.studentName ||
                                        "-"
                                    }
                                </strong>

                            </div>


                            <div className="fee-review-row">

                                <span>
                                    Months
                                </span>

                                <strong>
                                    {
                                        Array.isArray(
                                            receipt.months
                                        )
                                            ? receipt.months.join(", ")
                                            : "-"
                                    }
                                </strong>

                            </div>


                            <div className="fee-review-row">

                                <span>
                                    Total Amount
                                </span>

                                <strong>
                                    Rs.{" "}
                                    {
                                        Number(
                                            receipt.totalAmount || 0
                                        ).toLocaleString()
                                    }
                                </strong>

                            </div>


                            <div className="fee-review-row">

                                <span>
                                    This Payment
                                </span>

                                <strong>
                                    Rs.{" "}
                                    {
                                        Number(
                                            receipt.paymentAmount || 0
                                        ).toLocaleString()
                                    }
                                </strong>

                            </div>


                            <div className="fee-review-row">

                                <span>
                                    Total Paid
                                </span>

                                <strong>
                                    Rs.{" "}
                                    {
                                        Number(
                                            receipt.paidAmount || 0
                                        ).toLocaleString()
                                    }
                                </strong>

                            </div>


                            <div className="fee-review-row">

                                <span>
                                    Remaining
                                </span>

                                <strong>
                                    Rs.{" "}
                                    {
                                        Number(
                                            receipt.remainingAmount || 0
                                        ).toLocaleString()
                                    }
                                </strong>

                            </div>


                            <div className="fee-review-row">

                                <span>
                                    Status
                                </span>

                                <strong>
                                    {
                                        receipt.status ||
                                        "Pending"
                                    }
                                </strong>

                            </div>


                            <div
                                className="fee-form-buttons"
                                style={{
                                    marginTop: "20px"
                                }}
                            >

                                <button
                                    type="button"
                                    className="fee-save-btn"
                                    onClick={
                                        handlePrint
                                    }
                                    disabled={
                                        printing
                                    }
                                >

                                    {
                                        printing
                                            ? "Preparing..."
                                            : "🖨 Print Receipt"
                                    }

                                </button>

                            </div>

                        </div>

                    )}

                </div>

            </div>

        </DashboardLayout>

    );

}

export default FeePayment;
