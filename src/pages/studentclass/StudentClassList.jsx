import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { Link } from "react-router-dom";

import {
    getStudentClasses,
    getStudentClassById,
    deleteStudentClass
} from "../../services/StudentClassService";

function StudentClassList() {

    const [students, setStudents] = useState([]);

    const [searchId, setSearchId] = useState("");

    useEffect(() => {
        loadStudents();
    }, []);

    const loadStudents = async () => {

        const data = await getStudentClasses();

        setStudents(data);

    };

    const search = async () => {

        if (searchId === "") {

            loadStudents();

            return;

        }

        const data = await getStudentClassById(searchId);

        setStudents([data]);

    };

    const remove = async (id) => {

        if (!window.confirm("Delete Record?"))
            return;

        await deleteStudentClass(id);

        loadStudents();

    };

    return (

        <DashboardLayout>

            <h2>Assigned Students</h2>

            <input
                placeholder="Search By ID"
                value={searchId}
                onChange={(e)=>setSearchId(e.target.value)}
            />

            <button onClick={search}>
                Search
            </button>

            <button onClick={loadStudents}>
                Show All
            </button>

            <Link to="/assign-students">

                <button>

                    Assign Students

                </button>

            </Link>

            <br /><br />

            <table border="1">

                <thead>

                    <tr>

                        <th>ID</th>

                        <th>Student</th>

                        <th>Class</th>

                        <th>Section</th>

                        <th>Admission</th>

                        <th>Action</th>

                    </tr>

                </thead>

                <tbody>

                    {

                        students.map(x=>(

                            <tr key={x.enrolledId}>

                                <td>{x.enrolledId}</td>

                                <td>{x.studentId}</td>

                                <td>{x.classId}</td>

                                <td>{x.sectionId}</td>

                                <td>{x.admissionDate}</td>

                                <td>

                                    <Link to={`/studentclass/edit/${x.enrolledId}`}>

                                        Edit

                                    </Link>

                                    {" | "}

                                    <button onClick={()=>remove(x.enrolledId)}>

                                        Delete

                                    </button>

                                </td>

                            </tr>

                        ))

                    }

                </tbody>

            </table>

        </DashboardLayout>

    );

}

export default StudentClassList;