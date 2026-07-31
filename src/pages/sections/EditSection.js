import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import {
    getSectionById,
    updateSection
} from "../../services/sectionService";

function EditSection() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [form, setForm] = useState({

        sectionId: id,
        classId: "",
        sectionName: "",
        sectionTeacherId: "",
        roomNo: "",
        capacity: ""

    });

    useEffect(() => {

        loadSection();

    }, []);

    const loadSection = async () => {

        const data = await getSectionById(id);

        setForm(data);

    };

    const handleChange = (e) => {

        setForm({

            ...form,
            [e.target.name]: e.target.value

        });

    };

    const save = async (e) => {

        e.preventDefault();

        await updateSection(form);

        alert("Section Updated Successfully");

        navigate("/sections");

    };

    return (

        <DashboardLayout>

            <h2>Edit Section</h2>

            <form onSubmit={save}>

                <input
                    name="classId"
                    value={form.classId || ""}
                    onChange={handleChange}
                />

                <br /><br />

                <input
                    name="sectionName"
                    value={form.sectionName || ""}
                    onChange={handleChange}
                />

                <br /><br />

                <input
                    name="sectionTeacherId"
                    value={form.sectionTeacherId || ""}
                    onChange={handleChange}
                />

                <br /><br />

                <input
                    name="roomNo"
                    value={form.roomNo || ""}
                    onChange={handleChange}
                />

                <br /><br />

                <input
                    name="capacity"
                    value={form.capacity || ""}
                    onChange={handleChange}
                />

                <br /><br />

                <button>

                    Update

                </button>

            </form>

        </DashboardLayout>

    );
}

export default EditSection;