import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";

import SchoolList from "../pages/schools/SchoolList";
import AddSchool from "../pages/schools/AddSchool";
import EditSchool from "../pages/schools/EditSchool";
import BranchList from "../pages/branches/BranchList";
import AddBranch from "../pages/branches/AddBranch";
import EditBranch from "../pages/branches/EditBranch";
import ClassList from "../pages/classes/ClassList";
import AddClass from "../pages/classes/AddClass";
import EditClass from "../pages/classes/EditClass";
import SectionList from "../pages/sections/SectionList";
import AddSection from "../pages/sections/AddSection";
import EditSection from "../pages/sections/EditSection";

import NotFound from "../pages/NotFound";
import StudentList from "../pages/students/StudentList";
import AddStudent from "../pages/students/AddStudent";
import StudentDetails from "../pages/students/StudentDetails";
import EditStudent from "../pages/students/EditStudent";
import TeacherList from "../pages/teachers/TeacherList";

import ParentList from "../pages/parents/ParentList";
import SubjectList from "../pages/subjects/SubjectList";
import AttendanceList from "../pages/attendance/AttendanceList";
import ExamList from "../pages/exams/ExamList";
import FeeList from "../pages/fees/FeeList";
import LibraryList from "../pages/library/LibraryList";
import TransportList from "../pages/transport/TransportList";
import Reports from "../pages/reports/Reports";
import Settings from "../pages/settings/Settings";
function AppRoutes() {
  return (
    <Routes>

      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/students" element={<StudentList />} />
      <Route path="/students/add" element={<AddStudent />} />
      <Route path="/students/details/:id" element={<StudentDetails/>}/>
      <Route path="/students/edit/:id" element={<EditStudent />} />

      <Route path="/schools" element={<SchoolList />} />
<Route path="/schools/add" element={<AddSchool />} />
<Route path="/schools/edit/:id" element={<EditSchool />} />
<Route path="/branches" element={<BranchList />} />
<Route path="/branches/add" element={<AddBranch />} />
<Route path="/branches/edit/:id" element={<EditBranch />} />
<Route path="/classes" element={<ClassList />} />
<Route path="/classes/add" element={<AddClass />} />
<Route path="/classes/edit/:id" element={<EditClass />} />

<Route path="/sections" element={<SectionList />} />
<Route path="/sections/add" element={<AddSection />} />
<Route path="/sections/edit/:id" element={<EditSection />} />

      <Route path="/teachers" element={<TeacherList/>}/>
      <Route path="/parents" element={<ParentList />} />
      <Route path="/subjects" element={<SubjectList />} />
      <Route path="/attendance" element={<AttendanceList />} />
      <Route path="/exams" element={<ExamList />} />
      <Route path="/fees" element={<FeeList />} />
      <Route path="/library" element={<LibraryList />} />
      <Route path="/transport" element={<TransportList />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  );
}
export default AppRoutes;