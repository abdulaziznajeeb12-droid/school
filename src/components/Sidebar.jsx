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
        {
            name: "Assign Students",
            icon: <AssignmentIndIcon />,
            path: "/studentclass"
        },


    ];

    return (

        <div className={`sidebar ${open ? "" : "close"}`}>

            <div className="logo">

                <SchoolIcon sx={{ fontSize: 35 }} />

                {open &&

                    <h2>

                        Brilliant School

                    </h2>

                }

            </div>

            <button

                className="toggle"

                onClick={() => setOpen(!open)}

            >

                {

                    open

                        ?

                        <MenuOpenIcon />

                        :

                        <MenuIcon />

                }

            </button>

            <ul>

                {

                    menus.map((item) => (

                        <li

                            key={item.path}

                            className={location.pathname === item.path ? "active" : ""}

                        >

                            <Link to={item.path}>

                                {item.icon}

                                {

                                    open &&

                                    <span>

                                        {item.name}

                                    </span>

                                }

                            </Link>

                        </li>

                    ))

                }

            </ul>

        </div>

    );

}

export default Sidebar;