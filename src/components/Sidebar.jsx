
import {
    Link,
    useLocation,
    useNavigate
} from "react-router-dom";

import {
    useEffect,
    useRef
} from "react";

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
import LogoutIcon from "@mui/icons-material/Logout";


function Sidebar({ open, setOpen }) {

    const location = useLocation();
    const navigate = useNavigate();

    // =====================================================
    // SIDEBAR REF
    // =====================================================

    const sidebarRef = useRef(null);


    // =====================================================
    // SAVE + RESTORE SIDEBAR SCROLL POSITION
    // =====================================================

    useEffect(() => {

        const sidebar = sidebarRef.current;

        if (!sidebar) return;


        // ---------------------------------------------
        // Restore previous scroll position
        // ---------------------------------------------

        const savedScroll =
            sessionStorage.getItem("sidebarScroll");

        if (savedScroll !== null) {

            setTimeout(() => {

                sidebar.scrollTop =
                    parseInt(savedScroll, 10);

            }, 0);

        }


        // ---------------------------------------------
        // Save scroll position while scrolling
        // ---------------------------------------------

        const handleScroll = () => {

            sessionStorage.setItem(
                "sidebarScroll",
                sidebar.scrollTop.toString()
            );

        };


        sidebar.addEventListener(
            "scroll",
            handleScroll
        );


        // ---------------------------------------------
        // Cleanup
        // ---------------------------------------------

        return () => {

            sidebar.removeEventListener(
                "scroll",
                handleScroll
            );

        };

    }, []);


    // =====================================================
    // LOGOUT
    // =====================================================

    const handleLogout = () => {

        localStorage.removeItem("user");

        // Sidebar scroll position clear
        sessionStorage.removeItem("sidebarScroll");

        navigate("/");

    };


    // =====================================================
    // MENUS
    // =====================================================

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

        {
            name: "Assign Students",
            icon: <AssignmentIndIcon />,
            path: "/studentclasses"
        },

        {
            name: "Teacher Subjects",
            icon: <MenuBookIcon />,
            path: "/teachersubject"
        },

        {
            name: "Timetable",
            icon: <MenuBookIcon />,
            path: "/timetable"
        },

        {
            name: "Student Report",
            icon: <FactCheckIcon />,
            path: "/reports/student-report"
        },

        {
            name: "Mark Attendance",
            icon: <AssignmentIndIcon />,
            path: "/attendance"
        },

        {
            name: "Attendance Records",
            icon: <AssignmentIndIcon />,
            path: "/attendance/list"
        },

        {
            name: "RFID Card Management",
            icon: <AssignmentIndIcon />,
            path: "/attendance/RFIDCardAssign"
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

        {
            name: "Exam Types",
            icon: <FactCheckIcon />,
            path: "/examtypes"
        },

        {
            name: "Exams",
            icon: <FactCheckIcon />,
            path: "/exam"
        },

        {
            name: "Marks",
            icon: <FactCheckIcon />,
            path: "/marks"
        },

        {
            name: "Fee Vouchers",
            icon: <PaymentsIcon />,
            path: "/fees/vouchers"
        }

    ];


    // =====================================================
    // CHECK ACTIVE MENU
    // =====================================================

    const isActive = (path) => {

        return location.pathname === path;

    };


    // =====================================================
    // RETURN
    // =====================================================

    return (

        <div
            ref={sidebarRef}
            className={`sidebar ${open ? "" : "close"}`}
        >

            {/* =====================================================
                LOGO
            ===================================================== */}

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
                        School Menu
                    </h2>

                )}

            </div>


            {/* =====================================================
                MENU
            ===================================================== */}

            <ul>

                {menus.map((item) => (

                    <li
                        key={item.path}
                        className={
                            isActive(item.path)
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


                {/* =====================================================
                    LOGOUT
                ===================================================== */}

                <li className="logout-item">

                    <button
                        onClick={handleLogout}
                        className="logout-button"
                    >

                        <LogoutIcon />

                        {open && (

                            <span>
                                Logout
                            </span>

                        )}

                    </button>

                </li>

            </ul>

        </div>

    );

}


export default Sidebar;
