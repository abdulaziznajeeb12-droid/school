import { useState , useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import { addBranch } from "../../services/branchService";
import { getSchools } from "../../services/schoolService";

function AddBranch() {

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

    const saveBranch = async (e) => {

        e.preventDefault();

        try {

            await addBranch({
                branchName,
                schoolName,
                schoolId,
                isActive
            });

            alert("Branch Added Successfully");

            navigate("/branches");

        } catch (error) {

            console.log(error);

            alert("Unable to Add Branch");
        }
    };

    return (

        <DashboardLayout>

            <h2>Add Branch</h2>

            <form onSubmit={saveBranch}>

                <div>

                    <label>Branch Name</label>

                    <br />

                    <input
                        type="text"
                        value={branchName}
                        onChange={(e) => setBranchName(e.target.value)}
                        required
                    />

                </div>

                <br />

                <div>

                    <label>School Name</label>

                    <br />

                    {/* <input
                        type="text"
                        value={schoolName}
                        onChange={(e) => setSchoolName(e.target.value)}
                        required
                    /> */}

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

    {/* <select
                        value={schoolId}
                        onChange={(e) => setSchoolId(e.target.value)}
                        required
    >
        {/* <option value="">Select School</option>

            <option key="Male" value="Male">
                Male
            </option> */}
        

    {/* </select>  */}

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
                    Save Branch
                </button>

            </form>

        </DashboardLayout>
    );
}

export default AddBranch;