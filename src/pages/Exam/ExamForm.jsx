import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import DashboardLayout from "../../layouts/DashboardLayout";
import "../../assets/dashboard.css";

import {
    getExamById,
    addExam,
    updateExam,
    getExamTypesDropdown,
    getExamSubjects,
    getExamClasses,
    getExamSections
} from "../../services/examService";

function ExamForm() {

    const navigate = useNavigate();
    const { id } = useParams();

    const isEdit = Boolean(id);

    const [examTypes, setExamTypes] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [classes, setClasses] = useState([]);
    const [sections, setSections] = useState([]);

    const [examTypeId, setExamTypeId] = useState("");
    const [subjectId, setSubjectId] = useState("");
    const [classId, setClassId] = useState("");
    const [sectionId, setSectionId] = useState("");
    const [examDate, setExamDate] = useState("");

    const [obtainMarks, setObtainMarks] = useState("");
    const [totalMarks, setTotalMarks] = useState("");
    const [passingMarks, setPassingMarks] = useState("");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {

        loadData();

    }, [id]);

    const loadData = async () => {

        try {

            setLoading(true);

            const [
                examTypeData,
                subjectData,
                classData
            ] = await Promise.all([
                getExamTypesDropdown(),
                getExamSubjects(),
                getExamClasses()
            ]);

            setExamTypes(
                Array.isArray(examTypeData)
                    ? examTypeData
                    : []
            );

            setSubjects(
                Array.isArray(subjectData)
                    ? subjectData
                    : []
            );

            setClasses(
                Array.isArray(classData)
                    ? classData
                    : []
            );

            if (isEdit) {

                const data = await getExamById(id);

                setExamTypeId(
                    data.examTypeId != null
                        ? String(data.examTypeId)
                        : ""
                );

                setSubjectId(
                    data.subjectId != null
                        ? String(data.subjectId)
                        : ""
                );

                setClassId(
                    data.classId != null
                        ? String(data.classId)
                        : ""
                );

                setSectionId(
                    data.sectionId != null
                        ? String(data.sectionId)
                        : ""
                );

                setExamDate(
                    data.examDate
                        ? String(data.examDate).substring(0, 10)
                        : ""
                );

                setObtainMarks(
                    data.obtainMarks != null
                        ? String(data.obtainMarks)
                        : ""
                );

                setTotalMarks(
                    data.totalMarks != null
                        ? String(data.totalMarks)
                        : ""
                );

                setPassingMarks(
                    data.passingMarks != null
                        ? String(data.passingMarks)
                        : ""
                );

                if (data.classId) {

                    const sectionData =
                        await getExamSections(
                            data.classId
                        );

                    setSections(
                        Array.isArray(sectionData)
                            ? sectionData
                            : []
                    );

                }

            }

        } catch (error) {

            console.log(error);

            alert(
                error.response?.data?.message ||
                "Unable to load Exam."
            );

        } finally {

            setLoading(false);

        }

    };

    const handleClassChange = async (value) => {

        setClassId(value);

        setSectionId("");

        setSections([]);

        if (!value) {
            return;
        }

        try {

            const data =
                await getExamSections(value);

            setSections(
                Array.isArray(data)
                    ? data
                    : []
            );

        } catch (error) {

            console.log(error);

        }

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!examTypeId) {
            alert("Please select Exam Type.");
            return;
        }

        if (!subjectId) {
            alert("Please select Subject.");
            return;
        }

        if (!classId) {
            alert("Please select Class.");
            return;
        }

        if (!sectionId) {
            alert("Please select Section.");
            return;
        }

        if (!examDate) {
            alert("Please select Exam Date.");
            return;
        }

        if (
            totalMarks &&
            passingMarks &&
            Number(passingMarks) > Number(totalMarks)
        ) {
            alert(
                "Passing Marks cannot be greater than Total Marks."
            );
            return;
        }

        if (
            totalMarks &&
            obtainMarks &&
            Number(obtainMarks) > Number(totalMarks)
        ) {
            alert(
                "Obtained Marks cannot be greater than Total Marks."
            );
            return;
        }

        try {

            setSaving(true);

            const payload = {

                examTypeId: Number(examTypeId),

                subjectId: Number(subjectId),

                classId: Number(classId),

                sectionId: Number(sectionId),

                examDate: examDate,

                obtainMarks: obtainMarks
                    ? Number(obtainMarks)
                    : null,

                totalMarks: totalMarks
                    ? Number(totalMarks)
                    : null,

                passingMarks: passingMarks
                    ? Number(passingMarks)
                    : null
            };

            if (isEdit) {

                await updateExam(
                    Number(id),
                    payload
                );

                alert(
                    "Exam updated successfully."
                );

            } else {

                await addExam(payload);

                alert(
                    "Exam added successfully."
                );

            }

            navigate("/exam");

        } catch (error) {

            console.log(error);

            alert(
                error.response?.data?.message ||
                "Unable to save Exam."
            );

        } finally {

            setSaving(false);

        }

    };

    if (loading) {

        return (

            <DashboardLayout>

                <div className="form-container">

                    <h2>
                        Loading...
                    </h2>

                </div>

            </DashboardLayout>

        );

    }

    return (

        <DashboardLayout>

            <div className="form-container">

                <h2 className="main-heading">

                    {isEdit
                        ? "Edit Exam"
                        : "Add Exam"}

                </h2>

                <form onSubmit={handleSubmit}>

                    <div className="form-grid">

                        <div className="form-group">

                            <label>
                                Exam Type
                            </label>

                            <select
                                value={examTypeId}
                                onChange={(e) =>
                                    setExamTypeId(
                                        e.target.value
                                    )
                                }
                                required
                            >

                                <option value="">
                                    Select Exam Type
                                </option>

                                {examTypes.map((item) => (

                                    <option
                                        key={item.examTypeId}
                                        value={item.examTypeId}
                                    >
                                        {item.examName}
                                    </option>

                                ))}

                            </select>

                        </div>

                        <div className="form-group">

                            <label>
                                Subject
                            </label>

                            <select
                                value={subjectId}
                                onChange={(e) =>
                                    setSubjectId(
                                        e.target.value
                                    )
                                }
                                required
                            >

                                <option value="">
                                    Select Subject
                                </option>

                                {subjects.map((item) => (

                                    <option
                                        key={item.subjectId}
                                        value={item.subjectId}
                                    >
                                        {item.subjectName}
                                    </option>

                                ))}

                            </select>

                        </div>

                        <div className="form-group">

                            <label>
                                Class
                            </label>

                            <select
                                value={classId}
                                onChange={(e) =>
                                    handleClassChange(
                                        e.target.value
                                    )
                                }
                                required
                            >

                                <option value="">
                                    Select Class
                                </option>

                                {classes.map((item) => (

                                    <option
                                        key={item.classId}
                                        value={item.classId}
                                    >
                                        {item.className}
                                    </option>

                                ))}

                            </select>

                        </div>

                        <div className="form-group">

                            <label>
                                Section
                            </label>

                            <select
                                value={sectionId}
                                onChange={(e) =>
                                    setSectionId(
                                        e.target.value
                                    )
                                }
                                disabled={!classId}
                                required
                            >

                                <option value="">
                                    Select Section
                                </option>

                                {sections.map((item) => (

                                    <option
                                        key={item.sectionId}
                                        value={item.sectionId}
                                    >
                                        {item.sectionName}
                                    </option>

                                ))}

                            </select>

                        </div>

                        <div className="form-group">

                            <label>
                                Exam Date
                            </label>

                            <input
                                type="date"
                                value={examDate}
                                onChange={(e) =>
                                    setExamDate(
                                        e.target.value
                                    )
                                }
                                required
                            />

                        </div>

                        <div className="form-group">

                            <label>
                                Total Marks
                            </label>

                            <input
                                type="number"
                                min="0"
                                value={totalMarks}
                                onChange={(e) =>
                                    setTotalMarks(
                                        e.target.value
                                    )
                                }
                                placeholder="Total Marks"
                            />

                        </div>

                        <div className="form-group">

                            <label>
                                Passing Marks
                            </label>

                            <input
                                type="number"
                                min="0"
                                value={passingMarks}
                                onChange={(e) =>
                                    setPassingMarks(
                                        e.target.value
                                    )
                                }
                                placeholder="Passing Marks"
                            />

                        </div>

                        <div className="form-group">

                            <label>
                                Obtain Marks
                            </label>

                            <input
                                type="number"
                                min="0"
                                value={obtainMarks}
                                onChange={(e) =>
                                    setObtainMarks(
                                        e.target.value
                                    )
                                }
                                placeholder="Obtained Marks"
                            />

                        </div>

                    </div>

                    <div className="form-buttons">

                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={() =>
                                navigate("/exam")
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
                                    ? "Update Exam"
                                    : "Save Exam"}
                        </button>

                    </div>

                </form>

            </div>

        </DashboardLayout>

    );

}

export default ExamForm;