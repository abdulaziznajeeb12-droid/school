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

function Dashboard() {

    return (

        <DashboardLayout>

            <div className="main-heading"> Dashboard</div>

            <div className="cards">

                <DashboardCard
                    title="Students"
                    value="520"
                    icon={<FaUserGraduate />}
                    color="#2563eb"
                />

                <DashboardCard
                    title="Teachers"
                    value="42"
                    icon={<FaChalkboardTeacher />}
                    color="#16a34a"
                />

                <DashboardCard
                    title="Classes"
                    value="18"
                    icon={<FaSchool />}
                    color="#ea580c"
                />

                <DashboardCard
                    title="Subjects"
                    value="65"
                    icon={<FaBook />}
                    color="#9333ea"
                />

                <DashboardCard
                    title="Attendance"
                    value="92%"
                    icon={<FaClipboardCheck />}
                    color="#dc2626"
                />

                <DashboardCard
                    title="Parents"
                    value="480"
                    icon={<FaUsers />}
                    color="#0f766e"
                />

                <DashboardCard
                    title="Library Books"
                    value="2500"
                    icon={<FaBookOpen />}
                    color="#7c3aed"
                />

                <DashboardCard
                    title="Fee Collection"
                    value="8.5M"
                    icon={<FaMoneyBillWave />}
                    color="#15803d"
                />

            </div>


        </DashboardLayout>

    );

}

export default Dashboard;