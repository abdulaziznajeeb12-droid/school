import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";

import {
    getSchools,
    getSchoolById,
    deleteSchool
} from "../../services/schoolService";

function SchoolList() {

    const [schools, setSchools] = useState([]);
    const [searchId, setSearchId] = useState("");

    useEffect(() => {
        loadSchools();
    }, []);

    const loadSchools = async () => {
        try {
            const data = await getSchools();
            setSchools(data);
        }
        catch (error) {
            console.log(error);
        }
    };

    const searchSchool = async () => {

        if (searchId === "") {
            loadSchools();
            return;
        }

        try {

            const school = await getSchoolById(searchId);

            if (school == null) {
                alert("School Not Found");
                return;
            }

            setSchools([school]);

        }
        catch (error) {

            console.log(error);

            alert("School Not Found");
        }
    };

    const handleDelete = async (id) => {

        if (!window.confirm("Are you sure you want to delete this school?"))
            return;

        try {

            await deleteSchool(id);

            loadSchools();

        }
        catch (error) {

            console.log(error);

            alert("Delete Failed");
        }

    };

    return (

        <DashboardLayout>

            <h2>Schools</h2>

            <div style={{ marginBottom: "20px" }}>

                <input  style={{  width:"200px",height:"30px"}}
                    type="number"
                    placeholder="Search By ID"
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                />

                <button  style={{marginLeft:"1px", backgroundColor: "green", color: "white" ,width:"100px",height:"30px"}} onClick={searchSchool}>
                    Search
                </button>

                <button  style={{ marginLeft: "5px", backgroundColor: "green", color: "white" ,width:"100px",height:"30px"}} onClick={loadSchools}>
                    Show All
                </button>

                <Link to="/schools/add">

                    <button style={{ marginLeft: "5px", backgroundColor: "green", color: "white" ,width:"100px",height:"30px"}}>
                        Add School
                    </button>

                </Link>

            </div>

            <table border="1" cellPadding="10">

                <thead>

                    <tr>

                        <th>ID</th>

                        <th>School Name</th>

                        <th>Active</th>

                        <th>Action</th>

                    </tr>

                </thead>

                <tbody>

                    {schools.map((school) => (

                        <tr key={school.id}>

                            <td>{school.id}</td>

                            <td>{school.schoolName}</td>

                            <td>{school.isActive ? "Yes" : "No"}</td>

                            <td>

                                <Link to={`/schools/edit/${school.id}`}>

                                    <button>Edit</button>

                                </Link>

                                &nbsp;

                                <button
                                    onClick={() => handleDelete(school.id)}
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

export default SchoolList;