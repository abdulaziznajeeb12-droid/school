import React, { useEffect, useState } from "react";

import {
    getRFIDStudents,
    getRFIDCards,
    assignRFIDCard,
    updateRFIDCard,
    deactivateRFIDCard,
    activateRFIDCard,
    deleteRFIDCard
} from "../../services/rfidCardService";
import "../../assets/rfid-card.css";
import DashboardLayout from "../../layouts/DashboardLayout";

const RFIDCardAssign = () => {

    const [students, setStudents] = useState([]);
    const [cards, setCards] = useState([]);

    const [userId, setUserId] = useState("");
    const [rfid, setRfid] = useState("");

    const [editingRfid, setEditingRfid] = useState(null);
    const [editIsActive, setEditIsActive] = useState(true);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("success");


    // ======================================================
    // LOAD STUDENTS
    // ======================================================

    const loadStudents = async () => {

        try {

            const data = await getRFIDStudents();

            setStudents(data || []);

        } catch (error) {

            setMessage(
                error.response?.data?.message ||
                "Students load nahi ho sake."
            );

            setMessageType("error");

        }
    };


    // ======================================================
    // LOAD CARDS
    // ======================================================

    const loadCards = async () => {

        try {

            const data = await getRFIDCards();

            setCards(data || []);

        } catch (error) {

            setMessage(
                error.response?.data?.message ||
                "RFID cards load nahi ho sake."
            );

            setMessageType("error");

        }
    };


    // ======================================================
    // INITIAL LOAD
    // ======================================================

    useEffect(() => {

        const loadData = async () => {

            setLoading(true);

            await Promise.all([
                loadStudents(),
                loadCards()
            ]);

            setLoading(false);
        };

        loadData();

    }, []);


    // ======================================================
    // ASSIGN RFID
    // ======================================================

    const handleAssign = async () => {

        if (!userId) {

            setMessage("Student select karein.");

            setMessageType("error");

            return;
        }


        if (!rfid.trim()) {

            setMessage("RFID card number required hai.");

            setMessageType("error");

            return;
        }


        try {

            setSaving(true);

            setMessage("");


            await assignRFIDCard({
                userId: Number(userId),
                rfid: rfid.trim().toUpperCase()
            });


            setMessage(
                "RFID card assigned successfully."
            );

            setMessageType("success");


            setUserId("");

            setRfid("");


            await loadCards();

        } catch (error) {

            setMessage(
                error.response?.data?.message ||
                "RFID card assign nahi ho saka."
            );

            setMessageType("error");

        } finally {

            setSaving(false);
        }
    };


    // ======================================================
    // START EDIT
    // ======================================================

    const handleEdit = (card) => {

        setEditingRfid(card.rfid);

        setRfid(card.rfid);

        setUserId(String(card.userId));

        setEditIsActive(card.isActive);

        setMessage("");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };


    // ======================================================
    // CANCEL EDIT
    // ======================================================

    const handleCancelEdit = () => {

        setEditingRfid(null);

        setRfid("");

        setUserId("");

        setEditIsActive(true);

        setMessage("");
    };


    // ======================================================
    // UPDATE RFID
    // ======================================================

    const handleUpdate = async () => {

        if (!rfid.trim()) {

            setMessage("RFID card number required hai.");

            setMessageType("error");

            return;
        }


        try {

            setSaving(true);

            setMessage("");


            await updateRFIDCard(
                editingRfid,
                {
                    rfid: rfid.trim().toUpperCase(),
                    isActive: editIsActive
                }
            );


            setMessage(
                "RFID card updated successfully."
            );

            setMessageType("success");


            setEditingRfid(null);

            setRfid("");

            setUserId("");

            setEditIsActive(true);


            await loadCards();

        } catch (error) {

            setMessage(
                error.response?.data?.message ||
                "RFID card update nahi ho saka."
            );

            setMessageType("error");

        } finally {

            setSaving(false);
        }
    };


    // ======================================================
    // DEACTIVATE RFID
    // ======================================================

    const handleDeactivate = async (rfid) => {

        if (!window.confirm(
            `Are you sure you want to deactivate RFID "${rfid}"?`
        )) {
            return;
        }


        try {

            setSaving(true);

            setMessage("");


            await deactivateRFIDCard(rfid);


            setMessage(
                "RFID card deactivated successfully."
            );

            setMessageType("success");


            await loadCards();

        } catch (error) {

            setMessage(
                error.response?.data?.message ||
                "RFID card deactivate nahi ho saka."
            );

            setMessageType("error");

        } finally {

            setSaving(false);
        }
    };


    // ======================================================
    // ACTIVATE RFID
    // ======================================================

    const handleActivate = async (rfid) => {

        if (!window.confirm(
            `Are you sure you want to activate RFID "${rfid}"?`
        )) {
            return;
        }


        try {

            setSaving(true);

            setMessage("");


            await activateRFIDCard(rfid);


            setMessage(
                "RFID card activated successfully."
            );

            setMessageType("success");


            await loadCards();

        } catch (error) {

            setMessage(
                error.response?.data?.message ||
                "RFID card activate nahi ho saka."
            );

            setMessageType("error");

        } finally {

            setSaving(false);
        }
    };


    // ======================================================
    // DELETE RFID
    // ======================================================

    const handleDelete = async (rfid) => {

        if (!window.confirm(
            `Are you sure you want to delete RFID "${rfid}"?`
        )) {
            return;
        }


        try {

            setSaving(true);

            setMessage("");


            await deleteRFIDCard(rfid);


            setMessage(
                "RFID card deleted successfully."
            );

            setMessageType("success");


            if (editingRfid === rfid) {
                handleCancelEdit();
            }


            await loadCards();

        } catch (error) {

            setMessage(
                error.response?.data?.message ||
                "RFID card delete nahi ho saka."
            );

            setMessageType("error");

        } finally {

            setSaving(false);
        }
    };


    // ======================================================
    // LOADING
    // ======================================================

    if (loading) {

        return (
            <div className="rfid-page">

                <div className="rfid-loading">
                    Loading...
                </div>

            </div>
        );
    }


    return (
        <DashboardLayout>

        <div className="rfid-page">


            {/* ==================================================
                PAGE HEADER
            ================================================== */}

            <div className="rfid-header">

                <div>
                    <h1>RFID Card Assignment</h1>

                    <p>
                        Assign and manage student RFID cards
                    </p>
                </div>

            </div>


            {/* ==================================================
                MESSAGE
            ================================================== */}

            {message && (

                <div
                    className={
                        messageType === "error"
                            ? "rfid-message error"
                            : "rfid-message success"
                    }
                >
                    {message}
                </div>

            )}


            {/* ==================================================
                FORM CARD
            ================================================== */}

            <div className="rfid-form-card">


                <div className="rfid-form-header">

                    <h2>
                        {editingRfid
                            ? "Edit RFID Card"
                            : "Assign RFID Card"
                        }
                    </h2>

                </div>


                <div className="rfid-form">


                    {/* ==================================================
                        STUDENT
                    ================================================== */}

                    <div className="rfid-form-group">

                        <label>
                            Student
                        </label>

                        <select
                            value={userId}
                            onChange={(e) =>
                                setUserId(e.target.value)
                            }
                            disabled={
                                !!editingRfid ||
                                saving
                            }
                        >

                            <option value="">
                                Select Student
                            </option>

                            {students.map((student) => (

                                <option
                                    key={student.userId}
                                    value={student.userId}
                                >
                                    {student.studentName}
                                </option>

                            ))}

                        </select>

                    </div>


                    {/* ==================================================
                        RFID
                    ================================================== */}

                    <div className="rfid-form-group">

                        <label>
                            RFID Card Number
                        </label>

                        <input
                            type="text"
                            value={rfid}
                            onChange={(e) =>
                                setRfid(
                                    e.target.value.toUpperCase()
                                )
                            }
                            placeholder="Enter RFID card number"
                            disabled={saving}
                        />

                    </div>


                    {/* ==================================================
                        STATUS - EDIT ONLY
                    ================================================== */}

                    {editingRfid && (

                        <div className="rfid-form-group">

                            <label>
                                Status
                            </label>

                            <select
                                value={
                                    editIsActive
                                        ? "true"
                                        : "false"
                                }
                                onChange={(e) =>
                                    setEditIsActive(
                                        e.target.value === "true"
                                    )
                                }
                                disabled={saving}
                            >

                                <option value="true">
                                    Active
                                </option>

                                <option value="false">
                                    Inactive
                                </option>

                            </select>

                        </div>

                    )}


                    {/* ==================================================
                        BUTTONS
                    ================================================== */}

                    <div className="rfid-form-buttons">


                        {editingRfid ? (

                            <>

                                <button
                                    type="button"
                                    className="rfid-btn update"
                                    onClick={handleUpdate}
                                    disabled={saving}
                                >
                                    {saving
                                        ? "Updating..."
                                        : "Update RFID"
                                    }
                                </button>


                                <button
                                    type="button"
                                    className="rfid-btn cancel"
                                    onClick={handleCancelEdit}
                                    disabled={saving}
                                >
                                    Cancel
                                </button>

                            </>

                        ) : (

                            <button
                                type="button"
                                className="rfid-btn assign"
                                onClick={handleAssign}
                                disabled={saving}
                            >
                                {saving
                                    ? "Assigning..."
                                    : "Assign RFID"
                                }
                            </button>

                        )}

                    </div>

                </div>

            </div>


            {/* ==================================================
                RFID CARDS TABLE
            ================================================== */}

            <div className="rfid-table-card">


                <div className="rfid-table-header">

                    <div>

                        <h2>
                            RFID Cards
                        </h2>

                        <p>
                            Total Cards: {cards.length}
                        </p>

                    </div>

                </div>


                <div className="rfid-table-wrapper">

                    <table className="rfid-table">

                        <thead>

                            <tr>

                                <th>
                                    #
                                </th>

                                <th>
                                    RFID
                                </th>

                                <th>
                                    Student ID
                                </th>

                                <th>
                                    Student Name
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

                            {cards.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="6"
                                        className="rfid-empty"
                                    >
                                        No RFID cards found.
                                    </td>

                                </tr>

                            ) : (

                                cards.map((card, index) => (

                                    <tr key={card.rfid}>

                                        <td>
                                            {index + 1}
                                        </td>

                                        <td>

                                            <strong>
                                                {card.rfid}
                                            </strong>

                                        </td>

                                        <td>
                                            {card.userId}
                                        </td>

                                        <td>
                                            {card.studentName}
                                        </td>

                                        <td>

                                            {card.isActive ? (

                                                <span className="rfid-status active">
                                                    Active
                                                </span>

                                            ) : (

                                                <span className="rfid-status inactive">
                                                    Inactive
                                                </span>

                                            )}

                                        </td>


                                        <td>

                                            <div className="rfid-actions">


                                                {/* EDIT */}

                                                <button
                                                    type="button"
                                                    className="rfid-action edit"
                                                    onClick={() =>
                                                        handleEdit(card)
                                                    }
                                                    disabled={saving}
                                                >
                                                    Edit
                                                </button>


                                                {/* ACTIVATE / DEACTIVATE */}

                                                {card.isActive ? (

                                                    <button
                                                        type="button"
                                                        className="rfid-action deactivate"
                                                        onClick={() =>
                                                            handleDeactivate(
                                                                card.rfid
                                                            )
                                                        }
                                                        disabled={saving}
                                                    >
                                                        Deactivate
                                                    </button>

                                                ) : (

                                                    <button
                                                        type="button"
                                                        className="rfid-action activate"
                                                        onClick={() =>
                                                            handleActivate(
                                                                card.rfid
                                                            )
                                                        }
                                                        disabled={saving}
                                                    >
                                                        Activate
                                                    </button>

                                                )}


                                                {/* DELETE */}

                                                <button
                                                    type="button"
                                                    className="rfid-action delete"
                                                    onClick={() =>
                                                        handleDelete(
                                                            card.rfid
                                                        )
                                                    }
                                                    disabled={saving}
                                                >
                                                    Delete
                                                </button>

                                            </div>

                                        </td>

                                    </tr>

                                ))

                            )}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>
        </DashboardLayout>
    );
};


export default RFIDCardAssign;