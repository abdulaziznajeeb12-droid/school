import { Link, useLocation } from "react-router-dom";
import "../assets/sidebar.css";

import DashboardIcon from "@mui/icons-material/Dashboard";
import SchoolIcon from "@mui/icons-material/School";
import ApartmentIcon from "@mui/icons-material/Apartment";
import ClassIcon from "@mui/icons-material/Class";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import PeopleIcon from "@mui/icons-material/People";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import MenuIcon from "@mui/icons-material/Menu";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import PaymentsIcon from "@mui/icons-material/Payments";
import FactCheckIcon from "@mui/icons-material/FactCheck";


function Sidebar({ open, setOpen }) {

    const location = useLocation();


    const menus = [

        {
            name: "Dashboard",
            icon: <DashboardIcon />,
            path: "/dashboard"
        },

        {
            name: "Schools",
            icon: <SchoolIcon />,
            path: "/schools"
        },

        {
            name: "Branches",
            icon: <ApartmentIcon />,
            path: "/branches"
        },

        {
            name: "Classes",
            icon: <ClassIcon />,
            path: "/classes"
        },

        {
            name: "Sections",
            icon: <ViewModuleIcon />,
            path: "/sections"
        },

        {
            name: "Roles",
            icon: <AdminPanelSettingsIcon />,
            path: "/roles"
        },

        {
            name: "Users",
            icon: <PeopleIcon />,
            path: "/users"
        },

        // {
        //     name: "Students",
        //     icon: <PeopleIcon />,
        //     path: "/students"
        // },

        {
            name: "Assign Students",
            icon: <AssignmentIndIcon />,
            path: "/student-class"
        },

        {
            name: "Subjects",
            icon: <MenuBookIcon />,
            path: "/subjects"
        },

        {
            name: "Teacher Subjects",
            icon: <MenuBookIcon />,
            path: "/teachersubject"
        },

        {
            name: "Attendance",
            icon: <FactCheckIcon />,
            path: "/attendance"
        },

        {
            name: "Fee Types",
            icon: <PaymentsIcon />,
            path: "/fees/types"
        },

        {
            name: "Student Fees",
            icon: <PaymentsIcon />,
            path: "/fees/student-fees"
        },

        // {
        //     name: "Teachers",
        //     icon: <PeopleIcon />,
        //     path: "/teachers"
        // },

        {
            name: "Parents",
            icon: <PeopleIcon />,
            path: "/parents"
        },

        {
            name: "Exams",
            icon: <FactCheckIcon />,
            path: "/exams"
        },

        {
            name: "Library",
            icon: <MenuBookIcon />,
            path: "/library"
        },

        {
            name: "Transport",
            icon: <ApartmentIcon />,
            path: "/transport"
        },

        {
            name: "Reports",
            icon: <FactCheckIcon />,
            path: "/reports"
        },

        {
            name: "Settings",
            icon: <AdminPanelSettingsIcon />,
            path: "/settings"
        }

    ];


    return (

        <div className={`sidebar ${open ? "" : "close"}`}>

            {/* ===============================
                LOGO
            =============================== */}

            <div className="logo">

                <button
                    className="toggle"
                    onClick={() => setOpen(!open)}
                >

                    {open
                        ? <MenuOpenIcon />
                        : <MenuIcon />
                    }

                </button>


                {open && (
                    <h2>
                        Brilliant School
                    </h2>
                )}

            </div>


            {/* ===============================
                MENU
            =============================== */}

            <ul>

                {menus.map((item) => (

                    <li
                        key={item.path}
                        className={
                            location.pathname === item.path
                                ? "active"
                                : ""
                        }
                    >

                        <Link to={item.path}>

                            {item.icon}

                            {open && (
                                <span>
                                    {item.name}
                                </span>
                            )}

                        </Link>

                    </li>

                ))}

            </ul>

        </div>

    );

}

export default Sidebar;