import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import {    getBranchById,updateBranch} from "../../services/branchService";
import { getSchools } from "../../services/schoolService";

function EditBranch() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [branchName, setBranchName] = useState("");
    const [schoolName, setSchoolName] = useState("");
    const [isActive, setIsActive] = useState(true);


    const [schools, setSchools] = useState([]);
    const [schoolId, setSchoolId] = useState("");

useEffect(() => {
    loadSchools();
}, []);

const loadSchools = async () => {
    try {
        const data = await getSchools();
        setSchools(data);
    } catch (error) {
        console.log(error);
    }
};

    useEffect(() => {

        loadBranch();

    }, []);

    const loadBranch = async () => {

        const data = await getBranchById(id);

        setBranchName(data.branchName);
        setSchoolName(data.schoolName);
        setIsActive(data.isActive);
        setSchoolId(data.schoolId)


    };

    const updateData = async (e) => {

        e.preventDefault();

        await updateBranch({

            id: Number(id),

            branchName,

            schoolName,

            isActive

        });

        alert("Branch Updated Successfully");

        navigate("/branches");

    };

    return (

        <DashboardLayout>

            <h2>Edit Branch</h2>

            <form onSubmit={updateData}>

                <div>

                    <label>Branch Name</label>

                    <br />

                    <input
                        type="text"
                        value={branchName}
                        onChange={(e) => setBranchName(e.target.value)}
                    />
                </div>

                <br />

                <div>
                    <label>School Name</label>
                    <br />
                    {/* <input type="text" value={schoolName} onChange={(e) => setSchoolName(e.target.value)}  /> */}
       <select
                        value={schoolId}
                        onChange={(e) => setSchoolId(e.target.value)}
                        required
    >
        <option value="">Select School</option>

        {schools.map((school) => (
            <option key={school.id} value={school.id}>
                {school.schoolName}
            </option>
        ))}

    </select>


                </div>

                <br />

                <label>

                    <input
                        type="checkbox"
                        checked={isActive}
                        onChange={(e) => setIsActive(e.target.checked)}
                    />

                    Active

                </label>

                <br /><br />

                <button type="submit">
                    Update Branch
                </button>

            </form>

        </DashboardLayout>
    );
}

export default EditBranch;