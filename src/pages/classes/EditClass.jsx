import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import { getClassById, updateClass } from "../../services/classService";
import { getBranches } from "../../services/branchService";

function EditClass() {
    const [Branch, setBranch] = useState([]);
    const [BranchId, setBranchId] = useState("");
    const [className,setClassName]=useState("");
    const [branchName,setBranchName]=useState("");
    const { id } = useParams();
    const navigate = useNavigate();
   

    const [isActive,setIsActive]=useState(true);
    useEffect(()=>{
            loadBranches();
    },[]);

    const loadBranches = async () => {
    try {
        const data = await getBranches();
        setBranch(data);
    } catch (error) {
        console.log(error);
    }
};

    const loadClass=async()=>{
        const data=await getClassById(id);
        setClassName(data.className);
        setBranchName(data.branchName);
        setBranchId(data.branchId);
        setIsActive(data.isActive);
    }

    const save=async(e)=>{
        e.preventDefault();
        await updateClass({ 
            id:Number(id),
            className,
            branchName,
            isActive
        });

        alert("Updated Successfully");
        navigate("/classes");
    }
        return(
        <DashboardLayout>
            <h2>Edit Class</h2>

            <form onSubmit={save}>
            
                <input
                type="text"
                value={className}
                onChange={(e)=>setClassName(e.target.value)}
                />
                <br /><br />
                {/* <input
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
                    Update
                </button>
            </form>
        </DashboardLayout>
    )
}
export default EditClass;