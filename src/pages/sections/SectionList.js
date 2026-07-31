import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";

import {
    getSections,
    getSectionById,
    deleteSection
} from "../../services/sectionService";

function SectionList() {

    const [sections, setSections] = useState([]);
    const [searchId, setSearchId] = useState("");

    useEffect(() => {
        loadSections();
    }, []);

    const loadSections = async () => {
        const data = await getSections();
        setSections(data);
    };

    const searchSection = async () => {

        if (searchId === "") {
            loadSections();
            return;
        }

        try {

            const data = await getSectionById(searchId);

            setSections([data]);

        } catch {

            alert("Section Not Found");

        }

    };

    const handleDelete = async (id) => {

        if (!window.confirm("Delete Section?"))
            return;

        await deleteSection(id);

        loadSections();

    };

    return (

        <DashboardLayout>

            <h2>Sections</h2>

            <div style={{ marginBottom: "20px" }}>

                <input
                    type="number"
                    placeholder="Search By ID"
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                    style={{ width: "200px", height: "30px" }}
                />

                <button
                    onClick={searchSection}
                    style={{ width: "100px", height: "30px", marginLeft: "5px", background: "green", color: "white" }}
                >
                    Search
                </button>

                <button
                    onClick={loadSections}
                    style={{ width: "100px", height: "30px", marginLeft: "5px", background: "green", color: "white" }}
                >
                    Show All
                </button>

                <Link to="/sections/add">

                    <button
                        style={{ width: "100px", height: "30px", marginLeft: "5px", background: "green", color: "white" }}
                    >
                        Add Section
                    </button>

                </Link>

            </div>

            <table border="1" cellPadding="10">

                <thead>

                    <tr>

                        <th>ID</th>
                        <th>Class Id</th>
                        <th>Section</th>
                        <th>Teacher Id</th>
                        <th>Room</th>
                        <th>Capacity</th>
                        <th>Action</th>

                    </tr>

                </thead>

                <tbody>

                    {sections.map((item) => (

                        <tr key={item.sectionId}>

                            <td>{item.sectionId}</td>
                            <td>{item.classId}</td>
                            <td>{item.sectionName}</td>
                            <td>{item.sectionTeacherId}</td>
                            <td>{item.roomNo}</td>
                            <td>{item.capacity}</td>

                            <td>

                                <Link to={`/sections/edit/${item.sectionId}`}>

                                    <button>Edit</button>

                                </Link>

                                &nbsp;

                                <button
                                    onClick={() => handleDelete(item.sectionId)}
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

export default SectionList;