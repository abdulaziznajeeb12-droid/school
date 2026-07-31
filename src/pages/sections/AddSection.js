import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import { addSection } from "../../services/sectionService";
import { getClasses } from "../../services/classService";

function AddSection() {

    const navigate = useNavigate();

    const [classes, setClasses] = useState([]);

    const [form, setForm] = useState({
        classId: "",
        sectionName: "",
        sectionTeacherId: "",
        roomNo: "",
        capacity: ""
    });

    useEffect(() => {
        loadClasses();
    }, []);

    const loadClasses = async () => {
        try {
            const data = await getClasses();
            setClasses(data);
        }
        catch (error) {
            console.log(error);
        }
    };

    const handleChange = (e) => {

        setForm({
            ...form,
            [e.target.name]: e.target.value
        });

    };

    const save = async (e) => { 

        e.preventDefault();

        try {

            await addSection(form);

            alert("Section Added Successfully");

            navigate("/sections");

        }
        catch (error) {

            console.log(error);

            alert("Unable to Add Section");

        }

    };

    return (

        <DashboardLayout>

            <h2>Add Section</h2>

            <form onSubmit={save}>

                <div>

                    <label>Class</label>

                    <br />

                    <select
                        name="classId"
                        value={form.classId}
                        onChange={handleChange}
                        required
                    >

                        <option value="">Select Class</option>

                        {classes.map((item) => (

                            <option key={item.id} value={item.id}>

                                {item.className}

                            </option>

                        ))}

                    </select>

                </div>

                <br />

                <input
                    name="sectionName"
                    placeholder="Section Name"
                    value={form.sectionName}
                    onChange={handleChange}
                    required
                />

                <br /><br />

                <input
                    name="sectionTeacherId"
                    placeholder="Teacher Id"
                    value={form.sectionTeacherId}
                    onChange={handleChange}
                />

                <br /><br />

                <input
                    name="roomNo"
                    placeholder="Room No"
                    value={form.roomNo}
                    onChange={handleChange}
                />

                <br /><br />

                <input
                    name="capacity"
                    placeholder="Capacity"
                    value={form.capacity}
                    onChange={handleChange}
                />

                <br /><br />

                <button type="submit">

                    Save

                </button>

            </form>

        </DashboardLayout>

    );
}

export default AddSection;