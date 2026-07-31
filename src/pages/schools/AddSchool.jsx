import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import { addSchool } from "../../services/schoolService";

function AddSchool() {

    const navigate = useNavigate();

    const [schoolName, setSchoolName] = useState("");

    const saveSchool = async (e) => {

        e.preventDefault();

        await addSchool({

            schoolName: schoolName,

            isActive: true

        });

        navigate("/schools");
    };

    return (

        <DashboardLayout>

            <h2>Add School</h2>

            <form onSubmit={saveSchool}>

                <input

                    type="text"

                    placeholder="School Name"

                    value={schoolName}

                    onChange={(e) => setSchoolName(e.target.value)}

                />

                <br /><br />

                <button type="submit">

                    Save

                </button>

            </form>

        </DashboardLayout>

    );

}

export default AddSchool;