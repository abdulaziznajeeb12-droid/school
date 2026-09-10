import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import DashboardCard from "../components/DashboardCard";

import {
    FaUserGraduate,
    FaChalkboardTeacher,
    FaSchool,
    FaBook,
    FaMoneyBillWave,
    FaClipboardCheck,
    FaUsers,
    FaBookOpen
} from "react-icons/fa";

import { getDashboardData } from "../services/dashboardService";

function Dashboard() {

    const [data, setData] = useState({
        students: 0,
        teachers: 0,
        classes: 0,
        sections: 0,
        subjects: 0,
        parents: 0,
        libraryBooks: 0,
        feeCollection: 0
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const loadDashboard = async () => {

            try {

                const result = await getDashboardData();

                setData({
                    students: result.students ?? 0,
                    teachers: result.teachers ?? 0,
                    classes: result.classes ?? 0,
                    subjects: result.subjects ?? 0,
                    parents: result.parents ?? 0,
                    libraryBooks: result.libraryBooks ?? 0,
                    feeCollection: result.feeCollection ?? 0
                });

            } catch (error) {

                console.error(
                    "Dashboard data error:",
                    error
                );

            } finally {

                setLoading(false);

            }
        };

        loadDashboard();

    }, []);

    return (

        <DashboardLayout>

            <div className="main-heading">
                Dashboard
            </div>

            <div className="cards">

                <DashboardCard
                    title="Students"
                    value={loading ? "..." : data.students}
                    icon={<FaUserGraduate />}
                    color="#2563eb"
                />

                <DashboardCard
                    title="Teachers"
                    value={loading ? "..." : data.teachers}
                    icon={<FaChalkboardTeacher />}
                    color="#16a34a"
                />

                <DashboardCard
                    title="Classes"
                    value={loading ? "..." : data.classes}
                    icon={<FaSchool />}
                    color="#ea580c"
                />
                 <DashboardCard
                    title="Sections"
                    value={loading ? "..." : data.sections}
                    icon={<FaClipboardCheck />}
                    color="#dc2626"
                />

                <DashboardCard
                    title="Subjects"
                    value={loading ? "..." : data.subjects}
                    icon={<FaBook />}
                    color="#9333ea"
                />

               

                <DashboardCard
                    title="Parents"
                    value={loading ? "..." : data.parents}
                    icon={<FaUsers />}
                    color="#0f766e"
                />

                <DashboardCard
                    title="Library Books"
                    value={loading ? "..." : data.libraryBooks}
                    icon={<FaBookOpen />}
                    color="#7c3aed"
                />

                <DashboardCard
                    title="Fee Collection"
                    value={
                        loading
                            ? "..."
                            : `${Number(data.feeCollection).toLocaleString()}`
                    }
                    icon={<FaMoneyBillWave />}
                    color="#15803d"
                />

            </div>

        </DashboardLayout>

    );
}

export default Dashboard;