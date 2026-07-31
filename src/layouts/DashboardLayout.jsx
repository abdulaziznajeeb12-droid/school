import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import "../assets/dashboard.css";

function DashboardLayout({ children }) {
  return (
    <div className="dashboard-container">

      <Sidebar />

      <div className="main-content">

        <Navbar />

        <div className="page-content">
          {children}
        </div>

      </div>

    </div>
  );
}

export default DashboardLayout;