import { useState } from "react";

import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Avatar,
  Box,
  Menu,
  MenuItem,
  TextField,
  InputAdornment
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";

import "../assets/navbar.css";

function Navbar({ open }) {

    const [anchorEl,setAnchorEl]=useState(null);

    const menuOpen=Boolean(anchorEl);

    const handleClick=(event)=>{
        setAnchorEl(event.currentTarget);
    };

    const handleClose=()=>{
        setAnchorEl(null);
    };

    return(

<AppBar
className={`navbar ${open ? "" : "navbar-collapse"}`}
>

<Toolbar className="navbar-toolbar">

{/* Left */}

<Box className="navbar-left">

<Typography
variant="h6"
className="navbar-title"
>

School Management System

</Typography>

</Box>

{/* Center */}

<Box className="navbar-center">

<TextField

placeholder="Search..."

size="small"

className="navbar-search"

InputProps={{

startAdornment:(

<InputAdornment position="start">

<SearchIcon/>

</InputAdornment>

)

}}

>

</TextField>

</Box>

{/* Right */}

<Box className="navbar-right">

<IconButton>

<Badge
badgeContent={5}
color="error"
>

<NotificationsIcon/>

</Badge>

</IconButton>

<IconButton
onClick={handleClick}
>

<Avatar
className="navbar-avatar"
>

A

</Avatar>

</IconButton>

<Menu

anchorEl={anchorEl}

open={menuOpen}

onClose={handleClose}

>

<MenuItem>

<AccountCircleIcon sx={{mr:1}}/>

Profile

</MenuItem>

<MenuItem>

<SettingsIcon sx={{mr:1}}/>

Settings

</MenuItem>

<MenuItem>

<LogoutIcon sx={{mr:1}}/>

Logout

</MenuItem>

</Menu>

</Box>

</Toolbar>

</AppBar>

);

}

export default Navbar;