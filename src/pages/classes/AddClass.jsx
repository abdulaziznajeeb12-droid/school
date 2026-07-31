import { useState , useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import { addClass } from "../../services/classService";
import { getBranches } from "../../services/branchService";
function AddClass() {
    const navigate = useNavigate();
    const [className, setClassName] = useState("");
    const [branchName, setBranchName] = useState("");
    const [Branch, setBranch] = useState([]);
    const [BranchId, setBranchId] = useState("");
    const [isActive, setIsActive] = useState(true);
    useEffect(() => {
    loadBranch();
}, []);
    const loadBranch = async () => {
    try {
        const data = await getBranches();
        setBranch(data);
    } catch (error) {
        console.log(error);
    }
};
    const saveClass = async (e) => {
        e.preventDefault();
        try {
        await addClass({
            className,
            branchName,
            BranchId,
            isActive
        });
        alert("Class Added Successfully");
        navigate("/classes");
    }
    catch (error) {
            console.log(error);
            alert("Unable to Add Branch");
    }  
        };
    return (
        <DashboardLayout>
            <h2>Add Class</h2>
            <form onSubmit={saveClass}>
                <input
                    placeholder="Class Name"
                    value={className}
                    onChange={(e)=>setClassName(e.target.value)}
                />
                <br /><br />
                {/* <input
                    placeholder="Branch Name"
                    value={branchName}
                    onChange={(e)=>setBranchName(e.target.value)}
                /> */}
                <div>
    <label>Branch</label>
    <br />
    <select
        value={BranchId}
        onChange={(e) => setBranchId(e.target.value)}
        required
    >
        <option value="">Select Branch</option>
        {Branch.map((branch) => (
            <option key={branch.id} value={branch.id}>
                {branch.branchName}
            </option>
        ))}
    </select>
</div>
                <br /><br />
                <label>
                    <input
                        type="checkbox"
                        checked={isActive}
                        onChange={(e)=>setIsActive(e.target.checked)}
                    />
                    Active
                </label>
                <br /><br />
                <button>
                    Save
                </button>
            </form>
        </DashboardLayout>
    );
}
export default AddClass;