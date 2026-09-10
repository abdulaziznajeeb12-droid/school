import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Card,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button
} from "@mui/material";

import DashboardLayout from "../../layouts/DashboardLayout";
import "../../assets/mark.css";

import {
  getMarkById,
  addMark,
  updateMark,
  getMarkExams,
  getMarkSubjects,
  getMarkStudents
} from "../../services/marksService";

function MarksForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [exams, setExams] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);

  const [examId, setExamId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [studentId, setStudentId] = useState("");
  const [obtainedMarks, setObtainedMarks] = useState("");
  const [remarks, setRemarks] = useState("");

  const [selectedTotalMarks, setSelectedTotalMarks] = useState(null);
  const [calculatedGrade, setCalculatedGrade] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, [id]);

  // Live Auto Grade Preview in Frontend
  useEffect(() => {
    if (obtainedMarks !== "" && selectedTotalMarks) {
      const percentage = (Number(obtainedMarks) / selectedTotalMarks) * 100;
      if (percentage >= 90) setCalculatedGrade("A+");
      else if (percentage >= 80) setCalculatedGrade("A");
      else if (percentage >= 70) setCalculatedGrade("B");
      else if (percentage >= 60) setCalculatedGrade("C");
      else if (percentage >= 50) setCalculatedGrade("D");
      else setCalculatedGrade("F");
    } else {
      setCalculatedGrade("");
    }
  }, [obtainedMarks, selectedTotalMarks]);

  const loadData = async () => {
    try {
      setLoading(true);

      const [examData, subjectData, studentData] = await Promise.all([
        getMarkExams(),
        getMarkSubjects(),
        getMarkStudents()
      ]);

      setExams(Array.isArray(examData) ? examData : []);
      setSubjects(Array.isArray(subjectData) ? subjectData : []);
      setStudents(Array.isArray(studentData) ? studentData : []);

      if (isEdit) {
        const data = await getMarkById(id);
        setExamId(data.examId != null ? String(data.examId) : "");
        setSubjectId(data.subjectId != null ? String(data.subjectId) : "");
        setStudentId(data.studentId != null ? String(data.studentId) : "");
        setObtainedMarks(data.obtainedMarks != null ? String(data.obtainedMarks) : "");
        setRemarks(data.remarks || "");
      }
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Unable to load marks data.");
    } finally {
      setLoading(false);
    }
  };

  const handleExamChange = (e) => {
    const selectedId = e.target.value;
    setExamId(selectedId);

    const examObj = exams.find((x) => String(x.examId) === String(selectedId));
    if (examObj) {
      setSelectedTotalMarks(examObj.totalMarks || 100);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!examId || !subjectId || !studentId || obtainedMarks === "") {
      alert("Please fill all required fields.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        examId: parseInt(examId, 10),
        subjectId: parseInt(subjectId, 10),
        studentId: parseInt(studentId, 10),
        obtainedMarks: parseInt(obtainedMarks, 10),
        remarks: remarks.trim() ? remarks.trim() : null
      };

      if (isEdit) {
        await updateMark(Number(id), payload);
        alert("Marks updated successfully.");
      } else {
        await addMark(payload);
        alert("Marks added successfully.");
      }

      navigate("/marks");
    } catch (error) {
      console.error("Save error:", error);
      const apiError =
        error.response?.data?.message || "Marks entry for this combination already exists!";
      alert(apiError);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="section-form-page">
          <Card className="section-form-card">
            <h2 className="section-form-title">Loading...</h2>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="section-form-page">
        <Card className="section-form-card">
          <h2 className="section-form-title">
            {isEdit ? "Edit Marks" : "Add Marks"}
          </h2>
          <p className="section-form-subtitle">
            Enter marks. System prevents duplicate entries and auto-calculates grade.
          </p>

          <form onSubmit={handleSubmit} className="section-form-content">
            <FormControl fullWidth size="medium">
              <InputLabel id="exam-label">Select Exam *</InputLabel>
              <Select
                labelId="exam-label"
                value={examId}
                label="Select Exam *"
                onChange={handleExamChange}
                required
              >
                {exams.map((item) => (
                  <MenuItem key={item.examId} value={item.examId}>
                    {item.examName} ({item.totalMarks ? `Total: ${item.totalMarks}` : "100"})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth size="medium">
              <InputLabel id="subject-label">Select Subject *</InputLabel>
              <Select
                labelId="subject-label"
                value={subjectId}
                label="Select Subject *"
                onChange={(e) => setSubjectId(e.target.value)}
                required
              >
                {subjects.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.subjectName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth size="medium">
              <InputLabel id="student-label">Select Student *</InputLabel>
              <Select
                labelId="student-label"
                value={studentId}
                label="Select Student *"
                onChange={(e) => setStudentId(e.target.value)}
                required
              >
                {students.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.studentName} {item.sectionName ? `(${item.sectionName})` : ""}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              type="number"
              label={`Obtained Marks ${selectedTotalMarks ? `(Max: ${selectedTotalMarks})` : ""}`}
              variant="outlined"
              value={obtainedMarks}
              onChange={(e) => setObtainedMarks(e.target.value)}
              required
            />

            {calculatedGrade && (
              <TextField
                label="Auto Grade Preview"
                variant="outlined"
                value={calculatedGrade}
                disabled
              />
            )}

            <TextField
              label="Remarks"
              variant="outlined"
              multiline
              rows={3}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />

            <div className="section-form-buttons">
              <Button
                variant="outlined"
                color="inherit"
                onClick={() => navigate("/marks")}
              >
                Cancel
              </Button>
              <Button type="submit" variant="contained" disabled={saving}>
                {saving ? "Saving..." : isEdit ? "Update Marks" : "Save Marks"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
}

export default MarksForm;