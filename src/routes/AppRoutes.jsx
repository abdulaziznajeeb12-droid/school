import { Routes, Route } from "react-router-dom";

// ===============================
// AUTH
// ===============================
// import Login from "../pages/Login";
import Login from "../pages/Auth/Login";
// import ForgotPassword from "../pages/Auth/ForgotPassword";
// import VerifyOtp from "../pages/Auth/VerifyOtp";
// import ResetPassword from "../pages/Auth/ResetPassword";
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
import ViewUser  from "../pages/users/ViewUser";

// ===============================
// SUBJECTS
// ===============================
import SubjectList from "../pages/subjects/SubjectList";
import AddSubject from "../pages/subjects/AddSubject";
import EditSubject from "../pages/subjects/EditSubject";

import StudentReport from "../pages/reports/StudentReport";
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
import AttendanceList from "../pages/attendance/AttendanceList";// ===============================
import RFIDCardAssign from "../pages/attendance/RFIDCardAssign";


import Timetable from "../pages/timetable/Timetable";

// STUDENTS
// ===============================
import StudentList from "../pages/students/StudentList";
import AddStudent from "../pages/students/AddStudent";
import EditStudent from "../pages/students/EditStudent";
import StudentDetails from "../pages/students/StudentDetails";



import ExamList from "../pages/Exam/ExamList";
import ExamForm from "../pages/Exam/ExamForm";

import ExamTypeList from "../pages/ExamType/ExamTypeList";
import ExamTypeForm from "../pages/ExamType/ExamTypeForm";

import MarksList from "../pages/Marks/MarksList";
import MarksForm from "../pages/Marks/MarksForm";
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
import FeeVouchers from "../pages/fees/FeeVouchers";
import FeePayment from "../pages/fees/FeePayment";


import LogoutButton from "../pages/logout/Logout";// ===============================
// OTHER
// ===============================


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

            <Route
    path="/logout"
    element={<LogoutButton />}
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
            <Route
                path="/users/view/:id"
                element={<ViewUser />}
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
                path="/studentclasses"
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
            

// ===============================
// TIMETABLE
// ===============================

<Route
    path="/timetable"
    element={<Timetable />}
/>
            {/* ===============================
                ATTENDANCE
            =============================== */}

       <Route
    path="/attendance"
    element={<Attendance />}
/>

<Route
    path="/attendance/list"
    element={<AttendanceList />}
/>
<Route
    path="/attendance/RFIDCardAssign"
    element={<RFIDCardAssign />}
/>
<Route
    path="/reports/student-report"
    element={<StudentReport />}
/>
            {/* ===============================
                FEES TYPES
            =============================== */}

            <Route
                path="/fees/types"
                element={<FeeTypes />}
            />
            <Route
    path="/fees/vouchers"
    element={<FeeVouchers />}
/>

<Route
    path="/fees/pay/:id"
    element={<FeePayment />}
/>


            {/* ===============================
                STUDENT FEES
            =============================== */}

            <Route
                path="/fees/student-fees"
                element={<StudentFees />}
            />

                
            <Route
    path="/exam"
    element={<ExamList />}
/>

<Route
    path="/exam/add"
    element={<ExamForm />}
/>

<Route
    path="/exam/edit/:id"
    element={<ExamForm />}
/>

<Route
    path="/examtypes"
    element={<ExamTypeList />}
/>

<Route
    path="/examtypes/add"
    element={<ExamTypeForm />}
/>

<Route
    path="/examtypes/edit/:id"
    element={<ExamTypeForm />}
/>

<Route
    path="/marks"
    element={<MarksList />}
/>

<Route
    path="/marks/add"
    element={<MarksForm />}
/>

<Route
    path="/marks/edit/:id"
    element={<MarksForm />}
/>

            {/* ===============================
                TEACHERS
            =============================== */}


        </Routes>

    );

}

export default AppRoutes;