import { createContext, useState } from "react";
import { getStudents } from "../services/studentService";

export const StudentContext = createContext();

export function StudentProvider({ children }) {

    const [students, setStudents] = useState(getStudents());

    const addStudent = (student) => {

        setStudents([...students, student]);

    };

    const updateStudent = (updatedStudent) => {

    const updatedList = students.map((student) =>

        student.id === updatedStudent.id
            ? updatedStudent
            : student

    );

    setStudents(updatedList);

};

    return (
        <StudentContext.Provider
    value={{
        students,
        setStudents,
        addStudent,
        updateStudent
    }}
>
            {children}
        </StudentContext.Provider>
    );
}
export default StudentProvider;