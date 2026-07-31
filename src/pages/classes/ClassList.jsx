import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";

import {
    getClasses,
    getClassById,
    deleteClass
} from "../../services/classService";

function ClassList() {

    const [classes, setClasses] = useState([]);
    const [searchId, setSearchId] = useState("");

    useEffect(() => {
        loadClasses();
    }, []);

    const loadClasses = async () => {
        const data = await getClasses();
        setClasses(data);
    };

    const searchClass = async () => {

        if (searchId === "") {
            loadClasses();
            return;
        }

        try {

            const data = await getClassById(searchId);

            setClasses([data]);

        }
        catch {

            alert("Class Not Found");

        }

    };

    const handleDelete = async (id) => {

        if (!window.confirm("Delete this Class?"))
            return;

        await deleteClass(id);

        loadClasses();

    };

    return (

        <DashboardLayout>

            <h2>Classes</h2>

            <div style={{ marginBottom: "20px" }}>

                <input
                    style={{ width: "200px", height: "30px" }}
                    type="number"
                    placeholder="Search By ID"
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                />

                <button
                    style={{
                        marginLeft: "1px",
                        backgroundColor: "green",
                        color: "white",
                        width: "100px",
                        height: "30px"
                    }}
                    onClick={searchClass}
                >
                    Search
                </button>

                <button
                    style={{
                        marginLeft: "10px",
                        backgroundColor: "green",
                        color: "white",
                        width: "100px",
                        height: "30px"
                    }}
                    onClick={loadClasses}
                >
                    Show All
                </button>

                <Link to="/classes/add">

                    <button
                        style={{
                            marginLeft: "10px",
                            backgroundColor: "green",
                            color: "white",
                            width: "100px",
                            height: "30px"
                        }}
                    >
                        Add Class
                    </button>

                </Link>

            </div>

            <table border="1" cellPadding="10">

                <thead>

                    <tr>

                        <th>ID</th>
                        <th>Class Name</th>
                        <th >Branch Name</th>
                        <th>Active</th>
                        <th>Action</th>

                    </tr>

                </thead>

                <tbody>

                    {classes.map((item) => (

                        <tr key={item.id}>

                            <td>{item.id}</td>
                            <td>{item.className}</td>
                            <td>{item.branchName}</td>
                            <td>{item.isActive ? "Yes" : "No"}</td>

                            <td>

                                <Link to={`/classes/edit/${item.id}`}>

                                    <button>Edit</button>

                                </Link>

                                &nbsp;

                                <button
                                    onClick={() => handleDelete(item.id)}
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

export default ClassList;