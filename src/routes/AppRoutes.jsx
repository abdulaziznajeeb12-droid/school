import { Routes, Route } from "react-router-dom";

// ===============================
// AUTH
// ===============================
import Login from "../pages/Login";

// ===============================
// DASHBOARD
// ===============================
import Dashboard from "../pages/Dashboard";

// ===============================
// SCHOOLS
// ===============================
import SchoolList from "../pages/schools/SchoolList";
import AddSchool from "../pages/schools/AddSchool";
import EditSchool from "../pages/schools/EditSchool";

// ===============================
// BRANCHES
// ===============================
import BranchList from "../pages/branches/BranchList";
import AddBranch from "../pages/branches/AddBranch";
import EditBranch from "../pages/branches/EditBranch";

// ===============================
// CLASSES
// ===============================
import ClassList from "../pages/classes/ClassList";
import AddClass from "../pages/classes/AddClass";
import EditClass from "../pages/classes/EditClass";

// ===============================
// SECTIONS
// ===============================
import SectionList from "../pages/sections/SectionList";
import AddSection from "../pages/sections/AddSection";
import EditSection from "../pages/sections/EditSection";

// ===============================
// ROLES
// ===============================
import RoleList from "../pages/roles/RoleList";
import AddRole from "../pages/roles/AddRole";
import EditRole from "../pages/roles/EditRole";

// ===============================
// USERS
// ===============================
import UserList from "../pages/users/UserList";
import AddUser from "../pages/users/AddUser";
import EditUser from "../pages/users/EditUser";

// ===============================
// SUBJECTS
// ===============================
import SubjectList from "../pages/subjects/SubjectList";
import AddSubject from "../pages/subjects/AddSubject";
import EditSubject from "../pages/subjects/EditSubject";

// ===============================
// STUDENT CLASS
// ===============================
import StudentClassList from "../pages/studentclass/StudentClassList";
import AddStudentClass from "../pages/studentclass/AddStudentClass";
import EditStudentClass from "../pages/studentclass/EditStudentClass";

// ===============================
// TEACHER SUBJECT
// ===============================
import TeacherSubjectList from "../pages/teachersubject/TeacherSubjectList";
import AddTeacherSubject from "../pages/teachersubject/AddTeacherSubject";
import EditTeacherSubject from "../pages/teachersubject/EditTeacherSubject";

// ===============================
// ATTENDANCE
// ===============================
import Attendance from "../pages/attendance/Attendance";

// ===============================
// STUDENTS
// ===============================
import StudentList from "../pages/students/StudentList";
import AddStudent from "../pages/students/AddStudent";
import EditStudent from "../pages/students/EditStudent";
import StudentDetails from "../pages/students/StudentDetails";

// ===============================
// TEACHERS
// ===============================
import TeacherList from "../pages/teachers/TeacherList";

// ===============================
// PARENTS
// ===============================
import ParentList from "../pages/parents/ParentList";

// ===============================
// FEES
// ===============================
import FeeTypes from "../pages/fees/FeeTypes";
import StudentFees from "../pages/fees/StudentFees";

// ===============================
// OTHER
// ===============================
import ExamList from "../pages/exams/ExamList";
import LibraryList from "../pages/library/LibraryList";
import TransportList from "../pages/transport/TransportList";
import Reports from "../pages/reports/Reports";
import Settings from "../pages/settings/Settings";

// ===============================
// NOT FOUND
// ===============================
import NotFound from "../pages/NotFound";


