import { useEffect, useState } from "react";
import { getUsers } from "../../services/userService";
import DashboardLayout from "../../layouts/DashboardLayout";

import { getClasses } from "../../services/classService";
import { getSections } from "../../services/sectionService";
import { addStudentClass } from "../../services/StudentClassService";

import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";
import OutlinedInput from "@mui/material/OutlinedInput";

function AssignStudents() {

    const [classes, setClasses] = useState([]);

    const [sections, setSections] = useState([]);

    const [students, setStudents] = useState([]);

    const [classId, setClassId] = useState("");

    const [sectionId, setSectionId] = useState("");

    const [selectedStudents, setSelectedStudents] = useState([]);

    const [admissionDate, setAdmissionDate] = useState("");

    const [isActive, setIsActive] = useState(true);

    useEffect(() => {

        loadData();

    }, []);

    const loadData = async () => {

        const classData = await getClasses();

        const sectionData = await getSections();

        const userData = await getUsers();

        setClasses(classData);

        setSections(sectionData);

        setStudents(userData);

    };

    const save = async () => {

        const payload = selectedStudents.map(studentId => ({

            studentId: studentId,

            classId: Number(classId),

            sectionId: Number(sectionId),

            admissionDate,

            isActive

        }));

        await addStudentClass(payload);

        alert("Students Assigned Successfully");

    };

    return (

        <DashboardLayout>

            <h2>Assign Students To Section</h2>

            <br />

            <div>

                <label>Class</label>

                <br />

                <select

                    value={classId}

                    onChange={(e)=>setClassId(e.target.value)}

                >

                    <option value="">Select Class</option>

                    {

                        classes.map(item=>(

                            <option
                                key={item.id}
                                value={item.id}
                            >

                                {item.className}

                            </option>

                        ))

                    }

                </select>

            </div>

            <br />

            <div>

                <label>Section</label>

                <br />

                <select

                    value={sectionId}

                    onChange={(e)=>setSectionId(e.target.value)}

                >

                    <option value="">Select Section</option>

                    {

                        sections.map(item=>(

                            <option

                                key={item.sectionId}

                                value={item.sectionId}

                            >

                                {item.sectionName}

                            </option>

                        ))

                    }

                </select>

            </div>

            <br />

            <div>

                <label>Select Students</label>

                <br />

                <FormControl sx={{ width: 500 }}>

                    <Select

                        multiple

                        value={selectedStudents}

                        onChange={(e)=>setSelectedStudents(e.target.value)}

                        input={<OutlinedInput />}

                        renderValue={(selected)=>{

                            return students

                            .filter(x=>selected.includes(x.id))

                            .map(x=>x.firstName)

                            .join(", ");

                        }}

                    >

                        {

                            students.map(student=>(

                                <MenuItem

                                    key={student.id}

                                    value={student.id}

                                >

                                    <Checkbox

                                        checked={selectedStudents.includes(student.id)}

                                    />

                                    <ListItemText

                                        primary={`${student.firstName} ${student.lastName}`}

                                    />

                                </MenuItem>

                            ))

                        }

                    </Select>

                </FormControl>

            </div>

            <br />

            <div>

                <label>Admission Date</label>

                <br />

                <input

                    type="date"

                    value={admissionDate}

                    onChange={(e)=>setAdmissionDate(e.target.value)}

                />

            </div>

            <br />

            <label>

                <input

                    type="checkbox"

                    checked={isActive}

                    onChange={(e)=>setIsActive(e.target.checked)}

                />

                Active

            </label>

            <br /><br />

            <button

                onClick={save}

            >

                Assign Students

            </button>

        </DashboardLayout>

    );

}

export default AssignStudents;