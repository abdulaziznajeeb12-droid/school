import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import { getSchoolById, updateSchool} from "../../services/schoolService";

function EditSchool() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [schoolName, setSchoolName] = useState("");

    const [isActive, setIsActive] = useState(true);

    useEffect(() => {

        loadSchool();

    }, []);

    const loadSchool = async () => {

        const data = await getSchoolById(id);

        setSchoolName(data.schoolName);

        setIsActive(data.isActive);

    };

    const saveSchool = async (e) => {

        e.preventDefault();

        await updateSchool({

            id: Number(id),

            schoolName: schoolName,

            isActive: isActive,

            updatedOn: new Date().toISOString()

        });

        alert("School Updated Successfully");

        navigate("/schools");

    };

    return (

        <DashboardLayout>

            <h2>Edit School</h2>

            <form onSubmit={saveSchool}>

                <div>

                    <label>School Name</label>

                    <br />

                    <input
                        type="text"
                        value={schoolName}
                        onChange={(e) => setSchoolName(e.target.value)}
                    />

                </div>

                <br />

                <div>

                    <label>

                        <input
                            type="checkbox"
                            checked={isActive}
                            onChange={(e) => setIsActive(e.target.checked)}
                        />

                        Active

                    </label>

                </div>

                <br />

                <button type="submit">

                    Update School

                </button>

            </form>

        </DashboardLayout>

    );
}

export default EditSchool;