function AppRoutes() {

    return (

        <Routes>

            {/* ===============================
                LOGIN
            =============================== */}

            <Route
                path="/"
                element={<Login />}
            />


            {/* ===============================
                DASHBOARD
            =============================== */}

            <Route
                path="/dashboard"
                element={<Dashboard />}
            />


            {/* ===============================
                STUDENTS
            =============================== */}

            <Route
                path="/students"
                element={<StudentList />}
            />

            <Route
                path="/students/add"
                element={<AddStudent />}
            />

            <Route
                path="/students/details/:id"
                element={<StudentDetails />}
            />

            <Route
                path="/students/edit/:id"
                element={<EditStudent />}
            />


            {/* ===============================
                SCHOOLS
            =============================== */}

            <Route
                path="/schools"
                element={<SchoolList />}
            />

            <Route
                path="/schools/add"
                element={<AddSchool />}
            />

            <Route
                path="/schools/edit/:id"
                element={<EditSchool />}
            />


            {/* ===============================
                BRANCHES
            =============================== */}

            <Route
                path="/branches"
                element={<BranchList />}
            />

            <Route
                path="/branches/add"
                element={<AddBranch />}
            />

            <Route
                path="/branches/edit/:id"
                element={<EditBranch />}
            />


            {/* ===============================
                CLASSES
            =============================== */}

            <Route
                path="/classes"
                element={<ClassList />}
            />

            <Route
                path="/classes/add"
                element={<AddClass />}
            />

            <Route
                path="/classes/edit/:id"
                element={<EditClass />}
            />


            {/* ===============================
                SECTIONS
            =============================== */}

            <Route
                path="/sections"
                element={<SectionList />}
            />

            <Route
                path="/sections/add"
                element={<AddSection />}
            />

            <Route
                path="/sections/edit/:id"
                element={<EditSection />}
            />


            {/* ===============================
                ROLES
            =============================== */}

            <Route
                path="/roles"
                element={<RoleList />}
            />

            <Route
                path="/roles/add"
                element={<AddRole />}
            />

            <Route
                path="/roles/edit/:id"
                element={<EditRole />}
            />


            {/* ===============================
                USERS
            =============================== */}

            <Route
                path="/users"
                element={<UserList />}
            />

            <Route
                path="/users/add"
                element={<AddUser />}
            />

            <Route
                path="/users/edit/:id"
                element={<EditUser />}
            />


            {/* ===============================
                SUBJECTS
            =============================== */}

            <Route
                path="/subjects"
                element={<SubjectList />}
            />

            <Route
                path="/subjects/add"
                element={<AddSubject />}
            />

            <Route
                path="/subjects/edit/:id"
                element={<EditSubject />}
            />


            {/* ===============================
                STUDENT CLASS
            =============================== */}

            <Route
                path="/student-class"
                element={<StudentClassList />}
            />

            <Route
                path="/student-class/add"
                element={<AddStudentClass />}
            />

            <Route
                path="/student-class/edit/:id"
                element={<EditStudentClass />}
            />


            {/* ===============================
                TEACHER SUBJECT
            =============================== */}

            <Route
                path="/teachersubject"
                element={<TeacherSubjectList />}
            />

            <Route
                path="/teachersubject/add"
                element={<AddTeacherSubject />}
            />

            <Route
                path="/teachersubject/edit/:id"
                element={<EditTeacherSubject />}
            />


            {/* ===============================
                ATTENDANCE
            =============================== */}

            <Route
                path="/attendance"
                element={<Attendance />}
            />


            {/* ===============================
                FEES TYPES
            =============================== */}

            <Route
                path="/fees/types"
                element={<FeeTypes />}
            />


            {/* ===============================
                STUDENT FEES
            =============================== */}

            <Route
                path="/fees/student-fees"
                element={<StudentFees />}
            />


            {/* ===============================
                TEACHERS
            =============================== */}

            <Route
                path="/teachers"
                element={<TeacherList />}
            />


            {/* ===============================
                PARENTS
            =============================== */}

            <Route
                path="/parents"
                element={<ParentList />}
            />


            {/* ===============================
                EXAMS
            =============================== */}

            <Route
                path="/exams"
                element={<ExamList />}
            />


            {/* ===============================
                LIBRARY
            =============================== */}

            <Route
                path="/library"
                element={<LibraryList />}
            />


            {/* ===============================
                TRANSPORT
            =============================== */}

            <Route
                path="/transport"
                element={<TransportList />}
            />


            {/* ===============================
                REPORTS
            =============================== */}

            <Route
                path="/reports"
                element={<Reports />}
            />


            {/* ===============================
                SETTINGS
            =============================== */}

            <Route
                path="/settings"
                element={<Settings />}
            />


            {/* ===============================
                NOT FOUND
            =============================== */}

            <Route
                path="*"
                element={<NotFound />}
            />

        </Routes>

    );

}

export default AppRoutes;