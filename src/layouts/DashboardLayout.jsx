import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import "../assets/dashboard.css";

function DashboardLayout({ children }) {

    const [open, setOpen] = useState(true);

    return (

        <div className="dashboard-container">

            <Sidebar
                open={open}
                setOpen={setOpen}
            />

            <div className={`main-content ${open ? "" : "expand"}`}>

                <Navbar
                    open={open}
                />

                <div className="page-content">

                    {children}

                </div>

            </div>

        </div>

    );

}

export default DashboardLayout;