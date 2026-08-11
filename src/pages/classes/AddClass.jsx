    import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../layouts/DashboardLayout";

import {
    Box,
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    TextField,
    Snackbar ,
    Alert,
    Typography
} from "@mui/material";

import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { addClass } from "../../services/classService";
import { getBranches } from "../../services/branchService";

import "../../assets/classForm.css";


function AddClass() {

    const navigate = useNavigate();

    const [className, setClassName] = useState("");

    const [branchId, setBranchId] = useState("");

    const [isActive, setIsActive] = useState(true);

    const [branches, setBranches] = useState([]);

    const [loading, setLoading] = useState(false);

    const [open, setOpen] = useState(false);
    /* =========================
       LOAD BRANCHES
    ========================= */

    useEffect(() => {

        loadBranches();

    }, []);


    const loadBranches = async () => {

        try {

            const data = await getBranches();

            setBranches(data);

        }
        catch (error) {

            console.log(error);

            alert("Unable to load branches");

        }

    };

    const handleClose = (event, reason) => {

    if (reason === "clickaway") {
        return;
    }

    setOpen(false);
};

    /* =========================
       SAVE CLASS
    ========================= */

    const saveClass = async (e) => {

        e.preventDefault();


        if (!className.trim()) {

            alert("Please enter Class Name");

            return;

        }


        if (!branchId) {

            alert("Please select Branch");

            return;

        }


        try {

            setLoading(true);


            const selectedBranch = branches.find(
                branch => branch.id === Number(branchId)
            );


            await addClass({

                className: className.trim(),

                branchName: selectedBranch
                    ? selectedBranch.branchName
                    : "",

                branchId: Number(branchId),

                isActive: isActive

            });


            setOpen(true);

setTimeout(() => {
    navigate("/schools");
}, 1500);

        }
        catch (error) {

            console.log(error);

            alert("Unable to Add Class");

        }
        finally {

            setLoading(false);

        }

    };


    return (

        <DashboardLayout>

            <Box className="class-form-page">

                <Paper
                    elevation={3}
                    className="class-form-card"
                >

                    {/* =========================
                        HEADER
                    ========================= */}

                    <Typography
                        variant="h5"
                        className="class-form-title"
                    >
                        Add Class
                    </Typography>


                    <Typography
                        className="class-form-subtitle"
                    >
                        Add a new class to a branch
                    </Typography>


                    {/* =========================
                        FORM
                    ========================= */}

                    <Box
                        component="form"
                        onSubmit={saveClass}
                        className="class-form-content"
                    >


                        {/* CLASS NAME */}

                        <TextField
                            fullWidth
                            label="Class Name"
                            placeholder="Enter class name"
                            value={className}
                            onChange={(e) =>
                                setClassName(e.target.value)
                            }
                            required
                        />


                        {/* BRANCH */}

                        <FormControl
                            fullWidth
                            required
                        >

                            <InputLabel>
                                Branch
                            </InputLabel>


                            <Select
                                value={branchId}
                                label="Branch"
                                onChange={(e) =>
                                    setBranchId(e.target.value)
                                }
                            >

                                <MenuItem value="">
                                    Select Branch
                                </MenuItem>


                                {branches.map((branch) => (

                                    <MenuItem
                                        key={branch.id}
                                        value={branch.id}
                                    >

                                        {branch.branchName}

                                    </MenuItem>

                                ))}

                            </Select>

                        </FormControl>


                        {/* ACTIVE */}

                        <FormControlLabel

                            control={
                                <Checkbox
                                    checked={isActive}
                                    onChange={(e) =>
                                        setIsActive(
                                            e.target.checked
                                        )
                                    }
                                />
                            }

                            label="Active"

                        />


                        {/* BUTTONS */}

                        <Box className="class-form-buttons">


                            <Button
                                type="button"
                                variant="outlined"
                                startIcon={<ArrowBackIcon />}
                                onClick={() =>
                                    navigate("/classes")
                                }
                            >
                                Cancel
                            </Button>


                            <Button
                                type="submit"
                                variant="contained"
                                startIcon={<SaveIcon />}
                                disabled={loading}
                            >

                                {loading
                                    ? "Saving..."
                                    : "Save Class"
                                }

                            </Button>


                        </Box>


                    </Box>

                </Paper>

                    <Snackbar
    open={open}
    autoHideDuration={3000}
    onClose={handleClose}
    anchorOrigin={{
        vertical: "bottom",
        horizontal: "right"
    }}
>
    <Alert
        onClose={handleClose}
        severity="success"
        variant="filled"
        sx={{ width: "100%" }}
    >
        School Added Successfully!
    </Alert>
</Snackbar>
                
            </Box>

        </DashboardLayout>

    );

}


export default AddClass;