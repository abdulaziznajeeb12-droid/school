import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import DashboardLayout from "../../layouts/DashboardLayout";
import "../../assets/dashboard.css";

import {
    getExamTypeById,
    addExamType,
    updateExamType
} from "../../services/examService";

function ExamTypeForm() {

    const navigate = useNavigate();
    const { id } = useParams();

    const isEdit = Boolean(id);

    const [examName, setExamName] = useState("");
    const [weightAge, setWeightAge] = useState("");

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {

        if (isEdit) {
            loadExamType();
        }

    }, [id]);

    const loadExamType = async () => {

        try {

            setLoading(true);

            const data = await getExamTypeById(id);

            setExamName(data.examName || "");

            setWeightAge(
                data.weightAge != null
                    ? String(data.weightAge)
                    : ""
            );

        } catch (error) {

            console.log(error);

            alert(
                error.response?.data?.message ||
                "Unable to load Exam Type."
            );

        } finally {

            setLoading(false);

        }

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!examName.trim()) {
            alert("Exam Name is required.");
            return;
        }

        try {

            setSaving(true);

            const payload = {
                examName: examName.trim(),
                weightAge: weightAge
                    ? Number(weightAge)
                    : null
            };

            if (isEdit) {

                await updateExamType(
                    Number(id),
                    payload
                );

                alert("Exam Type updated successfully.");

            } else {

                await addExamType(payload);

                alert("Exam Type added successfully.");

            }

            navigate("/examtypes");

        } catch (error) {

            console.log(error);

            alert(
                error.response?.data?.message ||
                "Unable to save Exam Type."
            );

        } finally {

            setSaving(false);

        }

    };

    if (loading) {

        return (
            <DashboardLayout>

                <div className="form-container">
                    <h2>Loading...</h2>
                </div>

            </DashboardLayout>
        );

    }

    return (

        <DashboardLayout>

            <div className="form-container">

                <h2 className="main-heading">

                    {isEdit
                        ? "Edit Exam Type"
                        : "Add Exam Type"}

                </h2>

                <form onSubmit={handleSubmit}>

                    <div className="form-grid">

                        <div className="form-group">

                            <label>
                                Exam Name
                            </label>

                            <input
                                type="text"
                                value={examName}
                                onChange={(e) =>
                                    setExamName(
                                        e.target.value
                                    )
                                }
                                placeholder="Enter Exam Name"
                                required
                            />

                        </div>

                        <div className="form-group">

                            <label>
                                Weightage (%)
                            </label>

                            <input
                                type="number"
                                min="0"
                                value={weightAge}
                                onChange={(e) =>
                                    setWeightAge(
                                        e.target.value
                                    )
                                }
                                placeholder="Enter Weightage"
                            />

                        </div>

                    </div>

                    <div className="form-buttons">

                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={() =>
                                navigate("/examtypes")
                            }
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="save-btn"
                            disabled={saving}
                        >
                            {saving
                                ? "Saving..."
                                : isEdit
                                    ? "Update Exam Type"
                                    : "Save Exam Type"}
                        </button>

                    </div>

                </form>

            </div>

        </DashboardLayout>

    );

}

export default ExamTypeForm;