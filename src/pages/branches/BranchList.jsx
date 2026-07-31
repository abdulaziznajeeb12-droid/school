import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";

import {
    getBranches,
    deleteBranch,
    getBranchById
} from "../../services/branchService";

function BranchList() {

    const [branches, setBranches] = useState([]);
    const [searchId, setSearchId] = useState("");

    useEffect(() => {

        loadBranches();

    }, []);

    const loadBranches = async () => {

        const data = await getBranches();

        setBranches(data);

    };

    const searchBranch = async () => {

        if (searchId === "") {

            loadBranches();

            return;
        }

        try {

            const data = await getBranchById(searchId);

            setBranches([data]);

        }
        catch {

            alert("Branch Not Found");

        }

    };

    const handleDelete = async (id) => {

        if (!window.confirm("Delete this Branch?"))
            return;

        await deleteBranch(id);

        loadBranches();

    };

    return (

        <DashboardLayout>

            <h2>Branches</h2>

            <div style={{ marginBottom: "20px" }}>

                <input style={{  width:"200px",height:"30px"}}
                    type="number"
                    placeholder="Search By ID"
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                />

                <button style={{marginLeft:"1px", backgroundColor: "green", color: "white" ,width:"100px",height:"30px"}} onClick={searchBranch}>
                    Search
                </button>

                <button style={{marginLeft:"10px", backgroundColor: "green", color: "white" ,width:"100px",height:"30px"}} onClick={loadBranches}>
                    Show All
                </button>

                <Link to="/branches/add" >

                    <button style={{marginLeft:"10px", backgroundColor: "green", color: "white" ,width:"100px",height:"30px"}}>
                        Add Branch
                    </button>

                </Link>

            </div>

            <table border="1" cellPadding="10">

                <thead>

                    <tr>

                        <th>ID</th>
                        <th>Branch Name</th>
                        <th>School Name</th>
                        <th>Active</th>
                        <th>Action</th>

                    </tr>

                </thead>

                <tbody>

                    {branches.map((branch) => (

                        <tr key={branch.id}>

                            <td>{branch.id}</td>
                            <td>{branch.branchName}</td>
                            <td>{branch.schoolName}</td>
                            <td>{branch.isActive ? "Yes" : "No"}</td>

                            <td>

                                <Link to={`/branches/edit/${branch.id}`}>

                                    <button>Edit</button>

                                </Link>

                                &nbsp;

                                <button
                                    onClick={() => handleDelete(branch.id)}
                                >
                                    Delete
                                </button>

                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </DashboardLayout>

    );
}

export default BranchList;