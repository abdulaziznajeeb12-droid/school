import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";

import {
    getFeeTypes,
    addFeeType,
    updateFeeType,
    deleteFeeType
} from "../../services/feesService";

import "../../assets/fees.css";

function FeeTypes() {

    const [feeTypes, setFeeTypes] = useState([]);

    const [form, setForm] = useState({
        id: null,
        feeName: "",
        amount: "",
        description: ""
    });

    const [editing, setEditing] = useState(false);

    const [message, setMessage] = useState("");

    const loadFeeTypes = async () => {

        try {

            const data = await getFeeTypes();

            setFeeTypes(data || []);

        } catch (error) {

            console.error(error);

            setMessage("Unable to load fee types.");

        }
    };


    useEffect(() => {

        loadFeeTypes();

    }, []);


    const handleChange = (e) => {

        const { name, value } = e.target;

        setForm({
            ...form,
            [name]: value
        });

    };


    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!form.feeName || !form.amount) {

            setMessage(
                "Fee name and amount are required."
            );

            return;
        }

        try {

            if (editing) {

                await updateFeeType({

                    id: Number(form.id),

                    feeName: form.feeName,

                    amount: Number(form.amount),

                    description: form.description || null

                });

                setMessage(
                    "Fee type updated successfully."
                );

            } else {

                await addFeeType({

                    feeName: form.feeName,

                    amount: Number(form.amount),

                    description: form.description || null

                });

                setMessage(
                    "Fee type added successfully."
                );
            }

            resetForm();

            loadFeeTypes();

        } catch (error) {

            console.error(error);

            setMessage(
                error.response?.data?.message ||
                error.response?.data ||
                "Something went wrong."
            );

        }
    };


    const handleEdit = (item) => {

        setForm({

            id: item.id,

            feeName: item.feeName,

            amount: item.amount,

            description: item.description || ""

        });

        setEditing(true);

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };


    const handleDelete = async (id) => {

        if (
            !window.confirm(
                "Are you sure you want to delete this fee type?"
            )
        ) {
            return;
        }

        try {

            await deleteFeeType(id);

            setMessage(
                "Fee type deleted successfully."
            );

            loadFeeTypes();

        } catch (error) {

            console.error(error);

            setMessage(
                error.response?.data?.message ||
                error.response?.data ||
                "Unable to delete fee type."
            );
        }
    };


    const resetForm = () => {

        setForm({

            id: null,

            feeName: "",

            amount: "",

            description: ""

        });

        setEditing(false);
    };


    return (

        <DashboardLayout>

            <div className="fees-page">

                <div className="fees-header">

                    <div>

                        <h1>Fee Types</h1>

                        <p>
                            Manage school fee types
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

                        {editing
                            ? "Edit Fee Type"
                            : "Add Fee Type"
                        }

                    </h2>


                    <form
                        onSubmit={handleSubmit}
                        className="fees-form"
                    >

                        <div className="fee-field">

                            <label>
                                Fee Name *
                            </label>

                            <input
                                type="text"
                                name="feeName"
                                value={form.feeName}
                                onChange={handleChange}
                                placeholder="e.g. Tuition Fee"
                            />

                        </div>


                        <div className="fee-field">

                            <label>
                                Amount *
                            </label>

                            <input
                                type="number"
                                name="amount"
                                value={form.amount}
                                onChange={handleChange}
                                placeholder="Enter amount"
                            />

                        </div>


                        <div className="fee-field">

                            <label>
                                Description
                            </label>

                            <textarea
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                placeholder="Enter description"
                            />

                        </div>


                        <div className="fee-form-buttons">

                            <button
                                type="submit"
                                className="fee-save-btn"
                            >

                                {editing
                                    ? "Update Fee Type"
                                    : "Add Fee Type"
                                }

                            </button>


                            {editing && (

                                <button
                                    type="button"
                                    className="fee-cancel-btn"
                                    onClick={resetForm}
                                >

                                    Cancel

                                </button>

                            )}

                        </div>

                    </form>

                </div>


                {/* TABLE */}

                <div className="fees-table-card">

                    <div className="fees-table-header">

                        <div>

                            <h2>
                                Fee Types
                            </h2>

                            <span>
                                {feeTypes.length} Fee Types
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
                                        Fee Name
                                    </th>

                                    <th>
                                        Amount
                                    </th>

                                    <th>
                                        Description
                                    </th>

                                    <th>
                                        Action
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {feeTypes.map(
                                    (item, index) => (

                                        <tr key={item.id}>

                                            <td>
                                                {index + 1}
                                            </td>

                                            <td className="fee-name">
                                                {item.feeName}
                                            </td>

                                            <td>
                                                Rs. {item.amount}
                                            </td>

                                            <td>
                                                {item.description || "-"}
                                            </td>

                                            <td>

                                                <button
                                                    className="edit-btn"
                                                    onClick={() =>
                                                        handleEdit(item)
                                                    }
                                                >
                                                    Edit
                                                </button>


                                                <button
                                                    className="delete-btn"
                                                    onClick={() =>
                                                        handleDelete(item.id)
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

export default FeeTypes;        