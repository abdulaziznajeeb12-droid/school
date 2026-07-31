import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div className="sidebar">

      <h2>Brilliant School</h2>

      <ul>

        <li><Link to="/dashboard">Dashboard</Link></li>

        <li><Link to="/schools">Schools</Link></li>
        <li><Link to="/branches">Branches</Link></li>
        <li><Link to="/classes">Classes</Link></li>
        <li><Link to="/sections">Sections</Link></li>

        <li><Link to="/students">Students</Link></li>

        <li><Link to="/teachers">Teachers</Link></li>


        <li><Link to="/subjects">Subjects</Link></li>

        <li><Link to="/attendance">Attendance</Link></li>

        <li><Link to="/fees">Fees</Link></li>

      </ul>

    </div>
  );
}

export default Sidebar;