import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";

import { addBranch } from "../../services/branchService";
import { getSchools } from "../../services/schoolService";

import {
    Paper,
    Typography,
    TextField,
    Button,
    Checkbox,
    FormControlLabel,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box,
    Snackbar,
    Alert
} from "@mui/material";

function AddBranch() {

    const navigate = useNavigate();

    const [branchName, setBranchName] = useState("");
    const [schoolId, setSchoolId] = useState("");
    const [isActive, setIsActive] = useState(true);

    const [schools, setSchools] = useState([]);

    // Snackbar
    const [open, setOpen] = useState(false);

    useEffect(() => {
        loadSchools();
    }, []);

    const loadSchools = async () => {

        try {

            const data = await getSchools();

            setSchools(data);

        } catch (error) {

            console.log(error);

        }

    };

    const handleClose = (event, reason) => {

        if (reason === "clickaway") {
            return;
        }

        setOpen(false);

    };

    const saveBranch = async (e) => {

        e.preventDefault();

        try {

            await addBranch({

                branchName,
                schoolId: Number(schoolId),
                isActive

            });

            // Snackbar open
            setOpen(true);

            // 1.5 second baad branches page par jao
            setTimeout(() => {

                navigate("/branches");

            }, 1500);

        } catch (error) {

            console.log(error);

        }

    };

    return (

        <DashboardLayout>

            <Paper
                className="form-card"
                elevation={4}
            >

                <Typography
                    variant="h4"
                    className="form-title"
                >
                    Add Branch
                </Typography>


                <Box
                    component="form"
                    onSubmit={saveBranch}
                    className="form-container"
                >

                    {/* Branch Name */}

                    <TextField
                        fullWidth
                        label="Branch Name"
                        variant="outlined"
                        value={branchName}
                        onChange={(e) =>
                            setBranchName(e.target.value)
                        }
                        required
                    />


                    {/* School */}

                    <FormControl fullWidth required>

                        <InputLabel>School</InputLabel>

                        <Select
                            value={schoolId}
                            label="School"
                            onChange={(e) =>
                                setSchoolId(e.target.value)
                            }
                        >

                            <MenuItem value="">
                                <em>Select School</em>
                            </MenuItem>

                            {schools.map((school) => (

                                <MenuItem
                                    key={school.id}
                                    value={school.id}
                                >
                                    {school.schoolName}
                                </MenuItem>

                            ))}

                        </Select>

                    </FormControl>


                    {/* Active */}

                    <FormControlLabel

                        control={

                            <Checkbox
                                checked={isActive}
                                onChange={(e) =>
                                    setIsActive(e.target.checked)
                                }
                            />

                        }

                        label="Active"

                    />


                    {/* Save Button */}

                    <Button
                        type="submit"
                        variant="contained"
                        size="large"
                    >
                        Save Branch
                    </Button>

                </Box>

            </Paper>


            {/* Snackbar */}

            <Snackbar
                open={open}
                autoHideDuration={5000}
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
                    Branch Added Successfully!
                </Alert>

            </Snackbar>

        </DashboardLayout>

    );

}

export default AddBranch;